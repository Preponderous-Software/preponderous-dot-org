import React from 'react';
import { renderToString } from 'react-dom/server';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useNow } from '../utils/useNow';

const MOUNTED_AT = new Date('2026-10-19T08:30:00Z');

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(MOUNTED_AT);
});
afterEach(() => vi.useRealTimers());

const ShowNow: React.FC = () => <span>{String(useNow())}</span>;

describe('useNow', () => {
    it('is null in the server render, so the static HTML never bakes in a date', () => {
        expect(renderToString(<ShowNow/>)).toBe('<span>null</span>');
    });

    it('is the visitor\'s clock once the page has mounted', () => {
        const { result } = renderHook(() => useNow());
        expect(result.current).toBeInstanceOf(Date);
        expect(result.current?.getTime()).toBe(MOUNTED_AT.getTime());
    });

    it('reads the clock once, not on every render', () => {
        const { result, rerender } = renderHook(() => useNow());
        const first = result.current;
        vi.setSystemTime(new Date('2026-10-20T08:30:00Z'));
        rerender();
        expect(result.current).toBe(first);
        expect(result.current?.getTime()).toBe(MOUNTED_AT.getTime());
    });
});
