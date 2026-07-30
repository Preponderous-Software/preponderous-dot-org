import {Html, Head, Main, NextScript} from 'next/document';

// Load the brand fonts (Inter for body, Space Grotesk for headings) from Google
// Fonts. Next 12 predates next/font, so they are linked here in the document
// head; preconnect hints keep the extra round-trip cheap.
export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/*
                  Next 12 serves no icon of its own, so without this every page
                  load 404s on /favicon.ico and the tab shows a placeholder.
                  Safari ignores the SVG icon (type="image/svg+xml") and falls
                  back to requesting /favicon.ico, so a PNG fallback is listed
                  explicitly too; both are rendered from the same mark, see
                  public/favicon.svg.
                */}
                <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
                <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32"/>
                <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>
    );
}
