/**
 * Services content module (C3). Verbatim seed from
 * `src/lib/components/TargoServices.svelte` — titles, descriptions, tags and
 * numbering copied word-for-word; nothing added, no client names, metrics or
 * testimonials invented.
 *
 * Extended detail fields (`deliverables`, `detail`) beyond the verbatim card
 * copy are UNCONFIRMED placeholders drafted from the card description alone —
 * do not present them as fact until the owner confirms.
 *
 * Data lives in `src/lib/content/data/services/*.json` (one entry per file,
 * editable via Sveltia CMS at `/cms/`). This module aggregates them in
 * filename order — output is identical to the former inline array.
 */
export interface Service {
  slug: string;
  num: string;
  title: string;
  /** Verbatim card description from TargoServices. */
  description: string;
  tag: string | null;
  /** UNCONFIRMED placeholder — generic sub-topics of the verbatim description. */
  deliverables: string[];
  /** UNCONFIRMED placeholder — elaboration of the verbatim description. */
  detail: string;
}

const modules = import.meta.glob<Service>('./data/services/*.json', {
  eager: true,
  import: 'default'
});

function need(value: unknown, file: string, field: string): asserts value {
  if (value === undefined || value === null || value === '') {
    throw new Error(`[content] ${file}: missing required field "${field}"`);
  }
}

export const SERVICES: Service[] = Object.keys(modules)
  .sort()
  .map((file) => {
    const raw = modules[file];
    need(raw.slug, file, 'slug');
    need(raw.num, file, 'num');
    need(raw.title, file, 'title');
    need(raw.description, file, 'description');
    need(raw.detail, file, 'detail');
    if (!Array.isArray(raw.deliverables)) {
      throw new Error(`[content] ${file}: field "deliverables" must be an array`);
    }
    return {
      slug: raw.slug,
      num: raw.num,
      title: raw.title,
      description: raw.description,
      tag: raw.tag || null,
      deliverables: [...raw.deliverables],
      detail: raw.detail
    };
  });

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
