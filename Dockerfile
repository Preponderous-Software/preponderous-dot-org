FROM node:18 AS manifests

WORKDIR /src

# Copy the manifests with the root `version` set to a fixed value. A release
# changes only that field, so the install layer below gets the same input and
# stays cached when no dependency has changed (#188).
COPY package*.json ./
RUN node -e "const fs = require('fs'); for (const f of ['package.json', 'package-lock.json']) { const p = JSON.parse(fs.readFileSync(f, 'utf8')); p.version = '0.0.0'; if (p.packages && p.packages['']) p.packages[''].version = '0.0.0'; fs.writeFileSync(f, JSON.stringify(p, null, 2) + '\n'); }"

FROM node:18

WORKDIR /app

# Install dependencies (use the lockfile for reproducible builds)
COPY --from=manifests /src/package*.json ./
RUN npm ci

# The real manifests, so the build reports the site's actual version
COPY package*.json ./

# Bundle the Next.js app source
COPY components ./components
COPY pages ./pages
COPY public ./public
COPY styles ./styles
COPY utils ./utils
COPY middleware.ts ./
COPY next-env.d.ts ./
COPY next.config.js ./
COPY tsconfig.json ./

# Build the production bundle
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
