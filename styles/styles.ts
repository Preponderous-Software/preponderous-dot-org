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

/**
 * Main page layout: a clean themed background that fills the viewport.
 */
export const pageStyle = (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
});

/**
 * Section heading: text in the standard colour with a short primary accent bar.
 */
export const sectionHeaderStyle = (theme: Theme) => ({
    fontWeight: 700,
    letterSpacing: '-0.01em',
    display: 'inline-block',
    marginBottom: theme.spacing(3),
    '&::after': {
        content: '""',
        display: 'block',
        width: '44px',
        height: '3px',
        marginTop: theme.spacing(1),
        borderRadius: '2px',
        backgroundColor: theme.palette.primary.main,
    },
});

/**
 * Clean hairline divider between sections.
 */
export const sectionDividerStyle = (theme: Theme) => ({
    height: '1px',
    border: 0,
    backgroundColor: theme.palette.divider,
    marginY: theme.spacing(6),
});

/**
 * Hover lift applied to each card in the project grid.
 */
export const cardWrapperStyle = {
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    },
};

/**
 * Responsive grid container spacing for the project grid.
 */
export const gridContainerStyle = {spacing: {xs: 2, md: 3}, pb: 4};

/**
 * Responsive grid item breakpoints — capped at 4 columns (lg) for readability.
 */
export const gridItemStyle = {
    xs: 12, sm: 6, md: 4, lg: 3,
    sx: cardWrapperStyle,
};

/**
 * Projects section container layout.
 */
export const projectsBoxStyle = {flexGrow: 1, marginBottom: 2};

/**
 * Project card with a fixed height so the grid stays even.
 */
export const projectCardStyle = {
    height: '16rem',
    display: 'flex',
    flexDirection: 'column',
};

/**
 * Content area of a project card.
 */
export const projectCardContentStyle = {
    flexGrow: 1,
};

/**
 * Action area of a project card.
 */
export const projectCardActionsStyle = {
    flexGrow: 0,
    paddingX: 2,
    paddingBottom: 2,
};

/**
 * Blurb (hero) section container.
 */
export const blurbBoxStyle = (theme: Theme) => ({
    flexGrow: 1,
    paddingY: theme.spacing(4),
});

/**
 * Centered blurb title.
 */
export const blurbTitleStyle = (theme: Theme) => ({
    fontWeight: 700,
    letterSpacing: '-0.02em',
    marginBottom: theme.spacing(4),
    textAlign: 'center',
});

/**
 * Spacing above the blurb info-card grid.
 */
export const blurbGridContainerStyle = (theme: Theme) => ({
    marginTop: theme.spacing(2),
});

/**
 * Info card: centered content with a hover lift.
 */
export const infoCardStyle = (theme: Theme) => ({
    padding: theme.spacing(3),
    height: '100%',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
});

/**
 * Icon wrapper for info cards.
 */
export const infoCardIconStyle = (theme: Theme) => ({
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
});

/**
 * Bold title for info cards.
 */
export const infoCardTitleStyle = () => ({
    fontWeight: 'bold',
});

/**
 * Standard icon size for info cards.
 */
export const infoCardIconSizeStyle = {
    fontSize: 40,
};
