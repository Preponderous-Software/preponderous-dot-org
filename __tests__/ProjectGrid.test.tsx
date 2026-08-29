import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectGrid from '../components/ProjectGrid';
import { type Project } from '../utils/projects';

// A project carrying only the required fields, so each test below can opt into
// exactly the optional field it is about.
const project = (overrides: Partial<Project> = {}): Project => ({
    id: 'roam',
    title: 'Roam',
    description: 'Explore a procedurally-generated 2D world.',
    githubLink: 'https://github.com/Preponderous-Software/Roam',
    technology: 'Python',
    ...overrides,
});

describe('ProjectGrid', () => {
    it('renders a card for every project, in the order given', () => {
        render(
            <ProjectGrid
                projects={[
                    project({ id: 'roam', title: 'Roam' }),
                    project({ id: 'ophidian', title: 'Ophidian' }),
                    project({ id: 'viron', title: 'Viron' }),
                ]}
            />
        );
        // The grid does not sort — callers hand it an already-ordered list, so
        // whatever order it is given has to survive to the DOM.
        expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent))
            .toEqual(['Roam', 'Ophidian', 'Viron']);
    });

    it('renders nothing but an empty container for an empty list', () => {
        render(<ProjectGrid projects={[]}/>);
        expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
        expect(screen.queryAllByRole('link')).toHaveLength(0);
    });

    it('forwards each card field through to its ProjectCard', () => {
        render(
            <ProjectGrid
                projects={[
                    project({
                        id: 'barony',
                        title: 'Barony',
                        description: 'Command armies to capture villages and castles.',
                        githubLink: 'https://github.com/Preponderous-Software/barony',
                        technology: 'Java',
                        websiteLink: 'https://barony.preponderous.org',
                        status: 'Active',
                    }),
                ]}
            />
        );
        expect(screen.getByRole('heading', { level: 3, name: 'Barony' })).toBeInTheDocument();
        expect(screen.getByText('Command armies to capture villages and castles.')).toBeInTheDocument();
        expect(screen.getByText('Java')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Barony on GitHub' }))
            .toHaveAttribute('href', 'https://github.com/Preponderous-Software/barony');
        expect(screen.getByRole('link', { name: 'Barony: Visit Site' }))
            .toHaveAttribute('href', 'https://barony.preponderous.org');
    });

    it('leaves out the optional fields a project does not set', () => {
        // The regression this guards: a card field wired into one page's copy of
        // the grid and not the other used to render on one page and vanish on
        // the other. With one grid, an unset field is the only reason a chip or
        // button is absent.
        render(<ProjectGrid projects={[project({ id: 'ophidian', title: 'Ophidian' })]}/>);
        expect(screen.queryByRole('link', { name: /visit site/i })).toBeNull();
        expect(screen.queryByText('Active')).toBeNull();
        expect(screen.queryByText('Maintenance')).toBeNull();
    });
});
