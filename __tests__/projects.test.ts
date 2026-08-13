import { describe, expect, it } from 'vitest';
import { categoryHeadingId, groupProjectsByCategory, sortProjectsByTitle, type Project } from '../utils/projects';

const make = (title: string, category?: string): Project => ({
    id: title.toLowerCase(),
    title,
    description: '',
    githubLink: '',
    technology: '',
    category,
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

describe('groupProjectsByCategory', () => {
    it('groups projects under their category', () => {
        const groups = groupProjectsByCategory([
            make('Barony', 'Games'),
            make('Viron', 'Libraries'),
            make('Roam', 'Games'),
        ]);
        expect(groups.map((g) => g.category)).toEqual(['Games', 'Libraries']);
        expect(groups[0].projects.map((p) => p.title)).toEqual(['Barony', 'Roam']);
        expect(groups[1].projects.map((p) => p.title)).toEqual(['Viron']);
    });

    it('sorts categories alphabetically, case-insensitively', () => {
        const groups = groupProjectsByCategory([
            make('Barony', 'Games'),
            make('env-lib-cpp', 'Libraries'),
            make('Patchwork', 'assets'),
        ]);
        expect(groups.map((g) => g.category)).toEqual(['assets', 'Games', 'Libraries']);
    });

    it('sorts projects within a category alphabetically by title', () => {
        const groups = groupProjectsByCategory([
            make('Viron', 'Libraries'),
            make('env-lib-cpp', 'Libraries'),
        ]);
        expect(groups[0].projects.map((p) => p.title)).toEqual(['env-lib-cpp', 'Viron']);
    });

    it('files projects with no category under "Other"', () => {
        const groups = groupProjectsByCategory([make('Mystery')]);
        expect(groups).toEqual([{ category: 'Other', projects: [make('Mystery')] }]);
    });

    it('does not mutate the input array', () => {
        const input = [make('Beta', 'Games'), make('Alpha', 'Games')];
        const snapshot = input.map((p) => p.title);
        groupProjectsByCategory(input);
        expect(input.map((p) => p.title)).toEqual(snapshot);
    });

    it('returns an empty array for no projects', () => {
        expect(groupProjectsByCategory([])).toEqual([]);
    });
});

describe('categoryHeadingId', () => {
    it('leaves a single-word category as a lowercase slug', () => {
        expect(categoryHeadingId('Games')).toBe('category-games');
    });

    it('produces a whitespace-free id for a multi-word category', () => {
        const id = categoryHeadingId('Developer Tools');
        expect(id).toBe('category-developer-tools');
        expect(id).not.toMatch(/\s/);
    });

    it('collapses punctuation and runs of separators', () => {
        expect(categoryHeadingId('Games & Simulations')).toBe('category-games-simulations');
        expect(categoryHeadingId('  Web   Apps  ')).toBe('category-web-apps');
    });

    it('never emits a leading or trailing separator', () => {
        expect(categoryHeadingId('!Tools!')).toBe('category-tools');
    });

    it('falls back to a usable id when a category has nothing sluggable', () => {
        expect(categoryHeadingId('!!!')).toBe('category-unnamed');
        expect(categoryHeadingId('')).toBe('category-unnamed');
    });
});
