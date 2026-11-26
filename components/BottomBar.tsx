import {AppBar, Box, Button, Link, Toolbar, Typography, useTheme} from '@mui/material';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import React, {useContext} from 'react';
import {ColorModeToggleSwitch} from './ColorModeToggleSwitch';
import {ColorModeContext} from '../utils/ColorModeContext';
import {isActiveNavLink} from '../utils/nav';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import GavelIcon from '@mui/icons-material/Gavel';
import HomeIcon from '@mui/icons-material/Home';
import {formatCopyright, LICENSE_SHORT_NAME} from '../utils/copyright';

import {
    toolbarStyle,
    bottomAppBarStyle,
    footerButtonStyle,
    versionNumberStyle,
    toggleSwitchBoxStyle,
    flexContainerStyle
} from '../styles/styles';

// Internal routes (e.g. /legal) navigate in the same tab; off-site links open in
// a new tab with rel="noopener noreferrer", matching TopBar's NavButton.
const FooterButton: React.FC<{ href: string; icon: React.ReactNode; active?: boolean; children: React.ReactNode }> = ({
    href,
    icon,
    active = false,
    children,
}) => {
    const isExternal = href.startsWith('http');
    const button = (
        <Button
            color="inherit"
            href={href}
            // Internal routes render through next/link, so navigation is a
            // client-side transition rather than a full document reload;
            // external links stay plain anchors (they leave the app anyway).
            LinkComponent={isExternal ? undefined : NextLink}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            startIcon={icon}
            // Tells assistive technology which of these links refers to the
            // page already being read, the same cue TopBar's NavButton gives.
            aria-current={active ? 'page' : undefined}
            sx={(theme) => footerButtonStyle(theme)}
        >
            {children}
        </Button>
    );

    return button;
};

const VersionNumber: React.FC<{ version: string }> = ({version}) => (
    <Typography variant="body1" color="inherit" component="div" sx={(theme) => versionNumberStyle(theme)}>
        v{version}
    </Typography>
);

// Copyright holder plus the license the site is published under, with the
// license name linking to the fuller explanation on /legal.
const CopyrightNotice: React.FC = () => (
    // Full-strength white: dimmed to 85% it fell to 4.1:1 on the light-mode
    // blue bar, under WCAG AA's 4.5:1 for text this size.
    <Typography variant="body2" color="inherit" component="div" sx={{textAlign: {xs: 'center', lg: 'left'}}}>
        {formatCopyright()}
        {' · '}
        <Link component={NextLink} href="/legal" color="inherit" underline="always">
            {LICENSE_SHORT_NAME}
        </Link>
    </Typography>
);

interface BottomBarProps {
    version: string;
}

const BottomBar: React.FC<BottomBarProps> = ({version}) => {
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();
    const {pathname} = useRouter();

    return (
        <AppBar position="static" component="footer" sx={(theme) => bottomAppBarStyle(theme)}>
            {/* Below lg the rows wrap, and left-aligned they left the
                colour-mode switch stranded under the links while the credit
                line beneath sat centred; there every row is centred instead.
                From lg up the switch keeps to the right of the row. */}
            <Toolbar sx={(theme) => ({...toolbarStyle(theme), justifyContent: {xs: 'center', lg: 'space-between'}, flexWrap: {xs: 'wrap', lg: 'nowrap'}, rowGap: 1})}>
                <Box sx={(theme) => ({...flexContainerStyle(theme), justifyContent: {xs: 'center', lg: 'flex-start'}})}>
                    <Box sx={(theme) => ({...flexContainerStyle(theme, {gap: 2}), justifyContent: 'center'})}>
                        <VersionNumber version={version}/>
                        <CopyrightNotice/>
                    </Box>

                    <Box component="nav" aria-label="Footer" sx={(theme) => ({...flexContainerStyle(theme, {gap: 1}), justifyContent: 'center'})}>
                        <FooterButton href="/" icon={<HomeIcon/>} active={isActiveNavLink(pathname, '/')}>
                            Home
                        </FooterButton>
                        <FooterButton href="/legal" icon={<GavelIcon/>} active={isActiveNavLink(pathname, '/legal')}>
                            Legal
                        </FooterButton>
                        <FooterButton
                            href="https://github.com/Preponderous-Software/preponderous-dot-org"
                            icon={<CodeIcon/>}
                        >
                            Source Code
                        </FooterButton>
                        <FooterButton
                            href="https://github.com/Preponderous-Software/preponderous-dot-org/issues/new"
                            icon={<BugReportIcon/>}
                        >
                            Report a Bug
                        </FooterButton>
                    </Box>
                </Box>

                <Box sx={toggleSwitchBoxStyle}>
                    <ColorModeToggleSwitch
                        checked={theme.palette.mode === 'dark'}
                        onChange={colorMode.toggleColorMode}
                        inputProps={{'aria-label': 'Toggle dark mode', role: 'switch'}}
                    />
                </Box>
            </Toolbar>
            {/* Underlined, not on hover only: the links are the same colour
                as the sentence around them, so nothing else tells them apart
                (WCAG 1.4.1). */}
            <Typography variant="caption" component="p" color="inherit" sx={{textAlign: 'center', pb: 1, px: 2, m: 0}}>
                More by Daniel Stephenson →{' '}
                <Link href="https://danielstephenson.dev" color="inherit" underline="always">
                    danielstephenson.dev
                </Link>
                {' · '}
                <Link href="https://danielstephenson.dev/play" color="inherit" underline="always">
                    Play his games in your browser
                </Link>
            </Typography>
        </AppBar>
    );
}

export default BottomBar;
