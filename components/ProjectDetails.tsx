import React from 'react';
import {Button, Chip, Link, Stack, Typography} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {type Project} from '../utils/projects';
import {statusChipColor} from '../utils/projectColors';
import {traceProgramFor} from '../utils/traceNames';
import type {ProgramUsage} from '../utils/traceUsage';
import UsageLine from './UsageLine';

interface ProjectDetailsProps {
    project: Project;
    // Id for the title, so the container (the hover panel or the phone's
    // bottom sheet) can name itself after it.
    titleId?: string;
    // Rendered beside the title — the bottom sheet's close button.
    titleAction?: React.ReactNode;
    // The project's trace figures, when it reports and they have arrived,
    // and the visitor's clock to date them by; shown as one usage line.
    usage?: ProgramUsage;
    now?: number | null;
}

// What a tile reveals about its project: title, description, technology and
// status, and the project's links. Shared by the desktop hover panel and the
// bottom sheet a tap opens on a touch screen, so both always show the same.
const ProjectDetails: React.FC<ProjectDetailsProps> = ({project, titleId, titleAction, usage, now}) => {
    const {title, description, githubLink, technology, websiteLink, status} = project;
    const traceProgram = traceProgramFor(project.id);
    return (
        <>
            <Stack direction="row" alignItems="flex-start" spacing={1} sx={{mb: 1}}>
                <Typography id={titleId} variant="h6" component="h3" sx={{fontWeight: 600, lineHeight: 1.2, flexGrow: 1}}>
                    {title}
                </Typography>
                {titleAction}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{mb: 1.5}}>
                {description}
            </Typography>
            {technology || status ? (
                <Stack direction="row" spacing={1} sx={{mb: 1.5, flexWrap: 'wrap', rowGap: 1}}>
                    {technology ? (
                        <Chip size="small" variant="outlined" icon={<CodeIcon/>} label={technology}/>
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
            {usage && traceProgram && typeof now === 'number' ? (
                <UsageLine usage={usage} kind={traceProgram.kind} now={now}/>
            ) : null}
            {/* Same actions and accessible names as ProjectCard, so a
                project's links read the same on the home page as on
                /projects. */}
            <Stack direction="row" spacing={1} justifyContent="flex-end">
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
            </Stack>
        </>
    );
};

export default ProjectDetails;
