import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import BottomBar from '../components/BottomBar';
import { ColorModeContext } from '../utils/ColorModeContext';
import { formatCopyright, LICENSE_SHORT_NAME } from '../utils/copyright';

// BottomBar reads the current route from next/router to decide which footer
// link is the active one; a bare render has no router provider, so stand one in
// with a pathname the individual tests can set.
const router = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/router', () => ({
    useRouter: () => ({ pathname: router.pathname }),
}));

afterEach(() => {
    router.pathname = '/';
});

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

    it('leaves the color-mode toggle unchecked in light mode', () => {
        expect(screen.getByRole('checkbox', { name: /toggle dark mode/i })).not.toBeChecked();
    });
});

describe('BottomBar active page', () => {
    it('marks the footer link for the current page with aria-current="page"', () => {
        router.pathname = '/legal';
        render(<BottomBar version="1.2.3"/>);
        expect(screen.getByRole('link', { name: /legal/i })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('link', { name: /home/i })).not.toHaveAttribute('aria-current');
    });

    it('marks the footer Home link on the home page', () => {
        router.pathname = '/';
        render(<BottomBar version="1.2.3"/>);
        expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('aria-current', 'page');
    });

    it('marks no footer link on a page the footer does not link to', () => {
        router.pathname = '/about';
        render(<BottomBar version="1.2.3"/>);
        for (const name of [/home/i, /legal/i, /source code/i, /report a bug/i]) {
            expect(screen.getByRole('link', { name })).not.toHaveAttribute('aria-current');
        }
    });
});

describe('BottomBar color mode', () => {
    it('checks the color-mode toggle in dark mode', () => {
        render(
            <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
                <BottomBar version="1.2.3"/>
            </ThemeProvider>
        );
        expect(screen.getByRole('checkbox', { name: /toggle dark mode/i })).toBeChecked();
    });

    it('toggles the color mode when the switch is clicked', () => {
        const toggleColorMode = vi.fn();
        render(
            <ColorModeContext.Provider value={{ toggleColorMode }}>
                <BottomBar version="1.2.3"/>
            </ColorModeContext.Provider>
        );
        fireEvent.click(screen.getByRole('checkbox', { name: /toggle dark mode/i }));
        expect(toggleColorMode).toHaveBeenCalledTimes(1);
    });
});
