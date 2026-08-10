# Configuration Guide

This document describes the configuration options for the Preponderous Software website.

## Environment Variables

The site is a static project showcase and requires **no environment variables** to build or run. If configurable values are added in the future, create a `.env.local` file in the project root (it is excluded from version control) and document the variables here.

One value is injected automatically by `next.config.js` and does not need to be set by hand:

| Variable | Set by | Purpose |
|---|---|---|
| `NEXT_PUBLIC_BUILD_YEAR` | `next.config.js`, at build time | The year the site was built, used for the copyright range in the footer and on `/legal`. Baked in at build time so the pre-rendered HTML and the client hydration pass always agree; reading the clock during render would disagree across a New Year boundary. If it is ever missing, `utils/copyright.ts` falls back to the current year. |
| `NEXT_PUBLIC_SITE_URL` | `next.config.js`, at build time | The site's canonical origin (`https://preponderous.org`), used by `components/Seo.tsx` to build the `<link rel="canonical">`/`og:url` links and the absolute `og:image`/`twitter:image` URLs. If it is ever missing (e.g. under Vitest, which does not load `next.config.js`), `Seo.tsx` falls back to the same value. |

## Project Showcase Data

The list of projects shown on the home page and the `/projects` page is data-driven, not hard-coded. It lives in:

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
| `websiteLink` | no | URL to a live/hosted version of the project. When set, the card shows a "Visit Site" button as its primary action, opening in a new tab. |
| `category` | no | Grouping shown as a section heading on the `/projects` page (e.g. `Games`, `Simulations`, `Libraries`, `Tools`, `Websites`). Entries with no `category` are filed under "Other" (see `groupProjectsByCategory` in `utils/projects.ts`); they still appear on the home page either way. |
| `status` | no | Maintenance state shown as a colour-coded chip on the card (e.g. `Active`, `Maintenance`). Any other value renders as a plain outlined chip. Omit it to show no status chip. |

Projects are sorted alphabetically by title at render time (see `utils/projects.ts`), so entries may be listed in any order. The home page lists every project in one flat, alphabetical grid; `/projects` groups the same data by `category`, each category's projects sorted alphabetically within it.

**Example entry:**

```json
{
  "id": "roam",
  "title": "Roam",
  "description": "Explore a procedurally-generated 2D world and interact with your surroundings.",
  "githubLink": "https://github.com/Preponderous-Software/Roam",
  "technology": "Python",
  "websiteLink": "https://roam.preponderous.org",
  "category": "Games",
  "status": "Active"
}
```

To add, remove, or edit a showcased project, change this file — no code changes are required.

## Icon and Open Graph Image Assets

The site's "P" mark is authored once, as `public/favicon.svg`, and rendered as
three PNG fallbacks for surfaces that can't use an SVG icon:

| File | Size | Used by |
|---|---|---|
| `public/favicon.png` | 32×32 | Safari, which ignores the SVG `<link rel="icon">` and falls back to a raster icon (`pages/_document.tsx`). |
| `public/apple-touch-icon.png` | 180×180 | iOS "Add to Home Screen" and Safari's tab/bookmark icon. |
| `public/og-image.png` | 1200×630 | `og:image`/`twitter:image` in `components/Seo.tsx`, shown by link unfurlers (Discord, social) that don't render SVG. |

All three use the light-theme blue (`#4263eb`) unconditionally — a static PNG
can't follow `prefers-color-scheme` the way the SVG does. If `favicon.svg`'s
mark ever changes, regenerate these with an SVG rasterizer (e.g. `sharp`,
`resvg`, or ImageMagick); there is no rasterization step in this repo's own
build.

## Crawler Files

Two static files under `public/` tell search engines what to crawl and index:

| File | Purpose |
|---|---|
| `public/robots.txt` | Allows every crawler the whole site and points at the sitemap's absolute URL. |
| `public/sitemap.xml` | Lists every indexable route (`/`, `/about`, `/contact`, `/legal`, `/projects`) as an absolute URL, matching the canonical links `components/Seo.tsx` emits. The shared `404`/`500` error pages are deliberately excluded — they have no canonical URL of their own. |

Both are hand-written and hard-code the origin, because a file served straight
out of `public/` is not templated at build time and so cannot read
`NEXT_PUBLIC_SITE_URL`. `__tests__/sitemap.test.ts` is the guard against that
duplication drifting: it fails if the sitemap's routes stop matching the pages
under `pages/`, or if either file's origin stops matching `next.config.js`. When
adding a page, add it to `public/sitemap.xml` in the same change.

## next.config.js

Additional Next.js configuration lives in `next.config.js` in the project root. Refer to the [Next.js documentation](https://nextjs.org/docs/api-reference/next.config.js/introduction) for all available options.
