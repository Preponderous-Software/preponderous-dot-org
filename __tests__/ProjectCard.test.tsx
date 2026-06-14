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
});
