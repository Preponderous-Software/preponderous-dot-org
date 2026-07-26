# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

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

### Changed

- The site now describes its projects as "source-available" rather than "open source", both in the home-page blurb and in the default page description (#49).
- The home page's **Contribute** and **Explore the Code** cards are now real links rather than clickable panels, so they support open-in-new-tab, middle-click, and "copy link address", and they carry the same external-link icon as the site's other off-site links (#66).

### Fixed

- The light/dark toggle no longer stops working in browsers that block site data: reading and writing the saved preference is now guarded, so the mode still switches when it cannot be persisted (#61).

### Removed

- The legacy Spring Boot + Thymeleaf application (`src/`, Gradle build, and wrapper) — the site is now served entirely by the Next.js app (#40).
