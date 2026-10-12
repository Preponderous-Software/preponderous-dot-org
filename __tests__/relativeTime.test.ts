import { describe, expect, it } from 'vitest';
import { relativeTimeFrom } from '../utils/relativeTime';

const NOW = Date.parse('2026-10-12T12:00:00Z');
const ago = (seconds: number) => new Date(NOW - seconds * 1000).toISOString();

describe('relativeTimeFrom', () => {
    it('says "just now" for anything under a minute old', () => {
        expect(relativeTimeFrom(ago(0), NOW)).toBe('just now');
        expect(relativeTimeFrom(ago(59), NOW)).toBe('just now');
    });

    it('says "just now" for a timestamp in the future rather than a negative age', () => {
        expect(relativeTimeFrom(ago(-3600), NOW)).toBe('just now');
    });

    it('counts minutes from a minute up, singular for one', () => {
        expect(relativeTimeFrom(ago(60), NOW)).toBe('1 minute ago');
        expect(relativeTimeFrom(ago(5 * 60), NOW)).toBe('5 minutes ago');
    });

    it('rounds to the nearest unit rather than truncating', () => {
        expect(relativeTimeFrom(ago(90), NOW)).toBe('2 minutes ago');
        expect(relativeTimeFrom(ago(89), NOW)).toBe('1 minute ago');
    });

    it('moves up to hours once the minutes round to sixty', () => {
        expect(relativeTimeFrom(ago(3600), NOW)).toBe('1 hour ago');
        expect(relativeTimeFrom(ago(3570), NOW)).toBe('1 hour ago');
        expect(relativeTimeFrom(ago(23 * 3600), NOW)).toBe('23 hours ago');
    });

    it('moves up to days, and stays in days however old the timestamp is', () => {
        expect(relativeTimeFrom(ago(24 * 3600), NOW)).toBe('1 day ago');
        expect(relativeTimeFrom(ago(3 * 24 * 3600), NOW)).toBe('3 days ago');
        expect(relativeTimeFrom(ago(400 * 24 * 3600), NOW)).toBe('400 days ago');
    });

    it('returns an empty string for an unparseable timestamp', () => {
        expect(relativeTimeFrom('not-a-date', NOW)).toBe('');
        expect(relativeTimeFrom('', NOW)).toBe('');
    });
});
