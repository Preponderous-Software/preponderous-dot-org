import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

// Each card's only stable, class-free handle on which project it is showing is
// its "GitHub" action, so read those in DOM order to recover the card order.
const renderedTitlesInOrder = (section: HTMLElement): string[] => {
    const byGithubLink = new Map(projects.map((p) => [p.githubLink, p.title]));
    return within(section)
        .getAllByRole('link', { name: 'GitHub' })
        .map((link) => byGithubLink.get(link.getAttribute('href') ?? '') ?? '<unknown>');
};

describe('Home page', () => {
    let container: HTMLElement;
    let projectsSection: HTMLElement;

    beforeEach(() => {
        ({ container } = render(<Home/>));
        projectsSection = container.querySelector('#projects') as HTMLElement;
    });

    it('gives the Projects section the #projects id the hero button scrolls to', () => {
        // Blurb's "Browse Projects" button is href="#projects"; losing this id
        // would silently turn that button into a no-op.
        expect(projectsSection).not.toBeNull();
        expect(within(projectsSection).getByText('Projects')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /browse projects/i })).toHaveAttribute('href', '#projects');
    });

    it('renders a card for every project in projects.json', () => {
        expect(renderedTitlesInOrder(projectsSection).sort()).toEqual(
            projects.map((p) => p.title).sort()
        );
    });

    it('orders the cards alphabetically by title, case-insensitively', () => {
        const titles = renderedTitlesInOrder(projectsSection);
        const alphabetical = [...titles].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        expect(titles).toEqual(alphabetical);
    });

    it('links each card that has one to the project\'s own site', () => {
        const withSites = projects.filter((p) => p.websiteLink);
        const visitLinks = within(projectsSection).getAllByRole('link', { name: 'Visit Site' });
        expect(visitLinks.map((link) => link.getAttribute('href')).sort()).toEqual(
            withSites.map((p) => p.websiteLink).sort()
        );
    });

    it('shows the package.json version in the footer', () => {
        expect(screen.getByText(`v${packageJson.version}`)).toBeInTheDocument();
    });
});
