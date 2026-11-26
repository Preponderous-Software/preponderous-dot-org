import React from 'react';
import {Html, Head, Main, NextScript} from 'next/document';
import {COLOR_MODE_BOOTSTRAP_SCRIPT} from '../utils/colorMode';

export const THEME_COLOR_LIGHT = '#4263eb';
export const THEME_COLOR_DARK = '#161b22';

// The brand fonts (Inter for body, Space Grotesk for headings) are self-hosted
// under public/fonts/ and declared with @font-face in styles/globals.css, so no
// request leaves for a third party and no font stylesheet blocks rendering.
// Both files are preloaded here so they arrive alongside the CSS rather than
// after it has been parsed. Each is one variable font with the latin subset.
export const FONT_PRELOADS = [
    '/fonts/inter-latin-v20.woff2',
    '/fonts/space-grotesk-latin-v22.woff2',
];

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/*
                  Resolves the visitor's color mode and stamps it onto
                  <html data-color-mode> before the body is parsed/painted, so
                  the [data-color-mode] rules in styles/globals.css apply
                  immediately instead of a dark flash. Must run first (as a
                  blocking, non-deferred inline script) and before any CSS that
                  depends on the attribute. See
                  utils/colorMode.ts#COLOR_MODE_BOOTSTRAP_SCRIPT.
                */}
                <script dangerouslySetInnerHTML={{__html: COLOR_MODE_BOOTSTRAP_SCRIPT}}/>
                {/*
                  Next serves no icon of its own, so without this every page
                  load 404s on /favicon.ico and the tab shows a placeholder.
                  Safari ignores the SVG icon (type="image/svg+xml") and falls
                  back to requesting /favicon.ico, so a PNG fallback is listed
                  explicitly too; both are rendered from the same mark, see
                  public/favicon.svg.
                */}
                <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
                <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32"/>
                <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
                {/*
                  Tints the mobile browser's address bar to match the TopBar:
                  the light theme's primary blue, or the dark theme's paper
                  (see the MuiAppBar override in pages/_app.tsx). Keyed off the
                  OS setting, which is what the page boots with unless a choice
                  was stored.
                */}
                <meta name="theme-color" media="(prefers-color-scheme: light)" content={THEME_COLOR_LIGHT}/>
                <meta name="theme-color" media="(prefers-color-scheme: dark)" content={THEME_COLOR_DARK}/>
                {FONT_PRELOADS.map((href) => (
                    <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous"/>
                ))}
            </Head>
            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>
    );
}
