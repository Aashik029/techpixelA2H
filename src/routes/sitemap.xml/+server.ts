import type { RequestHandler } from './$types';
import { response } from 'super-sitemap/sveltekit';
import { SERVICES } from '$lib/content/services';
import { WORK } from '$lib/content/work';
import { SITE_URL } from '$lib/content/site';

export const prerender = true;

export const GET: RequestHandler = async () => {
  return await response({
    origin: SITE_URL,
    excludeRoutePatterns: [/^\/404(?:$|\/)/],
    paramValues: {
      '/services/[slug]': SERVICES.map((s) => s.slug),
      '/work/[slug]': WORK.map((w) => w.slug)
    }
  });
};
