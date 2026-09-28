import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import IconGrid from '../components/IconGrid';
import { OPEN_DELAY_MS, CLOSE_DELAY_MS } from '../components/ProjectTile';
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

const PROJECTS = [
    project({ id: 'roam', title: 'Roam', websiteLink: 'https://roam.preponderous.org', status: 'Active' }),
    project({ id: 'viron', title: 'Viron', description: 'A spatial simulation service.', githubLink: 'https://github.com/Preponderous-Software/viron' }),
];

const tile = (title: string) => screen.getByRole('button', { name: title });
const panel = (title: string) => screen.queryByRole('region', { name: title });

describe('IconGrid', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders one tile per project, in the order given, with no panel open', () => {
        render(<IconGrid projects={PROJECTS}/>);
        const tiles = screen.getAllByRole('button');
        expect(tiles.map((t) => t.querySelector('.project-tile-caption')?.textContent)).toEqual(['Roam', 'Viron']);
        tiles.forEach((t) => expect(t).toHaveAttribute('aria-expanded', 'false'));
        expect(screen.queryByRole('region')).toBeNull();
        expect(screen.queryByText(PROJECTS[0].description)).toBeNull();
    });

    it('uses a project\'s icon when it has one, and its initial otherwise', () => {
        const { container } = render(
            <IconGrid projects={[project({ icon: '/icons/roam.png' }), project({ id: 'viron', title: 'Viron' })]}/>
        );
        expect(container.querySelector('img')).toHaveAttribute('src', '/icons/roam.png');
        expect(tile('Viron')).toHaveTextContent('V');
    });

    it('opens the details panel after hovering a tile, and closes it after the pointer leaves', () => {
        render(<IconGrid projects={PROJECTS}/>);
        const wrapper = tile('Roam').parentElement as HTMLElement;
        fireEvent.mouseEnter(wrapper);
        expect(panel('Roam')).toBeNull();
        act(() => { vi.advanceTimersByTime(OPEN_DELAY_MS); });
        expect(panel('Roam')).toBeInTheDocument();
        expect(tile('Roam')).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText(PROJECTS[0].description)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Roam: Visit Site' })).toHaveAttribute('href', 'https://roam.preponderous.org');
        expect(screen.getByRole('link', { name: 'Roam on GitHub' })).toHaveAttribute('href', PROJECTS[0].githubLink);
        expect(screen.getByText('Active')).toBeInTheDocument();

        fireEvent.mouseLeave(wrapper);
        act(() => { vi.advanceTimersByTime(CLOSE_DELAY_MS); });
        expect(panel('Roam')).toBeNull();
    });

    it('keeps the panel open when the pointer comes back before the close delay', () => {
        render(<IconGrid projects={PROJECTS}/>);
        const wrapper = tile('Roam').parentElement as HTMLElement;
        fireEvent.mouseEnter(wrapper);
        act(() => { vi.advanceTimersByTime(OPEN_DELAY_MS); });
        fireEvent.mouseLeave(wrapper);
        act(() => { vi.advanceTimersByTime(CLOSE_DELAY_MS / 2); });
        fireEvent.mouseEnter(wrapper);
        act(() => { vi.advanceTimersByTime(CLOSE_DELAY_MS * 2); });
        expect(panel('Roam')).toBeInTheDocument();
    });

    it('opens the panel on keyboard focus and closes it when focus leaves the tile', () => {
        render(<IconGrid projects={PROJECTS}/>);
        act(() => { tile('Roam').focus(); });
        expect(panel('Roam')).toBeInTheDocument();
        act(() => { tile('Viron').focus(); });
        expect(panel('Roam')).toBeNull();
        expect(panel('Viron')).toBeInTheDocument();
    });

    it('toggles the panel on click, for touch screens', () => {
        render(<IconGrid projects={PROJECTS}/>);
        fireEvent.click(tile('Viron'));
        expect(panel('Viron')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /Visit Site/ })).toBeNull();
        fireEvent.click(tile('Viron'));
        expect(panel('Viron')).toBeNull();
    });

    it('keeps only one panel open at a time', () => {
        render(<IconGrid projects={PROJECTS}/>);
        fireEvent.click(tile('Roam'));
        fireEvent.click(tile('Viron'));
        expect(panel('Roam')).toBeNull();
        expect(panel('Viron')).toBeInTheDocument();
    });

    it('closes on Escape and returns focus to the tile', () => {
        render(<IconGrid projects={PROJECTS}/>);
        act(() => { tile('Roam').focus(); });
        const github = screen.getByRole('link', { name: 'Roam on GitHub' });
        act(() => { github.focus(); });
        fireEvent.keyDown(github, { key: 'Escape' });
        expect(panel('Roam')).toBeNull();
        expect(tile('Roam')).toHaveFocus();
    });

    it('points each tile\'s aria-controls at its panel', () => {
        render(<IconGrid projects={PROJECTS}/>);
        fireEvent.click(tile('Roam'));
        expect(panel('Roam')).toHaveAttribute('id', tile('Roam').getAttribute('aria-controls'));
    });
});
