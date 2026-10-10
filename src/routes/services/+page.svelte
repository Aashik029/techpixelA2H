<script lang="ts">
  import type { PageData } from './$types';
  import JsonLd from '$lib/components/JsonLd.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Services — Tech Pixel A2H</title>
  <meta
    name="description"
    content="Five core services, one team: web development, AI automation, poster design, content creation and digital marketing."
  />
  <link rel="canonical" href="https://tech-pixel-a2h.vercel.app/services" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#12212e" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Tech Pixel A2H" />
  <meta property="og:title" content="Services — Tech Pixel A2H" />
  <meta
    property="og:description"
    content="Five core services, one team: web development, AI automation, poster design, content creation and digital marketing."
  />
  <meta property="og:url" content="https://tech-pixel-a2h.vercel.app/services" />
  <meta property="og:image" content="https://tech-pixel-a2h.vercel.app/og/services.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Services — Tech Pixel A2H" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Services — Tech Pixel A2H" />
  <meta
    name="twitter:description"
    content="Five core services, one team: web development, AI automation, poster design, content creation and digital marketing."
  />
  <meta name="twitter:image" content="https://tech-pixel-a2h.vercel.app/og/services.png" />
</svelte:head>

<JsonLd
  name="Services — Tech Pixel A2H"
  description="Five core services, one team: web development, AI automation, poster design, content creation and digital marketing."
  path="/services"
  crumbs={[{ name: 'Services', path: '/services' }]}
/>

<section class="targo-band-white px-6 py-24 md:py-32" aria-label="Services index">
  <div class="mx-auto max-w-6xl">
    <p class="targo-eyebrow">What we do</p>
    <h1 class="targo-title mt-4">Our<br /><span class="t-accent">Services</span></h1>
    <p class="targo-lead mt-6 max-w-2xl">
      Five core services, one team. Pick what you need now — add more as you grow.
    </p>

    <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {#each data.services as s (s.slug)}
        <a href="/services/{s.slug}" class="targo-card flex flex-col p-8">
          <span class="targo-num text-[22px]">{s.num}</span>
          <h2 class="targo-quant mt-5 text-[24px] font-bold uppercase leading-tight text-[#12212e]">
            {s.title}
          </h2>
          <p class="targo-lead mt-3 flex-1 text-[15px]">{s.description}</p>
        </a>
      {/each}
    </div>
  </div>
</section>
