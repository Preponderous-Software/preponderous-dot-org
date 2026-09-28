import React from 'react';
import {Box, IconButton, Paper, Popper, SwipeableDrawer} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProjectDetails from './ProjectDetails';
import ProjectIcon from './ProjectIcon';
import {type Project} from '../utils/projects';
import {
    projectTileButtonStyle,
    projectTileIconStyle,
    projectTileGlyphSize,
    projectTileCaptionStyle,
    projectPanelStyle,
    projectSheetPaperStyle,
    projectSheetHandleStyle,
} from '../styles/styles';

// Delays that keep the panel from flickering: a pointer crossing the grid on
// its way elsewhere should not open every tile it passes, and one moving from
// the tile into its panel (across the small gap between them) should not
// close it.
export const OPEN_DELAY_MS = 120;
export const CLOSE_DELAY_MS = 150;

interface ProjectTileProps {
    project: Project;
    // Whether this tile's panel is the one open. The grid owns the state so
    // only one panel is ever open at a time.
    open: boolean;
    onOpen: (id: string) => void;
    onClose: (id: string) => void;
    // A touch-only screen (no hover): a tap opens the details in a bottom
    // sheet instead of the hover panel, which on a phone covered the tiles
    // beside it and could run past the bottom of the screen.
    touch?: boolean;
}

// One icon in the home page's grid, and the details it opens. With a mouse or
// keyboard, a panel opens on hover, on keyboard focus, and on click, and is
// rendered in place (disablePortal) so that tabbing from the
// tile moves straight into its links, and so that pointer and focus movement
// between tile and panel stays inside the one wrapper these handlers watch. On
// a touch-only screen a tap opens a bottom sheet instead; none of the hover
// and focus handling applies there, since the sheet takes focus away from the
// wrapper by design and closes only on its own terms.
const ProjectTile: React.FC<ProjectTileProps> = ({project, open, onOpen, onClose, touch = false}) => {
    const {id, title} = project;
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    // The pointer type of the press in progress, so the focus that a press
    // causes is not mistaken for keyboard focus and the click can tell a mouse
    // (which has already opened the panel by hovering) from a finger.
    const pointerType = React.useRef<string | null>(null);
    // Set while Escape hands focus back to the tile, so that focus does not
    // immediately reopen the panel it just closed.
    const suppressFocusOpen = React.useRef(false);
    const panelId = `project-panel-${id}`;
    const titleId = `project-title-${id}`;

    const clearTimer = () => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    };

    React.useEffect(() => clearTimer, []);

    const scheduleOpen = () => {
        clearTimer();
        timer.current = setTimeout(() => onOpen(id), OPEN_DELAY_MS);
    };

    const scheduleClose = () => {
        clearTimer();
        timer.current = setTimeout(() => onClose(id), CLOSE_DELAY_MS);
    };

    const handleFocus = () => {
        if (pointerType.current || suppressFocusOpen.current) {
            return;
        }
        clearTimer();
        onOpen(id);
    };

    const handleBlur = (event: React.FocusEvent) => {
        const next = event.relatedTarget as Node | null;
        if (!next || !wrapperRef.current?.contains(next)) {
            clearTimer();
            onClose(id);
        }
    };

    const handleClick = () => {
        const wasMouse = pointerType.current === 'mouse';
        pointerType.current = null;
        clearTimer();
        // A mouse has hovered the panel open already, so its click should not
        // toggle it shut again; a tap or a keyboard press toggles.
        if (wasMouse || !open) {
            onOpen(id);
        } else {
            onClose(id);
        }
    };

    // Closing the sheet hands focus back to the tile that opened it, once the
    // sheet has slid away (until then its focus trap would take focus straight
    // back). MUI's own focus restore is off: a tap does not focus a button in
    // every mobile browser, so there may be nothing for it to restore to.
    const closeSheet = () => onClose(id);
    const focusTile = () => buttonRef.current?.focus({preventScroll: true});

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape' && open) {
            event.stopPropagation();
            clearTimer();
            onClose(id);
            suppressFocusOpen.current = true;
            buttonRef.current?.focus();
            suppressFocusOpen.current = false;
        }
    };

    return (
        <Box
            component="li"
            ref={wrapperRef}
            {...(touch ? {} : {
                onMouseEnter: scheduleOpen,
                onMouseLeave: scheduleClose,
                onFocus: handleFocus,
                onBlur: handleBlur,
                onKeyDown: handleKeyDown,
            })}
            sx={{minWidth: 0}}
        >
            <Box
                component="button"
                type="button"
                ref={buttonRef}
                aria-expanded={open}
                aria-controls={panelId}
                onPointerDown={(event: React.PointerEvent) => {
                    pointerType.current = event.pointerType || 'mouse';
                }}
                onClick={touch ? () => onOpen(id) : handleClick}
                sx={(theme) => projectTileButtonStyle(theme)}
            >
                <ProjectIcon
                    className="project-tile-icon"
                    project={project}
                    sx={projectTileIconStyle}
                    glyphSize={projectTileGlyphSize}
                />
                <Box component="span" className="project-tile-caption" sx={projectTileCaptionStyle}>
                    {title}
                </Box>
            </Box>
            {touch ? (
                <SwipeableDrawer
                    anchor="bottom"
                    open={open}
                    onOpen={() => onOpen(id)}
                    onClose={closeSheet}
                    disableSwipeToOpen
                    disableRestoreFocus
                    SlideProps={{onExited: focusTile}}
                    PaperProps={{
                        id: panelId,
                        role: 'dialog',
                        'aria-modal': true,
                        'aria-labelledby': titleId,
                        sx: projectSheetPaperStyle,
                    }}
                >
                    <Box aria-hidden sx={projectSheetHandleStyle}/>
                    <ProjectDetails
                        project={project}
                        titleId={titleId}
                        titleAction={(
                            <IconButton size="small" edge="end" aria-label={`Close ${title}`} onClick={closeSheet}>
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        )}
                    />
                </SwipeableDrawer>
            ) : (
                <Popper
                    open={open}
                    anchorEl={buttonRef.current}
                    placement="bottom"
                    disablePortal
                    modifiers={[
                        {name: 'offset', options: {offset: [0, 8]}},
                        {name: 'flip', enabled: true},
                        {name: 'preventOverflow', options: {padding: 16}},
                    ]}
                    sx={{zIndex: (theme) => theme.zIndex.tooltip}}
                >
                    <Paper id={panelId} role="region" aria-label={title} elevation={8} sx={projectPanelStyle}>
                        <ProjectDetails project={project}/>
                    </Paper>
                </Popper>
            )}
        </Box>
    );
};

export default ProjectTile;
