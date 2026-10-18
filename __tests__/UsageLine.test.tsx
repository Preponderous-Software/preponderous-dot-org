// Characterizes the one-sentence usage line in a project's details: which
// figure leads (active installs once trace counts them, otherwise when it was
// last used), what the caption adds beneath it, and when nothing is shown.
import React from 'react';
import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import UsageLine from '../components/UsageLine';
import type {ProgramUsage} from '../utils/traceUsage';
import {usageWithInstalls, usageWithoutInstalls} from './fixtures/traceUsage';

const NOW = Date.parse('2026-10-04T14:00:00Z');

const caption = () => screen.getByTestId('usage-line').querySelector('p.MuiTypography-caption');

describe('UsageLine', () => {
    it('leads with active installs and gives when it was last used beneath', () => {
        render(<UsageLine usage={usageWithInstalls()} kind="game" now={NOW}/>);
        expect(screen.getByTestId('usage-line-main')).toHaveTextContent('57 active installs (30 days)');
        expect(caption()).toHaveTextContent('Last used 1 day ago, reported by trace. About these figures');
    });

    it('leads with when it was last used and gives its starts, in the kind\'s unit, when installs are not counted', () => {
        render(<UsageLine usage={usageWithoutInstalls()} kind="game" now={NOW}/>);
        expect(screen.getByTestId('usage-line-main')).toHaveTextContent('Last used 3 days ago');
        expect(caption()).toHaveTextContent('412 launches in the last 30 days, reported by trace.');
    });

    it('labels a plugin\'s starts as server starts', () => {
        render(<UsageLine usage={usageWithoutInstalls()} kind="plugin" now={NOW}/>);
        expect(caption()).toHaveTextContent('412 server starts in the last 30 days, reported by trace.');
    });

    it('drops the detail when there were no starts in the window', () => {
        const usage: ProgramUsage = {...usageWithoutInstalls(), startups30d: 0};
        render(<UsageLine usage={usage} kind="game" now={NOW}/>);
        expect(screen.getByTestId('usage-line-main')).toHaveTextContent('Last used 3 days ago');
        expect(caption()).toHaveTextContent(/^reported by trace\. About these figures$/);
    });

    it('still shows active installs when trace has no last-used time', () => {
        const usage: ProgramUsage = {...usageWithInstalls(), lastSeen: null};
        render(<UsageLine usage={usage} kind="game" now={NOW}/>);
        expect(screen.getByTestId('usage-line-main')).toHaveTextContent('57 active installs (30 days)');
        expect(caption()).toHaveTextContent(/^reported by trace\. About these figures$/);
    });

    it('renders nothing when there are no installs counted and no public use yet', () => {
        const usage: ProgramUsage = {...usageWithoutInstalls(), lastSeen: null};
        const {container} = render(<UsageLine usage={usage} kind="game" now={NOW}/>);
        expect(container).toBeEmptyDOMElement();
    });

    it('links to /usage for where the figures come from', () => {
        render(<UsageLine usage={usageWithoutInstalls()} kind="game" now={NOW}/>);
        expect(screen.getByRole('link', {name: 'About these figures'})).toHaveAttribute('href', '/usage');
    });
});
