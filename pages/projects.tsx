import type {NextPage} from 'next'
import {Box, Container, Grid, Typography} from '@mui/material'
import React from 'react'
import TopBar from '../components/TopBar'
import BottomBar from '../components/BottomBar'
import Seo from '../components/Seo'
import ProjectCard from '../components/ProjectCard'
import {groupProjectsByCategory, type Project} from '../utils/projects'
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

const CategorySection: React.FC<{category: string; projects: Project[]}> = ({category, projects}) => (
    <Box component="section" aria-labelledby={`category-${category}`} sx={projectsBoxStyle}>
        <Typography id={`category-${category}`} variant="h4" component="h2" gutterBottom sx={(theme) => sectionHeaderStyle(theme)}>
            {category}
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
                        status={project.status}
                    />
                </Grid>
            ))}
        </Grid>
    </Box>
)

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
