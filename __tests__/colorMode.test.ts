import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    applyColorModeToDocument,
    COLOR_MODE_BOOTSTRAP_SCRIPT,
    COLOR_MODE_STORAGE_KEY,
    readStoredColorMode,
    resolveInitialColorMode,
    storeColorMode,
} from '../utils/colorMode';

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

describe('resolveInitialColorMode', () => {
    it('honours a saved "light" choice regardless of OS preference', () => {
        expect(resolveInitialColorMode('light', true)).toBe('light');
        expect(resolveInitialColorMode('light', false)).toBe('light');
    });

    it('honours a saved "dark" choice regardless of OS preference', () => {
        expect(resolveInitialColorMode('dark', true)).toBe('dark');
        expect(resolveInitialColorMode('dark', false)).toBe('dark');
    });

    it('falls back to the OS preference when nothing is saved', () => {
        expect(resolveInitialColorMode(null, true)).toBe('dark');
        expect(resolveInitialColorMode(null, false)).toBe('light');
    });

    it('ignores an unrecognised stored value and uses the OS preference', () => {
        expect(resolveInitialColorMode('purple', false)).toBe('light');
        expect(resolveInitialColorMode('', true)).toBe('dark');
    });
});

describe('readStoredColorMode', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('returns null when nothing has been saved', () => {
        expect(readStoredColorMode()).toBeNull();
    });

    it('returns the saved value', () => {
        window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'light');
        expect(readStoredColorMode()).toBe('light');
    });

    it('returns null instead of throwing when storage access is blocked', () => {
        stubThrowingStorage();
        expect(readStoredColorMode()).toBeNull();
    });
});

describe('storeColorMode', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('saves the mode under the shared storage key', () => {
        storeColorMode('light');
        expect(window.localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('light');
    });

    it('overwrites a previously saved mode', () => {
        storeColorMode('light');
        storeColorMode('dark');
        expect(window.localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('dark');
    });

    it('does not throw when the write is rejected', () => {
        stubThrowingStorage();
        expect(() => storeColorMode('dark')).not.toThrow();
    });
});

describe('applyColorModeToDocument', () => {
    afterEach(() => {
        // Unstubbed before `document` is touched below: the SSR case stubs
        // `document` away, and a failing assertion there would otherwise leave
        // it stubbed for the rest of the file.
        vi.unstubAllGlobals();
        document.documentElement.removeAttribute('data-color-mode');
        document.documentElement.style.colorScheme = '';
    });

    it('stamps the mode onto <html>', () => {
        applyColorModeToDocument('light');

        expect(document.documentElement.getAttribute('data-color-mode')).toBe('light');
        expect(document.documentElement.style.colorScheme).toBe('light');
    });

    // The point of the helper: the bootstrap script stamps the document once
    // per load, so a later switch has to overwrite what it left behind rather
    // than leaving styles/globals.css describing the boot-time mode.
    it('overwrites a mode already stamped on <html>', () => {
        applyColorModeToDocument('dark');
        applyColorModeToDocument('light');

        expect(document.documentElement.getAttribute('data-color-mode')).toBe('light');
        expect(document.documentElement.style.colorScheme).toBe('light');
    });

    it('does nothing when there is no document, as during server rendering', () => {
        vi.stubGlobal('document', undefined);

        expect(() => applyColorModeToDocument('light')).not.toThrow();
    });
});

describe('COLOR_MODE_BOOTSTRAP_SCRIPT', () => {
    // Runs the script exactly as pages/_document.tsx renders it (a raw string
    // evaluated against `document`), against a jsdom `document` that starts
    // with no data-color-mode attribute — mirroring what the browser sees
    // before this script runs.
    const runBootstrapScript = () => {
        // eslint-disable-next-line no-new-func
        new Function(COLOR_MODE_BOOTSTRAP_SCRIPT)();
    };

    beforeEach(() => {
        window.localStorage.clear();
    });

    afterEach(() => {
        document.documentElement.removeAttribute('data-color-mode');
        document.documentElement.style.colorScheme = '';
        vi.unstubAllGlobals();
    });

    it('stamps "light" for a saved light choice regardless of OS preference', () => {
        window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'light');
        vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));

        runBootstrapScript();

        expect(document.documentElement.getAttribute('data-color-mode')).toBe('light');
        expect(document.documentElement.style.colorScheme).toBe('light');
    });

    it('stamps "dark" for a saved dark choice regardless of OS preference', () => {
        window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'dark');
        vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));

        runBootstrapScript();

        expect(document.documentElement.getAttribute('data-color-mode')).toBe('dark');
        expect(document.documentElement.style.colorScheme).toBe('dark');
    });

    it('falls back to the OS preference when nothing is saved', () => {
        vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));

        runBootstrapScript();

        expect(document.documentElement.getAttribute('data-color-mode')).toBe('light');
    });

    it('falls back to dark when matchMedia is unavailable and nothing is saved', () => {
        vi.stubGlobal('matchMedia', undefined);

        runBootstrapScript();

        expect(document.documentElement.getAttribute('data-color-mode')).toBe('dark');
    });

    it('falls back to the OS preference instead of throwing when storage access is blocked', () => {
        stubThrowingStorage();
        vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));

        expect(() => runBootstrapScript()).not.toThrow();
        expect(document.documentElement.getAttribute('data-color-mode')).toBe('dark');
        expect(document.documentElement.style.colorScheme).toBe('dark');
    });

    // A light-preferring visitor with blocked site data used to be stamped
    // 'dark' regardless, leaving the !important background rule in
    // styles/globals.css dark under MUI's light theme.
    it('stamps "light" for a light-preferring OS when storage access is blocked', () => {
        stubThrowingStorage();
        vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));

        runBootstrapScript();

        expect(document.documentElement.getAttribute('data-color-mode')).toBe('light');
        expect(document.documentElement.style.colorScheme).toBe('light');
    });

    it('falls back to dark when storage is blocked and matchMedia is unavailable', () => {
        stubThrowingStorage();
        vi.stubGlobal('matchMedia', undefined);

        runBootstrapScript();

        expect(document.documentElement.getAttribute('data-color-mode')).toBe('dark');
        expect(document.documentElement.style.colorScheme).toBe('dark');
    });
});
