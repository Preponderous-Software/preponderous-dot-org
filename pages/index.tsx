import type {NextPage} from 'next'
import Head from 'next/head'
import {Box, Container, Typography} from '@mui/material'
import TopBar from '../components/TopBar'
import BottomBar from '../components/BottomBar'

// pull the displayed version from package.json so the footer stays in sync
const version = require('../package.json').version

// Scaffold home page with shared chrome (TopBar/BottomBar + color-mode toggle).
// The full project showcase — blurb + cards — lands with the home-page sub-issue;
// the dedicated SEO component replaces the inline <Head> in its own sub-issue.
const Home: NextPage = () => {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Head>
                <title>Preponderous Software</title>
                <meta name="description" content="Free and open-source games and assets by Preponderous Software."/>
            </Head>
            <TopBar/>
            <Box component="main" id="main" sx={{flexGrow: 1}}>
                <Container maxWidth="md" sx={{py: 8}}>
                    <Typography variant="h1" sx={{fontSize: {xs: '2.5rem', md: '3.5rem'}, mb: 2}}>
                        Preponderous Software
                    </Typography>
                    <Typography variant="h5" color="text.secondary">
                        Developing free and open-source games and assets.
                    </Typography>
                    <Typography variant="body1" sx={{mt: 4}} color="text.secondary">
                        This site is being rebuilt with Next.js. The redesigned home page,
                        project showcase, and navigation are on their way.
                    </Typography>
                </Container>
            </Box>
            <BottomBar version={version}/>
        </Box>
    )
}

export default Home
