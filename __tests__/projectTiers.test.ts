import { describe, expect, it } from 'vitest';
import projectData from '../pages/data/projects.json';
import releaseData from '../pages/data/releases.json';
import { COMPLETE_AT_RELEASES, derivedProjectTier, PROJECT_TIERS, projectTier, type ReleaseFacts } from '../utils/projectTiers';
import type { Project } from '../utils/projects';

const projects = projectData.projects as Project[];
const releases = releaseData as Record<string, ReleaseFacts>;

describe('derivedProjectTier', () => {
    const facts = (count: number): ReleaseFacts => ({ releases: count, latestStable: null });

    it('is complete for an active project with enough releases', () => {
        expect(derivedProjectTier({ status: 'Active' }, facts(COMPLETE_AT_RELEASES))).toBe('complete');
    });

    it('is growing for an active project with fewer releases', () => {
        expect(derivedProjectTier({ status: 'Active' }, facts(1))).toBe('growing');
    });

    it('is small for a project never released, unknown, or in maintenance', () => {
        expect(derivedProjectTier({ status: 'Active' }, facts(0))).toBe('small');
        expect(derivedProjectTier({ status: 'Active' }, undefined)).toBe('small');
        expect(derivedProjectTier({ status: 'Maintenance' }, facts(40))).toBe('small');
    });
});

describe('projectTier', () => {
    it('takes a hand-set tier over the derived one', () => {
        expect(projectTier({ id: 'x', status: 'Maintenance', tier: 'complete' }, {})).toBe('complete');
    });

    it('names a known tier for every project', () => {
        const keys = PROJECT_TIERS.map((tier) => tier.key);
        for (const project of projects) {
            expect(keys, project.id).toContain(projectTier(project, releases));
        }
    });
});

describe('releases.json', () => {
    it('only names projects that exist, with sane counts', () => {
        const ids = new Set(projects.map((project) => project.id));
        for (const [id, fact] of Object.entries(releases)) {
            expect(ids.has(id), id).toBe(true);
            expect(Number.isInteger(fact.releases) && fact.releases >= 0, id).toBe(true);
        }
    });
});
