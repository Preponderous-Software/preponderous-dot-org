import React, { useContext } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useTheme } from '@mui/material';
import type { AppProps } from 'next/app';
import MyApp from '../pages/_app';
import { ColorModeContext } from '../utils/ColorModeContext';
import { COLOR_MODE_STORAGE_KEY } from '../utils/colorMode';

// A stand-in page that reports the palette mode MyApp resolved and exposes the
// toggle, so the tests can observe and drive the color-mode wiring.
const ProbePage = () => {
    const theme = useTheme();
    const { toggleColorMode } = useContext(ColorModeContext);
    return (
        <main id="main">
            <span data-testid="mode">{theme.palette.mode}</span>
            <button onClick={toggleColorMode}>Toggle</button>
        </main>
    );
};

const renderApp = () =>
    render(
        <MyApp
            {...({ Component: ProbePage, pageProps: {} } as unknown as AppProps)}
        />
    );

const currentMode = () => screen.getByTestId('mode').textContent;

// jsdom's matchMedia support is not something these tests should depend on, so
// every case states the OS preference explicitly — including its absence.
const stubPrefersDark = (prefersDark: boolean) => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: prefersDark })));
};

const stubNoMatchMedia = () => {
    vi.stubGlobal('matchMedia', undefined);
};

// Stands in for a browser that blocks site data: touching storage throws
// instead of returning a value (SecurityError / QuotaExceededError).
const stubThrowingStorage = () => {
    vi.stubGlobal('localStorage', {
        getItem: () => {
            throw new Error('SecurityError');
        },
        setItem: () => {
            throw new Error('QuotaExceededError');
        },
    });
};

describe('MyApp', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders the page inside the shared chrome', () => {
        stubPrefersDark(true);
        renderApp();
        expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main');
        expect(screen.getByTestId('mode')).toBeInTheDocument();
    });

    it('honours a saved "light" choice over the OS preference', () => {
        window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'light');
        stubPrefersDark(true);
        renderApp();
        expect(currentMode()).toBe('light');
    });

    it('honours a saved "dark" choice over the OS preference', () => {
        window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'dark');
        stubPrefersDark(false);
        renderApp();
        expect(currentMode()).toBe('dark');
    });

    it('follows a dark OS preference for a first-time visitor', () => {
        stubPrefersDark(true);
        renderApp();
        expect(currentMode()).toBe('dark');
    });

    it('follows a light OS preference for a first-time visitor', () => {
        stubPrefersDark(false);
        renderApp();
        expect(currentMode()).toBe('light');
    });

    it('falls back to dark when the browser cannot report an OS preference', () => {
        stubNoMatchMedia();
        renderApp();
        expect(currentMode()).toBe('dark');
    });

    it('flips the mode and persists the choice when toggled', () => {
        stubPrefersDark(true);
        renderApp();
        expect(currentMode()).toBe('dark');

        fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));

        expect(currentMode()).toBe('light');
        expect(window.localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('light');
    });

    it('flips back on a second toggle', () => {
        stubPrefersDark(false);
        renderApp();

        fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
        fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));

        expect(currentMode()).toBe('light');
        expect(window.localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('light');
    });

    it('still follows the OS preference when storage reads are blocked', () => {
        stubThrowingStorage();
        stubPrefersDark(false);
        renderApp();
        expect(currentMode()).toBe('light');
    });

    it('still toggles when the choice cannot be persisted', () => {
        stubThrowingStorage();
        stubPrefersDark(true);
        renderApp();
        expect(currentMode()).toBe('dark');

        fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));

        expect(currentMode()).toBe('light');
    });
});
