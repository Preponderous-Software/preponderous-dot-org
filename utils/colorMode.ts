export type ColorMode = 'light' | 'dark';

// localStorage key under which the user's explicit color-mode choice is saved,
// so the selection survives navigation (full page loads) and return visits.
export const COLOR_MODE_STORAGE_KEY = 'preponderous-color-mode';

const isColorMode = (value: string | null): value is ColorMode =>
    value === 'light' || value === 'dark';

// Decide the color mode to start in: honour a previously-saved explicit choice,
// otherwise fall back to the operating system's prefers-color-scheme setting.
// Kept pure (no window access) so it can be unit-tested and reused on both the
// initial client render and the toggle path.
export const resolveInitialColorMode = (
    stored: string | null,
    prefersDark: boolean
): ColorMode => {
    if (isColorMode(stored)) {
        return stored;
    }
    return prefersDark ? 'dark' : 'light';
};

// Read the saved color-mode choice. Merely touching window.localStorage throws
// a SecurityError in browsers configured to block site data, so the access is
// guarded: a failure (and a server-side call, where `window` is undefined) is
// reported as "nothing saved" and the caller falls back to the OS preference.
export const readStoredColorMode = (): string | null => {
    try {
        return window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    } catch {
        return null;
    }
};

// Persist an explicit color-mode choice. Best-effort by design: writing throws
// when storage is blocked or full (QuotaExceededError), and a visitor who
// cannot have the choice remembered should still be able to switch modes for
// the current session.
export const storeColorMode = (mode: ColorMode): void => {
    try {
        window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
    } catch {
        // Ignored: persistence is a nice-to-have, switching modes is not.
    }
};
