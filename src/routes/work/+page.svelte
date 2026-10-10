<script lang="ts">
  import type { PageData } from './$types';
  import JsonLd from '$lib/components/JsonLd.svelte';
  import TargoNav from '$lib/components/TargoNav.svelte';


  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Work — Tech Pixel A2H</title>
  <meta
    name="description"
    content="A sample of our design and build capabilities, including concept work."
  />
  <link rel="canonical" href="https://tech-pixel-a2h.vercel.app/work" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#12212e" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Tech Pixel A2H" />
  <meta property="og:title" content="Work — Tech Pixel A2H" />
  <meta
    property="og:description"
    content="A sample of our design and build capabilities, including concept work."
  />
  <meta property="og:url" content="https://tech-pixel-a2h.vercel.app/work" />
  <meta property="og:image" content="https://tech-pixel-a2h.vercel.app/og/work.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Work — Tech Pixel A2H" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Work — Tech Pixel A2H" />
  <meta
    name="twitter:description"
    content="A sample of our design and build capabilities, including concept work."
  />
  <meta name="twitter:image" content="https://tech-pixel-a2h.vercel.app/og/work.png" />
</svelte:head>

<JsonLd
  name="Work — Tech Pixel A2H"
  description="A sample of our design and build capabilities, including concept work."
  path="/work"
  crumbs={[{ name: 'Work', path: '/work' }]}
/>

<TargoNav active="work" />

<main id="main" tabindex="-1">
  <section class="targo-band px-6 py-24 md:py-32" aria-label="Work index">
  <div class="mx-auto max-w-6xl">
    <p class="targo-eyebrow">Selected work</p>
    <h1 class="targo-title mt-4">Our<br /><span class="t-accent">Work</span></h1>
    <p class="targo-lead mt-6 max-w-2xl">
      A sample of our design and build capabilities, including concept work.
    </p>

    <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {#each data.work as w (w.slug)}
        <a href="/work/{w.slug}" class="targo-card flex flex-col p-8">
          <p class="targo-eyebrow">{w.cat}</p>
          <h2 class="targo-quant mt-3 text-[22px] font-bold uppercase leading-tight text-[#12212e]">
            {w.title}
          </h2>
          <p class="targo-lead mt-3 flex-1 text-[15px]">{w.summary}</p>
          <p class="targo-lead mt-3 text-[12px]" data-disclosure>{w.disclosure}</p>
        </a>
      {/each}
    </div>
  </div>
  </section>
</main>
