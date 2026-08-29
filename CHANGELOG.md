# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- `public/robots.txt` and `public/sitemap.xml`, listing every indexable route so search engines can discover all of them, documented in `CONFIG.md` (#83).
- Test coverage for `ColorModeToggleSwitch`, the last component without a test file, including a guard that the `public/colormode/*.svg` icons its styles reference still exist (#94).
- Test coverage for `pages/_document.tsx`, pinning down the parts that would regress silently: the color-mode bootstrap script stays inline, render-blocking, and ahead of the page content; the icon links keep pointing at the assets shipped under `public/`; and the document keeps declaring `lang="en"` (#90).

### Changed

- The project-card grid shown on the home page and on `/projects` is now a single `ProjectGrid` component rather than a copy in each page, so a field added to a project card is wired up once and appears on both pages instead of having to be threaded through two identical call sites. What renders is unchanged (#101).

### Fixed

- The site's hover and focus animations now honour the operating system's "reduce motion" setting: the lift on navigation buttons and project cards, the zoom on the color-mode toggle and version badge, and the transitions MUI supplies of its own are all suppressed for visitors who have asked for less motion. The hover colour and shadow changes are kept, so the feedback those effects give is unchanged (#99).
- Switching the color mode now updates `<html data-color-mode>` and its `color-scheme` as well as the theme, so the document background, the scrollbars, and the overscroll area follow the switch instead of staying on the mode the page was loaded with until the next reload (#96).
- The footer's **Home** and **Legal** links now carry `aria-current="page"` when they point at the page being viewed, matching the top bar, so a screen reader announces which of them leads nowhere new (#97).
- Each project card's **GitHub** and **Visit Site** buttons are now named after their project for assistive technology, so a page of cards no longer presents a dozen links called only "GitHub"; the **GitHub** button also carries the external-link icon the rest of the site uses for off-site links. The visible button text is unchanged (#92).
- Category sections on `/projects` now derive their heading id from a slug of the category name, so a category containing a space (or punctuation) keeps its accessible name instead of pointing `aria-labelledby` at ids that do not exist (#93).
- The top bar's link group is now a named `navigation` landmark ("Primary"), matching the footer's, so assistive technology can list the site's primary navigation and the skip link has a landmark to skip past (#89).
- The color-mode bootstrap script no longer stamps `dark` on every visitor whose browser blocks site data: the stored-choice and `prefers-color-scheme` lookups are now guarded separately, so a light-preferring visitor with blocked storage gets a light page instead of MUI's light theme on a permanently dark background (#82).

## [0.2.0-SNAPSHOT-8-8-2026] – 2026-08-08

### Changed
- preponderous-dot-org is now developed AI-first. Day-to-day feature work, grooming, review and maintenance run through AI agents working directly against this repository, with the maintainers setting direction and approving what lands. The version bump marks that change in how the project is built — it is not a break in behaviour, configuration or stored data, and existing installations can upgrade in place. Released as `0.2.0-SNAPSHOT-8-8-2026`: the AI-first line has not yet been verified in live operation, and the dated snapshot designation stays until it has.

The site has been redesigned from Spring Boot + Thymeleaf to Next.js + React + MUI, mirroring [dansplugins-dot-com](https://github.com/Dans-Plugins/dansplugins-dot-com) (epic #31, static first pass).

### Added

- Next.js + React + Material UI + Emotion project scaffold, alongside the existing app (#32).
- Shared layout chrome: `TopBar` and `BottomBar`, with an accessible "skip to main content" link (#33).
- Top-bar navigation cues: a brand wordmark linking home, an active-page ("you are here") indicator carrying `aria-current="page"`, and an external-link icon on off-site links (#33).
- Persisted light/dark color-mode toggle that follows the OS preference until the visitor chooses (#34).
- Home page with a data-driven project showcase: `ProjectCard`, intro `Blurb`, and a grid seeded from `pages/data/projects.json` (#35).
- `Seo` component emitting title, description, and Open Graph / Twitter card metadata (#36).
- Friendly themed `404` and `500` error pages within the standard chrome (#37).
- GitHub Actions CI: lint, test, and build on pull requests and `main` (#27, #53).
- Documentation set: `README`, `CONFIG.md`, `USER_GUIDE.md`, `CONTRIBUTING.md`, and this changelog (#39).
- Component-render test coverage for `ProjectCard` and `Blurb` using React Testing Library + jsdom (#38), extended to the shared chrome — `TopBar`, `BottomBar`, `Seo`, and `ErrorPage` (#58) — to the color-mode wiring in `_app` (#62), and to the home page's card ordering and `#projects` anchor (#64).
- Node-based `Dockerfile`, `compose.yaml`, and dev container; CI switched to npm (#40).
- `/legal` page covering the license, copyright, disclaimer, privacy (what is stored on the visitor's device), and third-party component notices (#21).
- Footer copyright notice with a license link, plus **Home** and **Legal** navigation links; the copyright year is baked in at build time via `NEXT_PUBLIC_BUILD_YEAR` (#20).
- Optional `websiteLink` field on a project, rendered as a **Visit Site** button beside the project card's GitHub button, and documented in `CONFIG.md` (#51, #56).
- Live-site links for Barony, Roam, and microbiome, plus project cards for the sibling sites [danielstephenson.dev](https://danielstephenson.dev) and [dansplugins.com](https://dansplugins.com) (#51, #54).
- A favicon: an SVG "P" mark in the brand blue that follows the OS light/dark preference (#67).
- A PNG favicon and apple-touch-icon fallback (rendered from the SVG mark) so Safari and "Add to Home Screen" no longer show a placeholder (#69).
- `Seo` now emits a canonical `<link>`, `og:url`, and an `og:image`/`twitter:image` (with `twitter:card` upgraded to `summary_large_image`), documented in `CONFIG.md` (#65).
- `/about` page covering the mission, values, and who runs Preponderous Software, and `/contact` page covering how to reach out (report a bug, or a project's own repository); both linked from the top navigation bar (#18, #19).
- `/projects` page listing every showcased project grouped by category, plus an optional `status` chip (e.g. `Active`, `Maintenance`) on `ProjectCard`; both driven by new optional `category`/`status` fields on `pages/data/projects.json` entries, documented in `CONFIG.md` (#17).
- Test coverage for the `404`/`500` error pages and `BottomBar`'s color-mode toggle (#79).
- A project card for Artificial-Consciousness-Simulation-Framework, including its `category`/`status` fields (#80, #81).

### Changed

- The site now describes its projects as "source-available" rather than "open source", both in the home-page blurb and in the default page description (#49).
- The home page's **Contribute** and **Explore the Code** cards are now real links rather than clickable panels, so they support open-in-new-tab, middle-click, and "copy link address", and they carry the same external-link icon as the site's other off-site links (#66).

### Fixed

- The light/dark toggle no longer stops working in browsers that block site data: reading and writing the saved preference is now guarded, so the mode still switches when it cannot be persisted (#61).
- Internal navigation (Home, brand wordmark, footer **Home**/**Legal**, error page "Back to home") now does a client-side route transition via `next/link` instead of a full document reload (#71).
- The heading outline is now contiguous on every page: the **Projects** section, "Get involved", and each card title use the correct heading level, and each error page's `<h1>` is its human-readable title rather than the status code (#72).
- Light-mode visitors no longer see a dark theme flash before hydration: a blocking script resolves the color mode before first paint and stamps it onto `<html data-color-mode>`, which `styles/globals.css` uses to paint the right background immediately (#73).
- `LICENSE`'s copyright range is now open-ended (`2022–present`) instead of a fixed end year, so it no longer drifts behind the footer/`/legal` page's build-time-computed range (#84).

### Removed

- The legacy Spring Boot + Thymeleaf application (`src/`, Gradle build, and wrapper) — the site is now served entirely by the Next.js app (#40).
