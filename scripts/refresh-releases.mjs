// Refreshes pages/data/releases.json: each project's release count and its
// latest stable (non-prerelease) tag, read from GitHub with the gh CLI. These
// are the facts a project's derived tier is worked out from (see
// utils/projectTiers.ts). Run by hand when releases have moved:
//
//     node scripts/refresh-releases.mjs
import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';

const projects = JSON.parse(readFileSync('pages/data/projects.json', 'utf8')).projects;
const out = {};
for (const project of projects) {
    const repo = project.githubLink.replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '');
    try {
        const releases = JSON.parse(execFileSync('gh', [
            'api', `repos/${repo}/releases?per_page=100`, '-q', '[.[] | {tag: .tag_name, prerelease, draft}]',
        ], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']}));
        const published = releases.filter((release) => !release.draft);
        const stable = published.find((release) => !release.prerelease);
        out[project.id] = {releases: published.length, latestStable: stable ? stable.tag : null};
    } catch {
        console.error(`${project.id}: could not read releases of ${repo}; left out`);
    }
}
writeFileSync('pages/data/releases.json', JSON.stringify(out, null, 4) + '\n');
console.log(`${Object.keys(out).length} of ${projects.length} projects written`);
