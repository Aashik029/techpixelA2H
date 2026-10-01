<script lang="ts">
  import TargoNav from '$lib/components/TargoNav.svelte';
  import TargoNotFound from '$lib/components/TargoNotFound.svelte';
</script>

<svelte:head>
  <title>Page not found — Tech Pixel A2H</title>
  <meta name="robots" content="noindex, follow" />
</svelte:head>

<TargoNav active="not-found" />

<main id="main" tabindex="-1" class="targo-band">
  <TargoNotFound />
</main>
