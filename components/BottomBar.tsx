import {AppBar, Box, Button, Link, Toolbar, Typography, useTheme} from '@mui/material';
import NextLink from 'next/link';
import React, {useContext} from 'react';
import {ColorModeToggleSwitch} from './ColorModeToggleSwitch';
import {ColorModeContext} from '../utils/ColorModeContext';
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
const FooterButton: React.FC<{ href: string; icon: React.ReactNode; children: React.ReactNode }> = ({
    href,
    icon,
    children,
}) => {
    const isExternal = href.startsWith('http');
    const button = (
        <Button
            color="inherit"
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            startIcon={icon}
            sx={(theme) => footerButtonStyle(theme)}
        >
            {children}
        </Button>
    );

    // Internal routes go through next/link so navigation is a client-side
    // transition rather than a full document reload; external links stay plain
    // anchors (they leave the app anyway).
    return isExternal ? button : (
        <NextLink href={href} passHref>
            {button}
        </NextLink>
    );
};

const VersionNumber: React.FC<{ version: string }> = ({version}) => (
    <Typography variant="body1" color="inherit" component="div" sx={(theme) => versionNumberStyle(theme)}>
        v{version}
    </Typography>
);

// Copyright holder plus the license the site is published under, with the
// license name linking to the fuller explanation on /legal.
const CopyrightNotice: React.FC = () => (
    <Typography variant="body2" color="inherit" component="div" sx={{opacity: 0.85}}>
        {formatCopyright()}
        {' · '}
        <NextLink href="/legal" passHref>
            <Link color="inherit" underline="always">
                {LICENSE_SHORT_NAME}
            </Link>
        </NextLink>
    </Typography>
);

interface BottomBarProps {
    version: string;
}

const BottomBar: React.FC<BottomBarProps> = ({version}) => {
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();

    return (
        <AppBar position="static" component="footer" sx={(theme) => bottomAppBarStyle(theme)}>
            <Toolbar sx={(theme) => toolbarStyle(theme)}>
                <Box sx={(theme) => flexContainerStyle(theme)}>
                    <Box sx={(theme) => flexContainerStyle(theme, {gap: 2})}>
                        <VersionNumber version={version}/>
                        <CopyrightNotice/>
                    </Box>

                    <Box component="nav" aria-label="Footer" sx={(theme) => flexContainerStyle(theme, {gap: 1})}>
                        <FooterButton href="/" icon={<HomeIcon/>}>
                            Home
                        </FooterButton>
                        <FooterButton href="/legal" icon={<GavelIcon/>}>
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
                        inputProps={{'aria-label': 'Toggle dark mode'}}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default BottomBar;
