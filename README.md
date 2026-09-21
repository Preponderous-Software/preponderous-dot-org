# Preponderous Software Website

## Description

The Preponderous Software website is a [Next.js](https://nextjs.org/) web application that serves as the public face of Preponderous Software. It showcases the projects — free, source-available games, simulations, and libraries — and links out to their source on GitHub. Built with React and [Material UI](https://mui.com/), it mirrors the structure of the [Dan's Plugins Community website](https://github.com/Dans-Plugins/dansplugins-dot-com).

## Installation

### First Time Installation

1. Ensure [Node.js](https://nodejs.org/en/) (v18 or later) is installed on your machine.
2. Clone this repository: `git clone https://github.com/Preponderous-Software/preponderous-dot-org.git`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Start the server:
   ```bash
   npm run start
   ```

The site will be available at `http://localhost:3000`.

### Other Ways to Run It

`npm run dev` is the day-to-day development server, Docker Compose runs the production build in a container, and a dev container provides a ready-made Node toolchain. See the [Development](#development) section below for all three.

## Usage

### Documentation

- [User Guide](USER_GUIDE.md) – Getting started and common scenarios
- [Configuration Guide](CONFIG.md) – Configuration and the project showcase data
- [Contributing](CONTRIBUTING.md) – How to contribute
- [Changelog](CHANGELOG.md) – Release history

## Support

### Experiencing a bug?

Please file a bug report [here](https://github.com/Preponderous-Software/preponderous-dot-org/issues/new).

- [Known Bugs](https://github.com/Preponderous-Software/preponderous-dot-org/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Testing

### Lint

```bash
npm run lint
```

If you see no errors, the lint check has passed.

### Unit Tests

The site uses [Vitest](https://vitest.dev/) for unit tests. Run the suite with:

```bash
npm test
```

Test files live in the `__tests__/` directory. If all tests pass, the suite has succeeded.

## Development

### Hot-Reloading Dev Server

`npm run dev` is the hot-reloading path — edits are picked up without a restart:

```bash
npm run dev
```

The site is a static project showcase with no back end, so this is the whole stack; there is nothing else to start. It requires no environment variables (see [CONFIG.md](CONFIG.md)).

### Docker Compose

`compose.yaml` builds the site from the `Dockerfile` and serves the **production build** on port 3000, so it does *not* hot-reload: source is copied into the image at build time, and changes need a rebuild.

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop) (or another Docker engine with the Compose plugin).
2. Build and start the container:
   ```bash
   docker compose up --build
   ```
   The site will be available at `http://localhost:3000`. The container restarts automatically unless stopped.
3. Stop it with:
   ```bash
   docker compose down
   ```

The image is built from `package-lock.json` with `npm ci`, and `.dockerignore` keeps `node_modules`, `.next`, the tests, and the docs out of the build context.

### Dev Container

`.devcontainer/` describes a [dev container](https://containers.dev/) with Node.js 18 pre-installed, for editors that support them (e.g. VS Code with the Dev Containers extension, or GitHub Codespaces). Open the repository in the container, then run `npm install` and `npm run dev` inside it as usual — dependencies are not installed automatically. Port 3000 is forwarded to the host.

## Technologies Used

- [Next.js](https://nextjs.org/) (React)
- [Material UI](https://mui.com/) with [Emotion](https://emotion.sh/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/) for unit testing

## 📄 License

This project is licensed under the **Preponderous Non-Commercial License (Preponderous-NC)**.
It is free to use, modify, and self-host for **non-commercial** purposes, but **commercial use requires a separate license**.

> **Disclaimer:** *Preponderous Software is not a legal entity.*
> All rights to works published under this license are reserved by the copyright holder, **Daniel McCoy Stephenson**.

Full license text:
[https://github.com/Preponderous-Software/preponderous-nc-license/blob/main/LICENSE.md](https://github.com/Preponderous-Software/preponderous-nc-license/blob/main/LICENSE.md)

## Project Status

This project is in active development. It has been redesigned from its original Spring Boot + Thymeleaf implementation to the Next.js stack described above.
