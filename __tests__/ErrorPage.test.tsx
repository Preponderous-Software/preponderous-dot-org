import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorPage from '../components/ErrorPage';

// ErrorPage renders TopBar, which reads the current route from next/router;
// there is no router provider in a bare render, so stand one in.
vi.mock('next/router', () => ({
    useRouter: () => ({ pathname: '/404' }),
}));

describe('ErrorPage', () => {
    beforeEach(() => {
        render(
            <ErrorPage
                code="404"
                title="Page not found"
                message="We could not find the page you were looking for."
            />
        );
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
