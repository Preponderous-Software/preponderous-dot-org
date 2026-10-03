import React from 'react';
import NextLink from 'next/link';
import {Box, Link, Typography} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import type {ProgramKind} from '../utils/traceNames';
import type {ProgramUsage} from '../utils/traceUsage';
import {activeInstallsLabel, usageHeadline} from '../utils/usageDisplay';

interface UsageLineProps {
    usage: ProgramUsage;
    kind: ProgramKind;
    now: number;
}

/**
 * A project's usage in a sentence, for its details in the icon grid (the
 * hover panel and the phone's bottom sheet alike): when it was last used and
 * its starts in the last 30 days, or its active installs once trace can count
 * them. The full rules, and where the figures come from, are a tap away on
 * /usage. Plain text throughout, so nothing hides behind a hover.
 */
const UsageLine: React.FC<UsageLineProps> = ({usage, kind, now}) => {
    const headline = usageHeadline(usage, kind, now);
    const main = headline.activeInstalls !== null
        ? `${activeInstallsLabel(headline.activeInstalls)} (30 days)`
        : headline.lastUsed;
    if (!main) return null;
    const detail = headline.activeInstalls !== null ? headline.lastUsed : headline.starts;
    return (
        <Box sx={{display: 'flex', gap: 0.75, alignItems: 'flex-start', mb: 1.5}} data-testid="usage-line">
            <InsightsIcon color="primary" sx={{fontSize: '1.1rem', mt: '1px'}} aria-hidden/>
            <Box sx={{minWidth: 0}}>
                <Typography variant="body2" sx={{fontWeight: 600}} data-testid="usage-line-main">{main}</Typography>
                <Typography variant="caption" color="text.secondary" component="p" sx={{m: 0}}>
                    {detail ? <>{detail}, </> : null}
                    reported by trace.{' '}
                    <Link component={NextLink} href="/usage">About these figures</Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default UsageLine;
