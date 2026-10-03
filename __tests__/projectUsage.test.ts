import {beforeEach, describe, expect, it, vi} from 'vitest';
import projectData from '../pages/data/projects.json';
import handler from '../pages/api/usage';
import {loadProjectUsage, usageRows} from '../utils/projectUsage';
import {clearTraceUsageCache} from '../utils/traceUsage';
import type {Project} from '../utils/projects';
import {usageWithInstalls, usageWithoutInstalls} from './fixtures/traceUsage';

const projects = projectData.projects as Project[];

// summary: trace's /api/public/summary body, or undefined for a 404.
// programs: per-program bodies by trace name; any other name 404s.
const stub = (summary: unknown, programs: Record<string, unknown>) => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
        if (url.endsWith('/api/public/summary')) {
            return summary === undefined
                ? {ok: false, status: 404, statusText: 'Not Found'} as Response
                : {ok: true, json: async () => summary} as unknown as Response;
        }
        const program = decodeURIComponent(url.split('/api/public/programs/')[1] ?? '');
        if (program && programs[program] !== undefined) {
            return {ok: true, json: async () => programs[program]} as unknown as Response;
        }
        return {ok: false, status: 404, statusText: 'Not Found'} as Response;
    }));
};

const programUrls = () => (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls
    .map(([url]) => url as string)
    .filter((url) => url.includes('/api/public/programs/'));

beforeEach(() => {
    clearTraceUsageCache();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('loadProjectUsage', () => {
    it('asks only about programs the summary has heard from, and keys the answers by project id', async () => {
        stub(
            [
                {application: 'FishE', count: 5, lastSeen: '2026-10-03T00:00:00Z'},
                {application: 'apex', count: 900, lastSeen: '2026-10-02T00:00:00Z'},
                {application: 'viron', count: 40, lastSeen: '2026-10-02T00:00:00Z'},
            ],
            {
                FishE: usageWithoutInstalls('FishE'),
                apex: usageWithInstalls('apex'),
            },
        );

        const usage = await loadProjectUsage();

        // viron is in the summary but is a service, so not mapped and not asked.
        expect(programUrls().sort()).toEqual([
            'https://trace.danielstephenson.dev/api/public/programs/FishE',
            'https://trace.danielstephenson.dev/api/public/programs/apex',
        ]);
        expect(Object.keys(usage).sort()).toEqual(['apex-ecosystem-simulator', 'fishe']);
        expect(usage.fishe.activeInstalls30d).toBeNull();
    });

    it('asks about every project when the summary is unavailable, and leaves out every 404', async () => {
        stub(undefined, {});
        expect(await loadProjectUsage()).toEqual({});
        expect(programUrls()).toHaveLength(10);
    });
});

describe('usageRows', () => {
    it('lists every reporting project with its kind, installs first, then recency, then the rest A–Z', () => {
        const rows = usageRows(projects, {
            fishe: {...usageWithoutInstalls('FishE'), lastSeen: '2026-10-03T00:00:00Z'},
            roam: {...usageWithoutInstalls('roam'), lastSeen: '2026-09-12T20:00:00Z'},
            'apex-ecosystem-simulator': usageWithInstalls('apex'),
        });
        expect(rows).toHaveLength(10);
        expect(rows.slice(0, 3).map((row) => [row.project.id, row.kind])).toEqual([
            ['apex-ecosystem-simulator', 'program'], ['fishe', 'game'], ['roam', 'game'],
        ]);
        const rest = rows.slice(3);
        expect(rest.every((row) => row.usage === null)).toBe(true);
        expect(rest.map((row) => row.title)).toEqual(rest.map((row) => row.title).sort((a, b) => a.localeCompare(b)));
    });
});

describe('GET /api/usage', () => {
    const call = async (method = 'GET') => {
        const res = {
            headers: {} as Record<string, string>,
            statusCode: 0,
            body: undefined as unknown,
            setHeader(name: string, value: string) { this.headers[name] = value; return this; },
            status(code: number) { this.statusCode = code; return this; },
            json(body: unknown) { this.body = body; return this; },
            end() { return this; },
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await handler({method} as any, res as any);
        return res;
    };

    it('answers with every reporting project trace has figures for, cacheable for a minute', async () => {
        stub([{application: 'roam', count: 1, lastSeen: '2026-09-12T20:00:00Z'}], {roam: usageWithoutInstalls()});
        const res = await call();
        expect(res.statusCode).toBe(200);
        expect(res.headers['Cache-Control']).toBe('public, max-age=60');
        expect(res.body).toEqual({usage: {roam: usageWithoutInstalls()}});
    });

    it('answers an empty map, not an error, when trace is down', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
        const res = await call();
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({usage: {}});
    });

    it('allows only reads', async () => {
        const res = await call('POST');
        expect(res.statusCode).toBe(405);
        expect(res.headers.Allow).toBe('GET, HEAD');
    });
});
