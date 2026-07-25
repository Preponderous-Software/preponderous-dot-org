import type {NextPage} from 'next';
import {Box, Container, Link, List, ListItem, Typography} from '@mui/material';
import React from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Seo from '../components/Seo';
import {COLOR_MODE_STORAGE_KEY} from '../utils/colorMode';
import {
    COPYRIGHT_HOLDER,
    LICENSE_NAME,
    LICENSE_SHORT_NAME,
    LICENSE_URL,
    formatCopyright,
} from '../utils/copyright';
import {pageStyle, sectionHeaderStyle, sectionDividerStyle} from '../styles/styles';

// pull the displayed version from package.json so the footer stays in sync
const version = require('../package.json').version;

const REPO_URL = 'https://github.com/Preponderous-Software/preponderous-dot-org';

const LegalSection: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
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

// Third-party components this site is built on. Listed here rather than
// generated from package.json so the notice stays a deliberate, reviewed
// statement about the runtime dependencies visitors actually receive.
const THIRD_PARTY = [
    {name: 'Next.js', license: 'MIT', href: 'https://github.com/vercel/next.js/blob/canary/license.md'},
    {name: 'React', license: 'MIT', href: 'https://github.com/facebook/react/blob/main/LICENSE'},
    {name: 'Material UI', license: 'MIT', href: 'https://github.com/mui/material-ui/blob/master/LICENSE'},
    {name: 'Emotion', license: 'MIT', href: 'https://github.com/emotion-js/emotion/blob/main/LICENSE'},
];

const LegalPage: NextPage = () => (
    <Box sx={(theme) => pageStyle(theme)}>
        <Seo
            title="Legal"
            description="Licensing, copyright, and privacy information for Preponderous Software."
        />
        <TopBar/>
        <Container component="main" id="main" maxWidth="md" sx={{py: 4, flexGrow: 1}}>
            <Typography variant="h3" component="h1" gutterBottom sx={{fontWeight: 700, letterSpacing: '-0.01em'}}>
                Legal
            </Typography>
            <Paragraph>
                Licensing, copyright, and privacy information for this website and the projects
                showcased on it.
            </Paragraph>
            <Box sx={(theme) => sectionDividerStyle(theme)}/>

            <LegalSection title="License">
                <Paragraph>
                    This website and the projects published by Preponderous Software are released
                    under the {LICENSE_NAME}. It is a source-available license: the work is free to
                    use, modify, and self-host for <strong>non-commercial</strong> purposes, and
                    commercial use requires a separate license.
                </Paragraph>
                <Paragraph>
                    The canonical license text is the authoritative version — the summary above is
                    for orientation only and does not replace it.
                </Paragraph>
                <List dense disablePadding>
                    <ListItem disableGutters>
                        <Link href={LICENSE_URL} target="_blank" rel="noopener noreferrer">
                            Full {LICENSE_SHORT_NAME} license text
                        </Link>
                    </ListItem>
                    <ListItem disableGutters>
                        <Link href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer">
                            License as distributed with this website
                        </Link>
                    </ListItem>
                </List>
            </LegalSection>

            <LegalSection title="Copyright">
                <Paragraph>
                    {formatCopyright()}. All rights reserved, except as granted by
                    the {LICENSE_SHORT_NAME} license.
                </Paragraph>
                <Paragraph>
                    Individual projects may carry their own notices; where a project&apos;s
                    repository states otherwise, that repository governs.
                </Paragraph>
            </LegalSection>

            <LegalSection title="Disclaimer">
                <Paragraph>
                    Preponderous Software is not a legal entity. All rights to works published under
                    this name are reserved by the copyright holder, {COPYRIGHT_HOLDER}.
                </Paragraph>
                <Paragraph>
                    The projects showcased here are provided &quot;as is&quot;, without warranty of
                    any kind, to the extent permitted by applicable law.
                </Paragraph>
            </LegalSection>

            <LegalSection title="Privacy">
                <Paragraph>
                    This website has no accounts, no advertising, and no analytics or tracking
                    scripts. It does not collect personal information and sets no cookies.
                </Paragraph>
                <Paragraph>
                    The only data stored on your device is your light/dark mode preference, saved in
                    your browser&apos;s local storage under the
                    key <code>{COLOR_MODE_STORAGE_KEY}</code>. It never leaves your browser, and
                    clearing your browser&apos;s site data removes it.
                </Paragraph>
                <Paragraph>
                    Following a link away from this site — for example to GitHub — hands you over to
                    that service&apos;s own privacy policy.
                </Paragraph>
            </LegalSection>

            <LegalSection title="Third-Party Software">
                <Paragraph>
                    This website is built with open-source components, each under its own license:
                </Paragraph>
                <List dense disablePadding>
                    {THIRD_PARTY.map(({name, license, href}) => (
                        <ListItem disableGutters key={name}>
                            <Typography variant="body2" color="text.secondary">
                                <Link href={href} target="_blank" rel="noopener noreferrer">
                                    {name}
                                </Link>
                                {` — ${license} License`}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </LegalSection>

            <LegalSection title="Questions">
                <Paragraph>
                    For licensing questions, or to report something on this page that looks wrong,
                    open an issue on the{' '}
                    <Link href={`${REPO_URL}/issues/new`} target="_blank" rel="noopener noreferrer">
                        website repository
                    </Link>
                    .
                </Paragraph>
            </LegalSection>
        </Container>
        <BottomBar version={version}/>
    </Box>
);

export default LegalPage;
