import { describe, expect, it } from 'vitest';
import { AVATAR_COLORS, colorForTitle, statusChipColor } from '../utils/projectColors';
import projectData from '../pages/data/projects.json';

describe('colorForTitle', () => {
    it('gives the same title the same colour every time', () => {
        expect(colorForTitle('Medieval Factions')).toBe(colorForTitle('Medieval Factions'));
    });

    it('derives the colour from a hash of the title', () => {
        // '' hashes to 0, 'a' to 97 (97 % 6 = 1), 'ab' to 97 * 31 + 98 = 3105 (3105 % 6 = 3).
        expect(colorForTitle('')).toBe(AVATAR_COLORS[0]);
        expect(colorForTitle('a')).toBe(AVATAR_COLORS[1]);
        expect(colorForTitle('ab')).toBe(AVATAR_COLORS[3]);
    });

    it('always picks from the palette, even for a title long enough to overflow the hash', () => {
        expect(AVATAR_COLORS).toContain(colorForTitle('x'.repeat(500)));
    });

    it('picks a palette colour for every showcased project', () => {
        for (const { title } of projectData.projects) {
            expect(AVATAR_COLORS).toContain(colorForTitle(title));
        }
    });
});

describe('statusChipColor', () => {
    it('colours active projects as success and maintenance ones as warning', () => {
        expect(statusChipColor('Active')).toBe('success');
        expect(statusChipColor('Maintenance')).toBe('warning');
    });

    it('matches the status case-insensitively', () => {
        expect(statusChipColor('ACTIVE')).toBe('success');
        expect(statusChipColor('maintenance')).toBe('warning');
    });

    it('leaves an unrecognized status uncoloured', () => {
        expect(statusChipColor('Archived')).toBeUndefined();
        expect(statusChipColor('')).toBeUndefined();
    });
});

// WCAG relative luminance and contrast ratio, for the white initials and
// glyphs drawn on these colours.
const luminance = (hex: string): number => {
    const [r, g, b] = [1, 3, 5].map((i) => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrastWithWhite = (hex: string): number => 1.05 / (luminance(hex) + 0.05);

describe('AVATAR_COLORS', () => {
    it.each(AVATAR_COLORS)('%s keeps white initials and glyphs at 4.5:1 or better', (hex) => {
        expect(contrastWithWhite(hex)).toBeGreaterThanOrEqual(4.5);
    });
});
