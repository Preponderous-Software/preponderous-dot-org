import React from 'react';
import {Box, Button, Container, Stack, Typography} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import NextLink from 'next/link';
import TopBar from './TopBar';
import Seo from './Seo';
import BottomBar from './BottomBar';
import {pageStyle, sectionHeaderStyle} from '../styles/styles';

const version = require('../package.json').version;

/**
 * Shared layout for the site's error pages (404 / 500). Renders the standard
 * page chrome (TopBar/BottomBar) around a centred message and a link home, so a
 * thrown or missing route still looks like the rest of the MUI-themed site
 * instead of Next.js's unstyled default.
 */
// A second way forward suited to the error, beside "Back to home" — e.g. the
// project list from a 404, or a bug report from a 500. Off-site targets open
// in a new tab with the external-link icon, like the rest of the site.
export interface ErrorPageAction {
    href: string;
    label: string;
    icon?: React.ReactNode;
}

const SecondaryAction: React.FC<{action: ErrorPageAction}> = ({action}) => {
    const isExternal = action.href.startsWith('http');
    const button = (
        <Button
            variant="outlined"
            href={action.href}
            LinkComponent={isExternal ? undefined : NextLink}
            startIcon={action.icon}
            endIcon={isExternal ? <OpenInNewIcon fontSize="small"/> : undefined}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
        >
            {action.label}
        </Button>
    );
    return button;
};

const ErrorPage: React.FC<{code: string; title: string; message: string; secondaryAction?: ErrorPageAction}> = ({
    code,
    title,
    message,
    secondaryAction,
}) => (
    <Box sx={(theme) => pageStyle(theme)}>
        <Seo title={`${code} — ${title}`} description={message}/>
        <TopBar/>
        <Container component="main" id="main" maxWidth="sm" sx={{py: 8, textAlign: 'center', flexGrow: 1}}>
            <Typography variant="h1" component="p" color="primary" sx={{fontWeight: 700}}>
                {code}
            </Typography>
            <Typography variant="h4" component="h1" gutterBottom sx={(theme) => sectionHeaderStyle(theme)}>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{mb: 3}}>
                {message}
            </Typography>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} justifyContent="center">
                <Button variant="contained" href="/" LinkComponent={NextLink} startIcon={<HomeIcon/>}>
                    Back to home
                </Button>
                {secondaryAction ? <SecondaryAction action={secondaryAction}/> : null}
            </Stack>
        </Container>
        <BottomBar version={version}/>
    </Box>
);

export default ErrorPage;
