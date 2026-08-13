import React from 'react';
import { existsSync } from 'fs';
import { join } from 'path';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ColorModeToggleSwitch } from '../components/ColorModeToggleSwitch';

// TopBar and BottomBar drive the switch the same way — a `checked` prop taken
// from the active theme and an `onChange` from ColorModeContext — so the
// component is exercised here through that same contract.
const renderSwitch = (props: { checked: boolean; onChange?: () => void }) =>
    render(
        <ColorModeToggleSwitch
            checked={props.checked}
            onChange={props.onChange}
            inputProps={{ 'aria-label': 'Toggle dark mode' }}
        />
    );

const toggle = () => screen.getByRole('checkbox', { name: /toggle dark mode/i });

describe('ColorModeToggleSwitch', () => {
    it('renders an accessibly-labelled control', () => {
        renderSwitch({ checked: false });
        expect(toggle()).toBeInTheDocument();
    });

    it('reflects the checked prop', () => {
        const { unmount } = renderSwitch({ checked: true });
        expect(toggle()).toBeChecked();
        unmount();

        renderSwitch({ checked: false });
        expect(toggle()).not.toBeChecked();
    });

    it('calls onChange when the control is toggled', () => {
        const onChange = vi.fn();
        renderSwitch({ checked: false, onChange });
        fireEvent.click(toggle());
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    // The visible switch is a styled wrapper around a real checkbox input, so
    // keyboard operability comes from the input being focusable rather than
    // from any handler of its own.
    it('is reachable by keyboard focus', () => {
        renderSwitch({ checked: false });
        toggle().focus();
        expect(toggle()).toHaveFocus();
    });

    // The sun/moon thumb is painted from two files under public/, referenced as
    // bare strings in the styled rules, so nothing else in the build would
    // notice if either asset were renamed or removed.
    it('has the color-mode icon assets its styles reference', () => {
        for (const asset of ['light.svg', 'dark.svg']) {
            expect(existsSync(join(process.cwd(), 'public', 'colormode', asset))).toBe(true);
        }
    });
});
