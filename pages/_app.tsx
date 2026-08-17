import type {AppProps} from 'next/app'
import React, {useEffect, useMemo, useState} from 'react';
import {Box, createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import {ColorModeContext} from '../utils/ColorModeContext';
import {
    applyColorModeToDocument,
    ColorMode,
    readStoredColorMode,
    resolveInitialColorMode,
    storeColorMode
} from '../utils/colorMode';
import '../styles/globals.css';

function MyApp({Component, pageProps}: AppProps) {
    // Start from a stable default for server-side rendering, then resolve the
    // real mode on the client in an effect. Doing the localStorage/matchMedia
    // lookup during render would diverge between server and client and cause a
    // hydration mismatch.
    const [mode, setMode] = useState<ColorMode>('dark');

    useEffect(() => {
        const stored = readStoredColorMode();
        const prefersDark = window.matchMedia
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
            : true;
        const initialMode = resolveInitialColorMode(stored, prefersDark);
        setMode(initialMode);
        // Normally a no-op — the bootstrap script in pages/_document.tsx has
        // already stamped this same value — but it keeps <html> in step with
        // the theme even where that script never ran (a CSP blocking inline
        // scripts, say). Stamping the *resolved* mode rather than reacting to
        // `mode` in its own effect matters: an effect keyed on `mode` would
        // first fire with the SSR default of 'dark' and briefly restamp the
        // document dark for a light-mode visitor, which is the exact flash the
        // bootstrap script exists to prevent.
        applyColorModeToDocument(initialMode);
    }, []);

    // Derived from the current mode rather than a state updater so that the
    // (side-effecting, best-effort) write stays outside React's render path —
    // under StrictMode an updater is invoked twice, and a persistence failure
    // must never be able to interfere with the mode actually flipping.
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                const nextMode: ColorMode = mode === 'light' ? 'dark' : 'light';
                setMode(nextMode);
                // Persist the explicit choice so it survives navigation and reloads.
                storeColorMode(nextMode);
                // Keep <html data-color-mode> and its color-scheme in step: the
                // !important background rules in styles/globals.css are keyed
                // off that attribute, so the document background and the
                // browser-painted scrollbars would otherwise stay on the mode
                // the page booted with until the next reload.
                applyColorModeToDocument(nextMode);
            }
        }),
        [mode],
    );

    const theme = useMemo(
        () => {
            const isDark = mode === 'dark';
            const headingFont = '"Space Grotesk", system-ui, sans-serif';
            return createTheme({
                palette: {
                    mode,
                    primary: {main: isDark ? '#5c7cfa' : '#4263eb'},
                    secondary: {main: '#f59f00'},
                    background: isDark
                        ? {default: '#0e1117', paper: '#161b22'}
                        : {default: '#f6f8fa', paper: '#ffffff'},
                },
                shape: {borderRadius: 10},
                typography: {
                    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                    h1: {fontFamily: headingFont, fontWeight: 700, letterSpacing: '-0.02em'},
                    h2: {fontFamily: headingFont, fontWeight: 700, letterSpacing: '-0.02em'},
                    h3: {fontFamily: headingFont, fontWeight: 600, letterSpacing: '-0.01em'},
                    h4: {fontFamily: headingFont, fontWeight: 600},
                    h5: {fontFamily: headingFont, fontWeight: 600},
                    h6: {fontFamily: headingFont, fontWeight: 600},
                    button: {textTransform: 'none', fontWeight: 600},
                },
                components: {
                    MuiAppBar: {
                        defaultProps: {elevation: 0},
                        styleOverrides: {
                            root: ({theme}) => ({
                                backgroundImage: 'none',
                                backgroundColor: isDark ? '#161b22' : theme.palette.primary.main,
                                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.16)'}`,
                            }),
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: ({theme}) => ({
                                backgroundImage: 'none',
                                border: `1px solid ${theme.palette.divider}`,
                            }),
                        },
                    },
                    MuiButton: {
                        defaultProps: {disableElevation: true},
                        styleOverrides: {root: {borderRadius: 8}},
                    },
                },
            });
        },
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {/* Skip link: the first focusable element, hidden until focused, lets
                    keyboard/screen-reader users jump past the nav to the page's
                    <main id="main"> content (WCAG 2.4.1). */}
                <Box
                    component="a"
                    href="#main"
                    sx={{
                        position: 'fixed',
                        top: 8,
                        left: 8,
                        zIndex: (t) => t.zIndex.tooltip + 1,
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        boxShadow: 3,
                        bgcolor: 'background.paper',
                        color: 'primary.main',
                        transform: 'translateY(-150%)',
                        transition: 'transform 0.2s ease',
                        '&:focus': {transform: 'translateY(0)'},
                    }}
                >
                    Skip to main content
                </Box>
                <Component {...pageProps} />
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export default MyApp
