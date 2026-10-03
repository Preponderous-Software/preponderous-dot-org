import type {NextPage} from 'next'
import {Box, Button, Container, Typography} from '@mui/material'
import React from 'react'
import TopBar from '../components/TopBar'
import BottomBar from '../components/BottomBar'
import Seo from '../components/Seo'
import Blurb from '../components/Blurb'
import IconGrid from '../components/IconGrid'
import {CatalogueFilterBar} from '@kingdom-community/community-site-kit'
import {filterCatalogue, sortCatalogue, type CatalogueQuery} from '@kingdom-community/community-site-kit/catalogue'
import {projectFacets, projectSortOptions, type Project} from '../utils/projects'
import {useProjectUsage} from '../utils/useProjectUsage'
import {useNow} from '../utils/useNow'
import {pageStyle, sectionDividerStyle} from '../styles/styles'

interface ProjectData {
    projects: Project[];
}

const projectData = require('./data/projects.json') as ProjectData

// pull the displayed version from package.json so the footer stays in sync
const version = require('../package.json').version

const SectionDivider: React.FC = () => (
    <Box sx={(theme) => sectionDividerStyle(theme)}/>
)

const FILTER_BAR_FACETS = [
    {facet: projectFacets[0], display: 'chips'},
    {facet: projectFacets[1], display: 'chips'},
    {facet: projectFacets[2], display: 'chips'},
] as const

// The first thing on the page: every project as an icon, details on hover,
// with the same folded Search & filter bar as dansplugins.com and
// danielstephenson.dev above it.
const ProjectsSection: React.FC = () => {
    const [query, setQuery] = React.useState<CatalogueQuery>({})
    const [sortKey, setSortKey] = React.useState(projectSortOptions[0].key)
    const sort = projectSortOptions.find((option) => option.key === sortKey) ?? projectSortOptions[0]
    const all = projectData.projects
    const shown = filterCatalogue(sortCatalogue(all, sort), projectFacets, query)
    // trace's usage figures, fetched after the page has rendered (the page
    // itself stays static), and the visitor's clock to date them by.
    const usage = useProjectUsage()
    const now = useNow()
    return (
        <IconGrid
            projects={shown}
            usage={usage}
            now={now}
            toolbar={
                <CatalogueFilterBar
                    items={all}
                    shownCount={shown.length}
                    noun="projects"
                    facets={FILTER_BAR_FACETS}
                    query={query}
                    onQueryChange={setQuery}
                    sortOptions={projectSortOptions}
                    sortKey={sortKey}
                    onSortChange={setSortKey}
                    idPrefix="project"
                />
            }
            empty={
                <Box sx={{py: 4, textAlign: 'center'}}>
                    <Typography color="text.secondary" gutterBottom>
                        No projects match your search.
                    </Typography>
                    <Button size="small" onClick={() => setQuery({})}>Clear filters</Button>
                </Box>
            }
        />
    )
}

const Home: NextPage = () => {
    return (
        <Box sx={(theme) => pageStyle(theme)}>
            <Seo path="/"/>
            <TopBar/>
            <Container component="main" id="main" maxWidth="xl" sx={{py: 4, flexGrow: 1}}>
                <ProjectsSection/>
                <SectionDivider/>
                <Blurb/>
            </Container>
            <BottomBar version={version}/>
        </Box>
    )
}

export default Home
