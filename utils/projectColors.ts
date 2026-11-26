// A small, fixed palette of muted brand-ish colours. Each project gets a stable
// colour derived from its title so it has a bit of visual identity without
// being random on every render. Shared by ProjectCard's avatar and the home
// page's ProjectTile icon, so a project reads as the same colour on both pages.
// The initials and glyphs on these are white, so every colour keeps at least
// 4.5:1 contrast with white (a test checks it); the teal, cyan, amber and
// orange were darkened from 2.1–3.6:1 to reach that.
export const AVATAR_COLORS = ['#4263eb', '#7048e8', '#0b7285', '#b35900', '#c2410c', '#087f5b'];

export const colorForTitle = (title: string): string => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
    }
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

// Colour for a status chip, keyed case-insensitively; unrecognized values fall
// back to the default (grey) chip styling rather than guessing a colour.
const STATUS_COLORS: Record<string, 'success' | 'warning'> = {
    active: 'success',
    maintenance: 'warning',
};

export const statusChipColor = (status: string): 'success' | 'warning' | undefined =>
    STATUS_COLORS[status.toLowerCase()];
