<script lang="ts">
  import { onMount } from 'svelte';
  import { armAutoplay, pickVideoSrc } from '$lib/targo';

  let heroVideo: HTMLVideoElement | null = $state(null);

  onMount(() => {
    // C6: no native `autoplay` attribute on the video — armAutoplay drives
    // playback in JS so the reduced-motion guard is effective.
    // C6 perf: the multi-MB video fetch starts only once the main thread is
    // idle, so the LCP poster gets uncontended bandwidth on slow networks.
    let disarm: (() => void) | undefined;
    let idleId: number | undefined;
    const run = () => {
      // Swap to the 540p H.264 twin BEFORE armAutoplay calls load(), so a
      // phone fetches the 284 KB file instead of the 3 MB 1080p HEVC one.
      if (heroVideo) {
        heroVideo.src = pickVideoSrc('/videos/hero.mp4', '/videos/hero-mobile.mp4');
      }
      disarm = armAutoplay(heroVideo);
    };
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(run, { timeout: 2000 });
    } else {
      idleId = window.setTimeout(run, 1);
    }
    return () => {
      disarm?.();
      if (idleId !== undefined) {
        if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId);
        else window.clearTimeout(idleId);
      }
    };
  });
</script>

<section id="home" class="targo-hero" aria-label="Hero">
  <!-- soft halo so the white globe reads against the light bg -->
  <div class="targo-hero-halo" aria-hidden="true"></div>
  <!-- background video: contain, no crop -->
  <div class="targo-hero-media" aria-hidden="true">
    <video
      bind:this={heroVideo}
      src="/videos/hero.mp4"
      poster="/videos/hero-poster.jpg"
      muted
      loop
      playsinline
      disablepictureinpicture
      preload="none"
    ></video>
  </div>
  <!-- desktop-only left scrim -->
  <div class="targo-scrim" aria-hidden="true"></div>

  <!-- staircase headline -->
  <h1 class="targo-headline">
    <span class="t-line">Building</span>
    <span class="t-line">The</span>
    <span class="t-line">Platform</span>
    <span class="t-line t-indent">For</span>
    <span class="t-line t-indent">Your</span>
    <span class="t-line t-indent t-accent">Growth</span>
  </h1>

  <div class="targo-cta-row">
    <a class="targo-cta" href="#contact">
      Get started <span class="targo-cta-dash" aria-hidden="true"></span>
    </a>
  </div>
</section>

<style>
  .targo-hero {
    position: relative;
    min-height: 100svh;
    /* Full-bleed: pull the hero up so the grey band + globe start at y=0,
       *behind* the floating glass nav (no white strip above it). The offset is
       the nav's measured height (--targo-nav-h, set by TargoNav) plus the nav's
       own top margin, which is not part of its border box. */
    margin-top: calc(-1 * (var(--targo-nav-h, 96px) + clamp(12px, 2vw, 24px)));
    background: #f2f1f0;
    overflow: hidden;
    font-family: 'Quantico', 'Arial Narrow', sans-serif;
  }

  /* --- halo: lifts the white globe off the light background --- */
  .targo-hero-halo {
    position: absolute;
    top: 0;
    right: 0;
    width: 62%;
    height: 88%;
    pointer-events: none;
    background: radial-gradient(
      ellipse 52% 46% at 62% 36%,
      rgba(18, 33, 46, 0.14) 0%,
      rgba(18, 33, 46, 0.05) 55%,
      rgba(18, 33, 46, 0) 72%
    );
  }

  /* --- background video: contain, no crop --- */
  .targo-hero-media {
    position: absolute;
    top: 0;
    right: -20%;
    width: 99%;
    pointer-events: none;
  }
  .targo-hero-media video {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
    filter: contrast(1.07) saturate(1.06);
  }

  /* --- desktop scrim: light left panel keeping headline readable --- */
  .targo-scrim {
    position: absolute;
    inset: 0;
    width: 70%;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      rgba(242, 241, 240, 0.95) 0%,
      rgba(242, 241, 240, 0.6) 55%,
      rgba(242, 241, 240, 0) 100%
    );
  }

  /* --- headline --- */
  .targo-headline {
    position: relative;
    margin: 0;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.01em;
    line-height: 0.98;
    color: #2b3033;
    font-size: min(clamp(34px, 7.6vw, 80px), 9.2vh);
    padding: min(clamp(40px, 9vw, 120px), 9vh) 20px min(clamp(24px, 4vw, 44px), 5vh)
      clamp(20px, 9vw, 118px);
    /* The hero now sits at y=0 under the floating nav, so the top padding must
       also clear it: nav height + nav top margin + the original breathing room.
       That keeps the headline in exactly its previous absolute position while
       guaranteeing it is never behind the glass bar. */
    padding-top: calc(
      var(--targo-nav-h, 96px) + clamp(12px, 2vw, 24px) + min(clamp(40px, 9vw, 120px), 9vh)
    );
  }
  .targo-headline .t-line {
    display: block;
  }
  .targo-headline .t-indent {
    padding-left: min(238px, 28vw);
  }
  .targo-headline .t-accent {
    color: #0a6f8c;
  }

  /* --- CTA --- */
  .targo-cta-row {
    position: relative;
    padding-left: calc(clamp(20px, 9vw, 118px) + min(238px, 28vw));
    padding-bottom: min(clamp(36px, 6vw, 80px), 7vh);
  }
  .targo-cta {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    background: #15bcdf;
    border: 1px solid #0fa3c2;
    color: #1a1c1e;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.14em;
    padding: 18px 34px;
    font-size: clamp(13px, 2.2vw, 16px);
    font-family: inherit;
    text-decoration: none;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
    box-shadow:
      0 0 0 1px rgba(21, 188, 223, 0.35),
      0 10px 30px -12px rgba(15, 163, 194, 0.6);
  }
  .targo-cta:hover {
    background: #3fd0ef;
    box-shadow:
      0 0 0 1px rgba(21, 188, 223, 0.55),
      0 14px 36px -12px rgba(15, 163, 194, 0.8);
  }
  .targo-cta-dash {
    display: inline-block;
    width: 22px;
    height: 1px;
    background: #1a1c1e;
  }

  /* --- mobile (<=700px) --- */
  @media (max-width: 700px) {
    .targo-hero-media {
      top: 0;
      left: -12%;
      right: auto;
      width: 119%;
    }
    .targo-scrim {
      display: none;
    }
    .targo-headline {
      /* 360px clears the globe; adding the nav height + nav top margin keeps the
         staircase below the glass bar now that the hero itself starts at y=0. */
      margin-top: calc(360px + var(--targo-nav-h, 96px) + clamp(12px, 2vw, 24px));
      padding: 0 20px 28px 20px;
      font-size: clamp(34px, 10vw, 56px);
    }
    .targo-cta-row {
      padding-left: 20px;
      padding-bottom: 48px;
    }
    .targo-cta-row .targo-cta {
      margin-left: min(238px, 28vw);
    }
  }
</style>
