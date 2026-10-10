<script lang="ts">
  import type { PageData } from './$types';
  import JsonLd from '$lib/components/JsonLd.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.entry.title} — Work — Tech Pixel A2H</title>
  <meta name="description" content={data.entry.summary} />
  <link rel="canonical" href="https://tech-pixel-a2h.vercel.app/work/{data.entry.slug}" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#12212e" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Tech Pixel A2H" />
  <meta property="og:title" content="{data.entry.title} — Work — Tech Pixel A2H" />
  <meta property="og:description" content={data.entry.summary} />
  <meta property="og:url" content="https://tech-pixel-a2h.vercel.app/work/{data.entry.slug}" />
  <meta property="og:image" content="https://tech-pixel-a2h.vercel.app/og/work-{data.entry.slug}.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="{data.entry.title} — Tech Pixel A2H" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{data.entry.title} — Work — Tech Pixel A2H" />
  <meta name="twitter:description" content={data.entry.summary} />
  <meta name="twitter:image" content="https://tech-pixel-a2h.vercel.app/og/work-{data.entry.slug}.png" />
</svelte:head>

<JsonLd
  name="{data.entry.title} — Work — Tech Pixel A2H"
  description={data.entry.summary}
  path="/work/{data.entry.slug}"
  crumbs={[{ name: 'Work', path: '/work' }, { name: data.entry.title, path: `/work/${data.entry.slug}` }]}
/>

<section class="targo-band px-6 py-24 md:py-32" aria-label={data.entry.title}>
  <div class="mx-auto max-w-6xl">
    <p class="targo-eyebrow">{data.entry.cat}</p>
    <h1 class="targo-title mt-4">{data.entry.title}</h1>
    <p class="targo-lead mt-6 max-w-2xl" data-disclosure>{data.entry.disclosure}</p>

    <div class="targo-card mt-12 p-8 md:p-12">
      <h2 class="targo-eyebrow">About this project</h2>
      <div class="targo-prose mt-4 max-w-none">
        {#each data.entry.body as para (para)}
          <p>{para}</p>
        {/each}
      </div>
      <a href="/work" class="targo-btn mt-8">← Back to work</a>
    </div>
  </div>
</section>
