// A small, fixed palette of muted brand-ish colours. Each project gets a stable
// colour derived from its title so it has a bit of visual identity without
// being random on every render. Shared by ProjectCard's avatar and the home
// page's ProjectTile icon, so a project reads as the same colour on both pages.
export const AVATAR_COLORS = ['#4263eb', '#7048e8', '#1098ad', '#f59f00', '#e8590c', '#0ca678'];

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
