import {Theme} from '@mui/material/styles';

/**
 * Standard animation transition for interactive elements.
 */
const commonTransition = {
    transition: 'all 0.3s ease',
};

/**
 * Subtle translucent hover background that reads on both light and dark modes.
 */
const commonHoverBg = (theme: Theme) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
});

/**
 * Top app bar surface (kept in sync with the MuiAppBar theme override in _app.tsx).
 */
export const appBarStyle = (theme: Theme) => ({
    backgroundImage: 'none',
    backgroundColor: theme.palette.mode === 'dark' ? '#161b22' : theme.palette.primary.main,
});

/**
 * Navigation button with a hover lift and background effect.
 */
export const navButtonStyle = (theme: Theme) => ({
    color: 'inherit',
    marginX: theme.spacing(0.5),
    ...commonTransition,
    '&:hover': {
        transform: 'translateY(-2px)',
        ...commonHoverBg(theme),
    },
});

/**
 * Brand wordmark.
 */
export const brandNameStyle = (theme: Theme) => ({
    display: 'inline',
    marginRight: theme.spacing(2),
    fontWeight: 700,
    letterSpacing: '-0.01em',
    color: 'inherit',
});

/**
 * Flexible toolbar layout with customizable alignment.
 */
export const toolbarStyle = (theme: Theme, options?: { justifyContent?: string; flexWrap?: string }) => ({
    paddingY: theme.spacing(0.5),
    display: 'flex',
    justifyContent: options?.justifyContent || 'space-between',
    flexWrap: options?.flexWrap || 'wrap',
});

/**
 * Toggle switch container with a hover scale effect.
 */
export const toggleSwitchBoxStyle = {
    flexGrow: 0,
    ...commonTransition,
    '&:hover': {transform: 'scale(1.1)'},
};

/**
 * Bottom app bar with a top border and bottom positioning.
 */
export const bottomAppBarStyle = (theme: Theme) => ({
    ...appBarStyle(theme),
    top: 'auto',
    bottom: 0,
    borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
});

/**
 * Footer button extending the nav button styles.
 */
export const footerButtonStyle = (theme: Theme) => ({
    ...navButtonStyle(theme),
    marginX: theme.spacing(1),
});

/**
 * Version number display with a monospace font and hover effect.
 */
export const versionNumberStyle = (theme: Theme) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
    borderRadius: theme.shape.borderRadius,
    ...commonHoverBg(theme),
    fontFamily: 'monospace',
    fontWeight: theme.typography.fontWeightMedium,
    ...commonTransition,
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
        transform: 'scale(1.05)',
    },
});

/**
 * Flexible container with customizable alignment and spacing.
 */
export const flexContainerStyle = (theme: Theme, options?: {
    gap?: number;
    alignItems?: string;
    flexWrap?: string;
}) => ({
    display: 'flex',
    alignItems: options?.alignItems || 'center',
    gap: theme.spacing(options?.gap || 2),
    flexWrap: options?.flexWrap || 'wrap',
});
