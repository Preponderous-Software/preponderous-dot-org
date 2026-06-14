# Configuration Guide

This document describes the configuration options for the Preponderous Software website.

## Environment Variables

The site is a static project showcase and currently requires **no environment variables** to build or run. If configurable values are added in the future, create a `.env.local` file in the project root (it is excluded from version control) and document the variables here.

## Project Showcase Data

The list of projects shown on the home page is data-driven, not hard-coded. It lives in:

```
pages/data/projects.json
```

The file contains a single `projects` array. Each entry supports these fields:

| Field | Required | Description |
|---|---|---|
| `id` | yes | Unique identifier for the project (used as the React key). Use a URL-safe slug. |
| `title` | yes | Project name shown on the card. |
| `description` | yes | Short description. Clamped to three lines on the card. |
| `githubLink` | yes | URL to the project's source repository (opens in a new tab). |
| `technology` | yes | Primary language/technology, shown as a chip (e.g. `Python`, `Java`, `C++`). |

Projects are sorted alphabetically by title at render time (see `utils/projects.ts`), so entries may be listed in any order.

**Example entry:**

```json
{
  "id": "viron",
  "title": "Viron",
  "description": "Viron is a flexible simulation framework for building and managing 2D virtual environments.",
  "githubLink": "https://github.com/Preponderous-Software/Viron",
  "technology": "Java"
}
```

To add, remove, or edit a showcased project, change this file — no code changes are required.

## next.config.js

Additional Next.js configuration lives in `next.config.js` in the project root. Refer to the [Next.js documentation](https://nextjs.org/docs/api-reference/next.config.js/introduction) for all available options.
