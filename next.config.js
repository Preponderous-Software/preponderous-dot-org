const FONT_CACHE_CONTROL = 'public, max-age=31536000, immutable'
const PUBLIC_ASSET_CACHE_CONTROL = 'public, max-age=86400, stale-while-revalidate=604800'
// robots.txt and sitemap.xml are left on Next's default so crawlers always see
// the current copy.
const STABLE_PUBLIC_PATHS = [
  '/previews/:path*',
  '/icons/:path*',
  '/colormode/:path*',
  '/favicon.svg',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/og-image.png',
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  env: {
    // Baked into both the server and client bundles at build time, so the
    // copyright year in the footer/legal page can never differ between the
    // pre-rendered HTML and the client hydration pass.
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
    // The site's canonical origin, used by components/Seo.tsx to build
    // canonical/og:url links and absolute image URLs. Set explicitly here
    // (rather than left to Seo.tsx's fallback) so it is visible as a single,
    // documented build setting — see CONFIG.md.
    NEXT_PUBLIC_SITE_URL: 'https://preponderous.org',
  },
  // GET /version.json answers with the version this build was made from
  // (pages/api/version.ts), so a deploy can be verified by the version it
  // reports.
  async rewrites() {
    return [{ source: '/version.json', destination: '/api/version' }]
  },
  // Browser caching for files served from public/. Next sends them with
  // `max-age=0` by default, so every page view revalidates every icon and
  // poster. (/_next/static/ is content-hashed and already immutable.)
  async headers() {
    return [
      // The font files carry their upstream version in the name
      // (styles/globals.css), so a changed font is a new URL: safe to cache
      // for a year without revalidating.
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: FONT_CACHE_CONTROL }],
      },
      // Everything else keeps a fixed path when its content changes — a
      // preview's poster.jpg / clip.* is re-recorded in place, icons and the
      // og image are replaced under the same name — so these get a day, then
      // are served from cache while a fresh copy is fetched in the background
      // for up to a week.
      ...STABLE_PUBLIC_PATHS.map((source) => ({
        source,
        headers: [{ key: 'Cache-Control', value: PUBLIC_ASSET_CACHE_CONTROL }],
      })),
    ]
  },
}

module.exports = nextConfig
