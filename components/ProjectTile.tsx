import React from 'react';
import {Avatar, Box, Button, Chip, Link, Paper, Popper, Stack, Typography} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {type Project} from '../utils/projects';
import {colorForTitle, statusChipColor} from '../utils/projectColors';
import {
    projectTileButtonStyle,
    projectTileIconStyle,
    projectTileCaptionStyle,
    projectPanelStyle,
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
}

// One icon in the home page's grid, and the details panel it opens. The panel
// opens on hover, on keyboard focus, and on click (the only way in on a touch
// screen), and is rendered in place (disablePortal) so that tabbing from the
// tile moves straight into its links, and so that pointer and focus movement
// between tile and panel stays inside the one wrapper these handlers watch.
const ProjectTile: React.FC<ProjectTileProps> = ({project, open, onOpen, onClose}) => {
    const {id, title, description, githubLink, technology, websiteLink, status, icon} = project;
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
            onMouseEnter={scheduleOpen}
            onMouseLeave={scheduleClose}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
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
                onClick={handleClick}
                sx={(theme) => projectTileButtonStyle(theme)}
            >
                <Avatar
                    className="project-tile-icon"
                    variant="rounded"
                    {...(icon ? {src: icon, alt: ''} : {'aria-hidden': true})}
                    sx={{...projectTileIconStyle, bgcolor: colorForTitle(title)}}
                >
                    {title.charAt(0).toUpperCase()}
                </Avatar>
                <Box component="span" className="project-tile-caption" sx={projectTileCaptionStyle}>
                    {title}
                </Box>
            </Box>
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
                    <Typography variant="h6" component="h3" sx={{fontWeight: 600, lineHeight: 1.2, mb: 1}}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 1.5}}>
                        {description}
                    </Typography>
                    {technology || status ? (
                        <Stack direction="row" spacing={1} sx={{mb: 1.5, flexWrap: 'wrap', rowGap: 1}}>
                            {technology ? (
                                <Chip size="small" variant="outlined" icon={<CodeIcon/>} label={technology}/>
                            ) : null}
                            {status ? (
                                <Chip
                                    size="small"
                                    color={statusChipColor(status)}
                                    variant={statusChipColor(status) ? 'filled' : 'outlined'}
                                    label={status}
                                />
                            ) : null}
                        </Stack>
                    ) : null}
                    {/* Same actions and accessible names as ProjectCard, so a
                        project's links read the same on the home page as on
                        /projects. */}
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {websiteLink ? (
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<OpenInNewIcon/>}
                                component={Link}
                                href={websiteLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${title}: Visit Site`}
                            >
                                Visit Site
                            </Button>
                        ) : null}
                        <Button
                            variant={websiteLink ? 'outlined' : 'contained'}
                            size="small"
                            startIcon={<GitHubIcon/>}
                            endIcon={<OpenInNewIcon fontSize="small"/>}
                            component={Link}
                            href={githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${title} on GitHub`}
                        >
                            GitHub
                        </Button>
                    </Stack>
                </Paper>
            </Popper>
        </Box>
    );
};

export default ProjectTile;
