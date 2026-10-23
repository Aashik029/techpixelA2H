<script lang="ts">
  import { FAQS } from '$lib/content/faq';

  const homeFaqs = FAQS.slice(0, 4);
</script>

<section
  id="answers"
  class="targo-band-white border-t border-[rgba(18,33,46,0.08)] px-6 py-24 md:py-32"
  aria-label="Common questions"
>
  <div class="mx-auto max-w-6xl">
    <p class="targo-eyebrow">Common questions</p>
    <div class="mt-4 flex flex-wrap items-end justify-between gap-6">
      <h2 class="targo-title">
        Straight<br /><span class="t-accent">answers</span>
      </h2>
      <a href="/faq" class="targo-btn targo-btn-cyan">See all FAQs →</a>
    </div>
    <p class="targo-lead mt-6 max-w-2xl">
      Short, direct answers to the questions we hear most — what we do, what it costs, how long it
      takes, and how to start.
    </p>

    <div class="mt-12 grid gap-5 md:grid-cols-2">
      {#each homeFaqs as f (f.question)}
        <article class="targo-card p-8">
          <h3 class="targo-quant text-[20px] font-bold uppercase leading-tight text-[#12212e]">
            {f.question}
          </h3>
          <p class="targo-lead mt-3 text-[15px]">{f.answer}</p>
        </article>
      {/each}
    </div>
  </div>
</section>
