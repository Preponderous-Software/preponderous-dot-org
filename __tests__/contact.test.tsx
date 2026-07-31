import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContactPage from '../pages/contact';

// The page renders TopBar, which reads the current route from next/router; there
// is no router provider in a bare render, so stand one in.
vi.mock('next/router', () => ({
    useRouter: () => ({ pathname: '/contact' }),
}));

describe('Contact page', () => {
    beforeEach(() => {
        render(<ContactPage/>);
    });

    it('renders a Contact heading and the report/project sections', () => {
        expect(screen.getByRole('heading', { level: 1, name: 'Contact' })).toBeInTheDocument();
        for (const title of ['Report a Bug', 'Projects']) {
            expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
        }
    });

    it('links to filing a new bug report on the website repository', () => {
        const link = screen.getByRole('link', { name: /report a website bug/i });
        expect(link).toHaveAttribute(
            'href',
            'https://github.com/Preponderous-Software/preponderous-dot-org/issues/new'
        );
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('links to the GitHub organization for project-specific contact', () => {
        const link = screen.getByRole('link', { name: /preponderous software on github/i });
        expect(link).toHaveAttribute('href', 'https://github.com/Preponderous-Software');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
});
