import { SERVICES } from '$lib/content/services';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  return { services: SERVICES };
};
