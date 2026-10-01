<script lang="ts">
  import {
    PHONE_DISPLAY,
    PHONE_TEL,
    EMAIL,
    EMAIL_HREF,
    LOCATION,
    SOCIALS
  } from '$lib/content/site';
</script>

<footer class="border-t border-[rgba(18,33,46,0.1)] bg-white px-6 pb-10 pt-16 md:pt-20" aria-label="Footer">
  <div class="mx-auto max-w-6xl">
    <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <p class="targo-quant flex items-center gap-2.5">
          <span class="text-[24px] font-bold lowercase tracking-tight text-[#0a6f8c]">a2h</span>
          <span class="text-[14px] font-bold uppercase tracking-[0.08em] text-[#12212e]">Tech Pixel A2H</span>
        </p>
        <p class="targo-quant mt-4 text-[12px] font-bold uppercase tracking-[0.22em] text-[#3d4653]">
          Innovate. Develop. Elevate.
        </p>
        <p class="targo-quant mt-4 max-w-xs text-[14px] leading-[1.7] text-[#3d4653]">
          Web development, AI automation, design, content and marketing — one team for everything
          your business needs online.
        </p>
      </div>

      <nav aria-label="Contact details">
        <p class="targo-quant text-[11px] font-bold uppercase tracking-[0.22em] text-[#3d4653]">Get in touch</p>
        <ul class="mt-4 space-y-3 text-[14px]">
          <li>
            <a href={PHONE_TEL} class="targo-quant font-bold text-[#12212e] transition-colors hover:text-[#15bcdf]">{PHONE_DISPLAY}</a>
          </li>
          <li>
            <a href={EMAIL_HREF} class="targo-quant break-all font-bold text-[#12212e] transition-colors hover:text-[#15bcdf]">{EMAIL}</a>
          </li>
          <li class="targo-quant font-bold text-[#3d4653]">{LOCATION}</li>
        </ul>
      </nav>

      <nav aria-label="Social links">
        <p class="targo-quant text-[11px] font-bold uppercase tracking-[0.22em] text-[#3d4653]">Follow us</p>
        <ul class="mt-4 space-y-3 text-[14px]">
          {#each SOCIALS as s (s.label)}
            <li>
              <a
                href={s.href}
                target={s.external ? '_blank' : undefined}
                rel={s.external ? 'noopener' : undefined}
                class="targo-quant font-bold text-[#12212e] transition-colors hover:text-[#15bcdf]"
              >{s.label}</a>
            </li>
          {/each}
        </ul>
      </nav>

      <nav aria-label="Explore">
        <p class="targo-quant text-[11px] font-bold uppercase tracking-[0.22em] text-[#3d4653]">Explore</p>
        <ul class="mt-4 space-y-3 text-[14px]">
          <li>
            <a href="/services" class="targo-quant font-bold text-[#12212e] transition-colors hover:text-[#15bcdf]">Services</a>
          </li>
          <li>
            <a href="/work" class="targo-quant font-bold text-[#12212e] transition-colors hover:text-[#15bcdf]">Work</a>
          </li>
          <li>
            <a href="/about" class="targo-quant font-bold text-[#12212e] transition-colors hover:text-[#15bcdf]">About</a>
          </li>
          <li>
            <a href="/#contact" class="targo-quant font-bold text-[#12212e] transition-colors hover:text-[#15bcdf]">Contact</a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="targo-quant mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(18,33,46,0.1)] pt-7 text-[13px] font-bold text-[#3d4653] sm:flex-row">
      <p>© 2026 Tech Pixel A2H. All rights reserved.</p>
      <p class="flex gap-6">
        <a href="/privacy" class="transition-colors hover:text-[#15bcdf]">Privacy Policy</a>
        <a href="/terms" class="transition-colors hover:text-[#15bcdf]">Terms of Service</a>
      </p>
    </div>
  </div>
</footer>
