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
const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

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
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={fullTitle}/>
            <meta name="twitter:description" content={desc}/>
            <meta name="twitter:image" content={OG_IMAGE_URL}/>
        </Head>
    );
};

export default Seo;
