// Characterizes the line every usage view carries: where the figures come
// from, what is left out of them, and the off-site link explaining both.
import React from 'react';
import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import TraceAttribution from '../components/TraceAttribution';
import {TRACE_HOW_IT_WORKS_URL} from '../utils/usageDisplay';

describe('TraceAttribution', () => {
    it('names trace as the source and says test and CI runs are left out', () => {
        render(<TraceAttribution/>);
        expect(screen.getByTestId('trace-attribution')).toHaveTextContent(
            'Usage reported by trace — how it works. Test and CI runs are excluded.',
        );
    });

    it('links to how the figures are collected, opening safely in a new tab', () => {
        render(<TraceAttribution/>);
        const link = screen.getByRole('link', {name: 'how it works'});
        expect(link).toHaveAttribute('href', TRACE_HOW_IT_WORKS_URL);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
});
