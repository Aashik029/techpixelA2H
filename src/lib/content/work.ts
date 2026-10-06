/**
 * Evidence-bound case-study content (C4). Seeded verbatim from the six
 * `TargoWork.svelte` cards — no invented client names, metrics,
 * testimonials, or percentages. Every entry carries a non-empty
 * `disclosure` label; the HRMS entry is labelled concept work.
 *
 * Data lives in `src/lib/content/data/work/*.json` (one entry per file,
 * editable via Sveltia CMS at `/cms/`). This module aggregates them in
 * filename order — output is identical to the former inline array.
 */

export interface WorkEntry {
  slug: string;
  cat: string;
  title: string;
  summary: string;
  disclosure: string;
  body: string[];
}

const modules = import.meta.glob<WorkEntry>('./data/work/*.json', {
  eager: true,
  import: 'default'
});

function need(value: unknown, file: string, field: string): asserts value {
  if (value === undefined || value === null || value === '') {
    throw new Error(`[content] ${file}: missing required field "${field}"`);
  }
}

export const WORK: WorkEntry[] = Object.keys(modules)
  .sort()
  .map((file) => {
    const raw = modules[file];
    need(raw.slug, file, 'slug');
    need(raw.cat, file, 'cat');
    need(raw.title, file, 'title');
    need(raw.summary, file, 'summary');
    need(raw.disclosure, file, 'disclosure');
    if (!Array.isArray(raw.body)) {
      throw new Error(`[content] ${file}: field "body" must be an array`);
    }
    return {
      slug: raw.slug,
      cat: raw.cat,
      title: raw.title,
      summary: raw.summary,
      disclosure: raw.disclosure,
      body: [...raw.body]
    };
  });

export function getWork(slug: string): WorkEntry | undefined {
  return WORK.find((w) => w.slug === slug);
}
