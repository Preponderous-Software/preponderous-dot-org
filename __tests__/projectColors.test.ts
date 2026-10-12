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
