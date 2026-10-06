/**
 * Team content module (C3). UNCONFIRMED placeholder — every entry below is
 * invented structure awaiting owner input. Never present as fact.
 *
 * Data lives in `src/lib/content/data/team/*.json` (one entry per file,
 * editable via Sveltia CMS at `/cms/`). This module aggregates them in
 * filename order — output is identical to the former inline array.
 */
export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
}

const modules = import.meta.glob<TeamMember>('./data/team/*.json', {
  eager: true,
  import: 'default'
});

function need(value: unknown, file: string, field: string): asserts value {
  if (value === undefined || value === null || value === '') {
    throw new Error(`[content] ${file}: missing required field "${field}"`);
  }
}

/** UNCONFIRMED placeholder roster — replace with owner-confirmed members. */
export const TEAM: TeamMember[] = Object.keys(modules)
  .sort()
  .map((file) => {
    const raw = modules[file];
    need(raw.slug, file, 'slug');
    need(raw.name, file, 'name');
    need(raw.role, file, 'role');
    need(raw.bio, file, 'bio');
    return {
      slug: raw.slug,
      name: raw.name,
      role: raw.role,
      bio: raw.bio
    };
  });
