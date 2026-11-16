// The pure part of scripts/refresh-releases.mjs, kept apart from its gh calls
// and file writes so __tests__/release-facts.test.ts can exercise it.

// `owner/name` from a project's githubLink, as `gh api repos/<repo>/...` wants it.
export const repoOfGithubLink = (githubLink) =>
    githubLink.replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '');

// One project's release facts from its GitHub releases, newest first as the
// API lists them ({tag, prerelease, draft} each). Drafts and the rolling `dev`
// prerelease are not releases; the latest stable tag is the first of the rest
// that is not a prerelease.
export const releaseFacts = (releases) => {
    const published = releases.filter((release) => !release.draft && release.tag !== 'dev');
    const stable = published.find((release) => !release.prerelease);
    return {releases: published.length, latestStable: stable ? stable.tag : null};
};
