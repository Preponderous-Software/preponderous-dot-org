// Licensing and copyright facts shared by the footer and the /legal page, kept
// framework-free so the formatting helpers below stay pure and unit-testable.
// The values mirror LICENSE in the repository root — update both together.

export const COPYRIGHT_HOLDER = 'Daniel McCoy Stephenson';

// First year of publication; the displayed range runs from here to the year the
// site was built.
export const COPYRIGHT_START_YEAR = 2022;

export const LICENSE_NAME = 'Preponderous Non-Commercial License (Preponderous-NC)';
export const LICENSE_SHORT_NAME = 'Preponderous-NC';
export const LICENSE_URL =
    'https://github.com/Preponderous-Software/preponderous-nc-license/blob/main/LICENSE.md';

/**
 * The year the site was built. Injected as a build-time constant by
 * `next.config.js` so the pre-rendered HTML and the client hydration pass always
 * agree — reading the clock during render would disagree across a New Year
 * boundary and cause a hydration mismatch. Falls back to the current year when
 * the constant is absent (e.g. under Vitest, which does not load next.config.js).
 */
export const getBuildYear = (): number => {
    const injected = Number(process.env.NEXT_PUBLIC_BUILD_YEAR);
    return Number.isInteger(injected) && injected >= COPYRIGHT_START_YEAR
        ? injected
        : new Date().getFullYear();
};

/**
 * A copyright line such as `© 2022–2026 Daniel McCoy Stephenson`. Collapses to a
 * single year while the current year is still the first year of publication (or
 * if a stale/earlier year is somehow supplied).
 */
export const formatCopyright = (year: number = getBuildYear()): string => {
    const range =
        year > COPYRIGHT_START_YEAR
            ? `${COPYRIGHT_START_YEAR}–${year}`
            : `${COPYRIGHT_START_YEAR}`;
    return `© ${range} ${COPYRIGHT_HOLDER}`;
};
