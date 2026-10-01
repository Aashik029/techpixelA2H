import { WORK } from '$lib/content/work';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  return { work: WORK };
};
