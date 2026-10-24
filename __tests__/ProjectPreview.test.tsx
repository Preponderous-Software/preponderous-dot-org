// A project's 3D preview in its details: a still, a muted looping clip in its
// place unless the visitor asks for reduced motion, a pause button, and a
// credit for the tool that drew it. Also holds every preview in projects.json
// to files that exist, at 16:10, within budget.
import React from 'react';
import fs from 'fs';
import path from 'path';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import ProjectDetails from '../components/ProjectDetails';
import projectData from '../pages/data/projects.json';
import type {Project, ProjectPreviewData} from '../utils/projects';

const PREVIEW: ProjectPreviewData = {
    poster: '/previews/example/poster.jpg',
    clip: {webm: '/previews/example/clip.webm', mp4: '/previews/example/clip.mp4'},
    alt: 'Coloured territories spreading over a generated map.',
    madeWith: {name: 'replay-player', url: 'https://github.com/Preponderous-Software/replay-player'},
    more: 'https://danielstephenson.dev/projects/example',
    moreLabel: 'Play the replay in 3D',
};

const project: Project = {
    id: 'example',
    title: 'Example',
    description: 'An example.',
    githubLink: 'https://github.com/Preponderous-Software/example',
    technology: 'C#',
    preview: PREVIEW,
};

const media = (...queries: string[]) => vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: queries.includes(query), media: query,
    addEventListener: () => {}, removeEventListener: () => {},
})));

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('ProjectPreview', () => {
    it('plays the clip, muted and inline, with the still as its poster, and names it for screen readers', () => {
        media();
        render(<ProjectDetails project={project}/>);
        const video = screen.getByTestId('project-preview-video') as HTMLVideoElement;
        expect(video).toHaveAttribute('poster', PREVIEW.poster);
        expect(video.muted).toBe(true);
        expect(video).toHaveAttribute('playsinline');
        expect(video).toHaveAttribute('loop');
        expect(video.querySelector('source[type="video/webm"]')).toHaveAttribute('src', PREVIEW.clip?.webm);
        expect(video.querySelector('source[type="video/mp4"]')).toHaveAttribute('src', PREVIEW.clip?.mp4);
        expect(screen.getByRole('img', {name: PREVIEW.alt})).toBeInTheDocument();
    });

    it('has a pause button that toggles', () => {
        media();
        render(<ProjectDetails project={project}/>);
        fireEvent.click(screen.getByRole('button', {name: 'Pause the clip'}));
        expect(screen.getByRole('button', {name: 'Play the clip'})).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows only the still for a visitor who asks for reduced motion', () => {
        media('(prefers-reduced-motion: reduce)');
        render(<ProjectDetails project={project}/>);
        expect(screen.queryByTestId('project-preview-video')).not.toBeInTheDocument();
        expect(screen.getByTestId('project-preview-poster')).toHaveAttribute('src', PREVIEW.poster);
        expect(screen.queryByRole('button', {name: /clip/})).not.toBeInTheDocument();
    });

    it('credits the tool and links to more', () => {
        media();
        render(<ProjectDetails project={project}/>);
        expect(screen.getByTestId('project-preview-credit')).toHaveTextContent('Drawn by replay-player · Play the replay in 3D');
        expect(screen.getByRole('link', {name: 'replay-player'})).toHaveAttribute('href', PREVIEW.madeWith.url);
        expect(screen.getByRole('link', {name: 'Play the replay in 3D'})).toHaveAttribute('href', PREVIEW.more);
    });

    it('is absent for a project without one', () => {
        render(<ProjectDetails project={{...project, preview: undefined}}/>);
        expect(screen.queryByTestId('project-preview')).not.toBeInTheDocument();
    });
});

const PUBLIC = path.join(__dirname, '..', 'public');
const file = (url: string) => path.join(PUBLIC, ...url.split('/').filter(Boolean));
const jpegSize = (name: string): [number, number] => {
    const data = fs.readFileSync(name);
    let at = 2;
    while (at < data.length) {
        const marker = data[at + 1];
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
            return [data.readUInt16BE(at + 7), data.readUInt16BE(at + 5)];
        }
        at += 2 + data.readUInt16BE(at + 2);
    }
    throw new Error(`no SOF marker in ${name}`);
};

describe('the previews in projects.json', () => {
    const withPreviews = (projectData.projects as Project[]).filter((entry) => entry.preview);

    it('has some', () => {
        expect(withPreviews.length).toBeGreaterThan(0);
    });

    for (const entry of withPreviews) {
        const preview = entry.preview as ProjectPreviewData;
        it(`${entry.id}: lives in public/previews/${entry.id}/, 16:10 and within budget, with a credited tool`, () => {
            const dir = `/previews/${entry.id}/`;
            expect(preview.poster).toBe(`${dir}poster.jpg`);
            expect(fs.statSync(file(preview.poster)).size).toBeLessThanOrEqual(100 * 1024);
            const [width, height] = jpegSize(file(preview.poster));
            expect(width / height).toBeCloseTo(1.6, 1);
            if (preview.clip?.webm) {
                expect(preview.clip.webm).toBe(`${dir}clip.webm`);
                expect(fs.statSync(file(preview.clip.webm)).size).toBeLessThanOrEqual(320 * 1024);
            }
            if (preview.clip?.mp4) {
                expect(preview.clip.mp4).toBe(`${dir}clip.mp4`);
                expect(fs.statSync(file(preview.clip.mp4)).size).toBeLessThanOrEqual(420 * 1024);
            }
            for (const name of fs.readdirSync(file(dir))) {
                expect(['poster.jpg', 'clip.webm', 'clip.mp4', 'PROVENANCE.json']).toContain(name);
            }
            expect(preview.alt.trim().length).toBeGreaterThan(20);
            expect(preview.madeWith.url).toMatch(/^https:\/\/github\.com\//);
            const provenance = JSON.parse(fs.readFileSync(path.join(file(dir), 'PROVENANCE.json'), 'utf8'));
            expect(provenance.source_repo).toMatch(/^https:\/\/github\.com\//);
            expect(provenance.commit).toMatch(/^[0-9a-f]{40}$/);
            expect(provenance.tool).toBeTruthy();
        });
    }
});
