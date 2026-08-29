import React from 'react';
import {Grid} from '@mui/material';
import ProjectCard from './ProjectCard';
import {type Project} from '../utils/projects';
import {gridContainerStyle, gridItemStyle} from '../styles/styles';

// The responsive card grid shared by the home page's single flat listing and
// the per-category sections on /projects. Both showed the same cards from the
// same data, so both carried a copy of this mapping — and every field added to
// ProjectCard (websiteLink, then status) had to be threaded through both. Owned
// here instead, so a new card field is wired up once and appears on both pages.
//
// Only the grid is shared: each caller keeps its own section wrapper and
// heading, which genuinely differ (one #projects section on the home page,
// versus one aria-labelledby section per category on /projects).
const ProjectGrid: React.FC<{projects: Project[]}> = ({projects}) => (
    <Grid container {...gridContainerStyle}>
        {projects.map((project) => (
            <Grid item {...gridItemStyle} key={project.id}>
                <ProjectCard
                    title={project.title}
                    description={project.description}
                    githubLink={project.githubLink}
                    technology={project.technology}
                    websiteLink={project.websiteLink}
                    status={project.status}
                />
            </Grid>
        ))}
    </Grid>
);

export default ProjectGrid;
