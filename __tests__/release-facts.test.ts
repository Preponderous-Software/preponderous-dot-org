import { describe, expect, it } from 'vitest';
import projectData from '../pages/data/projects.json';
import { releaseFacts, repoOfGithubLink } from '../scripts/release-facts.mjs';

const release = (tag: string, flags: { prerelease?: boolean; draft?: boolean } = {}) => ({
    tag,
    prerelease: flags.prerelease ?? false,
    draft: flags.draft ?? false,
});

describe('releaseFacts', () => {
    it('counts nothing and has no stable tag for a repository with no releases', () => {
        expect(releaseFacts([])).toEqual({ releases: 0, latestStable: null });
    });

    it('counts every published release and takes the first stable one as the latest', () => {
        const releases = [release('v1.2.0'), release('v1.1.0'), release('v1.0.0')];
        expect(releaseFacts(releases)).toEqual({ releases: 3, latestStable: 'v1.2.0' });
    });

    it('does not count the rolling dev prerelease', () => {
        expect(releaseFacts([release('dev', { prerelease: true })])).toEqual({ releases: 0, latestStable: null });
        expect(releaseFacts([release('dev', { prerelease: true }), release('v0.1.0')]))
            .toEqual({ releases: 1, latestStable: 'v0.1.0' });
    });

    it('drops a tag named dev even when it is not marked as a prerelease', () => {
        expect(releaseFacts([release('dev'), release('v2.0.0')])).toEqual({ releases: 1, latestStable: 'v2.0.0' });
    });

    it('does not count drafts, even stable-looking ones', () => {
        expect(releaseFacts([release('v3.0.0', { draft: true }), release('v2.9.0')]))
            .toEqual({ releases: 1, latestStable: 'v2.9.0' });
    });

    it('counts other prereleases but skips them for the latest stable tag', () => {
        const releases = [release('v2.0.0-rc.1', { prerelease: true }), release('v1.9.0')];
        expect(releaseFacts(releases)).toEqual({ releases: 2, latestStable: 'v1.9.0' });
    });

    it('has no stable tag when every published release is a prerelease', () => {
        const releases = [release('v0.2.0-beta', { prerelease: true }), release('v0.1.0-alpha', { prerelease: true })];
        expect(releaseFacts(releases)).toEqual({ releases: 2, latestStable: null });
    });

    it('takes the latest stable tag in the order given rather than by version', () => {
        expect(releaseFacts([release('v1.0.0'), release('v9.0.0')]).latestStable).toBe('v1.0.0');
    });
});

describe('repoOfGithubLink', () => {
    it('strips the github.com origin', () => {
        expect(repoOfGithubLink('https://github.com/Preponderous-Software/Roam')).toBe('Preponderous-Software/Roam');
    });

    it('strips one trailing slash', () => {
        expect(repoOfGithubLink('https://github.com/Preponderous-Software/Roam/')).toBe('Preponderous-Software/Roam');
    });

    it('turns every showcased project link into an owner/name pair', () => {
        for (const project of projectData.projects) {
            expect(repoOfGithubLink(project.githubLink), project.id).toMatch(/^[\w.-]+\/[\w.-]+$/);
        }
    });
});
