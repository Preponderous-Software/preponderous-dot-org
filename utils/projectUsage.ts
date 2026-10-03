// Every mapped project's trace figures, keyed by project id: what the /usage
// page renders and what /api/usage hands the browser for the home page's
// project grid. Server side only (utils/traceUsage.ts).
import type {Project} from './projects';
import {TRACE_PROGRAMS, traceReportingIds, type ProgramKind} from './traceNames';
import {getProgramUsage, getUsageSummary, type ProgramUsage} from './traceUsage';
import {rankUsage} from './usageDisplay';

/** trace's figures by project id; a project trace has nothing for is absent. */
export type ProjectUsageMap = Readonly<Record<string, ProgramUsage>>;

/**
 * One summary call says which programs trace has heard from at all, so a
 * project that has never reported costs no request of its own. When the
 * summary itself is unavailable every project is asked; each answer is
 * cached (utils/traceUsage.ts) and a failure just leaves the project out. The
 * summary's own counts are raw events, CI runs included, and are never shown.
 */
export async function loadProjectUsage(ids: readonly string[] = traceReportingIds()): Promise<ProjectUsageMap> {
    const summary = await getUsageSummary();
    const known = summary ? new Set(summary.map((row) => row.application)) : null;
    const mapped = ids.filter((id) => TRACE_PROGRAMS[id]);
    const usages = await Promise.all(mapped.map((id) => {
        const name = TRACE_PROGRAMS[id].name;
        return known && !known.has(name) ? Promise.resolve(undefined) : getProgramUsage(name);
    }));
    const byId: Record<string, ProgramUsage> = {};
    mapped.forEach((id, i) => {
        const usage = usages[i];
        if (usage) byId[id] = usage;
    });
    return byId;
}

/** One project on the /usage page. */
export interface UsageRow {
    project: Project;
    kind: ProgramKind;
    title: string;
    // Null when trace has no public figures for the project, or can't be reached.
    usage: ProgramUsage | null;
}

/** Every reporting project that is on the site, with its figures, in /usage order. */
export const usageRows = (projects: readonly Project[], usage: ProjectUsageMap): UsageRow[] =>
    rankUsage(traceReportingIds().flatMap((id) => {
        const project = projects.find((candidate) => candidate.id === id);
        return project
            ? [{project, kind: TRACE_PROGRAMS[id].kind, title: project.title, usage: usage[id] ?? null}]
            : [];
    }));
