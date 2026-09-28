import type SvgIcon from '@mui/material/SvgIcon';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import BiotechIcon from '@mui/icons-material/Biotech';
import CastleIcon from '@mui/icons-material/Castle';
import ExtensionIcon from '@mui/icons-material/Extension';
import GridOnIcon from '@mui/icons-material/GridOn';
import HubIcon from '@mui/icons-material/Hub';
import PhishingIcon from '@mui/icons-material/Phishing';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PublicIcon from '@mui/icons-material/Public';
import TerminalIcon from '@mui/icons-material/Terminal';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import WavesIcon from '@mui/icons-material/Waves';

// The Material icons a project can name as its `glyph` in
// pages/data/projects.json, for projects with no artwork of their own. Each is
// a static import so the bundle carries only these twelve rather than the whole
// icon set; a name missing from this map falls back to the project's initial.
// danielstephenson.dev keeps a matching map, so a project both sites list reads
// with the same symbol on each.
export const PROJECT_GLYPHS: Record<string, typeof SvgIcon> = {
    AcUnit: AcUnitIcon,
    Biotech: BiotechIcon,
    Castle: CastleIcon,
    Extension: ExtensionIcon,
    GridOn: GridOnIcon,
    Hub: HubIcon,
    Phishing: PhishingIcon,
    Psychology: PsychologyIcon,
    Public: PublicIcon,
    Terminal: TerminalIcon,
    ViewQuilt: ViewQuiltIcon,
    Waves: WavesIcon,
};

export const glyphFor = (name?: string): typeof SvgIcon | undefined =>
    name ? PROJECT_GLYPHS[name] : undefined;
