<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { prefetchVideo } from '$lib/targo';
  import { NAV_ITEMS, CONTACT_HREF, type PageId } from '$lib/content/site';

  /** Shared single navbar. `active` highlights current page. */
  let { active = 'home' }: { active?: PageId } = $props();

  let menuOpen = $state(false);
  // SSR-safe: only gates the JS-opened mobile panel (rendered post-hydration
  // on user action), so SSR/CSR markup matches and there is no desktop flash.
  // Visibility of desktop links vs burger is CSS media-query driven (no-JS safe).
  let isMobile = $state(false);
  let menuEl: HTMLElement | null = $state(null);
  let toggleEl: HTMLButtonElement | null = $state(null);

  const warmHero = () => prefetchVideo('/videos/hero.mp4');

  function closeMenu(returnFocus = false) {
    menuOpen = false;
    document.body.style.overflow = '';
    if (returnFocus) toggleEl?.focus();
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (menuOpen) {
      tick().then(() => {
        menuEl?.querySelector('a')?.focus();
      });
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (!menuOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu(true);
      return;
    }
    if (e.key === 'Tab' && menuEl) {
      const focusables = menuEl.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function onDocumentClick(e: MouseEvent) {
    if (!menuOpen || !menuEl) return;
    const target = e.target as Node;
    if (!menuEl.contains(target) && !(toggleEl && toggleEl.contains(target))) {
      closeMenu();
    }
  }

  onMount(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const sync = () => {
      isMobile = mq.matches;
      if (!mq.matches && menuOpen) closeMenu();
    };
    sync();
    mq.addEventListener('change', sync);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onDocumentClick);
    return () => {
      mq.removeEventListener('change', sync);
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('click', onDocumentClick);
      document.body.style.overflow = '';
    };
  });
</script>

<a class="skip-link" href="#main">Skip to content</a>

<header class="targo-nav">
  <a
    href="/"
    class="targo-logo"
    aria-label="Tech Pixel A2H — home"
    onpointerenter={warmHero}
    onfocus={warmHero}
  >
    <span class="targo-mark" aria-hidden="true"><span class="targo-ellipse"></span></span>
    <span class="targo-word">a2h</span>
  </a>

  <nav class="targo-links" aria-label="Primary">
    {#each NAV_ITEMS as item (item.id)}
      <a
        href={item.href}
        class:active={active === item.id}
        aria-current={active === item.id ? 'page' : undefined}
        onpointerenter={warmHero}
        onfocus={warmHero}>{item.label}</a
      >
    {/each}
  </nav>
  <a
    class="targo-contact-btn targo-contact-desktop"
    href={CONTACT_HREF}
    onpointerenter={warmHero}
    onfocus={warmHero}
  >
    <svg width="17" height="13" viewBox="0 0 17 13" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="15" height="11" rx="1.5" stroke="#111" stroke-width="1.4" />
      <path d="M1.5 2.5 L8.5 8 L15.5 2.5" stroke="#111" stroke-width="1.4" fill="none" />
    </svg>
    Contact us
  </a>
  <button
    bind:this={toggleEl}
    class="targo-burger"
    onclick={toggleMenu}
    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={menuOpen}
    aria-controls="targo-mobile-menu"
  >
    <span></span><span></span><span></span>
  </button>
</header>

{#if menuOpen}
  <nav
    id="targo-mobile-menu"
    bind:this={menuEl}
    class="targo-mobile-menu"
    aria-label="Mobile"
  >
    {#each NAV_ITEMS as item (item.id)}
      <a
        href={item.href}
        aria-current={active === item.id ? 'page' : undefined}
        onclick={() => closeMenu()}
        onpointerenter={warmHero}
        onfocus={warmHero}>{item.label}</a
      >
    {/each}
    <a
      href={CONTACT_HREF}
      onclick={() => closeMenu()}
      onpointerenter={warmHero}
      onfocus={warmHero}>Contact us</a
    >
  </nav>
{/if}

<style>
  :global(section[id], div[id], main) {
    scroll-margin-top: 110px;
  }
  .skip-link {
    position: absolute;
    left: 16px;
    top: -100px;
    z-index: 100;
    background: #111;
    color: #fff;
    font-family: 'Quantico', 'Arial Narrow', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 12px 20px;
    border-radius: 8px;
    transition: top 0.15s ease;
  }
  .skip-link:focus-visible {
    top: 12px;
    outline: 3px solid #15bcdf;
    outline-offset: 2px;
  }
  .targo-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: clamp(20px, 5vw, 56px);
    margin: clamp(12px, 2vw, 24px) clamp(20px, 4vw, 48px) 0;
    padding: 14px clamp(18px, 2.5vw, 28px);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.55);
    -webkit-backdrop-filter: blur(18px) saturate(1.5);
    backdrop-filter: blur(18px) saturate(1.5);
    border: 1px solid rgba(255, 255, 255, 0.65);
    box-shadow: 0 8px 32px rgba(18, 33, 46, 0.1);
    font-family: 'Quantico', 'Arial Narrow', sans-serif;
  }
  .targo-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .targo-mark {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #111;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .targo-ellipse {
    width: 20px;
    height: 8px;
    background: #fff;
    border-radius: 50%;
    transform: rotate(-25deg);
    display: block;
  }
  .targo-word {
    font-size: clamp(22px, 5vw, 30px);
    font-weight: 400;
    color: #111;
    letter-spacing: -0.5px;
    text-transform: lowercase;
  }
  .targo-links {
    display: flex;
    flex-wrap: wrap;
    row-gap: 12px;
    gap: 34px;
    margin-left: auto;
    min-width: 0;
  }
  .targo-links a {
    font-weight: 700;
    font-size: clamp(12px, 2.4vw, 15px);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #111;
    text-decoration: none;
    white-space: nowrap;
  }
  .targo-links a:hover,
  .targo-links a.active {
    color: #0a6f8c;
  }
  .targo-contact-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: none;
    color: #111;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-family: inherit;
    font-weight: 700;
    font-size: 13px;
    padding: 14px 26px;
    text-decoration: none;
    white-space: nowrap;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    background: rgba(255, 255, 255, 0.7);
  }
  .targo-contact-btn:hover {
    background: #15bcdf;
    color: #fff;
  }
  .targo-contact-btn:hover svg rect,
  .targo-contact-btn:hover svg path {
    stroke: #fff;
  }
  .targo-burger {
    display: none;
    margin-left: auto;
    background: #111;
    border: none;
    padding: 12px;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    min-width: 44px;
    min-height: 44px;
    align-items: center;
    justify-content: center;
  }
  .targo-burger span {
    display: block;
    width: 22px;
    height: 2px;
    background: #fff;
  }
  .targo-mobile-menu {
    position: sticky;
    top: 96px;
    z-index: 49;
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin: 10px clamp(20px, 4vw, 48px) 0;
    padding: 18px clamp(20px, 4vw, 28px);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.6);
    -webkit-backdrop-filter: blur(18px) saturate(1.5);
    backdrop-filter: blur(18px) saturate(1.5);
    border: 1px solid rgba(255, 255, 255, 0.65);
    box-shadow: 0 8px 32px rgba(18, 33, 46, 0.1);
    font-family: 'Quantico', 'Arial Narrow', sans-serif;
  }
  .targo-mobile-menu a {
    color: #1a1c1e;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    text-decoration: none;
    font-size: 15px;
  }
  @media (max-width: 700px) {
    .targo-links,
    .targo-contact-desktop {
      display: none;
    }
    .targo-burger {
      display: flex;
    }
  }
</style>
