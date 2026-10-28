import Head from 'next/head';
import React from 'react';

// Shared per-page document metadata: title, description, canonical URL, and
// Open Graph / Twitter card tags so browser tabs, search engines, and shared
// links (Discord, social) all show meaningful information. Render once near
// the top of each page.
const SITE_NAME = 'Preponderous Software';
const DEFAULT_DESCRIPTION =
    'Free, source-available games and assets — built in the open and free to use.';

// Injected at build time by next.config.js, same as NEXT_PUBLIC_BUILD_YEAR; the
// fallback here only matters under Vitest, which does not load next.config.js.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://preponderous.org';
// The share card: public/og-image.png, a 1200x630 PNG drawn from
// og-card/card.json (planets on their orbits rendered with Strata, the name over
// it; see og-card/README.md). OG_IMAGE_ALT is the card spec's alt text, word for
// word; __tests__/Seo.test.tsx fails if the two drift apart.
export const OG_IMAGE_PATH = '/og-image.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT =
    'A star lighting its planets on traced orbits under a field of stars, rendered in 3D with Strata. ' +
    'Over it: the name Preponderous Software, the tagline “Free, source-available games and assets”, and ' +
    'the address preponderous.org.';
const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

interface SeoProps {
    // Page-specific title; the site name is appended automatically. Omit on the
    // home page to use the site name alone.
    title?: string;
    description?: string;
    // This page's canonical path (e.g. "/legal"). Omit for pages with no single
    // canonical URL, such as the shared 404/500 error page, which then skip the
    // canonical link and og:url tag rather than pointing at a URL of their own.
    path?: string;
}

const Seo: React.FC<SeoProps> = ({title, description, path}) => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const desc = description ?? DEFAULT_DESCRIPTION;
    const url = path ? `${SITE_URL}${path}` : undefined;
    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={desc}/>
            {url && <link rel="canonical" href={url}/>}
            <meta property="og:title" content={fullTitle}/>
            <meta property="og:description" content={desc}/>
            <meta property="og:type" content="website"/>
            <meta property="og:site_name" content={SITE_NAME}/>
            {url && <meta property="og:url" content={url}/>}
            <meta property="og:image" content={OG_IMAGE_URL}/>
            <meta property="og:image:type" content="image/png"/>
            <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)}/>
            <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)}/>
            <meta property="og:image:alt" content={OG_IMAGE_ALT}/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={fullTitle}/>
            <meta name="twitter:description" content={desc}/>
            <meta name="twitter:image" content={OG_IMAGE_URL}/>
            <meta name="twitter:image:alt" content={OG_IMAGE_ALT}/>
        </Head>
    );
};

export default Seo;
