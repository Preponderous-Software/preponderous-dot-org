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

### Development Server

For local development with hot-reloading:

```bash
npm run dev
```

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
