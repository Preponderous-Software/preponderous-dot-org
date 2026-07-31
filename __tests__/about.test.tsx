import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from '../pages/about';
import { COPYRIGHT_HOLDER } from '../utils/copyright';

// The page renders TopBar, which reads the current route from next/router; there
// is no router provider in a bare render, so stand one in.
vi.mock('next/router', () => ({
    useRouter: () => ({ pathname: '/about' }),
}));

describe('About page', () => {
    beforeEach(() => {
        render(<AboutPage/>);
    });

    it('renders an About heading and the mission/values/team sections', () => {
        expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
        for (const title of ['Mission', 'Values', 'Team', 'Get Involved']) {
            expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
        }
    });

    it('names who runs Preponderous Software', () => {
        // The footer's copyright notice also names the same holder.
        expect(screen.getAllByText(new RegExp(COPYRIGHT_HOLDER)).length).toBeGreaterThan(0);
    });

    it('links to the Legal page for license and privacy details, in the same tab', () => {
        const links = screen.getAllByRole('link', { name: 'Legal' });
        expect(links.length).toBeGreaterThan(0);
        for (const link of links) {
            expect(link).toHaveAttribute('href', '/legal');
            expect(link).not.toHaveAttribute('target');
            expect(link).not.toHaveAttribute('rel');
        }
    });

    it('links to the Contact page to reach out, in the same tab', () => {
        // TopBar's own "Contact" nav button also matches by name, so there are two.
        const links = screen.getAllByRole('link', { name: 'Contact' });
        expect(links.length).toBeGreaterThan(0);
        for (const link of links) {
            expect(link).toHaveAttribute('href', '/contact');
            expect(link).not.toHaveAttribute('target');
            expect(link).not.toHaveAttribute('rel');
        }
    });

    it('opens the GitHub organization link in a new tab', () => {
        // TopBar's own "GitHub" nav button also matches by name, so there are two.
        const links = screen.getAllByRole('link', { name: 'GitHub' });
        expect(links.length).toBeGreaterThan(0);
        for (const link of links) {
            expect(link).toHaveAttribute('href', 'https://github.com/Preponderous-Software');
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
    });
});
