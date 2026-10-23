import { describe, expect, it } from 'vitest';
import {
    categoryHeadingId,
    groupProjectsByCategory,
    projectFacets,
    projectSortOptions,
    sortProjectsByTitle,
    type Project,
} from '../utils/projects';

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

describe('projectFacets', () => {
    const facet = (key: string) => {
        const found = projectFacets.find((f) => f.key === key);
        if (!found) throw new Error(`no facet ${key}`);
        return found;
    };

    it('offers category, technology and status filters, in that order', () => {
        expect(projectFacets.map((f) => [f.key, f.label])).toEqual([
            ['category', 'Category'],
            ['technology', 'Technology'],
            ['status', 'Status'],
        ]);
    });

    it('files a project under its category, and under none when it has no category', () => {
        expect(facet('category').values(make('Roam', 'Games'))).toBe('Games');
        expect(facet('category').values(make('Mystery'))).toBeUndefined();
    });

    it('splits a technology on " / " so each part is its own value', () => {
        const project = { ...make('Site'), technology: 'TypeScript / Next.js' };
        expect(facet('technology').values(project)).toEqual(['TypeScript', 'Next.js']);
    });

    it('keeps a single technology whole, and does not split on a bare slash', () => {
        expect(facet('technology').values({ ...make('Viron'), technology: 'Python' })).toEqual(['Python']);
        expect(facet('technology').values({ ...make('Odd'), technology: 'C/C++' })).toEqual(['C/C++']);
    });

    it('trims each technology part', () => {
        const project = { ...make('Spaced'), technology: ' Java  /  Gradle ' };
        expect(facet('technology').values(project)).toEqual(['Java', 'Gradle']);
    });

    it('files a project under its status, and under none when it has no status', () => {
        expect(facet('status').values({ ...make('Roam'), status: 'Active' })).toBe('Active');
        expect(facet('status').values(make('Mystery'))).toBeUndefined();
    });
});

describe('projectSortOptions', () => {
    const option = (key: string) => {
        const found = projectSortOptions.find((o) => o.key === key);
        if (!found) throw new Error(`no sort option ${key}`);
        return found;
    };
    const titles = (projects: Project[]) => projects.map((p) => p.title);

    it('offers A–Z first, so it stays the default, then By category', () => {
        expect(projectSortOptions.map((o) => [o.key, o.label])).toEqual([
            ['title', 'A–Z'],
            ['category', 'By category'],
        ]);
    });

    it('A–Z orders projects by title regardless of category', () => {
        const sorted = [make('Viron', 'Libraries'), make('Barony', 'Games'), make('Roam', 'Games')]
            .sort(option('title').compare);
        expect(titles(sorted)).toEqual(['Barony', 'Roam', 'Viron']);
    });

    it('By category orders by category, then by title within a category', () => {
        const sorted = [
            make('Viron', 'Libraries'),
            make('Roam', 'Games'),
            make('Apex', 'Libraries'),
            make('Barony', 'Games'),
        ].sort(option('category').compare);
        expect(titles(sorted)).toEqual(['Barony', 'Roam', 'Apex', 'Viron']);
    });

    it('By category ignores case in category names', () => {
        const sorted = [make('Viron', 'Libraries'), make('Patchwork', 'assets'), make('Roam', 'Games')]
            .sort(option('category').compare);
        expect(titles(sorted)).toEqual(['Patchwork', 'Roam', 'Viron']);
    });

    it('By category sorts a project with no category as "Other"', () => {
        const sorted = [make('Viron', 'Simulations'), make('Mystery'), make('Roam', 'Games'), make('Apex', 'Other')]
            .sort(option('category').compare);
        expect(titles(sorted)).toEqual(['Roam', 'Apex', 'Mystery', 'Viron']);
    });
});
