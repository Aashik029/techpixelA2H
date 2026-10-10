<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { prefetchVideo } from '$lib/targo';
  import { NAV_ITEMS, CONTACT_HREF, type PageId } from '$lib/content/site';
  import { initAuth, authStore, ensureViewerProfile, signOut } from '$lib/auth/store.svelte';

  /** Shared single navbar. `active` highlights current page. */
  let { active = 'home' }: { active?: PageId } = $props();

  let menuOpen = $state(false);
  // SSR-safe: only gates the JS-opened mobile panel (rendered post-hydration
  // on user action), so SSR/CSR markup matches and there is no desktop flash.
  // Visibility of desktop links vs burger is CSS media-query driven (no-JS safe).
  let isMobile = $state(false);
  let menuEl: HTMLElement | null = $state(null);
  let toggleEl: HTMLButtonElement | null = $state(null);
  let headerEl: HTMLElement | null = $state(null);
  let accountOpen = $state(false);
  let accountEl: HTMLElement | null = $state(null);
  let accountButtonEl: HTMLButtonElement | null = $state(null);

  // Prerendered site: auth resolves client-side, so before `ready` we render
  // the logged-out variant (never a flash of the account controls) and let the
  // $derived flip reactively once the session probe settles.
  const loggedIn = $derived(authStore.ready && authStore.isAuthenticated);

  $effect(() => {
    if (loggedIn) void ensureViewerProfile();
  });

  const viewerLabel = $derived(authStore.viewerName || authStore.user?.email || '');
  const viewerInitial = $derived(viewerLabel.trim().charAt(0).toUpperCase() || '?');

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

  function closeAccount(returnFocus = false) {
    accountOpen = false;
    if (returnFocus) {
      tick().then(() => accountButtonEl?.focus());
    }
  }

  function toggleAccount() {
    accountOpen = !accountOpen;
    if (accountOpen) {
      tick().then(() => {
        accountEl?.querySelector<HTMLElement>('.targo-account-menu a, .targo-account-menu button')
          ?.focus();
      });
    }
  }

  async function onSignOut() {
    closeMenu();
    closeAccount();
    await signOut();
    goto('/');
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (accountOpen) {
        e.preventDefault();
        closeAccount(true);
        return;
      }
      if (menuOpen) {
        e.preventDefault();
        closeMenu(true);
        return;
      }
    }
    if (!menuOpen) return;
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
    const target = e.target as Node;
    if (accountOpen && accountEl && !accountEl.contains(target)) {
      closeAccount();
    }
    if (!menuOpen || !menuEl) return;
    if (!menuEl.contains(target) && !(toggleEl && toggleEl.contains(target))) {
      closeMenu();
    }
  }

  onMount(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const sync = () => {
      isMobile = mq.matches;
      if (!mq.matches && menuOpen) closeMenu();
      if (mq.matches) closeAccount();
    };
    sync();
    mq.addEventListener('change', sync);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onDocumentClick);

    // Measured nav height -> --targo-nav-h. Consumers (the home hero's
    // full-bleed offset) use var(--targo-nav-h, 96px) as a pre-hydration
    // fallback, so this only ever runs client-side: no top-level DOM access,
    // SSR/prerender safe. Kept in sync because the header reflows on resize,
    // font load and burger/menu open.
    const header: HTMLElement | null =
      headerEl ?? document.querySelector<HTMLElement>('header.targo-nav');
    let unobserveNavHeight: (() => void) | undefined;
    if (header) {
      const el: HTMLElement = header;
      const syncNavHeight = () => {
        document.documentElement.style.setProperty('--targo-nav-h', `${el.offsetHeight}px`);
      };
      syncNavHeight();
      const navHeightObserver = new ResizeObserver(syncNavHeight);
      navHeightObserver.observe(el);
      unobserveNavHeight = () => navHeightObserver.disconnect();
    }

    // Start the shared auth probe (idempotent: first caller wins). Kept inside
    // this existing mount so no browser/Supabase API runs at module scope.
    initAuth();

    return () => {
      mq.removeEventListener('change', sync);
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('click', onDocumentClick);
      document.body.style.overflow = '';
      unobserveNavHeight?.();
    };
  });
</script>

<a class="skip-link" href="#main">Skip to content</a>

<header class="targo-nav" bind:this={headerEl}>
  <a
    href="/"
    class="targo-logo"
    aria-label="Tech Pixel A2H — home"
    onpointerenter={warmHero}
    onfocus={warmHero}
  >
    <img class="targo-logo-img" src="/images/logo.png" alt="Tech Pixel A2H logo" width="1056" height="470" />
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
    {#if loggedIn}
      <div class="targo-account" bind:this={accountEl}>
        <button
          type="button"
          class="targo-user"
          bind:this={accountButtonEl}
          data-testid="nav-account"
          aria-expanded={accountOpen}
          aria-label={viewerLabel ? `Signed in as ${viewerLabel}` : 'Account menu'}
          onpointerenter={warmHero}
          onfocus={warmHero}
          onclick={toggleAccount}
        >
          <span class="targo-user-avatar" aria-hidden="true">{viewerInitial}</span>
          <span class="targo-user-meta">
            <span class="targo-user-name">{viewerLabel}</span>
            <span class="targo-user-role">{authStore.isAdmin ? 'Admin' : 'Signed in'}</span>
          </span>
        </button>
        {#if accountOpen}
          <div class="targo-account-menu">
            {#if authStore.isAdmin}
              <a
                href="/admin"
                data-testid="nav-menu-admin"
                onpointerenter={warmHero}
                onfocus={warmHero}
                onclick={() => {
                  closeAccount();
                  closeMenu();
                }}>Admin</a
              >
            {/if}
            <button type="button" data-testid="nav-signout" onclick={() => void onSignOut()}>
              Sign out
            </button>
          </div>
        {/if}
      </div>
    {/if}
  </nav>
  <a
    class="targo-contact-btn targo-contact-desktop"
    href={CONTACT_HREF}
    data-testid="nav-start-project"
    onpointerenter={warmHero}
    onfocus={warmHero}
  >
    <svg width="17" height="13" viewBox="0 0 17 13" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="15" height="11" rx="1.5" stroke="#111" stroke-width="1.4" />
      <path d="M1.5 2.5 L8.5 8 L15.5 2.5" stroke="#111" stroke-width="1.4" fill="none" />
    </svg>
    Start a Project
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
    {#if loggedIn}
      {#if authStore.isAdmin}
        <a
          href="/admin"
          data-testid="nav-menu-admin-mobile"
          onclick={() => closeMenu()}
          onpointerenter={warmHero}
          onfocus={warmHero}>Admin</a
        >
      {/if}
      <button
        type="button"
        class="targo-mobile-signout"
        data-testid="nav-signout-mobile"
        onclick={() => void onSignOut()}
      >
        Sign out{viewerLabel ? ` (${viewerLabel})` : ''}
      </button>
    {/if}
    <a
      href={CONTACT_HREF}
      data-testid="nav-start-project-mobile"
      onclick={() => closeMenu()}
      onpointerenter={warmHero}
      onfocus={warmHero}>Start a Project</a
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
    /* frosted-glass bar: semi-transparent gradient + strong backdrop blur so
       the page/hero behind it shows through instead of reading as a white pill */
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0.42));
    -webkit-backdrop-filter: blur(22px) saturate(1.8);
    backdrop-filter: blur(22px) saturate(1.8);
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow:
      0 10px 40px rgba(18, 33, 46, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.75);
    /* faint dark hairline just inside the border: keeps the panel edge readable
       over very light backgrounds as well as over the hero */
    outline: 1px solid rgba(18, 33, 46, 0.1);
    outline-offset: -1px;
    font-family: 'Quantico', 'Arial Narrow', sans-serif;
  }
  .targo-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .targo-logo-img {
    height: 40px;
    width: auto;
    display: block;
    flex-shrink: 0;
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
  .targo-links button.targo-user {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    text-transform: none;
    letter-spacing: normal;
    text-decoration: none;
    color: #111;
    background: none;
    border: 0;
    padding: 0;
    margin: 0;
    font: inherit;
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;
  }
  .targo-user-avatar {
    display: inline-grid;
    place-items: center;
    width: 30px;
    height: 30px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: #12212e;
    color: #ffffff;
    font-size: 13px;
    line-height: 1;
  }
  .targo-user-meta {
    display: grid;
    gap: 1px;
    min-width: 0;
    text-align: left;
  }
  .targo-user-name {
    font-size: clamp(12px, 2.4vw, 14px);
    line-height: 1.15;
    max-width: 16ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .targo-user-role {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #0a6f8c;
  }
  .targo-account {
    position: relative;
    display: inline-flex;
  }
  .targo-account-menu {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    z-index: 60;
    min-width: 172px;
    display: grid;
    gap: 4px;
    padding: 10px;
    border-radius: 14px;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.8));
    -webkit-backdrop-filter: blur(22px) saturate(1.8);
    backdrop-filter: blur(22px) saturate(1.8);
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow:
      0 10px 40px rgba(18, 33, 46, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.75);
    outline: 1px solid rgba(18, 33, 46, 0.1);
    outline-offset: -1px;
    font-family: 'Quantico', 'Arial Narrow', sans-serif;
  }
  .targo-account-menu a,
  .targo-account-menu button {
    display: block;
    width: 100%;
    padding: 9px 12px;
    border: 0;
    border-radius: 9px;
    background: none;
    color: #1a1c1e;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
  }
  .targo-account-menu a:hover,
  .targo-account-menu a:focus-visible,
  .targo-account-menu button:hover,
  .targo-account-menu button:focus-visible {
    background: rgba(10, 111, 140, 0.12);
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
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0.42));
    -webkit-backdrop-filter: blur(22px) saturate(1.8);
    backdrop-filter: blur(22px) saturate(1.8);
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow:
      0 10px 40px rgba(18, 33, 46, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.75);
    outline: 1px solid rgba(18, 33, 46, 0.1);
    outline-offset: -1px;
    font-family: 'Quantico', 'Arial Narrow', sans-serif;
  }
  .targo-mobile-menu a,
  .targo-mobile-menu button.targo-mobile-signout {
    color: #1a1c1e;
    font-family: inherit;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    text-decoration: none;
    font-size: 15px;
  }
  .targo-mobile-menu button.targo-mobile-signout {
    background: none;
    border: 0;
    padding: 0;
    margin: 0;
    text-align: left;
    cursor: pointer;
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
