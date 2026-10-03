import {describe, expect, it} from 'vitest';
import {
    perDayHeading,
    percentLabel,
    rankUsage,
    startsLabel,
    usageHeadline,
    versionCountLabel,
    versionShares,
} from '../utils/usageDisplay';
import type {ProgramUsage} from '../utils/traceUsage';
import {usageWithInstalls, usageWithoutInstalls} from './fixtures/traceUsage';

const NOW = Date.parse('2026-10-03T16:00:00Z');

describe('usageHeadline', () => {
    it('counts active installs only when trace counted distinct installs', () => {
        expect(usageHeadline(usageWithInstalls(), 'game', NOW).activeInstalls).toBe(57);
    });

    it('never presents starts as installs or people when installs are null', () => {
        const headline = usageHeadline(usageWithoutInstalls(), 'game', NOW);
        expect(headline.activeInstalls).toBeNull();
        expect(headline.lastUsed).toBe('Last used 2 days ago');
        expect(headline.starts).toBe('412 launches in the last 30 days');
        for (const text of [headline.lastUsed, headline.starts]) {
            expect(text).not.toMatch(/install|user|player|people/i);
        }
    });

    it('words a start by what the project is', () => {
        expect(usageHeadline(usageWithoutInstalls(), 'plugin', NOW).starts).toBe('412 server starts in the last 30 days');
        expect(usageHeadline(usageWithoutInstalls(), 'game', NOW).starts).toBe('412 launches in the last 30 days');
        expect(usageHeadline(usageWithoutInstalls(), 'program', NOW).starts).toBe('412 starts in the last 30 days');
    });

    it('omits the starts line when there were none, and handles a project never seen', () => {
        const quiet: ProgramUsage = {...usageWithoutInstalls(), startups30d: 0, lastSeen: null, days: []};
        expect(usageHeadline(quiet, 'program', NOW)).toEqual({activeInstalls: null, lastUsed: null, starts: null});
    });

    it('labels a single start in the singular', () => {
        expect(startsLabel(1, 'game')).toBe('1 launch in the last 30 days');
        expect(startsLabel(1, 'plugin')).toBe('1 server start in the last 30 days');
        expect(startsLabel(1234, 'program')).toBe('1,234 starts in the last 30 days');
    });

    it('heads the sparkline with the same unit', () => {
        expect(perDayHeading('game')).toBe('Launches per day');
        expect(perDayHeading('plugin')).toBe('Server starts per day');
        expect(perDayHeading('program')).toBe('Starts per day');
    });
});

describe('versionShares', () => {
    it('divides active installs by version when installs are present', () => {
        const shares = versionShares(usageWithInstalls(), 'game')!;
        expect(shares.basis).toBe('installs');
        expect(shares.heading).toBe('Versions in use, by share of active installs');
        expect(shares.rows.map((r) => [r.label, r.count])).toEqual([['0.14.0', 41], ['0.13.0', 10], ['Unknown version', 6]]);
        expect(versionCountLabel(shares, 41, 'game')).toBe('41 installs');
    });

    it('divides starts by version, and says so in the project\'s own unit, when installs are null', () => {
        const shares = versionShares(usageWithoutInstalls(), 'game')!;
        expect(shares.basis).toBe('starts');
        expect(shares.heading).toBe('Versions in use, by share of launches');
        expect(shares.rows.map((r) => r.count)).toEqual([300, 80, 32]);
        expect(versionCountLabel(shares, 300, 'game')).toBe('300 launches');
        expect(versionCountLabel(shares, 1, 'plugin')).toBe('1 server start');
    });

    it('falls back to starts when the headline has an install count but no version does', () => {
        const mixed: ProgramUsage = {...usageWithoutInstalls(), activeInstalls30d: 12};
        expect(versionShares(mixed, 'program')!.basis).toBe('starts');
    });

    it('shows the top five and groups the rest as other versions', () => {
        const many: ProgramUsage = {
            ...usageWithoutInstalls(),
            versions: [1, 2, 3, 4, 5, 6, 7].map((n) => ({version: `1.${n}`, installs: null, startups: n * 10})),
        };
        const shares = versionShares(many, 'program')!;
        expect(shares.rows.map((r) => r.label)).toEqual(['1.7', '1.6', '1.5', '1.4', '1.3', 'Other versions']);
        expect(shares.rows[5].count).toBe(30);
        expect(shares.rows.reduce((sum, r) => sum + r.share, 0)).toBeCloseTo(1);
    });

    it('is null when there is nothing to divide', () => {
        expect(versionShares({...usageWithoutInstalls(), versions: []}, 'game')).toBeNull();
    });
});

describe('percentLabel', () => {
    it('rounds, but never shows a real sliver as 0%', () => {
        expect(percentLabel(0.7234)).toBe('72%');
        expect(percentLabel(0.001)).toBe('<1%');
        expect(percentLabel(0)).toBe('0%');
    });
});

describe('rankUsage', () => {
    const row = (title: string, usage: Partial<ProgramUsage> | null) => ({
        title,
        usage: usage ? {...usageWithoutInstalls(), ...usage} : null,
    });

    it('puts install counts first, then recency, then projects without figures, never by raw starts', () => {
        const ranked = rankUsage([
            row('Nothing', null),
            row('OldButBusy', {lastSeen: '2026-09-01T00:00:00Z', startups30d: 99999}),
            row('Recent', {lastSeen: '2026-10-03T00:00:00Z', startups30d: 3}),
            row('FewInstalls', {activeInstalls30d: 2}),
            row('ManyInstalls', {activeInstalls30d: 40}),
            row('NeverSeen', {lastSeen: null}),
        ]);
        expect(ranked.map((r) => r.title)).toEqual(['ManyInstalls', 'FewInstalls', 'Recent', 'OldButBusy', 'NeverSeen', 'Nothing']);
    });
});
