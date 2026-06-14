import { describe, expect, it } from 'vitest';
import { sortProjectsByTitle, type Project } from '../utils/projects';

const make = (title: string): Project => ({
    id: title.toLowerCase(),
    title,
    description: '',
    githubLink: '',
    technology: '',
});

describe('sortProjectsByTitle', () => {
    it('sorts titles alphabetically, case-insensitively', () => {
        const sorted = sortProjectsByTitle([make('Viron'), make('apex'), make('Roam')]);
        expect(sorted.map((p) => p.title)).toEqual(['apex', 'Roam', 'Viron']);
    });

    it('does not mutate the input array', () => {
        const input = [make('Beta'), make('Alpha')];
        const snapshot = input.map((p) => p.title);
        sortProjectsByTitle(input);
        expect(input.map((p) => p.title)).toEqual(snapshot);
    });

    it('returns an empty array unchanged', () => {
        expect(sortProjectsByTitle([])).toEqual([]);
    });
});
