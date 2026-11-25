import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import {
    BODY_FALLBACK_FAMILY,
    BODY_FONT_STACK,
    HEADING_FALLBACK_FAMILY,
    HEADING_FONT_STACK,
} from '../utils/fonts';

const globalsCss = fs.readFileSync(path.join(__dirname, '..', 'styles', 'globals.css'), 'utf8');

// The @font-face block that declares `family`, or undefined when none does.
const fontFaceFor = (family: string): string | undefined =>
    (globalsCss.match(/@font-face\s*{[^}]*}/g) ?? []).find((block) =>
        block.includes(`font-family: '${family}';`)
    );

describe('font stacks', () => {
    it('name the metric-matched fallback right after each web font', () => {
        expect(BODY_FONT_STACK.startsWith(`"Inter", "${BODY_FALLBACK_FAMILY}",`)).toBe(true);
        expect(HEADING_FONT_STACK.startsWith(`"Space Grotesk", "${HEADING_FALLBACK_FAMILY}",`)).toBe(true);
    });

    it('end in a generic family', () => {
        expect(BODY_FONT_STACK.endsWith('sans-serif')).toBe(true);
        expect(HEADING_FONT_STACK.endsWith('sans-serif')).toBe(true);
    });
});

// The override values are next/font's for these families; a fallback that is
// named in a stack but never declared would silently fall through to
// system-ui and bring the layout shift back.
describe.each([
    [BODY_FALLBACK_FAMILY, { ascent: '90.49%', descent: '22.56%', size: '107.06%' }],
    [HEADING_FALLBACK_FAMILY, { ascent: '89.71%', descent: '26.62%', size: '109.69%' }],
])('styles/globals.css @font-face for %s', (family, metrics) => {
    const block = fontFaceFor(family);

    it('is declared', () => {
        expect(block).toBeDefined();
    });

    it('resolves to a locally installed Arial or its metric twin', () => {
        expect(block).toContain("local('Arial')");
        expect(block).toContain("local('Liberation Sans')");
    });

    it('overrides the metrics to match the web font', () => {
        expect(block).toContain(`ascent-override: ${metrics.ascent};`);
        expect(block).toContain(`descent-override: ${metrics.descent};`);
        expect(block).toContain('line-gap-override: 0%;');
        expect(block).toContain(`size-adjust: ${metrics.size};`);
    });
});
