<script lang="ts">
  import TargoNav from '$lib/components/TargoNav.svelte';
  import TargoNotFound from '$lib/components/TargoNotFound.svelte';
  import JsonLd from '$lib/components/JsonLd.svelte';
</script>

<svelte:head>
  <title>Page not found — Tech Pixel A2H</title>
  <meta name="robots" content="noindex, follow" />
</svelte:head>

<JsonLd
  name="Page not found — Tech Pixel A2H"
  description="The page you are looking for does not exist."
  path="/404"
/>

<TargoNav active="not-found" />

<main id="main" tabindex="-1" class="targo-band">
  <TargoNotFound />
</main>
