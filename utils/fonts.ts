// The theme's font stacks. Inter (body) and Space Grotesk (headings) are
// self-hosted (public/fonts/, @font-face in styles/globals.css) with
// font-display: swap, so text first paints in a local font and
// re-flows when the web font arrives. On a phone that re-flow wrapped the top
// bar's wordmark onto a second row and pushed the page down (a layout shift
// Lighthouse scored at 0.32). Each stack therefore names, right after the web
// font, a metric-matched fallback declared in styles/globals.css: Arial (or
// its metric twin Liberation Sans) scaled and with ascent/descent overridden
// to the web font's own measurements, so the swap barely moves anything.
export const BODY_FALLBACK_FAMILY = 'Inter Fallback';
export const HEADING_FALLBACK_FAMILY = 'Space Grotesk Fallback';

export const BODY_FONT_STACK =
    `"Inter", "${BODY_FALLBACK_FAMILY}", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
export const HEADING_FONT_STACK = `"Space Grotesk", "${HEADING_FALLBACK_FAMILY}", system-ui, sans-serif`;
