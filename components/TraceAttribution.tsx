import React from 'react';
import {Link, Typography} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {TRACE_HOW_IT_WORKS_URL} from '../utils/usageDisplay';

/** The "where these figures come from" line every usage view carries. */
const TraceAttribution: React.FC = () => (
    <Typography variant="caption" color="text.secondary" component="p" sx={{m: 0}} data-testid="trace-attribution">
        Usage reported by trace —{' '}
        <Link href={TRACE_HOW_IT_WORKS_URL} target="_blank" rel="noopener noreferrer">
            how it works
            <OpenInNewIcon sx={{fontSize: '0.75rem', ml: 0.25, verticalAlign: 'middle'}} aria-hidden/>
        </Link>
        . Test and CI runs are excluded.
    </Typography>
);

export default TraceAttribution;
