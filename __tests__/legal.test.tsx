import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LegalPage from '../pages/legal';
import { COLOR_MODE_STORAGE_KEY } from '../utils/colorMode';
import { COPYRIGHT_HOLDER, LICENSE_URL, formatCopyright } from '../utils/copyright';
import { DEFAULT_ENDPOINT, DETAILS_URL } from '../utils/usage-reporting';

// The page renders TopBar, which reads the current route from next/router; there
// is no router provider in a bare render, so stand one in.
vi.mock('next/router', () => ({
    useRouter: () => ({ pathname: '/legal' }),
}));

describe('Legal page', () => {
    beforeEach(() => {
        render(<LegalPage/>);
    });

    it('renders a Legal heading and the licensing sections', () => {
        expect(screen.getByRole('heading', { level: 1, name: 'Legal' })).toBeInTheDocument();
        for (const title of ['License', 'Copyright', 'Disclaimer', 'Privacy', 'Third-Party Software', 'Questions']) {
            expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
        }
    });

    it('links to the canonical license text in a new tab', () => {
        const link = screen.getByRole('link', { name: /full preponderous-nc license text/i });
        expect(link).toHaveAttribute('href', LICENSE_URL);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('states the copyright and the "not a legal entity" disclaimer', () => {
        // Twice over: once in the Copyright section, once in the footer's notice.
        expect(screen.getAllByText(formatCopyright(), { exact: false })).toHaveLength(2);
        expect(
            screen.getByText(/Preponderous Software is not a legal entity/i)
        ).toBeInTheDocument();
        expect(screen.getAllByText(new RegExp(COPYRIGHT_HOLDER)).length).toBeGreaterThan(0);
    });

    it('names the only value stored on the visitor\'s device', () => {
        expect(screen.getByText(COLOR_MODE_STORAGE_KEY)).toBeInTheDocument();
    });

    it('discloses page-view reporting, linking to where the reports go', () => {
        expect(screen.getByText(/the server counts page views/i)).toBeInTheDocument();
        // The page hard-codes these rather than importing the server-only module,
        // so pin them to the values the reporting code actually uses.
        const trace = screen.getByRole('link', { name: 'trace' });
        expect(trace).toHaveAttribute('href', DEFAULT_ENDPOINT);
        expect(trace).toHaveAttribute('target', '_blank');
        const details = screen.getByRole('link', { name: /what is and is not sent/i });
        expect(details).toHaveAttribute('href', DETAILS_URL);
        expect(details).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('credits the third-party components the site is built on', () => {
        for (const name of ['Next.js', 'React', 'Material UI', 'Emotion']) {
            expect(screen.getByRole('link', { name })).toBeInTheDocument();
        }
    });
});
