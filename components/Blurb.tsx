import React from 'react';
import {Box, Button, Typography, Paper, Grid, Stack} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import FavoriteIcon from '@mui/icons-material/Favorite';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import NextLink from 'next/link';

import {
    blurbBoxStyle,
    blurbTitleStyle,
    blurbGridContainerStyle,
    infoCardStyle,
    infoCardIconStyle,
    infoCardTitleStyle,
    infoCardIconSizeStyle,
    infoCardLinkStyle,
    infoCardExternalIconStyle
} from '../styles/styles';

const ORG_URL = 'https://github.com/Preponderous-Software';
// Every open issue across the organization's repositories — somewhere to pick
// up work, which is what "Contribute" promises, rather than the org overview
// that "View on GitHub" already opens.
const OPEN_ISSUES_URL = 'https://github.com/search?q=org%3APreponderous-Software+is%3Aissue+is%3Aopen&type=issues';
// The organization's repository list, so "Explore the Code" lands straight on
// the code instead of the org overview's pinned-repository summary.
const REPOSITORIES_URL = 'https://github.com/orgs/Preponderous-Software/repositories';

const InfoCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    content: string;
    href?: string
}> = ({icon, title, content, href}) => {
    // Off-site cards open in a new tab and carry the external-link icon; an
    // in-site card (e.g. /legal) navigates in place like the top bar's links.
    const isExternal = !!href && href.startsWith('http');
    const body = (
        <>
            <Box sx={(theme) => infoCardIconStyle(theme)}>
                {icon}
            </Box>
            <Typography variant="h6" component="h3" gutterBottom sx={(theme) => infoCardTitleStyle()}>
                {title}
                {isExternal ? <OpenInNewIcon sx={infoCardExternalIconStyle}/> : null}
            </Typography>
            <Typography variant="body1" color="text.secondary">{content}</Typography>
        </>
    );

    // A card that links somewhere is a real anchor rather than a div wired up
    // with role="link" and a window.open handler: that keeps "open in new tab",
    // middle-click, and "copy link address" working, and survives the popup
    // blockers that would otherwise swallow window.open.
    return (
        <Grid item xs={12} md={4}>
            {isExternal ? (
                <Paper
                    elevation={0}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={(theme) => ({...infoCardStyle(theme), ...infoCardLinkStyle})}
                >
                    {body}
                </Paper>
            ) : href ? (
                <NextLink href={href} passHref>
                    <Paper
                        elevation={0}
                        component="a"
                        sx={(theme) => ({...infoCardStyle(theme), ...infoCardLinkStyle})}
                    >
                        {body}
                    </Paper>
                </NextLink>
            ) : (
                // Nothing to activate here, so no pointer and no hover lift.
                <Paper
                    elevation={0}
                    sx={(theme) => ({...infoCardStyle(theme), cursor: 'default', '&:hover': {}})}
                >
                    {body}
                </Paper>
            )}
        </Grid>
    );
};

const Blurb: React.FC = () => (
    <Box sx={(theme) => blurbBoxStyle(theme)}>
        <Box sx={{textAlign: 'center', py: {xs: 4, md: 8}}}>
            <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={(theme) => ({...blurbTitleStyle(theme), marginBottom: theme.spacing(2)})}
            >
                Preponderous Software
            </Typography>
            <Typography
                variant="h6"
                color="text.secondary"
                sx={{maxWidth: 640, mx: 'auto', fontWeight: 400}}
            >
                Free, source-available games and assets — built in the open,
                and easy to run, extend, and contribute to.
            </Typography>
            <Stack
                direction={{xs: 'column', sm: 'row'}}
                spacing={2}
                justifyContent="center"
                sx={{mt: 4}}
            >
                <Button variant="contained" size="large" href="/projects">
                    Browse Projects
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    href={ORG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<OpenInNewIcon fontSize="small"/>}
                >
                    View on GitHub
                </Button>
            </Stack>
        </Box>

        <Typography
            variant="overline"
            component="h2"
            color="text.secondary"
            sx={{display: 'block', textAlign: 'center', letterSpacing: '0.1em'}}
        >
            Get involved
        </Typography>

        <Grid container spacing={4} sx={(theme) => blurbGridContainerStyle(theme)}>
            <InfoCard
                icon={<GitHubIcon sx={infoCardIconSizeStyle}/>}
                title="Contribute"
                content="Pick up an open issue on any project. Each one welcomes issues and pull requests."
                href={OPEN_ISSUES_URL}
            />
            <InfoCard
                icon={<CodeIcon sx={infoCardIconSizeStyle}/>}
                title="Explore the Code"
                content="Browse the source for our games, simulations, and libraries across many languages."
                href={REPOSITORIES_URL}
            />
            <InfoCard
                icon={<FavoriteIcon sx={infoCardIconSizeStyle}/>}
                title="Source Available"
                content="Everything we make is free to use, modify, and self-host for non-commercial purposes. Read the license."
                href="/legal"
            />
        </Grid>
    </Box>
);

export default Blurb;
