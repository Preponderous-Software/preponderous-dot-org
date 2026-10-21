// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { isBot, pagePath } from '../utils/trace-client';

// The two helpers utils/page-view-policy.ts takes from the vendored client:
// pagePath decides what a page-view records, isBot whether one is sent.

describe('pagePath', () => {
    it('keeps only the path of a full URL', () => {
        expect(pagePath('https://preponderous.org/projects/?q=apex#top')).toBe('/projects');
        expect(pagePath('HTTPS://Example.com/About')).toBe('/About');
        expect(pagePath('https://preponderous.org')).toBe('/');
    });

    it('treats an unparseable URL as the root', () => {
        expect(pagePath('http://[bad')).toBe('/');
    });

    it('drops the query string and fragment of a bare path', () => {
        expect(pagePath('/usage?ref=home')).toBe('/usage');
        expect(pagePath('/usage#apex')).toBe('/usage');
        expect(pagePath('?ref=home')).toBe('/');
    });

    it('adds a leading slash, collapses runs of slashes and drops a trailing one', () => {
        expect(pagePath('about')).toBe('/about');
        expect(pagePath('//a///b//')).toBe('/a/b');
        expect(pagePath('/')).toBe('/');
        expect(pagePath('')).toBe('/');
    });

    it('cuts the path to 200 characters', () => {
        expect(pagePath('/' + 'a'.repeat(300))).toBe('/' + 'a'.repeat(199));
    });

    it('treats a non-string as the root', () => {
        expect(pagePath(undefined as unknown as string)).toBe('/');
        expect(pagePath(42 as unknown as string)).toBe('/');
    });
});

describe('isBot', () => {
    it('counts a missing or blank user agent as a bot', () => {
        expect(isBot(null)).toBe(true);
        expect(isBot(undefined)).toBe(true);
        expect(isBot('')).toBe(true);
        expect(isBot('   ')).toBe(true);
    });

    it('lets ordinary desktop and phone browsers through', () => {
        for (const agent of [
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
        ]) {
            expect(isBot(agent), agent).toBe(false);
        }
    });

    it('flags crawlers, link previews, headless browsers and HTTP libraries', () => {
        for (const agent of [
            'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
            'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)',
            'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/126.0 Safari/537.36',
            'Wget/1.21.4',
            'Go-http-client/1.1',
            'Java/17.0.2',
            'axios/1.7.2',
            'node-fetch/1.0',
        ]) {
            expect(isBot(agent), agent).toBe(true);
        }
    });

    it('matches regardless of case', () => {
        expect(isBot('GOOGLEBOT/2.1')).toBe(true);
        expect(isBot('CURL/8.5.0')).toBe(true);
    });
});
