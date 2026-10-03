import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {
    clearProjectUsageCache,
    fetchProjectUsage,
    loadProjectUsageInBrowser,
    parseProjectUsage,
} from '../utils/useProjectUsage';
import {usageWithoutInstalls} from './fixtures/traceUsage';

beforeEach(() => clearProjectUsageCache());
afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('parseProjectUsage', () => {
    it('keeps well-formed entries and drops anything else', () => {
        expect(parseProjectUsage({usage: {roam: usageWithoutInstalls(), fishe: {startups30d: 'many'}}}))
            .toEqual({roam: usageWithoutInstalls()});
        expect(parseProjectUsage(null)).toEqual({});
        expect(parseProjectUsage({usage: []})).toEqual({});
    });
});

describe('fetchProjectUsage', () => {
    it('reads this site\'s /api/usage, never trace directly', async () => {
        const fetchImpl = vi.fn().mockResolvedValue({ok: true, json: async () => ({usage: {}})});
        await fetchProjectUsage(fetchImpl as unknown as typeof fetch);
        expect(fetchImpl.mock.calls[0][0]).toBe('/api/usage');
    });

    it('resolves to an empty map on a failed request, a bad status or a bad body', async () => {
        expect(await fetchProjectUsage(vi.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch)).toEqual({});
        expect(await fetchProjectUsage(vi.fn().mockResolvedValue({ok: false}) as unknown as typeof fetch)).toEqual({});
        expect(await fetchProjectUsage(vi.fn().mockResolvedValue({ok: true, json: async () => 'x'}) as unknown as typeof fetch)).toEqual({});
    });
});

describe('loadProjectUsageInBrowser', () => {
    it('shares one request between readers, and does not keep an empty answer', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ok: true, json: async () => ({usage: {roam: usageWithoutInstalls()}})});
        vi.stubGlobal('fetch', fetchMock);
        await Promise.all([loadProjectUsageInBrowser(), loadProjectUsageInBrowser()]);
        expect(fetchMock).toHaveBeenCalledTimes(1);

        clearProjectUsageCache();
        const failing = vi.fn().mockResolvedValue({ok: false});
        vi.stubGlobal('fetch', failing);
        expect(await loadProjectUsageInBrowser()).toEqual({});
        await loadProjectUsageInBrowser();
        expect(failing).toHaveBeenCalledTimes(2);
    });
});
