export type ColorMode = 'light' | 'dark';

// localStorage key under which the user's explicit color-mode choice is saved,
// so the selection survives page reloads and return visits.
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

// A blocking inline script, rendered by pages/_document.tsx into <head>, that
// runs before the browser parses/paints <body> — before any bundle (and so
// before resolveInitialColorMode/readStoredColorMode) has loaded. It
// duplicates their "stored choice, else prefers-color-scheme" logic in plain
// JS and stamps the result onto <html data-color-mode>, so the
// [data-color-mode] rules in styles/globals.css can paint the right
// background on the very first paint. pages/_app.tsx's own effect (which
// does use resolveInitialColorMode) then resolves to the same value, so its
// correction is visually a no-op. A thrown SecurityError (blocked site data)
// falls back to 'dark', matching resolveInitialColorMode's own default.
export const COLOR_MODE_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(
    COLOR_MODE_STORAGE_KEY
)};var s=window.localStorage.getItem(k);var m=(s==='light'||s==='dark')?s:((window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');document.documentElement.setAttribute('data-color-mode',m);document.documentElement.style.colorScheme=m;}catch(e){document.documentElement.setAttribute('data-color-mode','dark');document.documentElement.style.colorScheme='dark';}})();`;
