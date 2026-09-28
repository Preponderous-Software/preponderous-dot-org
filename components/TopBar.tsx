import {AppBar, Box, Button, Drawer, IconButton, Link, List, ListItemButton, ListItemText, Toolbar, Typography, useTheme} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import React, {useContext, useState} from 'react';
import {ColorModeToggleSwitch} from './ColorModeToggleSwitch';
import {ColorModeContext} from '../utils/ColorModeContext';
import {isActiveNavLink} from '../utils/nav';

import {
    appBarStyle,
    navButtonStyle,
    brandNameStyle,
    toolbarStyle,
    toggleSwitchBoxStyle,
    flexContainerStyle,
    navDrawerPaperStyle,
} from '../styles/styles';

// The primary navigation, shared by the inline bar and the phone drawer.
const NAV_LINKS = [
    {href: '/', label: 'Home'},
    {href: '/projects', label: 'Projects'},
    {href: '/about', label: 'About'},
    {href: '/contact', label: 'Contact'},
    {href: 'https://github.com/Preponderous-Software', label: 'GitHub'},
];

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

// Below the `md` breakpoint the inline links wrapped onto two more rows and
// took a quarter of a phone's first screen, so there they collapse behind a
// hamburger that opens this drawer — the same pattern as dansplugins.com.
const NavDrawer: React.FC<{open: boolean; onClose: () => void; pathname: string}> = ({open, onClose, pathname}) => (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{sx: (theme) => navDrawerPaperStyle(theme)}}>
        <Box component="nav" aria-label="Primary">
            <List sx={{width: 240}} onClick={onClose}>
                {NAV_LINKS.map((link) => {
                    const isExternal = link.href.startsWith('http');
                    return isExternal ? (
                        <ListItemButton key={link.href} component="a" href={link.href} target="_blank" rel="noopener noreferrer">
                            <ListItemText primary={link.label}/>
                            <OpenInNewIcon fontSize="small"/>
                        </ListItemButton>
                    ) : (
                        <NextLink key={link.href} href={link.href} passHref>
                            <ListItemButton
                                component="a"
                                selected={isActiveNavLink(pathname, link.href)}
                                aria-current={isActiveNavLink(pathname, link.href) ? 'page' : undefined}
                            >
                                <ListItemText primary={link.label}/>
                            </ListItemButton>
                        </NextLink>
                    );
                })}
            </List>
        </Box>
    </Drawer>
);

const TopBar: React.FC = () => {
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();
    const {pathname} = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <AppBar
            position="static"
            sx={(theme) => appBarStyle(theme)}
        >
            <Toolbar sx={(theme) => toolbarStyle(theme)}>
                <Box sx={(theme) => flexContainerStyle(theme, {flexWrap: 'wrap'})}>
                    <BrandName/>

                    {/* A named landmark, matching BottomBar's "Footer" nav, so
                        assistive technology can list the site's primary
                        navigation — and so the skip link in pages/_app.tsx has
                        an actual landmark to skip past. */}
                    <Box
                        component="nav"
                        aria-label="Primary"
                        sx={(theme) => ({...flexContainerStyle(theme, {gap: 1}), display: {xs: 'none', md: 'flex'}})}
                    >
                        {NAV_LINKS.map((link) => (
                            <NavButton key={link.href} href={link.href} active={isActiveNavLink(pathname, link.href)}>
                                {link.label}
                            </NavButton>
                        ))}
                    </Box>
                </Box>

                <Box sx={(theme) => flexContainerStyle(theme, {gap: 1, flexWrap: 'nowrap'})}>
                    <Box sx={toggleSwitchBoxStyle}>
                        <ColorModeToggleSwitch
                            checked={theme.palette.mode === 'dark'}
                            onChange={colorMode.toggleColorMode}
                            inputProps={{'aria-label': 'Toggle dark mode'}}
                        />
                    </Box>
                    <IconButton
                        color="inherit"
                        aria-label="Open navigation menu"
                        aria-haspopup="true"
                        aria-expanded={drawerOpen}
                        onClick={() => setDrawerOpen(true)}
                        sx={{display: {xs: 'inline-flex', md: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Box>
            </Toolbar>

            <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} pathname={pathname}/>
        </AppBar>
    );
}

export default TopBar;
