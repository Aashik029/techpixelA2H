<script lang="ts">
  const steps = [
    {
      n: '01',
      t: 'Discover',
      d: 'We start with a conversation about your business, your customers, and what success looks like.',
      items: ['Free consultation call', 'Requirement mapping', 'Honest timeline & quote']
    },
    {
      n: '02',
      t: 'Plan',
      d: 'You approve the direction before we build — designs, structure, and content plan, all shared upfront.',
      items: ['Design previews', 'Content outline', 'Fixed pricing']
    },
    {
      n: '03',
      t: 'Build',
      d: 'We design, develop, and test everything — with regular updates so you always know where things stand.',
      items: ['Weekly progress updates', 'Preview links to review', 'Revisions included']
    },
    {
      n: '04',
      t: 'Deliver & Support',
      d: 'Launch day is just the start. Training, documentation, and ongoing support keep you confident.',
      items: ['Launch + training', 'Free support window', 'Growth guidance']
    }
  ];
</script>

<section id="process" class="targo-band-white px-6 py-24 md:py-32" aria-label="How we work">
  <div class="mx-auto max-w-6xl">
    <p class="targo-eyebrow">How we work</p>
    <h2 class="targo-title mt-4">
      Simple<br /><span class="t-accent">Process</span>
    </h2>
    <p class="targo-lead mt-6 max-w-2xl">No surprises. You always know what happens next.</p>

    <div class="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      <div
        class="absolute left-0 right-0 top-10 hidden h-0.5 bg-gradient-to-r from-[#15bcdf] via-[#15bcdf]/30 to-transparent lg:block"
        aria-hidden="true"
      ></div>
      {#each steps as s (s.n)}
        <div class="targo-card relative p-8">
          <div
            class="targo-quant relative z-10 flex h-14 w-14 items-center justify-center bg-[#12212e] text-[16px] font-bold text-white"
            style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);"
          >
            {s.n}
          </div>
          <h3 class="targo-quant mt-6 text-[20px] font-bold uppercase text-[#12212e]">{s.t}</h3>
          <p class="targo-lead mt-2.5 text-[14px]">{s.d}</p>
          <ul class="mt-5 space-y-2">
            {#each s.items as item (item)}
              <li class="targo-quant flex items-start gap-2.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#3d4653]">
                <span class="mt-[5px] h-1.5 w-1.5 shrink-0 bg-[#15bcdf]" aria-hidden="true"></span>
                {item}
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>
</section>
