import {compareTitles, type CatalogueFacet, type CatalogueSortOption} from '@kingdom-community/community-site-kit/catalogue';

// A showcased project, as stored in pages/data/projects.json (seeded from the
// legacy application.yaml). Kept framework-free so the sort/filter helpers below
// stay pure and unit-testable.
export interface Project {
    id: string;
    title: string;
    description: string;
    githubLink: string;
    technology: string;
    // Optional link to a live/hosted version of the project.
    websiteLink?: string;
    // Grouping used by the /projects page (e.g. "Games", "Simulations",
    // "Libraries"). Optional so the home page's flat listing keeps working for
    // entries that predate this field.
    category?: string;
    // Current maintenance state (e.g. "Active", "Maintenance"), shown on the
    // /projects page as a status indicator. Optional for the same reason.
    status?: string;
    // Optional icon, a path under public/ (e.g. "/icons/roam.png"). Projects
    // without one fall back to an initials avatar in their title colour.
    icon?: string;
    // Optional Material icon name (see utils/projectGlyphs.ts) drawn on the
    // title colour for a project with no artwork, so its tile carries a symbol
    // of what it is rather than a letter shared with half the grid.
    glyph?: string;
}

// A category and the projects filed under it.
export interface ProjectCategory {
    category: string;
    projects: Project[];
}

// A DOM id for a category's heading, used by the /projects page to point each
// section's aria-labelledby at its own heading. Category names come from
// pages/data/projects.json and are free-form, so the raw value cannot be used:
// an id must not contain whitespace, and aria-labelledby is a space-separated
// list of id references — "category-Developer Tools" would resolve to two ids
// that do not exist, leaving the section with no accessible name at all.
export const categoryHeadingId = (category: string): string =>
    `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unnamed'}`;

// Sort projects alphabetically by title, case-insensitively. Returns a new
// array (does not mutate the input) so callers can keep the source order.
export const sortProjectsByTitle = (projects: Project[]): Project[] =>
    [...projects].sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

// Group projects by their `category`, sorting the categories alphabetically
// and the projects within each category by title. Projects with no category
// are filed under "Other" so every entry is still shown on the /projects page.
export const groupProjectsByCategory = (projects: Project[]): ProjectCategory[] => {
    const byCategory = new Map<string, Project[]>();
    for (const project of projects) {
        const category = project.category ?? 'Other';
        byCategory.set(category, [...(byCategory.get(category) ?? []), project]);
    }
    return Array.from(byCategory.entries())
        .sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .map(([category, categoryProjects]) => ({
            category,
            projects: sortProjectsByTitle(categoryProjects),
        }));
};

// The home page's search and filters, as community-site-kit's catalogue helpers
// take them. Technology is free text such as "TypeScript / Next.js"; each part
// is its own value, so "TypeScript" finds the Next.js sites too.
export const projectFacets: CatalogueFacet<Project>[] = [
    {key: 'category', label: 'Category', values: (project) => project.category},
    {key: 'technology', label: 'Technology', values: (project) => project.technology.split(' / ').map((part) => part.trim())},
    {key: 'status', label: 'Status', values: (project) => project.status},
];

// A–Z is the order the grid has always had, so it stays the default.
export const projectSortOptions: CatalogueSortOption<Project>[] = [
    {key: 'title', label: 'A–Z', compare: compareTitles},
    {
        key: 'category',
        label: 'By category',
        compare: (a, b) =>
            (a.category ?? 'Other').localeCompare(b.category ?? 'Other', undefined, {sensitivity: 'base'}) ||
            compareTitles(a, b),
    },
];
