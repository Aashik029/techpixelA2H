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

  let { children } = $props();
</script>

<div class="grain">
  {@render children()}
  <TargoFooter />
  <TargoConsent />
</div>
