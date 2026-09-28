import type {NextPage} from 'next';
import React from 'react';
import BugReportIcon from '@mui/icons-material/BugReport';
import ErrorPage from '../components/ErrorPage';

const ServerErrorPage: NextPage = () => (
    <ErrorPage
        code="500"
        title="Something went wrong"
        message="An unexpected error occurred on our end. Please try again in a moment."
        // A 500 is a fault in this site, so let the visitor tell us about it
        // from the page that shows it — the same target as the footer's
        // Report a Bug link.
        secondaryAction={{
            href: 'https://github.com/Preponderous-Software/preponderous-dot-org/issues/new',
            label: 'Report the problem',
            icon: <BugReportIcon/>,
        }}
    />
);

export default ServerErrorPage;
