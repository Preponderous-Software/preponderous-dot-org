import type {NextPage} from 'next'
import {Box, Container, Typography} from '@mui/material'
import React from 'react'
import TopBar from '../components/TopBar'
import BottomBar from '../components/BottomBar'
import Seo from '../components/Seo'
import ProjectGrid from '../components/ProjectGrid'
import {categoryHeadingId, groupProjectsByCategory, type Project} from '../utils/projects'
import {
    pageStyle,
    sectionHeaderStyle,
    sectionDividerStyle,
    projectsBoxStyle,
} from '../styles/styles'

interface ProjectData {
    projects: Project[];
}

const projectData = require('./data/projects.json') as ProjectData

// pull the displayed version from package.json so the footer stays in sync
const version = require('../package.json').version

const CategorySection: React.FC<{category: string; projects: Project[]}> = ({category, projects}) => {
    // Slugified rather than interpolated raw: category names are free-form data
    // and one containing a space would produce an invalid id and an
    // aria-labelledby pointing at two ids that do not exist.
    const headingId = categoryHeadingId(category)
    return (
        <Box component="section" aria-labelledby={headingId} sx={projectsBoxStyle}>
            <Typography id={headingId} variant="h4" component="h2" gutterBottom sx={(theme) => sectionHeaderStyle(theme)}>
                {category}
            </Typography>
            <ProjectGrid projects={projects}/>
        </Box>
    )
}

const ProjectsPage: NextPage = () => {
    const categories = groupProjectsByCategory(projectData.projects)
    return (
        <Box sx={(theme) => pageStyle(theme)}>
            <Seo
                title="Projects"
                description="Every game, simulation, library, and tool Preponderous Software builds, grouped by category."
                path="/projects"
            />
            <TopBar/>
            <Container component="main" id="main" maxWidth="xl" sx={{py: 4, flexGrow: 1}}>
                <Typography variant="h3" component="h1" gutterBottom sx={{fontWeight: 700, letterSpacing: '-0.01em'}}>
                    Projects
                </Typography>
                <Box sx={(theme) => sectionDividerStyle(theme)}/>
                {categories.map(({category, projects}) => (
                    <CategorySection key={category} category={category} projects={projects}/>
                ))}
            </Container>
            <BottomBar version={version}/>
        </Box>
    )
}

export default ProjectsPage
