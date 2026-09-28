import type {NextPage} from 'next'
import {Box, Container, Typography} from '@mui/material'
import React from 'react'
import TopBar from '../components/TopBar'
import BottomBar from '../components/BottomBar'
import Seo from '../components/Seo'
import Blurb from '../components/Blurb'
import IconGrid from '../components/IconGrid'
import {sortProjectsByTitle, type Project} from '../utils/projects'
import {
    pageStyle,
    sectionDividerStyle,
    projectsBoxStyle,
    visuallyHiddenStyle,
} from '../styles/styles'

interface ProjectData {
    projects: Project[];
}

const projectData = require('./data/projects.json') as ProjectData

// pull the displayed version from package.json so the footer stays in sync
const version = require('../package.json').version

const SectionDivider: React.FC = () => (
    <Box sx={(theme) => sectionDividerStyle(theme)}/>
)

// The first thing on the page: every project as an icon, details on hover.
// The heading is there for screen readers only; the grid itself is kept bare.
// Keeps the #projects id Blurb's "Browse Projects" button points at.
const ProjectsSection: React.FC<{projects: Project[]}> = ({projects}) => (
    <Box id="projects" component="section" aria-labelledby="projects-heading" sx={projectsBoxStyle}>
        <Typography id="projects-heading" variant="h3" component="h2" sx={visuallyHiddenStyle}>
            Projects
        </Typography>
        <IconGrid projects={projects}/>
    </Box>
)

const Home: NextPage = () => {
    const projects = sortProjectsByTitle(projectData.projects)
    return (
        <Box sx={(theme) => pageStyle(theme)}>
            <Seo path="/"/>
            <TopBar/>
            <Container component="main" id="main" maxWidth="xl" sx={{py: 4, flexGrow: 1}}>
                <ProjectsSection projects={projects}/>
                <SectionDivider/>
                <Blurb/>
            </Container>
            <BottomBar version={version}/>
        </Box>
    )
}

export default Home
