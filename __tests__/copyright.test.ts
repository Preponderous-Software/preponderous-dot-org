import { afterEach, describe, expect, it } from 'vitest';
import {
    COPYRIGHT_HOLDER,
    COPYRIGHT_START_YEAR,
    formatCopyright,
    getBuildYear,
} from '../utils/copyright';

const setBuildYear = (value: string | undefined) => {
    if (value === undefined) {
        delete process.env.NEXT_PUBLIC_BUILD_YEAR;
    } else {
        process.env.NEXT_PUBLIC_BUILD_YEAR = value;
    }
};

describe('formatCopyright', () => {
    it('renders a year range from the first year of publication', () => {
        expect(formatCopyright(2026)).toBe(`© ${COPYRIGHT_START_YEAR}–2026 ${COPYRIGHT_HOLDER}`);
    });

    it('collapses to a single year during the first year of publication', () => {
        expect(formatCopyright(COPYRIGHT_START_YEAR)).toBe(`© ${COPYRIGHT_START_YEAR} ${COPYRIGHT_HOLDER}`);
    });

    it('never renders a backwards range for a year before publication', () => {
        expect(formatCopyright(COPYRIGHT_START_YEAR - 3)).toBe(`© ${COPYRIGHT_START_YEAR} ${COPYRIGHT_HOLDER}`);
    });
});

describe('getBuildYear', () => {
    const original = process.env.NEXT_PUBLIC_BUILD_YEAR;

    afterEach(() => {
        setBuildYear(original);
    });

    it('uses the year injected at build time', () => {
        setBuildYear('2030');
        expect(getBuildYear()).toBe(2030);
    });

    it('falls back to the current year when the build year is absent', () => {
        setBuildYear(undefined);
        expect(getBuildYear()).toBe(new Date().getFullYear());
    });

    it('falls back to the current year when the build year is not a usable number', () => {
        setBuildYear('not-a-year');
        expect(getBuildYear()).toBe(new Date().getFullYear());

        setBuildYear(String(COPYRIGHT_START_YEAR - 1));
        expect(getBuildYear()).toBe(new Date().getFullYear());
    });
});
