import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

// visual-diff.json lists the pages the advisory visual diff shoots on every
// pull request (.github/workflows/visual-diff.yml, RFC 0038). Nothing in the
// build keeps that list in step with the routes under pages/, so a new page
// would silently go unshot. This test is that guard, in the same shape as
// __tests__/sitemap.test.ts.
const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'visual-diff.json'), 'utf8')
) as { pages: string[] };

// _app/_document are framework wrappers, not routes. The 404/500 error
// pages are not addressable by a path of their own.
const NON_ROUTE_PAGES = ['_app', '_document', '404', '500'];

// Routes deliberately left unshot. /usage is rendered per request from
// trace's live figures (getServerSideProps in pages/usage.tsx), so its shots
// would differ between base and head with no code change.
const UNSHOT_ROUTES = ['/usage'];

// Every route is a single file directly under pages/ (see sitemap.test.ts).
const routePathsFromPagesDirectory = (): string[] =>
    fs
        .readdirSync(path.join(__dirname, '..', 'pages'))
        .filter((entry) => entry.endsWith('.tsx'))
        .map((entry) => entry.replace(/\.tsx$/, ''))
        .filter((name) => !NON_ROUTE_PAGES.includes(name))
        .map((name) => (name === 'index' ? '/' : `/${name}`));

describe('visual-diff.json', () => {
    it('shoots every route except the deliberately unshot ones, each once', () => {
        const expected = routePathsFromPagesDirectory().filter(
            (route) => !UNSHOT_ROUTES.includes(route)
        );

        expect([...config.pages].sort()).toEqual(expected.sort());
    });

    it('leaves out /usage, whose live figures change between runs', () => {
        expect(config.pages).not.toContain('/usage');
    });

    it('keeps its unshot list to routes that still exist', () => {
        const routes = routePathsFromPagesDirectory();

        for (const route of UNSHOT_ROUTES) {
            expect(routes).toContain(route);
        }
    });
});
