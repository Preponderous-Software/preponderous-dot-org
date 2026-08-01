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
}

// A category and the projects filed under it.
export interface ProjectCategory {
    category: string;
    projects: Project[];
}

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
    return [...byCategory.entries()]
        .sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .map(([category, categoryProjects]) => ({
            category,
            projects: sortProjectsByTitle(categoryProjects),
        }));
};
