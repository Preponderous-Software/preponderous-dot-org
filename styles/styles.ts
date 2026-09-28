import {Theme} from '@mui/material/styles';

/**
 * Media query matching a visitor who has asked their operating system to
 * reduce motion. Exported so the tests can assert the styles below honour it
 * without restating the query string.
 */
export const REDUCED_MOTION_QUERY = '@media (prefers-reduced-motion: reduce)';

/**
 * Cancels a hover effect's movement for reduced-motion visitors, leaving the
 * colour and shadow feedback of that same hover intact — those are feedback
 * rather than motion, and dropping them would cost the affordance without
 * benefiting anyone.
 *
 * The global rule in styles/globals.css collapses transition durations, but a
 * zero-duration transform still teleports the element to its lifted position;
 * the transform itself has to be undone here. Spread this **last** into a
 * style object: Emotion serializes keys in insertion order, and the nested
 * `&:hover` below carries the same specificity as the one it overrides, so it
 * only wins while it comes later in the generated stylesheet.
 */
const withoutHoverMotion = {
    [REDUCED_MOTION_QUERY]: {
        transition: 'none',
        '&:hover': {transform: 'none'},
    },
};

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
    ...withoutHoverMotion,
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
    ...withoutHoverMotion,
};

/**
 * The phone navigation drawer, in the app bar's colours.
 */
export const navDrawerPaperStyle = (theme: Theme) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#161b22' : theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
});

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
    ...withoutHoverMotion,
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
    ...withoutHoverMotion,
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
 * Project card with a minimum height so the grid stays even. `height: 100%`
 * stretches every card to its grid row, so a card whose title wraps onto extra
 * lines grows (and its row-mates with it) instead of clipping its actions.
 */
export const projectCardStyle = {
    minHeight: '16rem',
    height: '100%',
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
 * Hides an element visually while leaving it in the accessibility tree — for
 * the icon grid's section heading, which screen readers need but the minimal
 * grid deliberately does not show.
 */
export const visuallyHiddenStyle = {
    // Pixel strings, not numbers: in sx a width of 1 means 100%, and a margin
    // of -1 means one theme spacing unit.
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    border: 0,
} as const;

/**
 * The home page's icon grid: no cards, no borders, just as many fixed-width
 * columns as fit. Narrower columns on phones keep four across at 390px.
 */
export const iconGridStyle = {
    display: 'grid',
    gridTemplateColumns: {
        xs: 'repeat(auto-fill, minmax(76px, 1fr))',
        sm: 'repeat(auto-fill, minmax(96px, 1fr))',
    },
    gap: {xs: 2, sm: 3},
    listStyle: 'none',
    margin: 0,
    padding: 0,
};

/**
 * Size of a tile's icon, in px per breakpoint.
 */
export const projectTileIconSize = {xs: 56, sm: 64};

// A project glyph drawn on its tile, about half the tile so it reads at a
// glance without crowding the rounded corners.
export const projectTileGlyphSize = {xs: 30, sm: 34};

/**
 * A tile in the icon grid: an unstyled button holding the icon and a one-line
 * caption. Hover and keyboard focus grow the icon slightly and lift the
 * caption to the primary text colour; reduced-motion visitors keep the colour
 * change but not the scale.
 */
export const projectTileButtonStyle = (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
    width: '100%',
    padding: 0,
    border: 0,
    background: 'none',
    cursor: 'pointer',
    font: 'inherit',
    color: 'inherit',
    '& .project-tile-icon': {
        transition: 'transform 0.15s ease',
    },
    '& .project-tile-caption': {
        color: theme.palette.text.secondary,
        transition: 'color 0.15s ease',
    },
    '&:hover .project-tile-icon, &:focus-visible .project-tile-icon, &[aria-expanded="true"] .project-tile-icon': {
        transform: 'scale(1.06)',
    },
    '&:hover .project-tile-caption, &:focus-visible .project-tile-caption, &[aria-expanded="true"] .project-tile-caption': {
        color: theme.palette.text.primary,
    },
    '&:focus-visible': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: 4,
        borderRadius: '14px',
    },
    [REDUCED_MOTION_QUERY]: {
        '& .project-tile-icon': {transition: 'none'},
        '&:hover .project-tile-icon, &:focus-visible .project-tile-icon, &[aria-expanded="true"] .project-tile-icon': {
            transform: 'none',
        },
    },
});

/**
 * The tile's icon: a rounded square, image or initials.
 */
export const projectTileIconStyle = {
    width: projectTileIconSize,
    height: projectTileIconSize,
    borderRadius: '14px',
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 700,
    fontSize: {xs: '1.5rem', sm: '1.75rem'},
};

/**
 * The tile's caption, centred. On a phone's narrow columns one line cut most
 * names to a few letters ("Apex-Ecos…"), so there it wraps to two lines before
 * the ellipsis; wider screens keep the single line.
 */
export const projectTileCaptionStyle = {
    fontSize: '0.75rem',
    lineHeight: 1.3,
    textAlign: 'center',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: {xs: 'normal', sm: 'nowrap'},
    display: {xs: '-webkit-box', sm: 'block'},
    WebkitLineClamp: {xs: 2, sm: 'none'},
    WebkitBoxOrient: 'vertical',
    overflowWrap: 'anywhere',
} as const;

/**
 * The details panel a tile opens on hover, focus, or tap. Never wider than the
 * viewport less its gutters, so it cannot scroll a phone sideways.
 */
export const projectPanelStyle = {
    width: 320,
    maxWidth: 'calc(100vw - 32px)',
    padding: 2,
};

/**
 * The bottom sheet a tap opens on a touch screen: full width, rounded top
 * corners, never taller than most of the screen (the rest scrolls), and padded
 * clear of the home indicator on phones that have one.
 */
export const projectSheetPaperStyle = {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80vh',
    overflowY: 'auto',
    paddingX: 2,
    paddingTop: 1,
    paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
};

/**
 * The grab handle at the top of the bottom sheet — the cue that it swipes down.
 */
export const projectSheetHandleStyle = (theme: Theme) => ({
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.palette.divider,
    marginX: 'auto',
    marginBottom: 1.5,
});

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
    // The h2 variant's fixed 3.75rem renders "Preponderous" wider than a phone's
    // content column, which scrolled the whole page sideways; step it down on xs.
    fontSize: {xs: '2.5rem', sm: '3.75rem'},
    overflowWrap: 'break-word',
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
    ...withoutHoverMotion,
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

/**
 * Extra styling for the linking variant of an info card. It renders as a real
 * anchor, so the browser's default link colour and underline have to be undone
 * to keep it looking like the non-linking card next to it.
 */
export const infoCardLinkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
};

/**
 * The external-link affordance on a linking info card, matching the
 * OpenInNewIcon the top bar and hero already put on their outbound links.
 */
export const infoCardExternalIconStyle = {
    fontSize: '1rem',
    marginLeft: '0.35rem',
    verticalAlign: 'middle',
};
