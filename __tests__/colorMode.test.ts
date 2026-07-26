import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
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
