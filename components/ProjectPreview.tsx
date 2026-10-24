import React from 'react';
import {Box, IconButton, Link, Typography} from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {type ProjectPreviewData} from '../utils/projects';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

interface ProjectPreviewProps {
    preview: ProjectPreviewData;
}

// A project's 3D preview in its details (the hover panel or the phone's
// bottom sheet): a 16:10 still, replaced in the browser by a short muted
// looping clip unless the visitor asks for reduced motion (a change of that
// setting is followed live). The details only mount when a tile is opened,
// so nothing here loads with the page. A pause button sits in the corner,
// because a loop that never ends must be stoppable (WCAG 2.2.2), and the tool
// that drew the pictures is credited under them.
const ProjectPreview: React.FC<ProjectPreviewProps> = ({preview}) => {
    const video = React.useRef<HTMLVideoElement>(null);
    const [reduced, setReduced] = React.useState(true); // the still until the browser says otherwise
    const [paused, setPaused] = React.useState(false);
    const hasClip = Boolean(preview.clip?.webm || preview.clip?.mp4);

    React.useEffect(() => {
        let query: MediaQueryList | null = null;
        try {
            query = window.matchMedia?.(REDUCED_MOTION_QUERY) ?? null;
        } catch {
            query = null;
        }
        setReduced(Boolean(query?.matches));
        if (!query) return undefined;
        const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
        query.addEventListener?.('change', onChange);
        return () => query?.removeEventListener?.('change', onChange);
    }, []);

    const playing = hasClip && !reduced;

    // React sets `muted` as a property, which some browsers read too late to
    // allow autoplay; set it again and start (or stop) the clip by hand.
    React.useEffect(() => {
        const element = video.current;
        if (!playing || !element) return;
        element.muted = true;
        if (paused) element.pause();
        else element.play?.()?.catch?.(() => setPaused(true));
    }, [playing, paused]);

    return (
        <Box data-testid="project-preview" sx={{mb: 1.5}}>
            <Box sx={{position: 'relative', overflow: 'hidden', borderRadius: 1.5, aspectRatio: '16 / 10', bgcolor: '#1b2026',
                '& img, & video': {display: 'block', width: '100%', height: '100%', objectFit: 'cover'}}}>
                <Box role="img" aria-label={preview.alt} sx={{width: '100%', height: '100%'}}>
                    {playing ? (
                        <video
                            ref={video}
                            aria-hidden
                            poster={preview.poster}
                            autoPlay={!paused}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            disablePictureInPicture
                            data-testid="project-preview-video"
                        >
                            {preview.clip?.webm ? <source src={preview.clip.webm} type="video/webm"/> : null}
                            {preview.clip?.mp4 ? <source src={preview.clip.mp4} type="video/mp4"/> : null}
                        </video>
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview.poster} alt="" aria-hidden data-testid="project-preview-poster"/>
                    )}
                </Box>
                {playing ? (
                    <IconButton
                        size="small"
                        onClick={() => setPaused((was) => !was)}
                        aria-label={paused ? 'Play the clip' : 'Pause the clip'}
                        aria-pressed={paused}
                        sx={{position: 'absolute', right: 6, bottom: 6, width: 40, height: 40, color: '#fff',
                            bgcolor: 'rgba(0, 0, 0, 0.55)', '&:hover': {bgcolor: 'rgba(0, 0, 0, 0.75)'}}}
                    >
                        {paused ? <PlayArrowIcon fontSize="small"/> : <PauseIcon fontSize="small"/>}
                    </IconButton>
                ) : null}
            </Box>
            <Typography variant="caption" color="text.secondary" component="p" sx={{mt: 0.5}} data-testid="project-preview-credit">
                {hasClip ? 'Drawn by ' : 'Still drawn by '}
                <Link href={preview.madeWith.url} target="_blank" rel="noopener noreferrer">{preview.madeWith.name}</Link>
                {preview.more ? (
                    <>
                        {' · '}
                        <Link href={preview.more} target="_blank" rel="noopener noreferrer">{preview.moreLabel ?? 'More'}</Link>
                    </>
                ) : null}
            </Typography>
        </Box>
    );
};

export default ProjectPreview;
