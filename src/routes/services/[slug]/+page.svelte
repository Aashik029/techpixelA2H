<script lang="ts">
  import type { PageData } from './$types';
  import JsonLd from '$lib/components/JsonLd.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.entry.title} — Services — Tech Pixel A2H</title>
  <meta name="description" content={data.entry.description} />
  <link rel="canonical" href="https://tech-pixel-a2h.vercel.app/services/{data.entry.slug}" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#12212e" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Tech Pixel A2H" />
  <meta property="og:title" content="{data.entry.title} — Services — Tech Pixel A2H" />
  <meta property="og:description" content={data.entry.description} />
  <meta property="og:url" content="https://tech-pixel-a2h.vercel.app/services/{data.entry.slug}" />
  <meta property="og:image" content="https://tech-pixel-a2h.vercel.app/og/services-{data.entry.slug}.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="{data.entry.title} — Tech Pixel A2H" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{data.entry.title} — Services — Tech Pixel A2H" />
  <meta name="twitter:description" content={data.entry.description} />
  <meta name="twitter:image" content="https://tech-pixel-a2h.vercel.app/og/services-{data.entry.slug}.png" />
</svelte:head>

<JsonLd
  name="{data.entry.title} — Services — Tech Pixel A2H"
  description={data.entry.description}
  path="/services/{data.entry.slug}"
  crumbs={[{ name: 'Services', path: '/services' }, { name: data.entry.title, path: `/services/${data.entry.slug}` }]}
/>

<section class="targo-band-white px-6 py-24 md:py-32" aria-label={data.entry.title}>
  <div class="mx-auto max-w-6xl">
    <p class="targo-eyebrow">Service {data.entry.num}</p>
    <h1 class="targo-title mt-4">{data.entry.title}</h1>
    <p class="targo-lead mt-6 max-w-2xl">{data.entry.description}</p>

    <div class="targo-card mt-12 p-8 md:p-12">
      <h2 class="targo-eyebrow">What's included</h2>
      <ul class="targo-lead mt-4 text-[15px]">
        {#each data.entry.deliverables as d (d)}
          <li>{d}</li>
        {/each}
      </ul>
      <div class="targo-prose mt-6 max-w-none">
        <p>{data.entry.detail}</p>
      </div>
      <div class="mt-8 flex flex-wrap gap-4">
        <a href="/#contact" class="targo-btn">Enquire about this service →</a>
        <a href="/services" class="targo-btn targo-btn-cyan">← All services</a>
      </div>
    </div>
  </div>
</section>
