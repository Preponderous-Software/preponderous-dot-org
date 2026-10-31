import type SvgIcon from '@mui/material/SvgIcon';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import BiotechIcon from '@mui/icons-material/Biotech';
import CastleIcon from '@mui/icons-material/Castle';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import DataArrayIcon from '@mui/icons-material/DataArray';
import ExtensionIcon from '@mui/icons-material/Extension';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import GridOnIcon from '@mui/icons-material/GridOn';
import HubIcon from '@mui/icons-material/Hub';
import LanguageIcon from '@mui/icons-material/Language';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import PhishingIcon from '@mui/icons-material/Phishing';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PublicIcon from '@mui/icons-material/Public';
import ReplayIcon from '@mui/icons-material/Replay';
import RuleIcon from '@mui/icons-material/Rule';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TerminalIcon from '@mui/icons-material/Terminal';
import TerrainIcon from '@mui/icons-material/Terrain';
import TimelineIcon from '@mui/icons-material/Timeline';
import VideocamIcon from '@mui/icons-material/Videocam';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import WavesIcon from '@mui/icons-material/Waves';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import YardIcon from '@mui/icons-material/Yard';

// The Material icons a project can name as its `glyph` in
// pages/data/projects.json, for projects with no artwork of their own. Each is
// a static import so the bundle carries only these rather than the whole
// icon set; a name missing from this map falls back to the project's initial.
// danielstephenson.dev keeps a matching map, so a project both sites list reads
// with the same symbol on each.
export const PROJECT_GLYPHS: Record<string, typeof SvgIcon> = {
    AcUnit: AcUnitIcon,
    Biotech: BiotechIcon,
    Castle: CastleIcon,
    ContentCut: ContentCutIcon,
    DataArray: DataArrayIcon,
    Extension: ExtensionIcon,
    Fireplace: FireplaceIcon,
    GridOn: GridOnIcon,
    Hub: HubIcon,
    Language: LanguageIcon,
    Layers: LayersIcon,
    Map: MapIcon,
    NightsStay: NightsStayIcon,
    Phishing: PhishingIcon,
    PhotoLibrary: PhotoLibraryIcon,
    Psychology: PsychologyIcon,
    Public: PublicIcon,
    Replay: ReplayIcon,
    Rule: RuleIcon,
    SmartToy: SmartToyIcon,
    Terminal: TerminalIcon,
    Terrain: TerrainIcon,
    Timeline: TimelineIcon,
    Videocam: VideocamIcon,
    ViewInAr: ViewInArIcon,
    ViewQuilt: ViewQuiltIcon,
    Waves: WavesIcon,
    WbTwilight: WbTwilightIcon,
    Yard: YardIcon,
};

export const glyphFor = (name?: string): typeof SvgIcon | undefined =>
    name && Object.prototype.hasOwnProperty.call(PROJECT_GLYPHS, name) ? PROJECT_GLYPHS[name] : undefined;
