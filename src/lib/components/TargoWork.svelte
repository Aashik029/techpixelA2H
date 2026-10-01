<script lang="ts">
  const visuals = ['store', 'dash', 'hrms', 'posters', 'blog', 'growth'] as const;

  const projects = [
    {
      slug: 'local-store-online',
      cat: 'E-commerce Website',
      title: 'Local Store, Online Overnight',
      d: 'A complete online store for a neighborhood retailer — product catalog, WhatsApp ordering, and festival offer banners.',
      disclosure: 'Sample work — illustrative example, not a client engagement.'
    },
    {
      slug: 'team-workspace',
      cat: 'B2B Web Application',
      title: 'One Workspace for the Whole Team',
      d: 'A shared dashboard where a growing business tracks projects, clients, and daily tasks — all in one place.',
      disclosure: 'Sample work — illustrative example, not a client engagement.'
    },
    {
      slug: 'hrms-concept',
      cat: 'HRMS Concept',
      title: 'HR Without the Spreadsheets',
      d: 'Attendance, leave requests, and employee records in a clean visual system — concept interface for modern HR teams.',
      disclosure: 'Concept work — interface concept, not shipped for a client.'
    },
    {
      slug: 'festival-posters',
      cat: 'Poster Pack',
      title: 'Festival Season, Fully Designed',
      d: 'A complete set of offer posters, social creatives, and banners for a retail brand’s festival campaign.',
      disclosure: 'Sample work — illustrative example, not a client engagement.'
    },
    {
      slug: 'seo-blog-system',
      cat: 'SEO Blog System',
      title: 'Content That Brings Customers',
      d: 'A search-optimized blog and content engine that turns everyday questions into a steady stream of new enquiries.',
      disclosure: 'Sample work — illustrative example, not a client engagement.'
    },
    {
      slug: 'growth-campaign',
      cat: 'Growth Campaign',
      title: 'From Invisible to Booked Out',
      d: 'Social media creatives, WhatsApp follow-ups, and review engine — a full local growth loop for a service business.',
      disclosure: 'Sample work — illustrative example, not a client engagement.'
    }
  ];
</script>

<section id="work" class="targo-band px-6 py-24 md:py-32" aria-label="Selected work">
  <div class="mx-auto max-w-6xl">
    <p class="targo-eyebrow">Selected work</p>
    <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <h2 class="targo-title mt-4">
        Our<br /><span class="t-accent">Work</span>
      </h2>
      <p class="targo-lead max-w-sm">
        A sample of our design and build capabilities, including concept work.
      </p>
    </div>

    <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {#each projects as p, i (p.title)}
        {@const v = visuals[i]}
        <a href="/work/{p.slug}" class="targo-card flex flex-col overflow-hidden">
          <!-- dashboard / app mockup header -->
          <div
            class="relative h-48 overflow-hidden bg-[#12212e]"
            aria-hidden="true"
          >
            <div
              class="absolute inset-0"
              style="background: linear-gradient({135 + i * 18}deg, #12212e 0%, #1d3a4d 65%, rgba(21,188,223,0.45) 130%);"
            ></div>

            {#if v === 'store'}
              <!-- mini storefront -->
              <div class="absolute inset-x-6 bottom-0 top-5 rounded-t-lg bg-white p-3 shadow-xl">
                <div class="flex items-center gap-1.5">
                  <span class="h-1.5 w-1.5 rounded-full bg-[#15bcdf]"></span>
                  <span class="h-1.5 w-1.5 rounded-full bg-[#12212e]/15"></span>
                  <span class="h-1.5 w-1.5 rounded-full bg-[#12212e]/15"></span>
                  <span class="ml-2 h-3.5 flex-1 rounded-full bg-[#12212e]/[0.06]"></span>
                </div>
                <div class="mt-2.5 h-2 w-2/5 rounded bg-[#12212e]/25"></div>
                <div class="mt-2 grid grid-cols-3 gap-2">
                  <div class="h-12 rounded bg-[#12212e]/[0.06]"></div>
                  <div class="h-12 rounded border border-[#15bcdf]/50 bg-[#15bcdf]/10"></div>
                  <div class="h-12 rounded bg-[#12212e]/[0.06]"></div>
                </div>
                <div class="mx-auto mt-2.5 h-5 w-20 rounded-full bg-[#15bcdf]"></div>
              </div>
            {:else if v === 'dash'}
              <!-- workspace dashboard -->
              <div class="absolute inset-4 flex gap-2">
                <div class="w-11 rounded-md bg-white/95 p-1.5">
                  <div class="mx-auto h-4 w-4 rounded-full bg-[#15bcdf]"></div>
                  <div class="mt-2 space-y-1.5">
                    <div class="h-1.5 rounded bg-[#12212e]/15"></div>
                    <div class="h-1.5 rounded bg-[#12212e]/15"></div>
                    <div class="h-1.5 rounded bg-[#15bcdf]/60"></div>
                    <div class="h-1.5 rounded bg-[#12212e]/15"></div>
                  </div>
                </div>
                <div class="flex-1 rounded-md bg-white/95 p-2.5">
                  <div class="flex items-center justify-between">
                    <div class="h-2 w-1/2 rounded bg-[#12212e]/25"></div>
                    <div class="h-4 w-4 rounded-full bg-[#15bcdf]/30"></div>
                  </div>
                  <div class="mt-2 space-y-1.5">
                    <div class="flex items-center gap-1.5 rounded bg-[#12212e]/[0.05] p-1.5">
                      <span class="flex h-3 w-3 items-center justify-center rounded-full bg-[#15bcdf] text-[7px] font-bold text-white">✓</span>
                      <div class="h-1.5 flex-1 rounded bg-[#12212e]/15"></div>
                    </div>
                    <div class="flex items-center gap-1.5 rounded bg-[#12212e]/[0.05] p-1.5">
                      <span class="flex h-3 w-3 items-center justify-center rounded-full bg-[#15bcdf] text-[7px] font-bold text-white">✓</span>
                      <div class="h-1.5 flex-1 rounded bg-[#12212e]/15"></div>
                    </div>
                    <div class="flex items-center gap-1.5 rounded border border-[#15bcdf]/40 bg-[#15bcdf]/[0.07] p-1.5">
                      <span class="h-3 w-3 rounded-full border-2 border-[#15bcdf]"></span>
                      <div class="h-1.5 flex-1 rounded bg-[#12212e]/15"></div>
                    </div>
                  </div>
                  <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-[#12212e]/10">
                    <div class="h-full w-2/3 rounded-full bg-[#15bcdf]"></div>
                  </div>
                </div>
              </div>
            {:else if v === 'hrms'}
              <!-- HRMS dashboard -->
              <div class="absolute inset-4 rounded-md bg-white/95 p-2.5">
                <div class="flex items-center gap-2">
                  <div class="h-7 w-7 rounded-full border-2 border-dashed border-[#15bcdf]"></div>
                  <div>
                    <div class="h-2 w-16 rounded bg-[#12212e]/25"></div>
                    <div class="mt-1 h-1.5 w-10 rounded bg-[#15bcdf]/60"></div>
                  </div>
                  <div class="ml-auto flex gap-1">
                    <div class="h-5 w-5 rounded bg-[#12212e]/10"></div>
                    <div class="h-5 w-5 rounded bg-[#12212e]/10"></div>
                    <div class="h-5 w-5 rounded bg-[#15bcdf]/40"></div>
                  </div>
                </div>
                <div class="mt-2 grid grid-cols-4 gap-1.5">
                  <div class="h-8 rounded bg-[#12212e]/[0.06]"></div>
                  <div class="h-8 rounded bg-[#12212e]/[0.06]"></div>
                  <div class="h-8 rounded border border-[#15bcdf]/40 bg-[#15bcdf]/10"></div>
                  <div class="h-8 rounded bg-[#12212e]/[0.06]"></div>
                </div>
              </div>
            {:else if v === 'posters'}
              <!-- poster sheets -->
              <div class="absolute inset-0 flex items-center justify-center gap-2.5">
                <div class="h-28 w-[74px] rotate-[-7deg] rounded bg-white p-1.5 shadow-lg">
                  <div class="h-1.5 w-3/4 rounded bg-[#15bcdf]/70"></div>
                  <div class="mt-1.5 h-16 rounded bg-[#12212e]/[0.07]"></div>
                </div>
                <div class="h-36 w-[86px] rounded bg-white p-2 shadow-xl ring-2 ring-[#15bcdf]/60">
                  <div class="h-2 w-3/4 rounded bg-[#15bcdf]"></div>
                  <div class="mt-2 h-20 rounded bg-[#12212e]/[0.07]"></div>
                  <div class="mx-auto mt-2 h-4 w-12 rounded-full bg-[#12212e]"></div>
                </div>
                <div class="h-28 w-[74px] rotate-[7deg] rounded bg-white p-1.5 shadow-lg">
                  <div class="h-1.5 w-3/4 rounded bg-[#12212e]/30"></div>
                  <div class="mt-1.5 h-16 rounded bg-[#12212e]/[0.07]"></div>
                </div>
              </div>
            {:else if v === 'blog'}
              <!-- blog article -->
              <div class="absolute inset-4 rounded-md bg-white/95 p-2.5">
                <div class="h-2.5 w-2/5 rounded bg-[#12212e]/25"></div>
                <div class="mt-1.5 h-2 w-3/5 rounded bg-[#15bcdf]/50"></div>
                <div class="mt-2 flex gap-1.5">
                  <div class="h-4 w-12 rounded-full border border-[#15bcdf] bg-[#15bcdf]/15"></div>
                  <div class="h-4 w-12 rounded-full bg-[#12212e]/10"></div>
                  <div class="h-4 w-12 rounded-full bg-[#12212e]/10"></div>
                </div>
                <div class="mt-2 space-y-1">
                  <div class="h-1.5 rounded bg-[#12212e]/10"></div>
                  <div class="h-1.5 w-11/12 rounded bg-[#12212e]/10"></div>
                  <div class="h-1.5 w-4/5 rounded bg-[#12212e]/10"></div>
                </div>
              </div>
            {:else}
              <!-- growth chart -->
              <div class="absolute inset-4 flex items-end gap-1.5 rounded-md bg-white/95 p-2.5">
                {#each [30, 50, 42, 65, 58, 80, 95] as hgt, bi (bi)}
                  <div
                    class="flex-1 rounded-sm {bi === 6 ? 'bg-[#15bcdf]' : 'bg-[#12212e]/15'}"
                    style="height:{hgt}%"
                  ></div>
                {/each}
              </div>
            {/if}

            <span
              class="targo-quant absolute left-4 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#12212e]"
            >
              {p.cat}
            </span>
          </div>
          <div class="flex flex-1 flex-col p-8">
            <h3 class="targo-quant text-[22px] font-bold uppercase leading-tight text-[#12212e]">
              {p.title}
            </h3>
            <p class="targo-lead mt-3 flex-1 text-[15px]">{p.d}</p>
            <p class="targo-lead mt-2 text-[12px]">{p.disclosure}</p>
          </div>
        </a>
      {/each}
    </div>

    <div class="mt-12 text-center">
      <a href="#contact" class="targo-btn">
        Start your project <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</section>
