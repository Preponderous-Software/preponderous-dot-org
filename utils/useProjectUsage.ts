import React from 'react';
import type {ProjectUsageMap} from './projectUsage';
import {parseProgramUsage} from './traceUsage';

export const PROJECT_USAGE_PATH = '/api/usage';

const NONE: ProjectUsageMap = {};

/** The /api/usage body, keeping only well-formed entries; empty for anything else. */
export const parseProjectUsage = (body: unknown): ProjectUsageMap => {
    const usage = (body as {usage?: unknown} | null)?.usage;
    if (!usage || typeof usage !== 'object' || Array.isArray(usage)) return NONE;
    const byId: Record<string, NonNullable<ReturnType<typeof parseProgramUsage>>> = {};
    for (const [id, value] of Object.entries(usage as Record<string, unknown>)) {
        const parsed = parseProgramUsage(value);
        if (parsed) byId[id] = parsed;
    }
    return byId;
};

/** Fetches /api/usage; resolves to an empty map on any failure, never rejects. */
export const fetchProjectUsage = async (fetchImpl: typeof fetch | undefined = globalThis.fetch): Promise<ProjectUsageMap> => {
    try {
        if (typeof fetchImpl !== 'function') return NONE;
        const response = await fetchImpl(PROJECT_USAGE_PATH, {headers: {accept: 'application/json'}});
        if (!response.ok) return NONE;
        return parseProjectUsage(await response.json());
    } catch {
        return NONE;
    }
};

// One request per page however many components read it, kept for a minute;
// an empty answer (a failure, or trace with nothing yet) is not kept.
const USAGE_TTL_MS = 60_000;
let shared: {at: number; usage: Promise<ProjectUsageMap>} | null = null;

/** Test hook: forget the shared request. */
export const clearProjectUsageCache = (): void => {
    shared = null;
};

export const loadProjectUsageInBrowser = (): Promise<ProjectUsageMap> => {
    if (shared && Date.now() - shared.at < USAGE_TTL_MS) return shared.usage;
    const usage = fetchProjectUsage().then((map) => {
        if (Object.keys(map).length === 0) shared = null;
        return map;
    });
    shared = {at: Date.now(), usage};
    return usage;
};

// Every reporting project's figures, fetched once in the browser after the
// page has rendered. Empty until they arrive, and stays empty if the fetch
// fails: the page renders the same either way, only without usage lines.
export const useProjectUsage = (): ProjectUsageMap => {
    const [usage, setUsage] = React.useState<ProjectUsageMap>(NONE);
    React.useEffect(() => {
        let live = true;
        loadProjectUsageInBrowser().then((map) => {
            if (live) setUsage(map);
        });
        return () => {
            live = false;
        };
    }, []);
    return usage;
};
