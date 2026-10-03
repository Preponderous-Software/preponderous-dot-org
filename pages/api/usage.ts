import type {NextApiRequest, NextApiResponse} from 'next';
import {loadProjectUsage, type ProjectUsageMap} from '../../utils/projectUsage';

// GET /api/usage: trace's figures for every project that reports, keyed by
// project id. trace sends no CORS headers, so the browser cannot ask it
// directly; the home page's project grid asks this instead, after it has
// rendered. Never fails: with trace unreachable the answer is an empty map
// and the grid shows no usage lines.
export default async function handler(req: NextApiRequest, res: NextApiResponse<{usage: ProjectUsageMap}>) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.setHeader('Allow', 'GET, HEAD');
        res.status(405).end();
        return;
    }
    const usage = await loadProjectUsage();
    // trace's answers are cached for ten minutes server side; a minute in
    // the browser keeps a few page loads from asking again.
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).json({usage});
}
