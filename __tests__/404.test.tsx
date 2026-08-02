import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFoundPage from '../pages/404';

// The page renders TopBar, which reads the current route from next/router; there
// is no router provider in a bare render, so stand one in.
vi.mock('next/router', () => ({
    useRouter: () => ({ pathname: '/404' }),
}));

describe('404 page', () => {
    beforeEach(() => {
        render(<NotFoundPage/>);
    });

    it('renders the 404 code, title, and a not-found message', () => {
        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
        expect(
            screen.getByText(/doesn't exist or may have moved/i)
        ).toBeInTheDocument();
    });

    it('offers a way back to the home page', () => {
        expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    });
});
