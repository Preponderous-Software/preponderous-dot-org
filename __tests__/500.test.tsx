import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServerErrorPage from '../pages/500';

// The page renders TopBar, which reads the current route from next/router; there
// is no router provider in a bare render, so stand one in.
vi.mock('next/router', () => ({
    useRouter: () => ({ pathname: '/500' }),
}));

describe('500 page', () => {
    beforeEach(() => {
        render(<ServerErrorPage/>);
    });

    it('renders the 500 code, title, and an unexpected-error message', () => {
        expect(screen.getByText('500')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 1, name: 'Something went wrong' })).toBeInTheDocument();
        expect(
            screen.getByText(/unexpected error occurred/i)
        ).toBeInTheDocument();
    });

    it('offers a way back to the home page', () => {
        expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    });
});
