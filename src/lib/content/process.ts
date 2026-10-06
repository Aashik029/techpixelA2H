/**
 * Process content module (C3). UNCONFIRMED placeholder — steps describe a
 * generic engagement flow awaiting owner confirmation. Never present as fact.
 *
 * Data lives in `src/lib/content/data/process/*.json` (one entry per file,
 * editable via Sveltia CMS at `/cms/`). This module aggregates them in
 * filename order — output is identical to the former inline array.
 */
export interface ProcessStep {
  num: string;
  title: string;
  description: string;
}

const modules = import.meta.glob<ProcessStep>('./data/process/*.json', {
  eager: true,
  import: 'default'
});

function need(value: unknown, file: string, field: string): asserts value {
  if (value === undefined || value === null || value === '') {
    throw new Error(`[content] ${file}: missing required field "${field}"`);
  }
}

/** UNCONFIRMED placeholder steps — confirm the real workflow with the owner. */
export const PROCESS: ProcessStep[] = Object.keys(modules)
  .sort()
  .map((file) => {
    const raw = modules[file];
    need(raw.num, file, 'num');
    need(raw.title, file, 'title');
    need(raw.description, file, 'description');
    return {
      num: raw.num,
      title: raw.title,
      description: raw.description
    };
  });
