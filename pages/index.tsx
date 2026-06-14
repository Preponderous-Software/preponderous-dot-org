import type {NextPage} from 'next'
import Head from 'next/head'
import {Box, Container, Typography} from '@mui/material'

// Minimal scaffold placeholder. The full home page — project showcase cards,
// blurb, search/sort — lands with the home-page sub-issue; the SEO component,
// TopBar/BottomBar chrome, and color-mode toggle each arrive in their own
// sub-issues. This page exists so `next build` succeeds and the theme/color-mode
// wiring in _app.tsx has something to render.
const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Preponderous Software</title>
                <meta name="description" content="Free and open-source games and assets by Preponderous Software."/>
            </Head>
            <Box component="main" id="main">
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
        </>
    )
}

export default Home
