<script lang="ts">
  import '$lib/targo.css';
  import TargoNav from '$lib/components/TargoNav.svelte';
  import JsonLd from '$lib/components/JsonLd.svelte';
  import { FAQS } from '$lib/content/faq';
  import {
    EMAIL,
    EMAIL_HREF,
    PHONE_DISPLAY,
    PHONE_TEL,
    WHATSAPP_HREF
  } from '$lib/content/site';

  const TITLE = 'Frequently Asked Questions — Tech Pixel A2H';
  const DESCRIPTION =
    'Straight answers about Tech Pixel A2H services, pricing, timelines, support, and how to start a project.';
  const PAGE_URL = 'https://tech-pixel-a2h.vercel.app/faq';
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
  <meta property="og:image" content="https://tech-pixel-a2h.vercel.app/og/home.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Tech Pixel A2H — frequently asked questions" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={TITLE} />
  <meta name="twitter:description" content={DESCRIPTION} />
  <meta name="twitter:image" content="https://tech-pixel-a2h.vercel.app/og/home.png" />
</svelte:head>

<JsonLd
  name={TITLE}
  description={DESCRIPTION}
  path="/faq"
  pageType="FAQPage"
  faqs={FAQS}
  crumbs={[{ name: 'FAQ', path: '/faq' }]}
/>

<TargoNav active="faq" />

<main id="main" tabindex="-1">
  <section class="targo-band-white px-6 py-24 md:py-32" aria-label="Frequently asked questions">
    <div class="mx-auto max-w-6xl">
      <p class="targo-eyebrow">FAQ</p>
      <h1 class="targo-title mt-4">Frequently<br /><span class="t-accent">Asked</span></h1>
      <p class="targo-lead mt-6 max-w-2xl">{DESCRIPTION}</p>

      <div class="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div class="max-w-3xl">
          {#each FAQS as f, i (f.question)}
            <article class="border-b border-[rgba(18,33,46,0.12)] py-7 first:pt-0">
              <p
                class="targo-quant text-[11px] font-bold uppercase tracking-[0.2em] text-[#0a6f8c]"
              >
                Question {String(i + 1).padStart(2, '0')}
              </p>
              <h2
                class="targo-quant mt-2 text-[22px] font-bold uppercase leading-tight text-[#12212e] md:text-[26px]"
              >
                {f.question}
              </h2>
              <p class="targo-lead mt-3 text-[15px] leading-[1.75]">{f.answer}</p>
            </article>
          {/each}
        </div>

        <aside class="h-fit lg:sticky lg:top-28">
          <div class="targo-card p-8">
            <p class="targo-eyebrow">Still have a question?</p>
            <h2 class="targo-quant mt-3 text-[22px] font-bold uppercase leading-tight text-[#12212e]">
              Talk to a human.
            </h2>
            <p class="targo-lead mt-3 text-[14px]">
              Tell us about your business and we'll reply within 24 hours with next steps.
            </p>
            <ul class="mt-6 space-y-3 text-[14px]">
              <li>
                <a
                  class="targo-quant font-bold text-[#12212e] transition-colors hover:text-[#15bcdf]"
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener">WhatsApp →</a
                >
              </li>
              <li>
                <a
                  class="targo-quant break-all font-bold text-[#12212e] transition-colors hover:text-[#15bcdf]"
                  href={EMAIL_HREF}>{EMAIL}</a
                >
              </li>
              <li>
                <a
                  class="targo-quant font-bold text-[#12212e] transition-colors hover:text-[#15bcdf]"
                  href={PHONE_TEL}>{PHONE_DISPLAY}</a
                >
              </li>
            </ul>
            <a href="/#contact" class="targo-btn mt-6">Start a Project →</a>
          </div>
        </aside>
      </div>
    </div>
  </section>
</main>
