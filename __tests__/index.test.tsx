import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import Home from '../pages/index';
import projectData from '../pages/data/projects.json';
import packageJson from '../package.json';
import { type Project } from '../utils/projects';

// The page renders TopBar, which reads the current route from next/router; there
// is no router provider in a bare render, so stand one in.
vi.mock('next/router', () => ({
    useRouter: () => ({ pathname: '/' }),
}));

const projects = projectData.projects as Project[];

// Each project is a tile whose caption is its title, so the tiles in DOM order
// give the grid's order. The kit marks its tiles with a test id, which keeps
// the filter bar's and chrome's buttons out of it.
const tileTitlesInOrder = (section: HTMLElement): string[] =>
    within(section)
        .getAllByTestId('catalogue-tile')
        .map((tile) => tile.querySelector('.catalogue-tile-caption')?.textContent ?? '');

describe('Home page', () => {
    let container: HTMLElement;
    let projectsSection: HTMLElement;

    beforeEach(() => {
        ({ container } = render(<Home/>));
        projectsSection = container.querySelector('#projects') as HTMLElement;
    });

    it('gives the Projects section its #projects id and a Projects heading', () => {
        expect(projectsSection).not.toBeNull();
        expect(within(projectsSection).getByRole('heading', { level: 2, name: 'Projects' })).toBeInTheDocument();
    });

    it('sends the hero\'s Browse Projects button to the full /projects page', () => {
        // The grid now sits directly above the hero, so a #projects jump
        // would scroll back up to what the visitor has just passed.
        expect(screen.getByRole('link', { name: /browse projects/i })).toHaveAttribute('href', '/projects');
    });

    it('puts the project grid before the blurb', () => {
        const blurbButton = screen.getByRole('link', { name: /browse projects/i });
        expect(projectsSection.compareDocumentPosition(blurbButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('renders a tile for every project in projects.json', () => {
        expect(tileTitlesInOrder(projectsSection).sort()).toEqual(
            projects.map((p) => p.title).sort()
        );
    });

    it('orders the tiles alphabetically by title, case-insensitively', () => {
        const titles = tileTitlesInOrder(projectsSection);
        const alphabetical = [...titles].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        expect(titles).toEqual(alphabetical);
    });

    it('links each project that has one to its own site from its panel', () => {
        const withSites = projects.filter((p) => p.websiteLink);
        const hrefs = withSites.map((project) => {
            fireEvent.click(within(projectsSection).getByRole('button', { name: project.title }));
            return screen.getByRole('link', { name: `${project.title}: Visit Site` }).getAttribute('href');
        });
        expect(hrefs.sort()).toEqual(withSites.map((p) => p.websiteLink).sort());
    });

    it('shows the package.json version in the footer', () => {
        expect(screen.getByText(`v${packageJson.version}`)).toBeInTheDocument();
    });
});

describe('Home page search and filters', () => {
    const shownTitles = () => {
        const section = screen.getByRole('region', { name: 'Projects' });
        return within(section)
            .queryAllByTestId('catalogue-tile')
            .map((tile) => tile.querySelector('.catalogue-tile-caption')?.textContent ?? '');
    };
    const openFilters = () => fireEvent.click(screen.getByRole('button', { name: /search & filter/i }));

    it('keeps the filters folded until asked for, and says nothing while nothing is filtered', () => {
        render(<Home />);
        const toggle = screen.getByRole('button', { name: /search & filter/i });
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        openFilters();
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
        expect(screen.queryByTestId('filter-summary')).toBeNull();
    });

    it('narrows the grid by search text and says how many are shown', () => {
        render(<Home />);
        openFilters();
        fireEvent.change(screen.getByRole('textbox', { name: 'Search projects' }), { target: { value: 'simulation' } });
        const matching = projects.filter((project) =>
            [project.title, project.description, project.category, project.technology, project.status]
                .join(' ').toLowerCase().includes('simulation'));
        expect(shownTitles()).toHaveLength(matching.length);
        expect(matching.length).toBeGreaterThan(0);
        expect(matching.length).toBeLessThan(projects.length);
        expect(screen.getByTestId('filter-summary'))
            .toHaveTextContent(`Showing ${matching.length} of ${projects.length} projects`);
    });

    it('offers a chip for every category, technology part and status in use', () => {
        render(<Home />);
        openFilters();
        const chips = (label: string) =>
            within(screen.getByRole('group', { name: `Filter by ${label}` })).getAllByRole('button').map((b) => b.textContent);
        expect(chips('category')).toEqual(['Any category', ...new Set(projects.map((p) => p.category!))].sort((a, b) =>
            a === 'Any category' ? -1 : b === 'Any category' ? 1 : a.localeCompare(b)));
        expect(chips('technology')).toContain('Next.js');
        expect(chips('technology')).not.toContain('TypeScript / Next.js');
        expect(chips('status')).toEqual(['Any status', 'Active', 'Maintenance']);
    });

    it('narrows the grid to one category, and back to all', () => {
        render(<Home />);
        openFilters();
        const group = screen.getByRole('group', { name: 'Filter by category' });
        fireEvent.click(within(group).getByRole('button', { name: 'Games' }));
        const games = projects.filter((project) => project.category === 'Games').map((project) => project.title);
        expect([...shownTitles()].sort()).toEqual([...games].sort());
        fireEvent.click(within(group).getByRole('button', { name: 'Any category' }));
        expect(shownTitles()).toHaveLength(projects.length);
    });

    it('offers a way back from a search that matches nothing', () => {
        render(<Home />);
        openFilters();
        fireEvent.change(screen.getByRole('textbox', { name: 'Search projects' }), { target: { value: 'zzz-no-such-project' } });
        expect(shownTitles()).toEqual([]);
        fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
        expect(shownTitles()).toHaveLength(projects.length);
    });

    it('sorts A–Z by default, and by category on request', () => {
        render(<Home />);
        const initial = shownTitles();
        expect(initial).toEqual([...initial].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })));
        openFilters();
        fireEvent.click(screen.getByRole('button', { name: 'By category' }));
        const categoryOf = new Map(projects.map((p) => [p.title, p.category ?? 'Other']));
        const categories = shownTitles().map((title) => categoryOf.get(title)!);
        expect(categories).toEqual([...categories].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })));
    });
});
