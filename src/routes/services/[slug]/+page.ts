import { SERVICES } from '$lib/content/services';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export function entries() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export const load: PageLoad = ({ params }) => {
  const entry = SERVICES.find((s) => s.slug === params.slug);
  if (!entry) error(404, 'Service not found');
  return { entry };
};
