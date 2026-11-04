// Renders the usage views in each of trace's states, to pin what they are
// allowed to call an install.
import type {GetServerSidePropsContext} from 'next';
import React from 'react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen, within} from '@testing-library/react';
import IconGrid from '../components/IconGrid';
import Usage, {getServerSideProps} from '../pages/usage';
import projectData from '../pages/data/projects.json';
import {usageRows, type UsageRow} from '../utils/projectUsage';
import type {Project} from '../utils/projects';
import {clearTraceUsageCache, type ProgramUsage} from '../utils/traceUsage';
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
        render(<IconGrid projects={[project('ophidian')]} usage={{ophidian: usageWithoutInstalls('ophidian')}} now={new Date(NOW)}/>);
        openDetails('Ophidian');

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
        const {unmount} = render(<IconGrid projects={[project('ophidian'), project('viron')]} usage={{viron: usageWithoutInstalls('viron')}} now={new Date(NOW)}/>);
        openDetails('Ophidian');
        expect(screen.queryByTestId('usage-line')).toBeNull();
        openDetails('Viron');
        expect(screen.queryByTestId('usage-line')).toBeNull();
        unmount();

        render(<IconGrid projects={[project('ophidian')]} usage={{ophidian: usageWithoutInstalls('ophidian')}} now={null}/>);
        openDetails('Ophidian');
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
        expect(items).toHaveLength(7);
        expect(within(items[0]).getByTestId('usage-row-installs').textContent).toBe('57 active installs (30 days)');
        expect(within(items[0]).getByTestId('usage-row-starts').textContent).toBe('412 starts in the last 30 days');
        expect(within(items[1]).queryByTestId('usage-row-installs')).toBeNull();
        expect(within(items[1]).getByTestId('usage-row-last-used').textContent).toBe('Last used 2 days ago');
        expect(within(items[1]).getByTestId('usage-row-starts').textContent).toBe('412 launches in the last 30 days');
        expect(within(items[2]).getByTestId('usage-row-none').textContent).toBe('No usage figures yet');
        expect(within(items[1]).getByRole('link', {name: 'Roam on GitHub'}).getAttribute('href'))
            .toBe('https://github.com/Preponderous-Software/Roam');
        expect(screen.getByRole('link', {name: /how it works/}).getAttribute('href'))
            .toBe('https://danielstephenson.dev/usage-reporting');
        expect(screen.getByTestId('trace-attribution').textContent).toContain('Test and CI runs are excluded');
        expect(screen.queryByTestId('usage-unavailable')).toBeNull();
        expect(screen.getAllByRole('img').some((img) => /^Launches per day from Sep 4 to Oct 3/.test(img.getAttribute('aria-label') ?? ''))).toBe(true);
    });

    it('says so when trace has no figures at all', () => {
        render(<Usage rows={usageRows(projects, {})} renderedAt={NOW}/>);
        expect(screen.getByTestId('usage-unavailable')).toBeInTheDocument();
        expect(screen.queryAllByTestId('usage-row-last-used')).toHaveLength(0);
    });

    it('says the list is by active installs only when some project has an install count', () => {
        const page = render(<Usage rows={usageRows(projects, {roam: usageWithInstalls('roam')})} renderedAt={NOW}/>);
        expect(screen.getByText(/Projects are listed by active installs, then by how recently they were used\./)).toBeInTheDocument();
        page.unmount();

        render(<Usage rows={usageRows(projects, {roam: usageWithoutInstalls('roam')})} renderedAt={NOW}/>);
        expect(screen.getByText(/Projects are listed by how recently they were used\./)).toBeInTheDocument();
        expect(screen.queryByText(/listed by active installs/)).toBeNull();
    });

    // The row for Roam, with these figures on the page.
    const roamRow = (usage: ProgramUsage) => {
        render(<Usage rows={usageRows(projects, {roam: usage})} renderedAt={NOW}/>);
        return screen.getAllByTestId('usage-row')
            .find((row) => within(row).queryByRole('link', {name: 'Roam on GitHub'}))!;
    };

    it('tells a project trace knows but has no public use for from one with no figures', () => {
        const row = roamRow({...usageWithoutInstalls('roam'), lastSeen: null, startups30d: 0, days: []});
        expect(within(row).getByTestId('usage-row-last-used').textContent).toBe('No use reported yet');
        expect(within(row).queryByTestId('usage-row-none')).toBeNull();
        expect(within(row).queryByTestId('usage-row-starts')).toBeNull();
        expect(screen.queryByTestId('usage-unavailable')).toBeNull();
    });

    it('draws the sparkline only for a project with starts and days to plot', () => {
        expect(within(roamRow(usageWithoutInstalls('roam'))).getByTestId('starts-sparkline')).toBeInTheDocument();
    });

    it('draws no sparkline over a window of no starts', () => {
        const row = roamRow({...usageWithoutInstalls('roam'), startups30d: 0});
        expect(within(row).queryByTestId('starts-sparkline')).toBeNull();
    });

    it('draws no sparkline when starts arrive without their days', () => {
        const row = roamRow({...usageWithoutInstalls('roam'), days: []});
        expect(within(row).queryByTestId('starts-sparkline')).toBeNull();
        expect(within(row).getByTestId('usage-row-starts').textContent).toBe('412 launches in the last 30 days');
    });
});

describe('/usage on the server', () => {
    const load = async () => {
        const result = await getServerSideProps({} as GetServerSidePropsContext);
        return (result as {props: {rows: UsageRow[]; renderedAt: number}}).props;
    };

    beforeEach(() => {
        clearTraceUsageCache();
        vi.spyOn(Date, 'now').mockReturnValue(NOW);
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('hands the page a row per reporting project, in /usage order, and the clock it read', async () => {
        vi.stubGlobal('fetch', vi.fn(async (url: string) => (
            url.endsWith('/api/public/summary')
                ? {ok: true, json: async () => [{application: 'roam', count: 1, lastSeen: '2026-10-01T14:00:00Z'}]}
                : {ok: true, json: async () => usageWithoutInstalls('roam')}
        ) as unknown as Response));

        const {rows, renderedAt} = await load();

        expect(renderedAt).toBe(NOW);
        expect(rows).toHaveLength(7);
        expect(rows[0].project.id).toBe('roam');
        expect(rows[0].usage).toEqual(usageWithoutInstalls('roam'));
        expect(rows.slice(1).every((row) => row.usage === null)).toBe(true);
    });

    it('still renders with trace down: every row is there, with no figures', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));

        const {rows} = await load();

        expect(rows).toHaveLength(7);
        expect(rows.every((row) => row.usage === null)).toBe(true);
    });

    it('returns props Next.js can serialize, with no undefined left in them', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));

        const props = await load();

        expect(JSON.parse(JSON.stringify(props))).toStrictEqual(props);
    });
});
