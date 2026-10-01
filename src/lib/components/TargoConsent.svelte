<script lang="ts">
  import { onMount } from 'svelte';
  import { CONSENT_STORAGE_KEY, DOMAIN, PLAUSIBLE_SCRIPT_SRC } from '$lib/content/site';

  type Consent = 'accepted' | 'declined';

  let choice = $state<Consent | null>(null);
  let loaded = $state(false);

  function readStored(): Consent | null {
    try {
      const v = localStorage.getItem(CONSENT_STORAGE_KEY);
      return v === 'accepted' || v === 'declined' ? v : null;
    } catch {
      return null;
    }
  }

  function loadPlausible() {
    if (loaded) return;
    if (document.querySelector(`script[data-targo-plausible]`)) {
      loaded = true;
      return;
    }
    const s = document.createElement('script');
    s.defer = true;
    s.src = PLAUSIBLE_SCRIPT_SRC;
    s.dataset.targoPlausible = 'true';
    s.dataset.domain = DOMAIN;
    document.head.appendChild(s);
    loaded = true;
  }

  function choose(c: Consent) {
    choice = c;
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, c);
    } catch {
      // storage unavailable: banner simply reappears next visit (still default-deny)
    }
    if (c === 'accepted') loadPlausible();
  }

  onMount(() => {
    const stored = readStored();
    choice = stored;
    if (stored === 'accepted') loadPlausible();
  });
</script>

{#if choice === null}
  <div
    class="fixed inset-x-0 bottom-0 z-50 border-t border-[#12212e]/15 bg-white/95 px-6 py-5 backdrop-blur"
    role="dialog"
    aria-live="polite"
    aria-label="Cookie and analytics consent"
    data-testid="tc-consent-banner"
  >
    <div class="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p class="targo-quant max-w-2xl text-[12px] font-bold uppercase tracking-[0.08em] text-[#3d4653]">
        We use privacy-friendly, cookieless analytics only if you opt in. Nothing
        loads until you accept.
      </p>
      <div class="flex gap-3">
        <button
          type="button"
          onclick={() => choose('declined')}
          class="targo-quant min-h-[44px] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em] text-[#3d4653] underline underline-offset-4 hover:text-[#15bcdf]"
          data-testid="tc-consent-decline"
        >
          Decline
        </button>
        <button
          type="button"
          onclick={() => choose('accepted')}
          class="targo-btn"
          data-testid="tc-consent-accept"
        >
          Accept <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  </div>
{/if}
