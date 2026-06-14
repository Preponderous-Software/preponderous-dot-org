# Contributing

## Thank You

Thank you for your interest in contributing to the Preponderous Software website! This guide will help you get started.

## Links

- [GitHub Organization](https://github.com/Preponderous-Software)
- [Repository](https://github.com/Preponderous-Software/preponderous-dot-org)

## Requirements

- A GitHub account
- Git installed on your local machine
- [Node.js](https://nodejs.org/en/) (v18 or later, to match CI)
- A code editor (e.g. VS Code)
- A basic understanding of TypeScript and React

## Getting Started

1. [Sign up for GitHub](https://github.com/signup) if you don't have an account.
2. Fork the repository by clicking **Fork** at the top right of the repo page.
3. Clone your fork: `git clone https://github.com/<your-username>/preponderous-dot-org.git`
4. Open the project in your editor.
5. Install dependencies: `npm install`
6. Start the development server: `npm run dev`
   If you encounter errors, please open an issue.

## Identifying What to Work On

Work items are tracked as [GitHub issues](https://github.com/Preponderous-Software/preponderous-dot-org/issues).

## Making Changes

1. Make sure an issue exists for the work. If not, create one.
2. Create a branch: `git checkout -b <branch-name>`
3. Make your changes.
4. Test your changes (see [Testing](#testing)).
5. Commit: `git commit -m "Description of changes"`
6. Push: `git push origin <branch-name>`
7. Open a pull request, linking the related issue with `Closes #<number>`.
8. Address review feedback.

## Testing

Lint and run the unit tests before opening a pull request:

```bash
npm run lint
npm test
```

For manual testing, start the development server:

```bash
npm run dev
```

## Questions

Open an [issue](https://github.com/Preponderous-Software/preponderous-dot-org/issues) if you have a question.
