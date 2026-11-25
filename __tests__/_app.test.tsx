import React, { useContext } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useTheme } from '@mui/material';
import { getContrastRatio } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import MyApp from '../pages/_app';
import { ColorModeContext } from '../utils/ColorModeContext';
import { COLOR_MODE_STORAGE_KEY } from '../utils/colorMode';
import { COARSE_POINTER_QUERY, TOUCH_TARGET } from '../styles/styles';

// A stand-in page that reports the palette mode MyApp resolved and exposes the
// toggle, so the tests can observe and drive the color-mode wiring.
const ProbePage = () => {
    const theme = useTheme();
    const { toggleColorMode } = useContext(ColorModeContext);
    return (
        <main id="main">
            <span data-testid="mode">{theme.palette.mode}</span>
            <span data-testid="primary">{theme.palette.primary.main}|{theme.palette.primary.contrastText}</span>
            <span data-testid="warning">{theme.palette.warning.main}|{theme.palette.warning.contrastText}</span>
            <button onClick={toggleColorMode}>Toggle</button>
        </main>
    );
};

// Records the theme MyApp provides, so a test can read its overrides.
let providedTheme: ReturnType<typeof useTheme> | null = null;
const ThemeProbePage = () => {
    providedTheme = useTheme();
    return <main id="main"/>;
};

const renderApp = () =>
    render(
        <MyApp
            {...({ Component: ProbePage, pageProps: {} } as unknown as AppProps)}
        />
    );

const currentMode = () => screen.getByTestId('mode').textContent;

// What styles/globals.css keys its !important background rules off, and what
// the browser paints scrollbars and the overscroll area from.
const stampedMode = () => document.documentElement.getAttribute('data-color-mode');

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
        document.documentElement.removeAttribute('data-color-mode');
        document.documentElement.style.colorScheme = '';
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

    it('stamps the resolved mode onto <html> on first render', () => {
        window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'light');
        stubPrefersDark(true);
        renderApp();

        expect(stampedMode()).toBe('light');
        expect(document.documentElement.style.colorScheme).toBe('light');
    });

    // The document-level values used to be stamped once by the bootstrap script
    // in pages/_document.tsx and never again, leaving the !important background
    // rules in styles/globals.css — and the browser-painted scrollbars — on the
    // boot-time mode until the next reload.
    it('restamps <html> when the mode is toggled', () => {
        stubPrefersDark(true);
        renderApp();
        expect(stampedMode()).toBe('dark');

        fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));

        expect(currentMode()).toBe('light');
        expect(stampedMode()).toBe('light');
        expect(document.documentElement.style.colorScheme).toBe('light');
    });

    it('restamps <html> again when toggled back', () => {
        stubPrefersDark(false);
        renderApp();

        fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
        fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));

        expect(currentMode()).toBe('light');
        expect(stampedMode()).toBe('light');
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

    // White text on the dark-mode primary was 3.7:1 and on the light-mode
    // warning chip 3.1:1; every filled surface's text must reach WCAG AA.
    const textContrast = (testId: string) => {
        const [main, contrastText] = (screen.getByTestId(testId).textContent ?? '').split('|');
        return getContrastRatio(main, contrastText);
    };

    it.each([
        ['dark', true],
        ['light', false],
    ])('gives filled primary and warning surfaces AA text contrast in %s mode', (_mode, prefersDark) => {
        stubPrefersDark(prefersDark);
        renderApp();
        expect(textContrast('primary')).toBeGreaterThanOrEqual(4.5);
        expect(textContrast('warning')).toBeGreaterThanOrEqual(4.5);
    });

    // A fingertip needs about 44px; the compact MUI sizes (31px buttons,
    // 30px icon buttons, 24px chips) were hard to hit on a phone.
    it('raises controls to a 44px touch target on a coarse pointer only', () => {
        stubPrefersDark(true);
        render(<MyApp {...({ Component: ThemeProbePage, pageProps: {} } as unknown as AppProps)}/>);
        const overrides = providedTheme?.components as Record<string, { styleOverrides?: Record<string, Record<string, unknown>> }>;
        expect(overrides.MuiButton.styleOverrides?.root[COARSE_POINTER_QUERY]).toMatchObject({ minHeight: TOUCH_TARGET });
        expect(overrides.MuiIconButton.styleOverrides?.root[COARSE_POINTER_QUERY]).toMatchObject({ minWidth: TOUCH_TARGET, minHeight: TOUCH_TARGET });
        expect(overrides.MuiToggleButton.styleOverrides?.root[COARSE_POINTER_QUERY]).toMatchObject({ minHeight: TOUCH_TARGET });
        const chip = overrides.MuiChip.styleOverrides?.clickable[COARSE_POINTER_QUERY] as Record<string, unknown>;
        // Visible height plus the invisible hit area above and below it.
        expect((chip.height as number) + 8).toBe(TOUCH_TARGET);
        expect(chip['&::after']).toMatchObject({ inset: '-4px 0' });
        expect(overrides.MuiButton.styleOverrides?.root.minHeight).toBeUndefined();
    });
});
