import React from 'react';
import {Box, useMediaQuery} from '@mui/material';
import ProjectTile from './ProjectTile';
import {type Project} from '../utils/projects';
import {iconGridStyle} from '../styles/styles';

// The home page's minimal project listing: one icon per project, details on
// hover, focus, or tap. Owns which panel is open so opening one closes any
// other. The grid does not sort; callers pass the order they want shown.
const IconGrid: React.FC<{projects: Project[]}> = ({projects}) => {
    const [openId, setOpenId] = React.useState<string | null>(null);
    // Touch-only screens get a bottom sheet per tap rather than hover panels.
    // False on the server and until the first client render, so the markup
    // matches and a desktop visitor never sees the touch path.
    const touch = useMediaQuery('(hover: none)');

    const handleOpen = React.useCallback((id: string) => setOpenId(id), []);
    // Only close if the closing tile is still the open one: a tile's delayed
    // close must not shut the panel of a tile opened after it.
    const handleClose = React.useCallback(
        (id: string) => setOpenId((current) => (current === id ? null : current)),
        [],
    );

    return (
        <Box component="ul" sx={iconGridStyle}>
            {projects.map((project) => (
                <ProjectTile
                    key={project.id}
                    project={project}
                    open={openId === project.id}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    touch={touch}
                />
            ))}
        </Box>
    );
};

export default IconGrid;
