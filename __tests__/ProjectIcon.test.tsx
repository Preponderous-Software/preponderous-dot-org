import React from 'react';
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectIcon from '../components/ProjectIcon';
import ProjectCard from '../components/ProjectCard';
import { PROJECT_GLYPHS } from '../utils/projectGlyphs';
import { type Project } from '../utils/projects';

const projects = (require('../pages/data/projects.json') as { projects: Project[] }).projects;

const renderIcon = (project: Pick<Project, 'title' | 'icon' | 'glyph'>) =>
    render(<ProjectIcon project={project} sx={{ width: 64, height: 64 }} glyphSize={34}/>);

describe('ProjectIcon', () => {
    it('shows a project\'s own artwork when it has one', () => {
        const { container } = renderIcon({ title: 'Roam', icon: '/icons/roam.png', glyph: 'Castle' });
        expect(container.querySelector('img')).toHaveAttribute('src', '/icons/roam.png');
        expect(screen.queryByTestId('project-glyph')).toBeNull();
    });

    it('draws its glyph when it has no artwork', () => {
        const { container } = renderIcon({ title: 'Barony', glyph: 'Castle' });
        expect(container.querySelector('img')).toBeNull();
        expect(screen.getByTestId('project-glyph')).toBeInTheDocument();
        expect(container).not.toHaveTextContent('B');
    });

    it('falls back to the initial for an unknown glyph or none at all', () => {
        expect(renderIcon({ title: 'Viron', glyph: 'NoSuchIcon' }).container).toHaveTextContent('V');
        expect(renderIcon({ title: 'Patchwork' }).container).toHaveTextContent('P');
    });
});

describe('ProjectCard icon', () => {
    it('uses the same artwork or glyph as the home grid', () => {
        const card = (extra: Partial<Project>) => render(
            <ProjectCard title="Barony" description="d" githubLink="https://github.com/x/y" technology="Java" {...extra}/>
        );
        expect(card({ glyph: 'Castle' }).getByTestId('project-glyph')).toBeInTheDocument();
        expect(card({ icon: '/icons/apex.png' }).container.querySelector('img')).toHaveAttribute('src', '/icons/apex.png');
    });
});

// Every showcased project should read as something at a glance, not as a
// letter it shares with half the grid.
describe('projects.json icons', () => {
    it.each(projects.map((p) => [p.id, p] as const))('%s has artwork that exists or a known glyph', (_id, project) => {
        if (project.icon) {
            expect(fs.existsSync(path.join(__dirname, '..', 'public', project.icon))).toBe(true);
        } else {
            expect(Object.keys(PROJECT_GLYPHS)).toContain(project.glyph);
        }
    });
});
