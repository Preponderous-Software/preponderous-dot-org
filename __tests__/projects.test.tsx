import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import ProjectsPage from '../pages/projects';
import projectData from '../pages/data/projects.json';
import packageJson from '../package.json';
import { groupProjectsByCategory, type Project } from '../utils/projects';

// The page renders TopBar, which reads the current route from next/router; there
// is no router provider in a bare render, so stand one in.
vi.mock('next/router', () => ({
    useRouter: () => ({ pathname: '/projects' }),
}));

const projects = projectData.projects as Project[];
const categories = groupProjectsByCategory(projects);

// Each card's only stable, class-free handle on which project it is showing is
// its "GitHub" action, so read those in DOM order to recover the card order.
const renderedTitlesInOrder = (section: HTMLElement): string[] => {
    const byGithubLink = new Map(projects.map((p) => [p.githubLink, p.title]));
    return within(section)
        .getAllByRole('link', { name: /github/i })
        .map((link) => byGithubLink.get(link.getAttribute('href') ?? '') ?? '<unknown>');
};

describe('Projects page', () => {
    let container: HTMLElement;

    beforeEach(() => {
        ({ container } = render(<ProjectsPage/>));
    });

    it('renders a Projects heading', () => {
        expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
    });

    it('renders a section heading for every category', () => {
        for (const { category } of categories) {
            expect(screen.getByRole('heading', { level: 2, name: category })).toBeInTheDocument();
        }
    });

    it('renders a card for every project in projects.json', () => {
        // Scoped to <main>, not the whole page — TopBar has its own "GitHub"
        // nav link that would otherwise inflate this count by one.
        const main = container.querySelector('main') as HTMLElement;
        const allCards = within(main).getAllByRole('link', { name: /github/i });
        expect(allCards.length).toBe(projects.length);
    });

    it('lists each category\'s projects alphabetically by title', () => {
        for (const { category, projects: categoryProjects } of categories) {
            const heading = screen.getByRole('heading', { level: 2, name: category });
            const section = heading.closest('section') as HTMLElement;
            expect(renderedTitlesInOrder(section)).toEqual(categoryProjects.map((p) => p.title));
        }
    });

    it('shows the package.json version in the footer', () => {
        expect(screen.getByText(`v${packageJson.version}`)).toBeInTheDocument();
    });
});
