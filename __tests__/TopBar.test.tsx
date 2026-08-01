import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import TopBar from '../components/TopBar';
import { ColorModeContext } from '../utils/ColorModeContext';

// TopBar reads the current route from next/router to decide which nav link is
// the active one; a bare render has no router provider, so stand one in with a
// pathname the individual tests can set.
const router = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/router', () => ({
    useRouter: () => ({ pathname: router.pathname }),
}));

afterEach(() => {
    router.pathname = '/';
});

describe('TopBar', () => {
    it('links the brand wordmark home', () => {
        render(<TopBar/>);
        expect(screen.getByRole('link', { name: 'Preponderous Software' })).toHaveAttribute('href', '/');
    });

    it('keeps internal nav links in the same tab', () => {
        render(<TopBar/>);
        for (const [name, href] of [['Home', '/'], ['Projects', '/projects'], ['About', '/about'], ['Contact', '/contact']] as const) {
            const link = screen.getByRole('link', { name });
            expect(link).toHaveAttribute('href', href);
            expect(link).not.toHaveAttribute('target');
            expect(link).not.toHaveAttribute('rel');
        }
    });

    it('opens the external nav link in a new tab with rel="noopener noreferrer"', () => {
        render(<TopBar/>);
        const github = screen.getByRole('link', { name: 'GitHub' });
        expect(github).toHaveAttribute('href', 'https://github.com/Preponderous-Software');
        expect(github).toHaveAttribute('target', '_blank');
        expect(github).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('marks the link for the current page with aria-current="page"', () => {
        render(<TopBar/>);
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    });

    it('marks no link as current when another page is being viewed', () => {
        router.pathname = '/legal';
        render(<TopBar/>);
        expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
        expect(screen.getByRole('link', { name: 'Projects' })).not.toHaveAttribute('aria-current');
        expect(screen.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current');
        expect(screen.getByRole('link', { name: 'Contact' })).not.toHaveAttribute('aria-current');
        expect(screen.getByRole('link', { name: 'GitHub' })).not.toHaveAttribute('aria-current');
    });

    it('marks the About link as current on the About page', () => {
        router.pathname = '/about';
        render(<TopBar/>);
        expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
    });

    it('marks the Projects link as current on the Projects page', () => {
        router.pathname = '/projects';
        render(<TopBar/>);
        expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
    });

    it('leaves the color-mode toggle unchecked in light mode', () => {
        render(<TopBar/>);
        expect(screen.getByRole('checkbox', { name: /toggle dark mode/i })).not.toBeChecked();
    });

    it('checks the color-mode toggle in dark mode', () => {
        render(
            <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
                <TopBar/>
            </ThemeProvider>
        );
        expect(screen.getByRole('checkbox', { name: /toggle dark mode/i })).toBeChecked();
    });

    it('toggles the color mode when the switch is clicked', () => {
        const toggleColorMode = vi.fn();
        render(
            <ColorModeContext.Provider value={{ toggleColorMode }}>
                <TopBar/>
            </ColorModeContext.Provider>
        );
        fireEvent.click(screen.getByRole('checkbox', { name: /toggle dark mode/i }));
        expect(toggleColorMode).toHaveBeenCalledTimes(1);
    });
});
