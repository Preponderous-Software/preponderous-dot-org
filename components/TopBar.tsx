import {AppBar, Box, Button, Link, Toolbar, Typography, useTheme} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import React, {useContext} from 'react';
import {ColorModeToggleSwitch} from './ColorModeToggleSwitch';
import {ColorModeContext} from '../utils/ColorModeContext';
import {isActiveNavLink} from '../utils/nav';

import {
    appBarStyle,
    navButtonStyle,
    brandNameStyle,
    toolbarStyle,
    toggleSwitchBoxStyle,
    flexContainerStyle
} from '../styles/styles';

// Internal routes navigate in the same tab; off-site links open in a new tab
// (with rel="noopener noreferrer") and carry an external-link icon so they are
// visually distinguishable from the in-site navigation they sit beside.
const NavButton: React.FC<{ href: string; active?: boolean; children: React.ReactNode }> = ({href, active = false, children}) => {
    const isExternal = href.startsWith('http');
    const button = (
        <Button
            color="inherit"
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            endIcon={isExternal ? <OpenInNewIcon fontSize="small"/> : undefined}
            aria-current={active ? 'page' : undefined}
            sx={(theme) => ({
                ...navButtonStyle(theme),
                // "You are here": highlight the link for the current page so the
                // user can tell where they are within the site.
                ...(active && {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    textUnderlineOffset: '6px',
                }),
            })}
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

const BrandName: React.FC = () => (
    // The wordmark links home — the near-universal "click the logo to return to
    // the home page" convention.
    <NextLink href="/" passHref>
        <Link
            underline="none"
            color="inherit"
            sx={(theme) => ({...brandNameStyle(theme), display: 'inline-block'})}
        >
            <Typography variant="h6" color="inherit" component="span">
                Preponderous Software
            </Typography>
        </Link>
    </NextLink>
);

const TopBar: React.FC = () => {
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();
    const {pathname} = useRouter();

    return (
        <AppBar
            position="static"
            sx={(theme) => appBarStyle(theme)}
        >
            <Toolbar sx={(theme) => toolbarStyle(theme)}>
                <Box sx={(theme) => flexContainerStyle(theme, {flexWrap: 'wrap'})}>
                    <BrandName/>

                    <Box sx={(theme) => flexContainerStyle(theme, {gap: 1})}>
                        <NavButton href="/" active={isActiveNavLink(pathname, '/')}>Home</NavButton>
                        <NavButton href="https://github.com/Preponderous-Software">GitHub</NavButton>
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

export default TopBar;
