import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import Document from '../pages/_document';
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

    it('preconnects to the Google Fonts origins the stylesheet is loaded from', () => {
        const { getByTestId } = renderDocument();
        const head = getByTestId('head');
        const preconnects = Array.from(head.querySelectorAll('link[rel="preconnect"]'))
            .map((link) => link.getAttribute('href'));
        expect(preconnects).toEqual(
            expect.arrayContaining(['https://fonts.googleapis.com', 'https://fonts.gstatic.com'])
        );
        expect(head.querySelector('link[rel="stylesheet"]'))
            .toHaveAttribute('href', expect.stringContaining('fonts.googleapis.com'));
    });

    it('loads both brand font families', () => {
        const { getByTestId } = renderDocument();
        const stylesheet = getByTestId('head').querySelector('link[rel="stylesheet"]');
        expect(stylesheet?.getAttribute('href')).toContain('Inter');
        expect(stylesheet?.getAttribute('href')).toContain('Space+Grotesk');
    });

    it('renders the app content and the Next.js scripts', () => {
        const { getByTestId } = renderDocument();
        expect(getByTestId('main')).toBeInTheDocument();
        expect(getByTestId('next-script')).toBeInTheDocument();
    });
});
