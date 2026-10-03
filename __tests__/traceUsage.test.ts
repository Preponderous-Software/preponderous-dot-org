import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {
    TRACE_CACHE_TTL_MS,
    clearTraceUsageCache,
    getProgramUsage,
    getUsageSummary,
    parseProgramUsage
} from '../utils/traceUsage';
import {usageWithInstalls, usageWithoutInstalls} from './fixtures/traceUsage';

const ok = (body: unknown) => ({ok: true, json: async () => body} as unknown as Response);
const status = (code: number, text: string) => ({ok: false, status: code, statusText: text} as Response);
const fetchMock = () => fetch as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
    clearTraceUsageCache();
    vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.useRealTimers();
});

describe('getProgramUsage', () => {
    it('reads the public per-program endpoint and returns its figures', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok(usageWithInstalls())));
        expect(await getProgramUsage('roam')).toEqual(usageWithInstalls());
        expect(fetchMock().mock.calls[0][0]).toBe('https://trace.danielstephenson.dev/api/public/programs/roam');
    });

    it('keeps null installs as null rather than turning them into zeros', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok(usageWithoutInstalls())));
        const usage = await getProgramUsage('roam');
        expect(usage?.activeInstalls30d).toBeNull();
        expect(usage?.versions.map((v) => v.installs)).toEqual([null, null, null]);
    });

    it('can be pointed at another trace server', async () => {
        vi.stubEnv('TRACE_PUBLIC_URL', 'http://localhost:4010/');
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok(usageWithInstalls())));
        await getProgramUsage('Tic-Tac-Toe-Using-SDL');
        expect(fetchMock().mock.calls[0][0]).toBe('http://localhost:4010/api/public/programs/Tic-Tac-Toe-Using-SDL');
    });

    it('bounds the request with an abort signal', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok(usageWithInstalls())));
        await getProgramUsage('roam');
        expect(fetchMock().mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
    });

    it('resolves a 404 (endpoint not deployed yet) to undefined, quietly', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(status(404, 'Not Found')));
        expect(await getProgramUsage('roam')).toBeUndefined();
        expect(console.error).not.toHaveBeenCalled();
    });

    it('resolves a server error, a timeout and a malformed body to undefined', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(status(502, 'Bad Gateway')));
        expect(await getProgramUsage('A')).toBeUndefined();
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('The operation timed out.', 'TimeoutError')));
        expect(await getProgramUsage('B')).toBeUndefined();
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({application: 'C', startups30d: 'lots'})));
        expect(await getProgramUsage('C')).toBeUndefined();
    });

    it('serves a cached answer inside the TTL without asking trace again', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok(usageWithInstalls())));
        await getProgramUsage('roam');
        await getProgramUsage('roam');
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('caches a miss too, so a down or not-yet-deployed trace is not asked on every render', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(status(404, 'Not Found')));
        expect(await getProgramUsage('roam')).toBeUndefined();
        expect(await getProgramUsage('roam')).toBeUndefined();
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('keeps the last good answer when trace fails after the TTL, then re-fetches once it is back', async () => {
        vi.useFakeTimers();
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok(usageWithInstalls())));
        expect((await getProgramUsage('roam'))?.activeInstalls30d).toBe(57);

        vi.advanceTimersByTime(TRACE_CACHE_TTL_MS + 1);
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')));
        expect((await getProgramUsage('roam'))?.activeInstalls30d).toBe(57);

        vi.advanceTimersByTime(TRACE_CACHE_TTL_MS + 1);
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({...usageWithInstalls(), activeInstalls30d: 60})));
        expect((await getProgramUsage('roam'))?.activeInstalls30d).toBe(60);
    });
});

describe('parseProgramUsage', () => {
    it('rejects non-objects and missing arrays', () => {
        expect(parseProgramUsage(null)).toBeUndefined();
        expect(parseProgramUsage([])).toBeUndefined();
        expect(parseProgramUsage({...usageWithInstalls(), days: undefined})).toBeUndefined();
    });

    it('rejects a negative or non-numeric count anywhere', () => {
        expect(parseProgramUsage({...usageWithInstalls(), activeInstalls30d: -1})).toBeUndefined();
        expect(parseProgramUsage({...usageWithInstalls(), versions: [{version: '1', installs: null, startups: 'x'}]})).toBeUndefined();
        expect(parseProgramUsage({...usageWithInstalls(), days: [{day: '2026-10-01'}]})).toBeUndefined();
    });

    it('treats an absent activeInstalls30d as null', () => {
        const {activeInstalls30d: _omitted, ...rest} = usageWithInstalls();
        expect(parseProgramUsage(rest)?.activeInstalls30d).toBeNull();
    });
});

describe('getUsageSummary', () => {
    it('keeps each program name and last-seen time, and drops the raw event count', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok([
            {application: 'roam', count: 9000, lastSeen: '2026-10-03T00:00:00Z'},
            {nonsense: true},
        ])));
        expect(await getUsageSummary()).toEqual([{application: 'roam', lastSeen: '2026-10-03T00:00:00Z'}]);
        expect(fetchMock().mock.calls[0][0]).toBe('https://trace.danielstephenson.dev/api/public/summary');
    });

    it('resolves to undefined when trace cannot be reached, and caches that', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
        expect(await getUsageSummary()).toBeUndefined();
        expect(await getUsageSummary()).toBeUndefined();
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
