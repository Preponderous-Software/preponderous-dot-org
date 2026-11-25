import React from 'react';
import { existsSync } from 'fs';
import { join } from 'path';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ColorModeToggleSwitch, colorModeSwitchTouchStyle } from '../components/ColorModeToggleSwitch';
import { TOUCH_TARGET } from '../styles/styles';

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

// On a touch screen the switch was a 32px-tall target; it must reach 44px
// without changing how it looks.
describe('ColorModeToggleSwitch on a touch screen', () => {
    const touch = colorModeSwitchTouchStyle;
    const base = touch['& .MuiSwitch-switchBase'];
    const input = touch['& .MuiSwitch-input'];

    it('is a 44px tap area', () => {
        expect(touch.height).toBe(TOUCH_TARGET);
        expect(input.height).toBe(TOUCH_TARGET);
    });

    it('keeps the 20px track and centres the 32px thumb in the taller root', () => {
        expect(touch.height - touch.paddingTop - touch.paddingBottom).toBe(20);
        // switchBase margin is 1px; the thumb's centre lands on the root's centre.
        expect(base.top + 1 + 32 / 2).toBe(TOUCH_TARGET / 2);
        // The input, positioned inside switchBase, starts at the root's top edge.
        expect(base.top + 1 + input.top).toBe(0);
    });
});
