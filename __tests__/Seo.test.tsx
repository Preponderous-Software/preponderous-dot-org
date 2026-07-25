import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import Seo from '../components/Seo';

// next/head only writes into document.head through Next's head manager, which a
// bare render has no provider for; render its children inline instead so the
// emitted tags can be queried from the test container.
vi.mock('next/head', async () => {
    const { Children, createElement, Fragment } = await import('react');
    return {
        default: (props: { children?: React.ReactNode }) =>
            // Children.toArray keys the tags, so rendering them as a list stays quiet.
            createElement(Fragment, null, Children.toArray(props.children)),
    };
});

const metaContent = (container: HTMLElement, selector: string) =>
    container.querySelector(selector)?.getAttribute('content');

describe('Seo', () => {
    it('appends the site name to a page-specific title', () => {
        const { container } = render(<Seo title="Legal"/>);
        expect(container.querySelector('title')?.textContent).toBe('Legal — Preponderous Software');
    });

    it('uses the site name alone when no title is given', () => {
        const { container } = render(<Seo/>);
        expect(container.querySelector('title')?.textContent).toBe('Preponderous Software');
    });

    it('falls back to the default description', () => {
        const { container } = render(<Seo/>);
        expect(metaContent(container, 'meta[name="description"]')).toContain('source-available');
    });

    it('uses the given description when one is provided', () => {
        const { container } = render(<Seo title="404" description="No such page."/>);
        expect(metaContent(container, 'meta[name="description"]')).toBe('No such page.');
    });

    it('mirrors the title and description into the Open Graph and Twitter tags', () => {
        const { container } = render(<Seo title="Legal" description="Licensing and privacy."/>);
        for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
            expect(metaContent(container, selector)).toBe('Legal — Preponderous Software');
        }
        for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
            expect(metaContent(container, selector)).toBe('Licensing and privacy.');
        }
        expect(metaContent(container, 'meta[property="og:site_name"]')).toBe('Preponderous Software');
        expect(metaContent(container, 'meta[property="og:type"]')).toBe('website');
        expect(metaContent(container, 'meta[name="twitter:card"]')).toBe('summary');
    });
});
