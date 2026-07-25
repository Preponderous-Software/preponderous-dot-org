import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import BottomBar from '../components/BottomBar';
import { formatCopyright, LICENSE_SHORT_NAME } from '../utils/copyright';

describe('BottomBar', () => {
    beforeEach(() => {
        render(<BottomBar version="1.2.3"/>);
    });

    it('shows the version it was given', () => {
        expect(screen.getByText('v1.2.3')).toBeInTheDocument();
    });

    it('shows the copyright notice with the license linking to /legal', () => {
        expect(screen.getByText(formatCopyright(), { exact: false })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: LICENSE_SHORT_NAME })).toHaveAttribute('href', '/legal');
    });

    it('keeps internal footer links in the same tab', () => {
        for (const [name, href] of [[/home/i, '/'], [/legal/i, '/legal']] as const) {
            const link = screen.getByRole('link', { name });
            expect(link).toHaveAttribute('href', href);
            expect(link).not.toHaveAttribute('target');
            expect(link).not.toHaveAttribute('rel');
        }
    });

    it('opens external footer links in a new tab with rel="noopener noreferrer"', () => {
        for (const name of [/source code/i, /report a bug/i]) {
            const link = screen.getByRole('link', { name });
            expect(link).toHaveAttribute('href', expect.stringContaining('https://github.com/'));
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
    });

    it('labels the footer link group as navigation', () => {
        expect(screen.getByRole('navigation', { name: /footer/i })).toBeInTheDocument();
    });

    it('renders the color-mode toggle', () => {
        expect(screen.getByRole('checkbox', { name: /toggle dark mode/i })).toBeInTheDocument();
    });
});
