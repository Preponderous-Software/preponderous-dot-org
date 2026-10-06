// Which trace program each project on this site reports as, and what one of
// its "starts" is. trace (https://danielstephenson.dev/usage-reporting) names
// a program by the `application` its client sends, which is the program's own
// name rather than this site's project id, so the two are paired here. The
// registered names are listed in trace's docs/CONSUMERS.md.
//
// Only programs people run are mapped. Left out on purpose:
//  - Barony and Viron: services, which report tagged `service`, and Barony's
//    web client reports page views; trace's public figures exclude both, so
//    they would only ever show "no figures";
//  - the websites (danielstephenson.dev, dansplugins.com): page views too;
//  - the libraries (env-lib-cpp, py-env-lib, tak), which run inside other
//    programs and report nothing of their own. tak's games report as
//    themselves (Tidewater, Overwinter).
//
// Same map, keyed by the same ids where they match, as danielstephenson.dev's
// utils/traceNames.ts.

/**
 * What one start of the program is, which decides the wording: a game's
 * start is someone launching it, anything else is just a start. ('plugin',
 * a Minecraft server starting, is unused here but kept so utils/usageDisplay.ts
 * stays the same file as on the sibling sites.)
 */
export type ProgramKind = 'plugin' | 'game' | 'program';

export interface TraceProgram {
    name: string;
    kind: ProgramKind;
}

const game = (name: string): TraceProgram => ({name, kind: 'game'});
const program = (name: string): TraceProgram => ({name, kind: 'program'});

// Keyed by the project's `id` in pages/data/projects.json; a test fails if a
// key here is not a project there.
export const TRACE_PROGRAMS: Readonly<Record<string, TraceProgram>> = {
    'beyond-nations': game('beyond-nations'),
    'fishe': game('FishE'),
    'ophidian': game('ophidian'),
    'overwinter': game('Overwinter'),
    'roam': game('roam'),
    'tidewater': game('Tidewater'),

    // The repository is now Preponderous-Software/apex; its program is `apex`.
    'apex-ecosystem-simulator': program('apex'),
    'artificial-consciousness-simulation-framework': program('artificial-consciousness-simulation-framework'),
    'microbiome': program('microbiome'),
    'patchwork': program('patchwork'),
};

/** The trace program a project reports as, or undefined for one that does not report. */
export const traceProgramFor = (projectId: string): TraceProgram | undefined =>
    Object.prototype.hasOwnProperty.call(TRACE_PROGRAMS, projectId) ? TRACE_PROGRAMS[projectId] : undefined;

/** Every project id that reports to trace, alphabetical. */
export const traceReportingIds = (): string[] => Object.keys(TRACE_PROGRAMS).sort();
