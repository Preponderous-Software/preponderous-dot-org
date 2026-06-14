import type {NextPage} from 'next'
import {Box, Container, Grid, Typography} from '@mui/material'
import React from 'react'
import TopBar from '../components/TopBar'
import BottomBar from '../components/BottomBar'
import Seo from '../components/Seo'
import Blurb from '../components/Blurb'
import ProjectCard from '../components/ProjectCard'
import {sortProjectsByTitle, type Project} from '../utils/projects'
import {
    pageStyle,
    sectionHeaderStyle,
    sectionDividerStyle,
    projectsBoxStyle,
    gridContainerStyle,
    gridItemStyle,
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

const ProjectsSection: React.FC<{projects: Project[]}> = ({projects}) => (
    <Box id="projects" sx={projectsBoxStyle}>
        <Typography variant="h3" component="div" gutterBottom sx={(theme) => sectionHeaderStyle(theme)}>
            Projects
        </Typography>
        <Grid container {...gridContainerStyle}>
            {projects.map((project) => (
                <Grid item {...gridItemStyle} key={project.id}>
                    <ProjectCard
                        title={project.title}
                        description={project.description}
                        githubLink={project.githubLink}
                        technology={project.technology}
                        websiteLink={project.websiteLink}
                    />
                </Grid>
            ))}
        </Grid>
    </Box>
)

const Home: NextPage = () => {
    const projects = sortProjectsByTitle(projectData.projects)
    return (
        <Box sx={(theme) => pageStyle(theme)}>
            <Seo/>
            <TopBar/>
            <Container component="main" id="main" maxWidth="xl" sx={{py: 4, flexGrow: 1}}>
                <Blurb/>
                <SectionDivider/>
                <ProjectsSection projects={projects}/>
            </Container>
            <BottomBar version={version}/>
        </Box>
    )
}

export default Home
