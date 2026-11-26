import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import ProjectsPage from '../pages/projects';
import projectData from '../pages/data/projects.json';
import packageJson from '../package.json';
import { categoryHeadingId, groupProjectsByCategory, type Project } from '../utils/projects';

// The page renders TopBar, which reads the current route from next/router; there
// is no router provider in a bare render, so stand one in.
vi.mock('next/router', () => ({
    useRouter: () => ({ pathname: '/projects' }),
}));

const projects = projectData.projects as Project[];
const categories = groupProjectsByCategory(projects);

// Each card titles itself with an <h3>, so read those in DOM order to recover
// the card order. (Not the "GitHub" actions: a website-only project has none.)
const renderedTitlesInOrder = (section: HTMLElement): string[] =>
    within(section)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent ?? '<unknown>');

describe('Projects page', () => {
    let container: HTMLElement;

    beforeEach(() => {
        ({ container } = render(<ProjectsPage/>));
    });

    it('renders a Projects heading', () => {
        expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
    });

    it('links to every category section from a jump list under the heading', () => {
        const nav = screen.getByRole('navigation', { name: 'Project categories' });
        const links = within(nav).getAllByRole('link');
        expect(links.map((link) => link.getAttribute('href'))).toEqual(
            categories.map(({ category }) => `#${categoryHeadingId(category)}`)
        );
        for (const { category, projects: inCategory } of categories) {
            expect(within(nav).getByRole('link', { name: `${category} (${inCategory.length})` })).toBeInTheDocument();
            expect(container.querySelector(`#${categoryHeadingId(category)}`)).not.toBeNull();
        }
    });

    it('renders a section heading for every category', () => {
        for (const { category } of categories) {
            expect(screen.getByRole('heading', { level: 2, name: category })).toBeInTheDocument();
        }
    });

    it('renders a card for every project in projects.json', () => {
        // Scoped to <main>, so TopBar and footer headings are not counted.
        const main = container.querySelector('main') as HTMLElement;
        const allCards = within(main).getAllByRole('heading', { level: 3 });
        expect(allCards.length).toBe(projects.length);
    });

    it('gives a GitHub action to every project with a repository, and none to the rest', () => {
        const main = container.querySelector('main') as HTMLElement;
        const githubActions = within(main).getAllByRole('link', { name: / on GitHub$/ });
        expect(githubActions.length).toBe(projects.filter((p) => p.githubLink).length);
        expect(within(main).queryByRole('link', { name: 'Daniel Stephenson on GitHub' })).toBeNull();
        expect(within(main).getByRole('link', { name: 'Daniel Stephenson: Visit Site' }))
            .toHaveAttribute('href', 'https://danielstephenson.dev');
    });

    it('lists each category\'s projects alphabetically by title', () => {
        for (const { category, projects: categoryProjects } of categories) {
            const heading = screen.getByRole('heading', { level: 2, name: category });
            const section = heading.closest('section') as HTMLElement;
            expect(renderedTitlesInOrder(section)).toEqual(categoryProjects.map((p) => p.title));
        }
    });

    it('labels each category section with its own heading', () => {
        for (const { category } of categories) {
            const heading = screen.getByRole('heading', { level: 2, name: category });
            const section = heading.closest('section') as HTMLElement;
            const labelledBy = section.getAttribute('aria-labelledby');
            // A single, whitespace-free id reference — aria-labelledby is a
            // space-separated list, so a raw category name with a space in it
            // would silently point at ids that do not exist.
            expect(labelledBy).toBe(categoryHeadingId(category));
            expect(labelledBy).not.toMatch(/\s/);
            expect(section.querySelector(`#${labelledBy}`)).toBe(heading);
        }
    });

    it('shows the package.json version in the footer', () => {
        expect(screen.getByText(`v${packageJson.version}`)).toBeInTheDocument();
    });
});
