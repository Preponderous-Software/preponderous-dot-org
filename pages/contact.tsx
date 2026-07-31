import type {NextPage} from 'next';
import {Box, Container, Link, List, ListItem, Typography} from '@mui/material';
import React from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Seo from '../components/Seo';
import {pageStyle, sectionHeaderStyle, sectionDividerStyle} from '../styles/styles';

// pull the displayed version from package.json so the footer stays in sync
const version = require('../package.json').version;

const ORG_URL = 'https://github.com/Preponderous-Software';
const WEBSITE_REPO_URL = 'https://github.com/Preponderous-Software/preponderous-dot-org';

const ContactSection: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
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

const ContactPage: NextPage = () => (
    <Box sx={(theme) => pageStyle(theme)}>
        <Seo
            title="Contact"
            description="How to reach Preponderous Software: report a bug, open an issue, or find a project on GitHub."
            path="/contact"
        />
        <TopBar/>
        <Container component="main" id="main" maxWidth="md" sx={{py: 4, flexGrow: 1}}>
            <Typography variant="h3" component="h1" gutterBottom sx={{fontWeight: 700, letterSpacing: '-0.01em'}}>
                Contact
            </Typography>
            <Paragraph>
                Preponderous Software doesn&apos;t run accounts, forums, or a support inbox — every
                conversation happens in the open on GitHub.
            </Paragraph>
            <Box sx={(theme) => sectionDividerStyle(theme)}/>

            <ContactSection title="Report a Bug">
                <Paragraph>
                    Found a problem with this website? File a report and include steps to
                    reproduce it.
                </Paragraph>
                <List dense disablePadding>
                    <ListItem disableGutters>
                        <Link href={`${WEBSITE_REPO_URL}/issues/new`} target="_blank" rel="noopener noreferrer">
                            Report a website bug
                        </Link>
                    </ListItem>
                </List>
            </ContactSection>

            <ContactSection title="Projects">
                <Paragraph>
                    Each project has its own repository — open an issue or pull request directly
                    on the project you&apos;re asking about.
                </Paragraph>
                <List dense disablePadding>
                    <ListItem disableGutters>
                        <Link href={ORG_URL} target="_blank" rel="noopener noreferrer">
                            Preponderous Software on GitHub
                        </Link>
                    </ListItem>
                </List>
            </ContactSection>
        </Container>
        <BottomBar version={version}/>
    </Box>
);

export default ContactPage;
