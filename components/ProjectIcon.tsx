import React from 'react';
import {Avatar} from '@mui/material';
import type {SxProps, Theme} from '@mui/material/styles';
import {type Project} from '../utils/projects';
import {colorForTitle} from '../utils/projectColors';
import {glyphFor} from '../utils/projectGlyphs';

interface ProjectIconProps {
    project: Pick<Project, 'title' | 'icon' | 'glyph'>;
    // Size and shape for the avatar itself (width, height, radius, font).
    sx: SxProps<Theme>;
    // Size of a glyph drawn on the coloured tile.
    glyphSize: number | {xs: number; sm: number};
    className?: string;
}

// A project's icon, shared by the home grid's tiles and the /projects cards so
// a project looks the same on both. In order of preference: its own artwork
// (the `icon` path), a Material symbol chosen for it (the `glyph` name) on its
// title colour, and only then its initial. The artwork sits on the page's
// paper colour with a hairline border rather than on the title colour, since
// most of it is square pixel art that would otherwise bleed into a coloured
// ground; `cover` fills the tile edge to edge so a non-square source (Roam is
// 264×237) is not letterboxed, and `pixelated` keeps those small sources
// crisp when scaled up. The image is decorative (alt="") because the tile's
// caption already names it.
const ProjectIcon: React.FC<ProjectIconProps> = ({project, sx, glyphSize, className}) => {
    const {title, icon, glyph} = project;
    if (icon) {
        return (
            <Avatar
                className={className}
                variant="rounded"
                src={icon}
                alt=""
                sx={[
                    {
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        '& img': {objectFit: 'cover', imageRendering: 'pixelated'},
                    },
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
            />
        );
    }
    const Glyph = glyphFor(glyph);
    return (
        <Avatar
            className={className}
            variant="rounded"
            aria-hidden
            sx={[{bgcolor: colorForTitle(title), color: '#fff'}, ...(Array.isArray(sx) ? sx : [sx])]}
        >
            {Glyph ? <Glyph data-testid="project-glyph" sx={{fontSize: glyphSize}}/> : title.charAt(0).toUpperCase()}
        </Avatar>
    );
};

export default ProjectIcon;
