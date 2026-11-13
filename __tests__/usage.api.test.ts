import type {NextApiRequest, NextApiResponse} from 'next';
import {beforeEach, describe, expect, it, vi} from 'vitest';

const {loadProjectUsage} = vi.hoisted(() => ({loadProjectUsage: vi.fn()}));
vi.mock('../utils/projectUsage', () => ({loadProjectUsage}));

import handler from '../pages/api/usage';

interface Recorded {
    statusCode: number;
    headers: Record<string, string>;
    body: unknown;
    ended: boolean;
}

const call = async (method: string): Promise<Recorded> => {
    const recorded: Recorded = {statusCode: 0, headers: {}, body: undefined, ended: false};
    const res = {
        setHeader(name: string, value: string) {
            recorded.headers[name.toLowerCase()] = value;
            return this;
        },
        status(code: number) {
            recorded.statusCode = code;
            return this;
        },
        json(body: unknown) {
            recorded.body = body;
            return this;
        },
        end() {
            recorded.ended = true;
            return this;
        },
    };
    await handler({method} as NextApiRequest, res as unknown as NextApiResponse);
    return recorded;
};

const sentinel = {roam: {starts: 4242}};

describe('GET /api/usage', () => {
    beforeEach(() => {
        loadProjectUsage.mockReset();
        loadProjectUsage.mockResolvedValue(sentinel);
    });

    it('answers 200 with the usage map from loadProjectUsage', async () => {
        const res = await call('GET');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({usage: sentinel});
        expect(loadProjectUsage).toHaveBeenCalledTimes(1);
    });

    it('lets the browser cache the answer for a minute', async () => {
        expect((await call('GET')).headers['cache-control']).toBe('public, max-age=60');
    });

    it('answers HEAD like GET', async () => {
        const res = await call('HEAD');
        expect(res.statusCode).toBe(200);
        expect(res.headers['cache-control']).toBe('public, max-age=60');
    });

    it('answers 200 with an empty map when trace reports nothing', async () => {
        loadProjectUsage.mockResolvedValue({});
        const res = await call('GET');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({usage: {}});
    });

    it('refuses other methods with 405 without asking trace', async () => {
        const res = await call('POST');
        expect(res.statusCode).toBe(405);
        expect(res.headers['allow']).toBe('GET, HEAD');
        expect(res.ended).toBe(true);
        expect(res.body).toBeUndefined();
        expect(loadProjectUsage).not.toHaveBeenCalled();
    });
});
