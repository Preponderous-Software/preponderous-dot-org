FROM node:18

WORKDIR /app

# Install dependencies (use the lockfile for reproducible builds)
COPY package*.json ./
RUN npm ci

# Bundle the Next.js app source
COPY components ./components
COPY pages ./pages
COPY public ./public
COPY styles ./styles
COPY utils ./utils
COPY next-env.d.ts ./
COPY next.config.js ./
COPY tsconfig.json ./

# Build the production bundle
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
