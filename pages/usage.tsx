import type {GetServerSideProps, NextPage} from 'next'
import {Alert, Box, Container, Link, Paper, Stack, Typography} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import React from 'react'
import TopBar from '../components/TopBar'
import BottomBar from '../components/BottomBar'
import Seo from '../components/Seo'
import ProjectIcon from '../components/ProjectIcon'
import StartsSparkline from '../components/StartsSparkline'
import TraceAttribution from '../components/TraceAttribution'
import {type Project} from '../utils/projects'
import {loadProjectUsage, usageRows, type UsageRow} from '../utils/projectUsage'
import {activeInstallsLabel, usageHeadline} from '../utils/usageDisplay'
import {pageStyle, sectionHeaderStyle} from '../styles/styles'

interface ProjectData {
    projects: Project[];
}

const projectData = require('./data/projects.json') as ProjectData

// pull the displayed version from package.json so the footer stays in sync
const version = require('../package.json').version

const DESCRIPTION =
    'Which Preponderous Software projects are in use, as reported by trace over the last 30 days. Test and CI runs are excluded.'

interface UsagePageProps {
    rows: UsageRow[];
    // Fixes the clock relative dates use, so server markup and hydration agree.
    renderedAt: number;
}

// Rendered per request, unlike the rest of the site: the figures change
// daily. trace's answers are cached server side for ten minutes
// (utils/traceUsage.ts), and with trace unreachable every row simply says it
// has no figures.
export const getServerSideProps: GetServerSideProps<UsagePageProps> = async () => {
    const usage = await loadProjectUsage()
    return {props: {rows: usageRows(projectData.projects, usage), renderedAt: Date.now()}}
}

const UsageListRow: React.FC<{row: UsageRow; now: number}> = ({row, now}) => {
    const headline = row.usage ? usageHeadline(row.usage, row.kind, now) : null
    return (
        <Paper
            component="li"
            variant="outlined"
            sx={{p: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 1.5, rowGap: 1}}
            data-testid="usage-row"
        >
            <ProjectIcon
                project={row.project}
                sx={{width: 40, height: 40, flexShrink: 0, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700}}
                glyphSize={24}
            />
            <Box sx={{minWidth: 0, flex: '1 1 12rem'}}>
                <Link
                    href={row.project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="subtitle1"
                    sx={{fontWeight: 600, overflowWrap: 'anywhere'}}
                    aria-label={`${row.title} on GitHub`}
                >
                    {row.title}
                    <OpenInNewIcon sx={{fontSize: '0.9rem', ml: 0.5, verticalAlign: 'middle'}} aria-hidden/>
                </Link>
                {headline ? (
                    <>
                        {headline.activeInstalls !== null ? (
                            <Typography variant="body2" sx={{fontWeight: 600}} data-testid="usage-row-installs">
                                {activeInstallsLabel(headline.activeInstalls)} (30 days)
                            </Typography>
                        ) : null}
                        <Typography variant="body2" data-testid="usage-row-last-used">
                            {headline.lastUsed ?? 'No use reported yet'}
                        </Typography>
                        {headline.starts ? (
                            <Typography variant="body2" color="text.secondary" data-testid="usage-row-starts">
                                {headline.starts}
                            </Typography>
                        ) : null}
                    </>
                ) : (
                    <Typography variant="body2" color="text.secondary" data-testid="usage-row-none">
                        No usage figures yet
                    </Typography>
                )}
            </Box>
            {row.usage && row.usage.startups30d > 0 && row.usage.days.length > 0 ? (
                <Box sx={{flex: '1 1 8rem', maxWidth: {xs: '100%', sm: 180}}}>
                    <StartsSparkline days={row.usage.days} kind={row.kind} height={32} showLabels={false}/>
                </Box>
            ) : null}
        </Paper>
    )
}

const Usage: NextPage<UsagePageProps> = ({rows, renderedAt}) => {
    const anyFigures = rows.some((row) => row.usage !== null)
    const anyInstallCounts = rows.some((row) => typeof row.usage?.activeInstalls30d === 'number')
    return (
        <Box sx={(theme) => pageStyle(theme)}>
            <Seo title="Usage" description={DESCRIPTION} path="/usage"/>
            <TopBar/>
            <Container component="main" id="main" maxWidth="md" sx={{py: 4, flexGrow: 1}}>
                <Typography variant="h3" component="h1" gutterBottom sx={(theme) => sectionHeaderStyle(theme)}>
                    Usage
                </Typography>
                <Typography gutterBottom>
                    Our games, simulations and tools report when they start, through{' '}
                    <Link href="https://github.com/Stephenson-Software/trace" target="_blank" rel="noopener noreferrer">trace</Link>:
                    a game when someone launches it, and any other program when it is run. These are the last 30
                    days of those reports.
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    A start is not a person: one player launching a game every evening counts thirty times.
                    Projects that report an install ID are counted as active installs; for the rest, this page says
                    only when the project was last used and how many starts were seen.
                    {anyInstallCounts
                        ? ' Projects are listed by active installs, then by how recently they were used.'
                        : ' Projects are listed by how recently they were used.'}
                </Typography>
                <Box sx={{mb: 3}}>
                    <TraceAttribution/>
                </Box>

                {anyFigures ? null : (
                    <Alert severity="info" sx={{mb: 3}} data-testid="usage-unavailable">
                        Usage figures are not available right now. They appear here once trace reports them.
                    </Alert>
                )}

                <Stack component="ol" spacing={1} sx={{listStyle: 'none', m: 0, p: 0, mb: 4}} aria-label="Projects by usage">
                    {rows.map((row) => <UsageListRow key={row.project.id} row={row} now={renderedAt}/>)}
                </Stack>
            </Container>
            <BottomBar version={version}/>
        </Box>
    )
}

export default Usage
