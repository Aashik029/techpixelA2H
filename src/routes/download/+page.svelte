<script lang="ts">
  import JsonLd from '$lib/components/JsonLd.svelte';
  import TargoNav from '$lib/components/TargoNav.svelte';
  import {
    CONTACT_HREF,
    EMAIL,
    EMAIL_HREF,
    PHONE_DISPLAY,
    PHONE_TEL,
    SITE_URL,
    WHATSAPP_HREF
  } from '$lib/content/site';

  const TITLE = 'Resources — Tech Pixel A2H';
  const DESCRIPTION =
    'Company profile, service menu and project starter checklist — free resources from Tech Pixel A2H, sent straight to your WhatsApp when you ask.';
  const PAGE_URL = `${SITE_URL}/download`;

  /**
   * Deep link into the shared WhatsApp thread with this request appended to
   * the site's standard greeting (WHATSAPP_HREF already carries `text=`).
   */
  const waRequest = (request: string) =>
    `${WHATSAPP_HREF}${encodeURIComponent(` ${request}`)}`;

  // Resources are sent on request — no files are hosted on the site, so each
  // CTA deep-links to WhatsApp instead of pointing at a URL that would 404.
  const resources = [
    {
      n: '01',
      t: 'Company Profile',
      d: 'Who we are, how we work and what we build — a quick, honest overview for teams doing their homework on us.',
      href: waRequest('Please send me the company profile.')
    },
    {
      n: '02',
      t: 'Service Menu',
      d: 'A plain list of everything we deliver — websites, AI automation, design, content and marketing — with the scope spelled out for each.',
      href: waRequest('Please send me the service menu.')
    },
    {
      n: '03',
      t: 'Project Starter Checklist',
      d: 'The questions worth answering before you brief a website or automation project, so nothing important gets missed.',
      href: waRequest('Please send me the project starter checklist.')
    }
  ];
</script>

<svelte:head>
  <title>{TITLE}</title>
  <meta name="description" content={DESCRIPTION} />
  <link rel="canonical" href={PAGE_URL} />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#12212e" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Tech Pixel A2H" />
  <meta property="og:title" content={TITLE} />
  <meta property="og:description" content={DESCRIPTION} />
  <meta property="og:url" content={PAGE_URL} />
  <!--
    og:image / twitter:image intentionally omitted: no /og/download.png asset
    exists and this pass cannot add static files — better no image tag than a
    meta URL that 404s. twitter:card stays "summary" (the image-less variant).
  -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={TITLE} />
  <meta name="twitter:description" content={DESCRIPTION} />
</svelte:head>

<JsonLd
  name={TITLE}
  description={DESCRIPTION}
  path="/download"
  crumbs={[{ name: 'Resources', path: '/download' }]}
/>

<TargoNav active="download" />

<main id="main" tabindex="-1">
  <section class="targo-band-white px-6 py-24 md:py-32" aria-label="Resources index">
    <div class="mx-auto max-w-6xl">
      <p class="targo-eyebrow">Resources</p>
      <h1 class="targo-title mt-4">Download<br /><span class="t-accent">Resources</span></h1>
      <p class="targo-lead mt-6 max-w-2xl">
        Pick what you need — company profile, service menu or a starter checklist — and we'll
        send it straight to your WhatsApp. No forms, no sign-up.
      </p>

      <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {#each resources as r (r.n)}
          <article class="targo-card flex flex-col p-8">
            <div class="flex items-center justify-between gap-3">
              <span class="targo-num text-[22px]">{r.n}</span>
              <span
                class="targo-quant bg-[#15bcdf]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0a6f8c]"
              >
                On request
              </span>
            </div>
            <h2 class="targo-quant mt-5 text-[24px] font-bold uppercase leading-tight text-[#12212e]">
              {r.t}
            </h2>
            <p class="targo-lead mt-3 flex-1 text-[15px]">{r.d}</p>
            <a
              href={r.href}
              target="_blank"
              rel="noopener"
              class="targo-quant mt-7 inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-[#12212e] transition-colors hover:text-[#15bcdf]"
              aria-label="Request the {r.t} on WhatsApp (opens in a new tab)"
            >
              Request on WhatsApp <span aria-hidden="true">→</span>
            </a>
          </article>
        {/each}
      </div>

      <!-- CTA row: contact form anchor + WhatsApp (no hosted files here either) -->
      <div
        class="targo-card mt-12 flex flex-col gap-7 p-8 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 class="targo-quant text-[24px] font-bold uppercase leading-tight text-[#12212e]">
            Need something else?
          </h2>
          <p class="targo-lead mt-3 max-w-xl text-[15px]">
            Tell us what you're looking for and we'll send it over — usually within 24 hours.
            Prefer to reach us directly?
            <a
              href={EMAIL_HREF}
              class="targo-quant font-bold text-[#0a6f8c] transition-colors hover:text-[#15bcdf]"
            >
              {EMAIL}
            </a>
            ·
            <a
              href={PHONE_TEL}
              class="targo-quant font-bold text-[#0a6f8c] transition-colors hover:text-[#15bcdf]"
            >
              {PHONE_DISPLAY}
            </a>
          </p>
        </div>
        <div class="flex shrink-0 flex-wrap gap-4">
          <a class="targo-btn" href={CONTACT_HREF}>
            Start a Project <span aria-hidden="true">→</span>
          </a>
          <a class="targo-btn targo-btn-cyan" href={WHATSAPP_HREF} target="_blank" rel="noopener">
            Talk on WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
</main>
