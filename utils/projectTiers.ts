import type {CatalogueTier} from '@kingdom-community/community-site-kit/catalogue'
import type {Project, ProjectTierKey} from './projects'

// The home page lists projects in tiers, most complete first. A project's
// tier is the `tier` set by hand in projects.json when there is one (every
// game has one, shared with /play), and otherwise derived from its releases
// (pages/data/releases.json, refreshed by scripts/refresh-releases.mjs) and
// its status.

// One release's worth of facts per project id, as the refresh script writes them.
export interface ReleaseFacts {
    releases: number;
    latestStable: string | null;
}

export const PROJECT_TIERS: readonly CatalogueTier[] = [
    {key: 'complete', heading: 'Most complete', blurb: 'Projects with a steady record of releases: start here.'},
    {key: 'growing', heading: 'Active and growing', blurb: 'Released and in use, still being built out.'},
    {key: 'small', heading: 'Small projects & early work', blurb: 'Not yet released, in maintenance, or small by design.'},
]

// How many releases put an active project in the top tier.
export const COMPLETE_AT_RELEASES = 3

// Maintenance or never released: small. Active with COMPLETE_AT_RELEASES or
// more releases: complete. Anything else released: growing.
export const derivedProjectTier = (
    project: Pick<Project, 'status'>,
    facts: ReleaseFacts | undefined,
): ProjectTierKey => {
    const releases = facts?.releases ?? 0
    if (project.status === 'Maintenance' || releases === 0) return 'small'
    return releases >= COMPLETE_AT_RELEASES ? 'complete' : 'growing'
}

export const projectTier = (
    project: Pick<Project, 'id' | 'status' | 'tier'>,
    releases: Readonly<Record<string, ReleaseFacts>>,
): ProjectTierKey => project.tier ?? derivedProjectTier(project, releases[project.id])
