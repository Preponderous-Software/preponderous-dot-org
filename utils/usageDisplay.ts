// How trace's usage figures are put into words. Pure functions, so the
// labelling rules — the reason this exists — are pinned by unit tests. The
// same file as danielstephenson.dev's, ported from dansplugins.com
// (Dans-Plugins/dansplugins-dot-com#353) with the unit of a "start" chosen
// per project kind.
//
// The rules:
//  - A raw event count is never called users, players or installs. "Active
//    installs" appears only when trace counted distinct installs
//    (activeInstalls30d is a number).
//  - Otherwise a project gets "Last used <when>", plus its starts in the last
//    30 days, labelled as starts: "server starts" for a plugin, "launches" for
//    a game, plain "starts" for anything else.
//  - Version adoption is a share of active installs when trace has
//    per-version install counts, and a share of starts — labelled so — when
//    it does not.

import {relativeTimeFrom} from './relativeTime';
import type {ProgramKind} from './traceNames';
import type {ProgramUsage} from './traceUsage';

/** Where the figures come from and how they are collected; every usage view links it. */
export const TRACE_HOW_IT_WORKS_URL = 'https://github.com/Stephenson-Software/trace#usage-reporting';

/** How many versions get a bar of their own before the rest are grouped as "Other versions". */
export const TOP_VERSIONS = 5;

const plural = (n: number, one: string, many: string): string => `${n.toLocaleString('en-US')} ${n === 1 ? one : many}`;

/** One start of a program of this kind, singular and plural. */
export const START_UNITS: Readonly<Record<ProgramKind, {one: string; many: string}>> = {
    plugin: {one: 'server start', many: 'server starts'},
    game: {one: 'launch', many: 'launches'},
    program: {one: 'start', many: 'starts'},
};

/** "3 launches", "1 server start". */
export const startsCount = (starts: number, kind: ProgramKind): string =>
    plural(starts, START_UNITS[kind].one, START_UNITS[kind].many);

/** "12 launches in the last 30 days". */
export const startsLabel = (starts: number, kind: ProgramKind): string =>
    `${startsCount(starts, kind)} in the last 30 days`;

/** "Launches per day", for the sparkline's heading. */
export const perDayHeading = (kind: ProgramKind): string => {
    const many = START_UNITS[kind].many;
    return `${many.charAt(0).toUpperCase()}${many.slice(1)} per day`;
};

export interface UsageHeadline {
    // Distinct installs seen in the last 30 days, or null when trace cannot count installs yet.
    activeInstalls: number | null;
    // "Last used 3 days ago"; null when the project has no public use yet.
    lastUsed: string | null;
    // "12 launches in the last 30 days"; null when there were none.
    starts: string | null;
}

export function usageHeadline(usage: ProgramUsage, kind: ProgramKind, now: number): UsageHeadline {
    const activeInstalls = typeof usage.activeInstalls30d === 'number' ? usage.activeInstalls30d : null;
    const when = usage.lastSeen ? relativeTimeFrom(usage.lastSeen, now) : '';
    return {
        activeInstalls,
        lastUsed: when ? `Last used ${when}` : null,
        starts: usage.startups30d > 0 ? startsLabel(usage.startups30d, kind) : null,
    };
}

/** "57 active installs". */
export const activeInstallsLabel = (n: number): string => plural(n, 'active install', 'active installs');

export interface VersionShareRow {
    label: string;
    count: number;
    // 0..1, of the total across every row (including "Other versions").
    share: number;
}

export interface VersionShares {
    basis: 'installs' | 'starts';
    heading: string;
    rows: VersionShareRow[];
}

/** "41 installs" / "300 launches": what a version row's count counts. */
export const versionCountLabel = (shares: Pick<VersionShares, 'basis'>, n: number, kind: ProgramKind): string =>
    shares.basis === 'installs' ? plural(n, 'install', 'installs') : startsCount(n, kind);

/**
 * Version adoption, largest first, the top five and then everything else as
 * one "Other versions" row. Null when there is nothing to divide up.
 */
export function versionShares(usage: ProgramUsage, kind: ProgramKind): VersionShares | null {
    // Install counts per version only mean something once the program sends
    // an install ID, which is exactly when the headline figure exists too.
    const byInstalls = typeof usage.activeInstalls30d === 'number'
        && usage.versions.some((v) => typeof v.installs === 'number');
    const counted = usage.versions
        .map((v) => ({
            label: v.version ?? 'Unknown version',
            count: byInstalls ? (v.installs ?? 0) : v.startups,
        }))
        .filter((row) => row.count > 0)
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    const total = counted.reduce((sum, row) => sum + row.count, 0);
    if (total === 0) {
        return null;
    }
    const top = counted.slice(0, TOP_VERSIONS);
    const rest = counted.slice(TOP_VERSIONS).reduce((sum, row) => sum + row.count, 0);
    const rows = rest > 0 ? [...top, {label: 'Other versions', count: rest}] : top;
    return {
        basis: byInstalls ? 'installs' : 'starts',
        heading: byInstalls
            ? 'Versions in use, by share of active installs'
            : `Versions in use, by share of ${START_UNITS[kind].many}`,
        rows: rows.map((row) => ({...row, share: row.count / total})),
    };
}

/** "72%", or "<1%" for a sliver that would otherwise round to a misleading 0%. */
export const percentLabel = (share: number): string =>
    share > 0 && share < 0.005 ? '<1%' : `${Math.round(share * 100)}%`;

export interface RankableUsage {
    title: string;
    usage: ProgramUsage | null;
}

/**
 * The /usage page's order: projects with an install count first (most
 * installs first), then the rest by how recently they were last used, then
 * projects trace has nothing for, alphabetically. Never by raw starts, which
 * would rank a project by how often its few users restart it.
 */
export function rankUsage<T extends RankableUsage>(rows: readonly T[]): T[] {
    const installs = (r: T) => (typeof r.usage?.activeInstalls30d === 'number' ? r.usage.activeInstalls30d : null);
    const seen = (r: T) => {
        const t = r.usage?.lastSeen ? new Date(r.usage.lastSeen).getTime() : NaN;
        return Number.isNaN(t) ? null : t;
    };
    return [...rows].sort((a, b) => {
        const ia = installs(a);
        const ib = installs(b);
        if (ia !== null || ib !== null) {
            if (ia === null) return 1;
            if (ib === null) return -1;
            if (ia !== ib) return ib - ia;
        }
        const ta = seen(a);
        const tb = seen(b);
        if (ta !== null || tb !== null) {
            if (ta === null) return 1;
            if (tb === null) return -1;
            if (ta !== tb) return tb - ta;
        }
        return a.title.localeCompare(b.title);
    });
}
