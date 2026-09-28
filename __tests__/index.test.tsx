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

// Each project is a tile button whose caption is its title, so the tiles in
// DOM order give the grid's order. Tiles are the only buttons carrying
// aria-controls, which keeps the Blurb's and chrome's controls out of it.
const tileTitlesInOrder = (section: HTMLElement): string[] =>
    within(section)
        .getAllByRole('button')
        .filter((button) => button.hasAttribute('aria-controls'))
        .map((button) => button.querySelector('.project-tile-caption')?.textContent ?? '');

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
