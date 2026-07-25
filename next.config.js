/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  env: {
    // Baked into both the server and client bundles at build time, so the
    // copyright year in the footer/legal page can never differ between the
    // pre-rendered HTML and the client hydration pass.
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
}

module.exports = nextConfig
