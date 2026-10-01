import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // NOTE (documented alternative): `fallback: '404.html'` would emit an
      // SPA fallback instead. C2 uses the prerendered `/404` route backed by
      // `+error.svelte` so `build/404.html` is emitted (host serves it for
      // unknown paths).
      fallback: undefined
    })
  }
};

export default config;
