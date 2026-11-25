// schema.org structured data (JSON-LD) for the home page, so search engines
// can show the organization's name, logo and profiles. Only facts the site
// already states are used: its name, address, description, icon and GitHub
// organization.
export const GITHUB_ORG_URL = 'https://github.com/Preponderous-Software';

export interface SiteFacts {
    siteUrl: string;
    siteName: string;
    description: string;
}

export const homeStructuredData = ({siteUrl, siteName, description}: SiteFacts) => {
    const home = `${siteUrl}/`;
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${home}#organization`,
                name: siteName,
                url: home,
                logo: `${siteUrl}/apple-touch-icon.png`,
                sameAs: [GITHUB_ORG_URL],
            },
            {
                '@type': 'WebSite',
                '@id': `${home}#website`,
                name: siteName,
                url: home,
                description,
                inLanguage: 'en',
                publisher: {'@id': `${home}#organization`},
            },
        ],
    };
};

// JSON.stringify leaves "<" alone, so a value containing "</script>" could end
// the inline script early; escaping it keeps the JSON valid and inert.
export const serializeJsonLd = (data: unknown): string =>
    JSON.stringify(data).replace(/</g, '\\u003c');
