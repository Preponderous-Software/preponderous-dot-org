import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorPage from '../components/ErrorPage';

// ErrorPage renders TopBar, which reads the current route from next/router;
// there is no router provider in a bare render, so stand one in.
vi.mock('next/router', () => ({
    useRouter: () => ({ pathname: '/404' }),
}));

// next/head only writes into document.head through Next's head manager; render
// its children inline so the page's metadata can be queried (as in Seo.test).
vi.mock('next/head', async () => {
    const { Children, createElement, Fragment } = await import('react');
    return {
        default: (props: { children?: React.ReactNode }) =>
            createElement(Fragment, null, Children.toArray(props.children)),
    };
});

describe('ErrorPage', () => {
    let container: HTMLElement;

    beforeEach(() => {
        ({ container } = render(
            <ErrorPage
                code="404"
                title="Page not found"
                message="We could not find the page you were looking for."
            />
        ));
    });

    // The error page is served at whatever URL failed, so it must stay out of
    // search results and never claim a canonical URL of its own.
    it('is marked noindex and has no canonical link', () => {
        expect(container.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
        expect(container.querySelector('link[rel="canonical"]')).toBeNull();
    });

    it('renders the code, title, and message it was given', () => {
        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
        expect(
            screen.getByText('We could not find the page you were looking for.')
        ).toBeInTheDocument();
    });

    it('makes the human-readable title the page\'s only heading level 1', () => {
        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
        expect(screen.queryByRole('heading', { level: 1, name: '404' })).not.toBeInTheDocument();
    });

    it('offers a way back to the home page', () => {
        expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    });

    it('keeps the standard page chrome around the message', () => {
        expect(screen.getByRole('link', { name: 'Preponderous Software' })).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: /footer/i })).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
    });
});
