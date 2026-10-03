// "3 days ago" from an ISO timestamp and the render's clock. `now` is passed
// in rather than read, so the function is pure and testable, and a server
// render and its hydration agree. Same formatter as dansplugins.com's
// utils/relativeTime.ts. Returns '' for an unparseable timestamp.
export const relativeTimeFrom = (iso: string, now: number): string => {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) {
        return '';
    }
    const seconds = Math.round((now - then) / 1000);
    if (seconds < 60) {
        return 'just now';
    }
    const units: [number, string][] = [
        [60, 'minute'],
        [60, 'hour'],
        [24, 'day'],
    ];
    let value = seconds;
    let unit = 'second';
    for (const [size, name] of units) {
        if (value < size) {
            break;
        }
        value = Math.round(value / size);
        unit = name;
    }
    return `${value} ${unit}${value === 1 ? '' : 's'} ago`;
};
