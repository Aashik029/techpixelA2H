<script lang="ts">
  import '../app.css';
  import '$lib/targo.css';
  import '@fontsource/quantico/400.css';
  import '@fontsource/quantico/700.css';
  import '@fontsource/space-grotesk/300.css';
  import '@fontsource/space-grotesk/400.css';
  import '@fontsource/space-grotesk/500.css';
  import '@fontsource/space-grotesk/600.css';
  import '@fontsource/space-grotesk/700.css';
  import TargoFooter from '$lib/components/TargoFooter.svelte';
  import TargoConsent from '$lib/components/TargoConsent.svelte';
  import { page } from '$app/state';

  let { children } = $props();
  const isAdmin = $derived(page.url.pathname.startsWith('/admin'));
</script>

<div class="grain">
  {@render children()}
  {#if !isAdmin}<TargoFooter />{/if}
  {#if !isAdmin}<TargoConsent />{/if}
</div>
