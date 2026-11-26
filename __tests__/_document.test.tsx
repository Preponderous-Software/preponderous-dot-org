import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import Document, { FONT_PRELOADS, THEME_COLOR_DARK, THEME_COLOR_LIGHT } from '../pages/_document';
import { COLOR_MODE_BOOTSTRAP_SCRIPT } from '../utils/colorMode';

// next/document's primitives only work inside Next's own document renderer, so
// they are replaced with plain containers that keep the props under test
// observable. <html>/<head>/<body> cannot be nested inside jsdom's existing
// document, hence the div stand-ins.
vi.mock('next/document', () => ({
    Html: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
        <div data-testid="html" {...props}>{children}</div>
    ),
    Head: ({ children }: React.PropsWithChildren) => <div data-testid="head">{children}</div>,
    Main: () => <div data-testid="main"/>,
    NextScript: () => <div data-testid="next-script"/>,
}));

const renderDocument = () => render(<Document/>);

describe('Document', () => {
    it('declares the document language', () => {
        const { getByTestId } = renderDocument();
        expect(getByTestId('html')).toHaveAttribute('lang', 'en');
    });

    it('inlines the color-mode bootstrap script in the head', () => {
        const { getByTestId } = renderDocument();
        const script = getByTestId('head').querySelector('script');
        expect(script).not.toBeNull();
        expect(script?.innerHTML).toBe(COLOR_MODE_BOOTSTRAP_SCRIPT);
    });

    // The script stamps <html data-color-mode> before the body paints, which
    // only holds while it stays render-blocking — an async/defer attribute
    // would let the dark flash back in.
    it('leaves the bootstrap script render-blocking', () => {
        const { getByTestId } = renderDocument();
        const script = getByTestId('head').querySelector('script') as HTMLScriptElement;
        expect(script).not.toHaveAttribute('async');
        expect(script).not.toHaveAttribute('defer');
        expect(script).not.toHaveAttribute('src');
    });

    it('renders the bootstrap script before the page content', () => {
        const { getByTestId } = renderDocument();
        const script = getByTestId('head').querySelector('script') as HTMLScriptElement;
        const main = getByTestId('main');
        expect(script.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('links the icon assets that ship under public/', () => {
        const { getByTestId } = renderDocument();
        const hrefs = Array.from(getByTestId('head').querySelectorAll('link[rel*="icon"]'))
            .map((link) => link.getAttribute('href'));
        expect(hrefs).toEqual(
            expect.arrayContaining(['/favicon.svg', '/favicon.png', '/apple-touch-icon.png'])
        );
    });

    it('marks the SVG icon with its type so Safari can fall back to the PNG', () => {
        const { getByTestId } = renderDocument();
        const head = getByTestId('head');
        expect(head.querySelector('link[href="/favicon.svg"]')).toHaveAttribute('type', 'image/svg+xml');
        expect(head.querySelector('link[href="/favicon.png"]')).toHaveAttribute('sizes', '32x32');
    });

    // The fonts are self-hosted, so nothing in the head may reach Google.
    it('loads no stylesheet or connection from Google Fonts', () => {
        const { getByTestId } = renderDocument();
        const head = getByTestId('head');
        expect(head.querySelector('link[rel="stylesheet"]')).toBeNull();
        expect(head.querySelector('link[rel="preconnect"]')).toBeNull();
        expect(head.innerHTML).not.toContain('fonts.googleapis.com');
        expect(head.innerHTML).not.toContain('fonts.gstatic.com');
    });

    it('preloads both self-hosted brand fonts as CORS woff2 font requests', () => {
        const { getByTestId } = renderDocument();
        const preloads = Array.from(getByTestId('head').querySelectorAll('link[rel="preload"][as="font"]'));
        expect(preloads.map((link) => link.getAttribute('href'))).toEqual(FONT_PRELOADS);
        expect(FONT_PRELOADS).toEqual([
            expect.stringMatching(/^\/fonts\/inter-.*\.woff2$/),
            expect.stringMatching(/^\/fonts\/space-grotesk-.*\.woff2$/),
        ]);
        for (const link of preloads) {
            expect(link).toHaveAttribute('type', 'font/woff2');
            // Fonts are always fetched in CORS mode; a preload without
            // crossorigin is not reused and the file downloads twice.
            expect(link).toHaveAttribute('crossorigin', 'anonymous');
        }
    });

    // Each preloaded file must exist under public/ and be declared in
    // styles/globals.css, or the preload is wasted bandwidth.
    it('preloads only files that ship in public/ and are declared in globals.css', () => {
        const css = readFileSync(join(__dirname, '..', 'styles', 'globals.css'), 'utf8');
        for (const href of FONT_PRELOADS) {
            expect(existsSync(join(__dirname, '..', 'public', href))).toBe(true);
            expect(css).toContain(`url('${href}') format('woff2')`);
        }
    });

    it('renders the app content and the Next.js scripts', () => {
        const { getByTestId } = renderDocument();
        expect(getByTestId('main')).toBeInTheDocument();
        expect(getByTestId('next-script')).toBeInTheDocument();
    });

    it('sets a theme color for each color scheme, matching the TopBar', () => {
        const { getByTestId } = renderDocument();
        const colors = Array.from(getByTestId('head').querySelectorAll('meta[name="theme-color"]'))
            .map((meta) => [meta.getAttribute('media'), meta.getAttribute('content')]);
        expect(colors).toEqual([
            ['(prefers-color-scheme: light)', THEME_COLOR_LIGHT],
            ['(prefers-color-scheme: dark)', THEME_COLOR_DARK],
        ]);
        expect(THEME_COLOR_LIGHT).toMatch(/^#[0-9a-f]{6}$/i);
        expect(THEME_COLOR_DARK).toMatch(/^#[0-9a-f]{6}$/i);
    });
});
