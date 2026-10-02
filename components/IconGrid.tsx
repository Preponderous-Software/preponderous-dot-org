import React from 'react';
import {CatalogueGrid} from '@kingdom-community/community-site-kit';
import ProjectDetails from './ProjectDetails';
import ProjectIcon from './ProjectIcon';
import {type Project} from '../utils/projects';
import {projectsBoxStyle} from '../styles/styles';

// The home page's project listing: one icon per project, details on hover,
// focus or click, or in a bottom sheet on tap where there is no hover. The
// grid itself — tiles, panels, sheet, timings — is community-site-kit's
// CatalogueGrid, shared with danielstephenson.dev and dansplugins.com; this
// file only says what a project's icon and details look like. The section
// carries the #projects id; nothing on the site links to it any more, since
// Blurb's "Browse Projects" button goes to the full /projects page.
interface IconGridProps {
    projects: Project[];
    // Controls shown above the grid, inside its section (the search and filters).
    toolbar?: React.ReactNode;
    // Shown in place of the grid when there are no projects to lay out.
    empty?: React.ReactNode;
}

const fill = {width: '100%', height: '100%', borderRadius: 'inherit', fontSize: {xs: '1.4rem', sm: '1.6rem'}};

const IconGrid: React.FC<IconGridProps> = ({projects, toolbar, empty}) => (
    <CatalogueGrid
        items={projects}
        heading="Projects"
        sectionId="projects"
        idPrefix="project"
        renderIcon={(project) => (
            <ProjectIcon className="project-tile-icon" project={project} sx={fill} glyphSize={{xs: 30, sm: 34}}/>
        )}
        renderDetails={(project, {titleId}) => <ProjectDetails project={project} titleId={titleId}/>}
        toolbar={toolbar}
        empty={empty}
        sx={projectsBoxStyle}
    />
);

export default IconGrid;
