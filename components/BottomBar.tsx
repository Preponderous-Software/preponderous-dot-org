import {AppBar, Box, Button, Toolbar, Typography, useTheme} from '@mui/material';
import React, {useContext} from 'react';
import {ColorModeToggleSwitch} from './ColorModeToggleSwitch';
import {ColorModeContext} from '../utils/ColorModeContext';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';

import {
    toolbarStyle,
    bottomAppBarStyle,
    footerButtonStyle,
    versionNumberStyle,
    toggleSwitchBoxStyle,
    flexContainerStyle
} from '../styles/styles';

const FooterButton: React.FC<{ href: string; icon: React.ReactNode; children: React.ReactNode }> = ({
    href,
    icon,
    children,
}) => (
    <Button color="inherit" href={href} target="_blank" rel="noopener noreferrer" startIcon={icon} sx={(theme) => footerButtonStyle(theme)}>
        {children}
    </Button>
);

const VersionNumber: React.FC<{ version: string }> = ({version}) => (
    <Typography variant="body1" color="inherit" component="div" sx={(theme) => versionNumberStyle(theme)}>
        v{version}
    </Typography>
);

interface BottomBarProps {
    version: string;
}

const BottomBar: React.FC<BottomBarProps> = ({version}) => {
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();

    return (
        <AppBar position="static" sx={(theme) => bottomAppBarStyle(theme)}>
            <Toolbar sx={(theme) => toolbarStyle(theme)}>
                <Box sx={(theme) => flexContainerStyle(theme)}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <VersionNumber version={version}/>
                    </Box>

                    <Box sx={(theme) => flexContainerStyle(theme, {gap: 1})}>
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
