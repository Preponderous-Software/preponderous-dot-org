// Renders the usage views in each of trace's states, to pin what they are
// allowed to call an install.
import React from 'react';
import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen, within} from '@testing-library/react';
import IconGrid from '../components/IconGrid';
import Usage from '../pages/usage';
import projectData from '../pages/data/projects.json';
import {usageRows} from '../utils/projectUsage';
import type {Project} from '../utils/projects';
import {usageWithInstalls, usageWithoutInstalls} from './fixtures/traceUsage';

vi.mock('next/router', () => ({
    useRouter: () => ({pathname: '/usage'}),
}));

const NOW = Date.parse('2026-10-03T16:00:00Z');
const projects = projectData.projects as Project[];
const project = (id: string) => projects.find((candidate) => candidate.id === id)!;

describe('the usage line in a project\'s details', () => {
    // A click opens the details as a tap does on a phone: the same content
    // as the desktop hover panel.
    const openDetails = (title: string) => fireEvent.click(screen.getByRole('button', {name: title}));

    it('says when a reporting game was last used and how many launches, labelled as launches', () => {
        render(<IconGrid projects={[project('fishe')]} usage={{fishe: usageWithoutInstalls('FishE')}} now={new Date(NOW)}/>);
        openDetails('FishE');

        const line = screen.getByTestId('usage-line');
        expect(within(line).getByTestId('usage-line-main').textContent).toBe('Last used 2 days ago');
        expect(line.textContent).toContain('412 launches in the last 30 days, reported by trace.');
        expect(line.textContent).not.toMatch(/install|players?\b|users?\b/i);
        expect(within(line).getByRole('link', {name: 'About these figures'}).getAttribute('href')).toBe('/usage');
    });

    it('calls a simulation\'s starts plain starts, and leads with active installs once trace counts them', () => {
        render(<IconGrid
            projects={[project('apex-ecosystem-simulator')]}
            usage={{'apex-ecosystem-simulator': usageWithInstalls('apex')}}
            now={new Date(NOW)}
        />);
        openDetails('Apex-Ecosystem-Simulator');

        expect(screen.getByTestId('usage-line-main').textContent).toBe('57 active installs (30 days)');
        expect(screen.getByTestId('usage-line').textContent).toContain('Last used 2 hours ago, reported by trace.');
    });

    it('is left out for a project with no figures, one that does not report, and before the clock is read', () => {
        const {unmount} = render(<IconGrid projects={[project('fishe'), project('viron')]} usage={{viron: usageWithoutInstalls('viron')}} now={new Date(NOW)}/>);
        openDetails('FishE');
        expect(screen.queryByTestId('usage-line')).toBeNull();
        openDetails('Viron');
        expect(screen.queryByTestId('usage-line')).toBeNull();
        unmount();

        render(<IconGrid projects={[project('fishe')]} usage={{fishe: usageWithoutInstalls('FishE')}} now={null}/>);
        openDetails('FishE');
        expect(screen.queryByTestId('usage-line')).toBeNull();
    });
});

describe('/usage', () => {
    it('lists installs first, then the rest by recency, never calling starts installs', () => {
        const rows = usageRows(projects, {
            'apex-ecosystem-simulator': usageWithInstalls('apex'),
            roam: usageWithoutInstalls('roam'),
        });
        render(<Usage rows={rows} renderedAt={NOW}/>);

        const items = screen.getAllByTestId('usage-row');
        expect(items).toHaveLength(10);
        expect(within(items[0]).getByTestId('usage-row-installs').textContent).toBe('57 active installs (30 days)');
        expect(within(items[0]).getByTestId('usage-row-starts').textContent).toBe('412 starts in the last 30 days');
        expect(within(items[1]).queryByTestId('usage-row-installs')).toBeNull();
        expect(within(items[1]).getByTestId('usage-row-last-used').textContent).toBe('Last used 2 days ago');
        expect(within(items[1]).getByTestId('usage-row-starts').textContent).toBe('412 launches in the last 30 days');
        expect(within(items[2]).getByTestId('usage-row-none').textContent).toBe('No usage figures yet');
        expect(within(items[1]).getByRole('link', {name: 'Roam on GitHub'}).getAttribute('href'))
            .toBe('https://github.com/Preponderous-Software/Roam');
        expect(screen.getByRole('link', {name: /how it works/}).getAttribute('href'))
            .toBe('https://github.com/Stephenson-Software/trace#usage-reporting');
        expect(screen.getByTestId('trace-attribution').textContent).toContain('Test and CI runs are excluded');
        expect(screen.queryByTestId('usage-unavailable')).toBeNull();
        expect(screen.getAllByRole('img').some((img) => /^Launches per day from Sep 4 to Oct 3/.test(img.getAttribute('aria-label') ?? ''))).toBe(true);
    });

    it('says so when trace has no figures at all', () => {
        render(<Usage rows={usageRows(projects, {})} renderedAt={NOW}/>);
        expect(screen.getByTestId('usage-unavailable')).toBeInTheDocument();
        expect(screen.queryAllByTestId('usage-row-last-used')).toHaveLength(0);
    });
});
