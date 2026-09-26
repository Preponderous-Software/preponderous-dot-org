import { readFileSync } from 'fs';
import { join } from 'path';
import { createTheme } from '@mui/material';
import { describe, expect, it } from 'vitest';
import {
    REDUCED_MOTION_QUERY,
    blurbTitleStyle,
    cardWrapperStyle,
    footerButtonStyle,
    gridItemStyle,
    infoCardStyle,
    navButtonStyle,
    projectCardStyle,
    toggleSwitchBoxStyle,
    versionNumberStyle,
} from '../styles/styles';

type StyleObject = Record<string, unknown>;

const theme = createTheme({ palette: { mode: 'dark' } });

// Every style in this file moves an element on hover: a lift, or a zoom. They
// are listed once and asserted over as a set, so a new animated style added
// without a reduced-motion override shows up as a missing entry here rather
// than as motion a visitor asked not to be shown.
const ANIMATED_STYLES: [string, StyleObject][] = [
    ['navButtonStyle', navButtonStyle(theme)],
    ['footerButtonStyle', footerButtonStyle(theme)],
    ['toggleSwitchBoxStyle', toggleSwitchBoxStyle],
    ['versionNumberStyle', versionNumberStyle(theme)],
    ['cardWrapperStyle', cardWrapperStyle],
    ['infoCardStyle', infoCardStyle(theme)],
    ['gridItemStyle.sx', gridItemStyle.sx],
];

// The subset whose hover pairs its movement with a colour or shadow change.
// toggleSwitchBoxStyle is deliberately absent: its hover is the zoom and
// nothing else, so under reduced motion it correctly becomes a no-op.
const STYLES_WITH_HOVER_FEEDBACK = ANIMATED_STYLES.filter(
    ([name]) => name !== 'toggleSwitchBoxStyle'
);

const reducedMotionBlock = (style: StyleObject) =>
    style[REDUCED_MOTION_QUERY] as { transition?: string; '&:hover'?: { transform?: string } } | undefined;

const hoverBlock = (style: StyleObject) => style['&:hover'] as StyleObject | undefined;

describe('reduced-motion overrides', () => {
    it.each(ANIMATED_STYLES)('%s cancels its hover movement under reduced motion', (_name, style) => {
        const reduced = reducedMotionBlock(style);
        expect(reduced).toBeDefined();
        expect(reduced?.transition).toBe('none');
        expect(reduced?.['&:hover']?.transform).toBe('none');
    });

    // The override and the rule it overrides carry the same specificity, so it
    // only wins while Emotion serializes it later — and Emotion serializes in
    // key insertion order. A style that grew another key after the media query
    // would still pass the assertion above while having no effect in a browser.
    it.each(ANIMATED_STYLES)('%s declares the reduced-motion block last', (_name, style) => {
        const keys = Object.keys(style);
        expect(keys[keys.length - 1]).toBe(REDUCED_MOTION_QUERY);
    });

    // Only the movement is dropped. The colour and shadow changes are the
    // hover's feedback rather than its motion, and removing them would cost
    // the affordance without benefiting anyone.
    it.each(STYLES_WITH_HOVER_FEEDBACK)(
        '%s keeps its hover feedback outside the media query',
        (_name, style) => {
            const hover = hoverBlock(style);
            expect(hover?.transform).toBeDefined();
            const feedbackKeys = Object.keys(hover ?? {}).filter((key) => key !== 'transform');
            expect(feedbackKeys.length).toBeGreaterThan(0);
        }
    );
});

describe('globals.css', () => {
    // MUI's own transitions (ripples, the color-mode Switch's thumb travel) and
    // the skip link in pages/_app.tsx are not authored through styles.ts, so
    // the stylesheet is what covers them. Read as text because nothing else in
    // the build would notice the rule being dropped.
    it('collapses animation and transition durations under reduced motion', () => {
        const css = readFileSync(join(process.cwd(), 'styles', 'globals.css'), 'utf8');
        const block = css.match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n\}/);
        expect(block).not.toBeNull();
        expect(block?.[0]).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
        expect(block?.[0]).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
    });
});

describe('layout overflow guards', () => {
    // A fixed height clipped any card whose title wrapped to extra lines (the
    // Artificial Consciousness Simulation Framework card at 1280px), pushing
    // its GitHub button out of the box. The card must be free to grow.
    it('gives the project card a minimum height rather than a fixed one', () => {
        expect(projectCardStyle).toMatchObject({ minHeight: '16rem', height: '100%' });
    });

    // At the h2 variant's 3.75rem, "Preponderous" alone is wider than a 390px
    // phone's content column and scrolled the whole home page sideways.
    it('steps the hero title down on the smallest breakpoint', () => {
        const title = blurbTitleStyle(theme) as StyleObject;
        const fontSize = title.fontSize as { xs: string; sm: string };
        expect(parseFloat(fontSize.xs)).toBeLessThan(parseFloat(fontSize.sm));
        expect(title.overflowWrap).toBe('break-word');
    });
});
