import type {NextPage} from 'next';
import React from 'react';
import AppsIcon from '@mui/icons-material/Apps';
import ErrorPage from '../components/ErrorPage';

const NotFoundPage: NextPage = () => (
    <ErrorPage
        code="404"
        title="Page not found"
        message="The page you're looking for doesn't exist or may have moved."
        // Most visitors who land here were after a project, so offer the full
        // list as well as the home page.
        secondaryAction={{href: '/projects', label: 'Browse projects', icon: <AppsIcon/>}}
    />
);

export default NotFoundPage;
