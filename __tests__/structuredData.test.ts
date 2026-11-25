import { describe, expect, it } from 'vitest';
import { GITHUB_ORG_URL, homeStructuredData, serializeJsonLd } from '../utils/structuredData';

const facts = {
    siteUrl: 'https://example.test',
    siteName: 'Example Site',
    description: 'An example description.',
};

describe('homeStructuredData', () => {
    const graph = homeStructuredData(facts)['@graph'];
    const organization = graph.find((node) => node['@type'] === 'Organization') as Record<string, unknown>;
    const website = graph.find((node) => node['@type'] === 'WebSite') as Record<string, unknown>;

    it('uses the schema.org context', () => {
        expect(homeStructuredData(facts)['@context']).toBe('https://schema.org');
    });

    it('describes the organization with its name, home URL, logo and GitHub profile', () => {
        expect(organization).toMatchObject({
            '@id': 'https://example.test/#organization',
            name: 'Example Site',
            url: 'https://example.test/',
            logo: 'https://example.test/apple-touch-icon.png',
            sameAs: [GITHUB_ORG_URL],
        });
    });

    it('describes the website and links it to the organization as publisher', () => {
        expect(website).toMatchObject({
            '@id': 'https://example.test/#website',
            name: 'Example Site',
            url: 'https://example.test/',
            description: 'An example description.',
            inLanguage: 'en',
            publisher: { '@id': organization['@id'] },
        });
    });
});

describe('serializeJsonLd', () => {
    it('round-trips as JSON', () => {
        const data = homeStructuredData(facts);
        expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
    });

    it('escapes "<" so a value cannot close the inline script', () => {
        const json = serializeJsonLd({ name: '</script><script>alert(1)</script>' });
        expect(json).not.toContain('<');
        expect(JSON.parse(json).name).toBe('</script><script>alert(1)</script>');
    });
});
