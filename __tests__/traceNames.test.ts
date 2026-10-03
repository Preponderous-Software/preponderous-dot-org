import {describe, expect, it} from 'vitest';
import projectData from '../pages/data/projects.json';
import {TRACE_PROGRAMS, traceProgramFor, traceReportingIds} from '../utils/traceNames';

const projectIds = new Set(projectData.projects.map((project) => project.id));

describe('trace programs', () => {
    it('maps only projects that are on the site', () => {
        for (const id of Object.keys(TRACE_PROGRAMS)) {
            expect(projectIds.has(id), id).toBe(true);
        }
    });

    it('gives every project its own program', () => {
        const names = Object.values(TRACE_PROGRAMS).map((program) => program.name);
        expect(new Set(names).size).toBe(names.length);
    });

    it('resolves a project to the name it reports as, and what one of its starts is', () => {
        expect(traceProgramFor('fishe')).toEqual({name: 'FishE', kind: 'game'});
        expect(traceProgramFor('roam')).toEqual({name: 'roam', kind: 'game'});
        expect(traceProgramFor('apex-ecosystem-simulator')).toEqual({name: 'apex', kind: 'program'});
        expect(traceProgramFor('patchwork')).toEqual({name: 'patchwork', kind: 'program'});
    });

    it('leaves out services, websites and libraries, whose events trace keeps out of its public figures', () => {
        for (const id of ['barony', 'viron', 'daniel-stephenson', 'dans-plugins-community', 'tak', 'py-env-lib', 'env-lib-cpp']) {
            expect(traceProgramFor(id), id).toBeUndefined();
        }
        expect(traceProgramFor('toString')).toBeUndefined();
    });

    it('lists the reporting projects alphabetically', () => {
        const ids = traceReportingIds();
        expect(ids).toEqual([...ids].sort());
        expect(ids).toHaveLength(10);
    });
});
