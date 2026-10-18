// Characterizes what a tile reveals about its project in the icon grid's hover
// panel and bottom sheet: title, description, technology and status chips, the
// usage line (only for a reporting project once the figures and the clock are
// both in), and the project's links.
import React from 'react';
import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import ProjectDetails from '../components/ProjectDetails';
import type {Project} from '../utils/projects';
import {usageWithoutInstalls} from './fixtures/traceUsage';

const NOW = Date.parse('2026-10-04T14:00:00Z');

const roam: Project = {
    id: 'roam',
    title: 'Roam',
    description: 'Explore a procedurally-generated 2D world.',
    githubLink: 'https://github.com/Preponderous-Software/roam',
    technology: 'Python',
    status: 'Active',
};

const chipOf = (label: string) => screen.getByText(label).closest('.MuiChip-root');

describe('ProjectDetails', () => {
    it('renders the title as a level-3 heading carrying the given id, and the description', () => {
        render(<ProjectDetails project={roam} titleId="details-roam"/>);
        const heading = screen.getByRole('heading', {level: 3, name: 'Roam'});
        expect(heading).toHaveAttribute('id', 'details-roam');
        expect(screen.getByText('Explore a procedurally-generated 2D world.')).toBeInTheDocument();
    });

    it('renders the title action beside the title', () => {
        render(<ProjectDetails project={roam} titleAction={<button type="button">Close</button>}/>);
        expect(screen.getByRole('button', {name: 'Close'})).toBeInTheDocument();
    });

    it('shows a known status as a filled, coloured chip and the technology as an outlined one', () => {
        render(<ProjectDetails project={roam}/>);
        expect(chipOf('Active')).toHaveClass('MuiChip-filled', 'MuiChip-colorSuccess');
        expect(chipOf('Python')).toHaveClass('MuiChip-outlined');
    });

    it('shows an unrecognised status as an outlined chip', () => {
        render(<ProjectDetails project={{...roam, status: 'Archived'}}/>);
        expect(chipOf('Archived')).toHaveClass('MuiChip-outlined');
        expect(chipOf('Archived')).not.toHaveClass('MuiChip-filled');
    });

    it('renders no chips when the project has neither technology nor status', () => {
        const {container} = render(<ProjectDetails project={{...roam, technology: '', status: undefined}}/>);
        expect(container.querySelector('.MuiChip-root')).toBeNull();
    });

    it('shows the usage line for a reporting project once its figures and the clock are in', () => {
        render(<ProjectDetails project={roam} usage={usageWithoutInstalls()} now={NOW}/>);
        expect(screen.getByTestId('usage-line-main')).toHaveTextContent('Last used 3 days ago');
    });

    it('shows no usage line before the clock is read', () => {
        render(<ProjectDetails project={roam} usage={usageWithoutInstalls()} now={null}/>);
        expect(screen.queryByTestId('usage-line')).toBeNull();
    });

    it('shows no usage line for a project that does not report to trace', () => {
        const viron: Project = {...roam, id: 'not-a-trace-program', title: 'Viron'};
        render(<ProjectDetails project={viron} usage={usageWithoutInstalls()} now={NOW}/>);
        expect(screen.queryByTestId('usage-line')).toBeNull();
    });

    it('makes GitHub the only, contained, action when there is no website', () => {
        render(<ProjectDetails project={roam}/>);
        expect(screen.queryByRole('link', {name: 'Roam: Visit Site'})).toBeNull();
        const github = screen.getByRole('link', {name: 'Roam on GitHub'});
        expect(github).toHaveAttribute('href', 'https://github.com/Preponderous-Software/roam');
        expect(github).toHaveAttribute('target', '_blank');
        expect(github).toHaveAttribute('rel', 'noopener noreferrer');
        expect(github).toHaveClass('MuiButton-contained');
    });

    it('leads with a contained Visit Site link and demotes GitHub to outlined when there is a website', () => {
        render(<ProjectDetails project={{...roam, websiteLink: 'https://roam.example'}}/>);
        const site = screen.getByRole('link', {name: 'Roam: Visit Site'});
        expect(site).toHaveAttribute('href', 'https://roam.example');
        expect(site).toHaveAttribute('target', '_blank');
        expect(site).toHaveClass('MuiButton-contained');
        expect(screen.getByRole('link', {name: 'Roam on GitHub'})).toHaveClass('MuiButton-outlined');
    });
});
