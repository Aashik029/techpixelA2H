/**
 * FAQ content module (C3). Answers are limited to claims already published
 * elsewhere on the site (services, process, about and contact copy) — no
 * pricing figures, client names, metrics or guarantees are invented here.
 *
 * Data lives in `src/lib/content/data/faq/*.json` (one entry per file,
 * editable via Sveltia CMS at `/cms/`). This module aggregates them in
 * filename order. The first four entries also power the home-page
 * "Straight answers" block.
 */
export interface Faq {
  question: string;
  answer: string;
}

const modules = import.meta.glob<Faq>('./data/faq/*.json', {
  eager: true,
  import: 'default'
});

function need(value: unknown, file: string, field: string): asserts value {
  if (value === undefined || value === null || value === '') {
    throw new Error(`[content] ${file}: missing required field "${field}"`);
  }
}

/** UNCONFIRMED placeholder FAQs — confirm every answer with the owner. */
export const FAQS: Faq[] = Object.keys(modules)
  .sort()
  .map((file) => {
    const raw = modules[file];
    need(raw.question, file, 'question');
    need(raw.answer, file, 'answer');
    return {
      question: raw.question,
      answer: raw.answer
    };
  });
