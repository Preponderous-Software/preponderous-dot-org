import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {
    TRACE_CACHE_TTL_MS,
    clearTraceUsageCache,
    getProgramUsage,
    getUsageSummary,
    parseProgramUsage,
    parseSummary,
    traceBaseUrl
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

    it('fills in what a payload may leave out: lastSeen, the window, and a version\'s name and installs', () => {
        const {lastSeen: _lastSeen, window: _window, ...rest} = usageWithoutInstalls();
        const usage = parseProgramUsage({...rest, versions: [{startups: 3}]});
        expect(usage?.lastSeen).toBeNull();
        expect(usage?.window).toBe('P30D');
        expect(usage?.versions).toEqual([{version: null, installs: null, startups: 3}]);
    });

    it('falls back to the 30-day window when the window is not a string', () => {
        expect(parseProgramUsage({...usageWithInstalls(), window: 30})?.window).toBe('P30D');
    });

    it('keeps only the documented fields', () => {
        expect(parseProgramUsage({...usageWithInstalls(), count: 9000, secret: 'x'})).toEqual(usageWithInstalls());
    });

    it('rejects an unparseable lastSeen, a non-string version or day, and a row that is not an object', () => {
        expect(parseProgramUsage({...usageWithInstalls(), lastSeen: 'yesterday'})).toBeUndefined();
        expect(parseProgramUsage({...usageWithInstalls(), versions: [{version: 14, installs: null, startups: 1}]})).toBeUndefined();
        expect(parseProgramUsage({...usageWithInstalls(), versions: [null]})).toBeUndefined();
        expect(parseProgramUsage({...usageWithInstalls(), days: [{day: 20261001, startups: 1}]})).toBeUndefined();
        expect(parseProgramUsage({...usageWithInstalls(), days: ['2026-10-01']})).toBeUndefined();
    });

    it('rejects a non-finite count', () => {
        expect(parseProgramUsage({...usageWithInstalls(), startups30d: Infinity})).toBeUndefined();
        expect(parseProgramUsage({...usageWithInstalls(), startups30d: NaN})).toBeUndefined();
    });
});

describe('parseSummary', () => {
    it('rejects anything that is not an array', () => {
        expect(parseSummary(null)).toBeUndefined();
        expect(parseSummary({application: 'roam'})).toBeUndefined();
        expect(parseSummary('roam')).toBeUndefined();
    });

    it('drops rows that are not objects or have no string application', () => {
        expect(parseSummary([null, 'roam', 7, {application: 7}, {lastSeen: '2026-10-03T00:00:00Z'}, {application: 'roam'}]))
            .toEqual([{application: 'roam', lastSeen: null}]);
    });

    it('keeps a row whose lastSeen is unusable, with lastSeen null', () => {
        expect(parseSummary([
            {application: 'a', lastSeen: 'yesterday'},
            {application: 'b', lastSeen: 1696291200000},
            {application: 'c', lastSeen: null},
        ])).toEqual([
            {application: 'a', lastSeen: null},
            {application: 'b', lastSeen: null},
            {application: 'c', lastSeen: null},
        ]);
    });

    it('is an empty list for an empty array', () => {
        expect(parseSummary([])).toEqual([]);
    });
});

describe('traceBaseUrl', () => {
    it('defaults to the public trace server when TRACE_PUBLIC_URL is empty', () => {
        vi.stubEnv('TRACE_PUBLIC_URL', '');
        expect(traceBaseUrl()).toBe('https://trace.danielstephenson.dev');
    });

    it('uses TRACE_PUBLIC_URL as is when it has no trailing slash', () => {
        vi.stubEnv('TRACE_PUBLIC_URL', 'http://localhost:4010');
        expect(traceBaseUrl()).toBe('http://localhost:4010');
    });

    it('strips every trailing slash, but not a path', () => {
        vi.stubEnv('TRACE_PUBLIC_URL', 'http://localhost:4010/trace///');
        expect(traceBaseUrl()).toBe('http://localhost:4010/trace');
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
