// A showcased project, as stored in pages/data/projects.json (seeded from the
// legacy application.yaml). Kept framework-free so the sort/filter helpers below
// stay pure and unit-testable.
export interface Project {
    id: string;
    title: string;
    description: string;
    githubLink: string;
    technology: string;
}

// Sort projects alphabetically by title, case-insensitively. Returns a new
// array (does not mutate the input) so callers can keep the source order.
export const sortProjectsByTitle = (projects: Project[]): Project[] =>
    [...projects].sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
