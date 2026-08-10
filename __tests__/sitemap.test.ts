import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import nextConfig from '../next.config.js';

// public/sitemap.xml and public/robots.txt are hand-written static files, so
// nothing in the build keeps them in step with the routes under pages/ or with
// the canonical origin in next.config.js. These tests are that guard: adding a
// page without listing it (or changing the site's origin in one place only)
// fails here.
const SITE_URL = nextConfig.env.NEXT_PUBLIC_SITE_URL;
const publicFile = (name: string) =>
    fs.readFileSync(path.join(__dirname, '..', 'public', name), 'utf8');

// Pages that are real, indexable routes. _app/_document are framework
// wrappers rather than routes, and the shared 404/500 error pages emit no
// canonical URL (see components/Seo.tsx), so neither belongs in a sitemap.
const NON_ROUTE_PAGES = ['_app', '_document', '404', '500'];

const routePathsFromPagesDirectory = (): string[] =>
    fs
        .readdirSync(path.join(__dirname, '..', 'pages'))
        .filter((entry) => entry.endsWith('.tsx'))
        .map((entry) => entry.replace(/\.tsx$/, ''))
        .filter((name) => !NON_ROUTE_PAGES.includes(name))
        // The home page's canonical URL is the bare origin with a trailing
        // slash, matching what <Seo path="/"/> emits on pages/index.tsx.
        .map((name) => (name === 'index' ? '/' : `/${name}`));

const sitemapLocations = (): string[] => {
    const document = new DOMParser().parseFromString(
        publicFile('sitemap.xml'),
        'application/xml'
    );
    expect(document.getElementsByTagName('parsererror')).toHaveLength(0);
    expect(document.documentElement.tagName).toBe('urlset');
    expect(document.documentElement.getAttribute('xmlns')).toBe(
        'http://www.sitemaps.org/schemas/sitemap/0.9'
    );
    return Array.from(document.getElementsByTagName('loc')).map(
        (loc) => loc.textContent ?? ''
    );
};

describe('public/sitemap.xml', () => {
    it('lists every indexable route exactly once, with no others', () => {
        const expected = routePathsFromPagesDirectory().map(
            (route) => `${SITE_URL}${route}`
        );

        expect(sitemapLocations().sort()).toEqual(expected.sort());
    });

    it('omits the error pages, which have no canonical URL', () => {
        const locations = sitemapLocations();

        expect(locations).not.toContain(`${SITE_URL}/404`);
        expect(locations).not.toContain(`${SITE_URL}/500`);
    });
});

describe('public/robots.txt', () => {
    it('allows every crawler to reach the whole site', () => {
        const robots = publicFile('robots.txt');

        expect(robots).toContain('User-agent: *');
        expect(robots).toContain('Allow: /');
        expect(robots).not.toContain('Disallow: /');
    });

    it('points crawlers at the sitemap on the configured origin', () => {
        expect(publicFile('robots.txt')).toContain(
            `Sitemap: ${SITE_URL}/sitemap.xml`
        );
    });
});
