import React from 'react';
import {Box, Button, Card, CardActions, CardContent, Chip, Link, Stack, Typography} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
    projectCardStyle,
    projectCardContentStyle,
    projectCardActionsStyle,
} from '../styles/styles';
import {statusChipColor} from '../utils/projectColors';
import ProjectIcon from './ProjectIcon';

interface ProjectCardProps {
    title: string;
    description: string;
    githubLink: string;
    technology: string;
    // Optional link to a live/hosted version of the project; when set, the card
    // shows a "Visit Site" button as the primary action.
    websiteLink?: string;
    // Optional maintenance status (e.g. "Active", "Maintenance"), shown as a
    // colour-coded chip next to the technology chip.
    status?: string;
    // Optional artwork path and Material glyph name, as in projects.json; see
    // ProjectIcon for how they are chosen between.
    icon?: string;
    glyph?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({title, description, githubLink, technology, websiteLink, status, icon, glyph}) => {
    return (
        <Card sx={projectCardStyle}>
            <CardContent sx={projectCardContentStyle}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 1.5}}>
                    <ProjectIcon
                        project={{title, icon, glyph}}
                        sx={{width: 40, height: 40, fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700}}
                        glyphSize={24}
                    />
                    <Typography variant="h6" component="h3" sx={{fontWeight: 600, lineHeight: 1.2}}>
                        {title}
                    </Typography>
                </Stack>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        // Clamp to keep every card the same height regardless of
                        // how long the project's description is.
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {description}
                </Typography>
            </CardContent>

            {technology || status ? (
                <Stack direction="row" spacing={1} sx={{px: 2, pb: 1}}>
                    {technology ? (
                        <Chip
                            size="small"
                            variant="outlined"
                            icon={<CodeIcon/>}
                            label={technology}
                        />
                    ) : null}
                    {status ? (
                        <Chip
                            size="small"
                            color={statusChipColor(status)}
                            variant={statusChipColor(status) ? 'filled' : 'outlined'}
                            label={status}
                        />
                    ) : null}
                </Stack>
            ) : null}

            {/* The visible button text stays short so every card reads the
                same, but a page full of cards would otherwise expose a dozen
                links named only "GitHub". aria-label prefixes the project each
                action belongs to, so the links stay distinguishable when a
                screen reader lists them away from their card, while still
                containing the visible text verbatim so voice control can
                activate them by what is on screen (WCAG 2.5.3). Both actions
                also carry the site's external-link icon, matching TopBar,
                BottomBar, and Blurb. */}
            <CardActions sx={projectCardActionsStyle}>
                <Box sx={{flexGrow: 1}}/>
                {websiteLink ? (
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<OpenInNewIcon/>}
                        component={Link}
                        href={websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${title}: Visit Site`}
                    >
                        Visit Site
                    </Button>
                ) : null}
                <Button
                    variant={websiteLink ? 'outlined' : 'contained'}
                    size="small"
                    startIcon={<GitHubIcon/>}
                    endIcon={<OpenInNewIcon fontSize="small"/>}
                    component={Link}
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${title} on GitHub`}
                >
                    GitHub
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProjectCard;
