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
        expect(screen.getByText('Viron')).toBeInTheDocument();
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
});
