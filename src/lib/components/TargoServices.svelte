<script lang="ts">
  const services = [
    {
      n: '01',
      slug: 'web-development',
      t: 'Web Development',
      d: 'Business websites, portfolios, landing pages and e-commerce stores. Fast, mobile-first, and built to convert visitors into customers.',
      tag: 'Most requested'
    },
    {
      n: '02',
      slug: 'ai-automation',
      t: 'AI Automation',
      d: 'WhatsApp bots, lead qualification, follow-up sequences and business reports — automation that runs your routine work while you sleep.',
      tag: null
    },
    {
      n: '03',
      slug: 'poster-design',
      t: 'Poster Design',
      d: 'Festival creatives, offer posters, event flyers and brand kits that stop the scroll.',
      tag: null
    },
    {
      n: '04',
      slug: 'content-creation',
      t: 'Content Creation',
      d: 'Product videos, reels, business profiles and presentation decks that tell your story.',
      tag: null
    },
    {
      n: '05',
      slug: 'digital-marketing',
      t: 'Digital Marketing',
      d: 'SEO, social media and WhatsApp campaigns that bring a steady flow of new customers.',
      tag: null
    }
  ];
</script>

<section id="services" class="targo-band-white px-6 py-24 md:py-32" aria-label="Services">
  <div class="mx-auto max-w-6xl">
    <p class="targo-eyebrow">What we do</p>
    <h2 class="targo-title mt-4">
      Our<br /><span class="t-accent">Services</span>
    </h2>
    <p class="targo-lead mt-6 max-w-2xl">
      Five core services, one team. Pick what you need now — add more as you grow.
    </p>

    <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {#each services as s (s.n)}
        <article class="targo-card flex flex-col p-8">
          <div class="flex items-center justify-between">
            <span class="targo-num text-[22px]">{s.n}</span>
            {#if s.tag}
              <span
                class="targo-quant bg-[#15bcdf]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0a6f8c]"
              >
                {s.tag}
              </span>
            {/if}
          </div>
          <h3 class="targo-quant mt-5 text-[24px] font-bold uppercase leading-tight text-[#12212e]">
            {s.t}
          </h3>
          <p class="targo-lead mt-3 flex-1 text-[15px]">{s.d}</p>
          <a
            href="/services/{s.slug}"
            class="targo-quant mt-7 inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-[#12212e] transition-colors hover:text-[#15bcdf]"
            aria-label="Enquire about {s.t}"
          >
            Enquire <span aria-hidden="true">→</span>
          </a>
        </article>
      {/each}

      <!-- 6th cell: CTA tile -->
      <article
        class="targo-card flex flex-col justify-between bg-[#12212e] p-8"
        style="border-color: #12212e;"
      >
        <div>
          <span class="targo-num text-[22px]">+</span>
          <h3 class="targo-quant mt-5 text-[24px] font-bold uppercase leading-tight text-white">
            Not sure<br />where to start?
          </h3>
          <p class="targo-lead mt-3 text-[15px] text-white/70">
            Tell us about your business — we'll recommend the right mix and reply within 24 hours.
          </p>
        </div>
        <a href="#contact" class="targo-btn targo-btn-cyan mt-7">
          Get free advice <span aria-hidden="true">→</span>
        </a>
      </article>
    </div>
  </div>
</section>
