import type {NextPage} from 'next';
import {Box, Container, Link, List, ListItem, Typography} from '@mui/material';
import NextLink from 'next/link';
import React from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Seo from '../components/Seo';
import {COPYRIGHT_HOLDER} from '../utils/copyright';
import {pageStyle, sectionHeaderStyle, sectionDividerStyle} from '../styles/styles';

// pull the displayed version from package.json so the footer stays in sync
const version = require('../package.json').version;

const ORG_URL = 'https://github.com/Preponderous-Software';

// Internal routes navigate via next/link so they get a client-side transition
// rather than a full reload, matching TopBar/BottomBar's NavButton/FooterButton.
const InternalLink: React.FC<{href: string; children: React.ReactNode}> = ({href, children}) => (
    <NextLink href={href} passHref>
        <Link>{children}</Link>
    </NextLink>
);

const AboutSection: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <Box component="section" sx={{mb: 5}}>
        <Typography variant="h5" component="h2" gutterBottom sx={(theme) => sectionHeaderStyle(theme)}>
            {title}
        </Typography>
        {children}
    </Box>
);

const Paragraph: React.FC<{children: React.ReactNode}> = ({children}) => (
    <Typography variant="body1" color="text.secondary" sx={{mb: 2}}>
        {children}
    </Typography>
);

const AboutPage: NextPage = () => (
    <Box sx={(theme) => pageStyle(theme)}>
        <Seo
            title="About"
            description="The mission, values, and team behind Preponderous Software."
            path="/about"
        />
        <TopBar/>
        <Container component="main" id="main" maxWidth="md" sx={{py: 4, flexGrow: 1}}>
            <Typography variant="h3" component="h1" gutterBottom sx={{fontWeight: 700, letterSpacing: '-0.01em'}}>
                About
            </Typography>
            <Paragraph>
                Free, source-available games and assets — built in the open, and easy to run,
                extend, and contribute to.
            </Paragraph>
            <Box sx={(theme) => sectionDividerStyle(theme)}/>

            <AboutSection title="Mission">
                <Paragraph>
                    Preponderous Software makes games, simulations, and libraries, and publishes
                    their source alongside them, so anyone can run, study, extend, or self-host
                    what we build.
                </Paragraph>
            </AboutSection>

            <AboutSection title="Values">
                <List dense disablePadding>
                    <ListItem disableGutters sx={{display: 'block'}}>
                        <Typography variant="subtitle1" component="h3" sx={{fontWeight: 600}}>
                            Source Available
                        </Typography>
                        <Paragraph>
                            Everything we make is free to use, modify, and self-host for
                            non-commercial purposes. See the <InternalLink href="/legal">Legal</InternalLink> page
                            for the license that governs it.
                        </Paragraph>
                    </ListItem>
                    <ListItem disableGutters sx={{display: 'block'}}>
                        <Typography variant="subtitle1" component="h3" sx={{fontWeight: 600}}>
                            Built in the Open
                        </Typography>
                        <Paragraph>
                            Development happens on GitHub, where issues and pull requests are
                            welcome on every project.
                        </Paragraph>
                    </ListItem>
                    <ListItem disableGutters sx={{display: 'block'}}>
                        <Typography variant="subtitle1" component="h3" sx={{fontWeight: 600}}>
                            No Accounts, No Tracking
                        </Typography>
                        <Paragraph>
                            This website has no accounts, no advertising, and no analytics. See
                            the Privacy section of the <InternalLink href="/legal">Legal</InternalLink> page
                            for details.
                        </Paragraph>
                    </ListItem>
                </List>
            </AboutSection>

            <AboutSection title="Team">
                <Paragraph>
                    Preponderous Software is run by {COPYRIGHT_HOLDER}.
                </Paragraph>
            </AboutSection>

            <AboutSection title="Get Involved">
                <Paragraph>
                    Browse the projects and their source on{' '}
                    <Link href={ORG_URL} target="_blank" rel="noopener noreferrer">
                        GitHub
                    </Link>
                    , or head to the <InternalLink href="/contact">Contact</InternalLink> page to reach out.
                </Paragraph>
            </AboutSection>
        </Container>
        <BottomBar version={version}/>
    </Box>
);

export default AboutPage;
