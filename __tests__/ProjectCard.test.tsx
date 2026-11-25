import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectCard from '../components/ProjectCard';

describe('ProjectCard', () => {
    it('renders the title, description, and technology chip', () => {
        render(
            <ProjectCard
                title="Viron"
                description="A flexible simulation framework."
                githubLink="https://github.com/Preponderous-Software/Viron"
                technology="Java"
            />
        );
        expect(screen.getByRole('heading', { level: 3, name: 'Viron' })).toBeInTheDocument();
        expect(screen.getByText('A flexible simulation framework.')).toBeInTheDocument();
        expect(screen.getByText('Java')).toBeInTheDocument();
    });

    it('links the GitHub button to the repo in a new tab', () => {
        render(
            <ProjectCard
                title="Roam"
                description="Explore a procedurally-generated 2D world."
                githubLink="https://github.com/Preponderous-Software/Roam"
                technology="Python"
            />
        );
        const link = screen.getByRole('link', { name: /github/i });
        expect(link).toHaveAttribute('href', 'https://github.com/Preponderous-Software/Roam');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });

    it('omits the Visit Site button when no websiteLink is given', () => {
        render(
            <ProjectCard
                title="Roam"
                description="Explore a procedurally-generated 2D world."
                githubLink="https://github.com/Preponderous-Software/Roam"
                technology="Python"
            />
        );
        expect(screen.queryByRole('link', { name: /visit site/i })).toBeNull();
    });

    it('omits the status chip when no status is given', () => {
        render(
            <ProjectCard
                title="Roam"
                description="Explore a procedurally-generated 2D world."
                githubLink="https://github.com/Preponderous-Software/Roam"
                technology="Python"
            />
        );
        expect(screen.queryByText('Active')).toBeNull();
        expect(screen.queryByText('Maintenance')).toBeNull();
    });

    it('renders a status chip when status is given', () => {
        render(
            <ProjectCard
                title="Roam"
                description="Explore a procedurally-generated 2D world."
                githubLink="https://github.com/Preponderous-Software/Roam"
                technology="Python"
                status="Active"
            />
        );
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('colours a known status chip and outlines an unrecognised one, as on the home grid', () => {
        const chipOf = (label: string) => screen.getByText(label).closest('.MuiChip-root');
        const {unmount} = render(
            <ProjectCard title="Roam" description="d" githubLink="https://github.com/Preponderous-Software/Roam" technology="Python" status="Active"/>
        );
        expect(chipOf('Active')).toHaveClass('MuiChip-filled', 'MuiChip-colorSuccess');
        expect(chipOf('Python')).toHaveClass('MuiChip-outlined');
        unmount();
        render(
            <ProjectCard title="Roam" description="d" githubLink="https://github.com/Preponderous-Software/Roam" technology="Python" status="Archived"/>
        );
        expect(chipOf('Archived')).toHaveClass('MuiChip-outlined');
        expect(chipOf('Archived')).not.toHaveClass('MuiChip-filled');
    });

    it('shows the status chip alone when there is no technology, and no chips with neither', () => {
        const {container, unmount} = render(
            <ProjectCard title="Roam" description="d" githubLink="https://github.com/Preponderous-Software/Roam" technology="" status="Active"/>
        );
        expect(container.querySelectorAll('.MuiChip-root')).toHaveLength(1);
        expect(screen.getByText('Active')).toBeInTheDocument();
        unmount();
        const empty = render(
            <ProjectCard title="Roam" description="d" githubLink="https://github.com/Preponderous-Software/Roam" technology=""/>
        );
        expect(empty.container.querySelector('.MuiChip-root')).toBeNull();
    });

    it('renders a Visit Site button linking to the live site in a new tab when websiteLink is set', () => {
        render(
            <ProjectCard
                title="Barony"
                description="Command armies to capture villages and castles against an AI opponent."
                githubLink="https://github.com/Preponderous-Software/barony"
                technology="Java"
                websiteLink="https://barony.preponderous.org"
            />
        );
        const site = screen.getByRole('link', { name: /visit site/i });
        expect(site).toHaveAttribute('href', 'https://barony.preponderous.org');
        expect(site).toHaveAttribute('target', '_blank');
        expect(site).toHaveAttribute('rel', expect.stringContaining('noopener'));
        // GitHub button still present alongside it
        expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    });

    it('names both actions after their project so they are distinguishable out of context', () => {
        render(
            <ProjectCard
                title="Barony"
                description="Command armies to capture villages and castles against an AI opponent."
                githubLink="https://github.com/Preponderous-Software/barony"
                technology="Java"
                websiteLink="https://barony.preponderous.org"
            />
        );
        expect(screen.getByRole('link', { name: 'Barony on GitHub' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Barony: Visit Site' })).toBeInTheDocument();
    });

    it('keeps the visible button text inside each accessible name', () => {
        render(
            <ProjectCard
                title="Barony"
                description="Command armies to capture villages and castles against an AI opponent."
                githubLink="https://github.com/Preponderous-Software/barony"
                technology="Java"
                websiteLink="https://barony.preponderous.org"
            />
        );
        // WCAG 2.5.3: speaking what is on screen has to match the link.
        for (const [visibleText, accessibleName] of [
            ['GitHub', 'Barony on GitHub'],
            ['Visit Site', 'Barony: Visit Site'],
        ] as const) {
            const link = screen.getByRole('link', { name: accessibleName });
            expect(link).toHaveTextContent(visibleText);
            expect(accessibleName).toContain(visibleText);
        }
    });
});
