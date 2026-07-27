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
}

module.exports = nextConfig
