import { WORK } from '$lib/content/work';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export function entries() {
  return WORK.map((w) => ({ slug: w.slug }));
}

export const load: PageLoad = ({ params }) => {
  const entry = WORK.find((w) => w.slug === params.slug);
  if (!entry) error(404, 'Work entry not found');
  return { entry };
};
