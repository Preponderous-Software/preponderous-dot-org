// Characterizes the 30-day sparkline drawn on /usage: its accessible summary,
// its visible labels, and the line it plots, including the windows the usage
// page filters out before drawing (no days, nothing but zeros).
import React from 'react';
import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import StartsSparkline from '../components/StartsSparkline';
import type {DailyStarts} from '../utils/traceUsage';

const days = (...startups: number[]): DailyStarts[] =>
    startups.map((n, i) => ({day: `2026-09-${String(i + 1).padStart(2, '0')}`, startups: n}));

const svgOf = (container: HTMLElement) => container.querySelector('svg')!;
const pathsOf = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('path')).map((path) => path.getAttribute('d'));

describe('StartsSparkline', () => {
    it('renders nothing for an empty window', () => {
        const {container} = render(<StartsSparkline days={[]} kind="plugin"/>);
        expect(container).toBeEmptyDOMElement();
    });

    it('sums the window and names the first peak in its accessible name, in the kind\'s unit', () => {
        render(<StartsSparkline days={days(3, 7, 7, 1)} kind="plugin"/>);
        expect(screen.getByRole('img')).toHaveAttribute(
            'aria-label',
            'Server starts per day from Sep 1 to Sep 4: 18 in total, peaking at 7 on Sep 2.',
        );
    });

    it('shows the first day, the peak and the last day under the line', () => {
        render(<StartsSparkline days={days(3, 7, 7, 1)} kind="game"/>);
        expect(screen.getByTestId('starts-sparkline')).toHaveTextContent('Sep 1Peak 7 on Sep 2Sep 4');
    });

    it('plots each day across the full width, scaled so the peak touches the top', () => {
        const {container} = render(<StartsSparkline days={days(3, 7, 7, 1)} kind="program"/>);
        const line = 'M0.0,27.1 L100.0,2.0 L200.0,2.0 L300.0,39.7';
        expect(pathsOf(container)).toEqual([`${line} L300,48 L0,48 Z`, line]);
    });

    it('draws a window of zeros flat along the bottom, with no peak', () => {
        const {container} = render(<StartsSparkline days={days(0, 0)} kind="game"/>);
        expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Launches per day from Sep 1 to Sep 2: 0 in total.');
        expect(screen.getByTestId('starts-sparkline')).not.toHaveTextContent('Peak');
        expect(pathsOf(container)[1]).toBe('M0.0,46.0 L300.0,46.0');
    });

    it('draws a single day as one point at the top', () => {
        const {container} = render(<StartsSparkline days={days(5)} kind="program"/>);
        expect(screen.getByRole('img')).toHaveAttribute(
            'aria-label',
            'Starts per day from Sep 1 to Sep 1: 5 in total, peaking at 5 on Sep 1.',
        );
        expect(pathsOf(container)[1]).toBe('M0.0,2.0');
    });

    it('groups thousands in the summary and the peak label', () => {
        render(<StartsSparkline days={days(1234, 10)} kind="plugin"/>);
        expect(screen.getByRole('img').getAttribute('aria-label')).toContain('1,244 in total, peaking at 1,234 on Sep 1.');
        expect(screen.getByTestId('starts-sparkline')).toHaveTextContent('Peak 1,234 on Sep 1');
    });

    it('falls back to the raw day string when it is not a date', () => {
        render(<StartsSparkline days={[{day: 'not-a-date', startups: 2}]} kind="program"/>);
        expect(screen.getByRole('img').getAttribute('aria-label')).toBe(
            'Starts per day from not-a-date to not-a-date: 2 in total, peaking at 2 on not-a-date.',
        );
    });

    it('hides the labels when asked, keeping the accessible summary', () => {
        render(<StartsSparkline days={days(3, 7)} kind="game" showLabels={false}/>);
        expect(screen.getByTestId('starts-sparkline').textContent).toBe('');
        expect(screen.getByRole('img').getAttribute('aria-label')).toMatch(/^Launches per day from Sep 1 to Sep 2/);
    });

    it('sizes the drawing to the given height', () => {
        const {container} = render(<StartsSparkline days={days(1, 2)} kind="plugin" height={20}/>);
        const svg = svgOf(container);
        expect(svg).toHaveAttribute('viewBox', '0 0 300 20');
        expect(svg).toHaveAttribute('height', '20');
        expect(pathsOf(container)[1]).toBe('M0.0,10.0 L300.0,2.0');
    });
});
