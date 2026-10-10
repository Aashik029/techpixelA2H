<script lang="ts">
  import { onMount } from 'svelte';
  import { armAutoplay, pickVideoSrc } from '$lib/targo';

  let aboutVideo: HTMLVideoElement | null = $state(null);

  onMount(() => {
    // C6: no native `autoplay` attribute on the video — armAutoplay drives
    // playback in JS so the reduced-motion guard is effective.
    // Offscreen video: wait until near viewport before fetching/arming
    // so the initial page load skips the ~1.8MB about.mp4. armAutoplay
    // (muted + playsinline) still drives playback once visible.
    // preload="none" means assigning src here still costs zero bytes, so the
    // 720p H.264 twin (228 KB vs 1835 KB) is chosen before anything can fetch.
    if (aboutVideo) {
      aboutVideo.src = pickVideoSrc('/videos/about.mp4', '/videos/about-mobile.mp4');
    }
    if (typeof IntersectionObserver !== 'undefined' && aboutVideo) {
      let disarm: (() => void) | undefined;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            disarm = armAutoplay(aboutVideo);
          }
        },
        { rootMargin: '200px' }
      );
      io.observe(aboutVideo);
      return () => {
        io.disconnect();
        disarm?.();
      };
    }
    const disarm = armAutoplay(aboutVideo);
    return () => disarm();
  });
</script>

<section id="about" class="targo-about" aria-label="About">
  <div class="targo-about-left">
    <h2 class="targo-about-title">
      <span class="t-line">About</span>
      <span class="t-line t-indent t-accent">Business</span>
    </h2>
    <p class="targo-about-text">
      Tech Pixel A2H builds the digital foundation modern businesses rely on — websites that load
      fast and rank well, AI workflows that save hours every week, designs people remember,
      content people read, and campaigns that bring customers back. 25+ projects delivered, zero
      surprises.
    </p>

    <a class="targo-cta" href="/about">Learn more</a>
  </div>

  <div class="targo-about-right">
    <div class="targo-about-halo" aria-hidden="true"></div>
    <div class="targo-video-wrap" aria-hidden="true">
      <video
        bind:this={aboutVideo}
        src="/videos/about.mp4"
        poster="/videos/about-poster.jpg"
        muted
        loop
        playsinline
        disablepictureinpicture
        preload="none"
      ></video>
      <div class="targo-video-tint"></div>
    </div>
  </div>
</section>

<style>
  .targo-about {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 40px;
    background: #f2f1f0;
    border-top: 1px solid rgba(18, 33, 46, 0.08);
    padding: clamp(60px, 10vw, 140px) 0 clamp(30px, 5vw, 70px) clamp(20px, 9vw, 118px);
    font-family: 'Quantico', 'Arial Narrow', sans-serif;
  }

  .targo-about-left {
    flex: 1 1 420px;
    min-width: 300px;
  }
  .targo-about-title {
    margin: 0;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.01em;
    line-height: 0.98;
    color: #2b3033;
    font-size: clamp(34px, 6.5vw, 72px);
  }
  .targo-about-title .t-line {
    display: block;
  }
  .targo-about-title .t-indent {
    padding-left: min(160px, 18vw);
  }
  .targo-about-title .t-accent {
    color: #0a6f8c;
  }

  .targo-about-text {
    max-width: 520px;
    margin: 32px 0 0 min(160px, 18vw);
    font-size: clamp(14px, 1.6vw, 17px);
    line-height: 1.7;
    color: #3d4653;
  }

  .targo-about .targo-cta {
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
    margin: 36px 0 0 min(160px, 18vw);
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
    box-shadow:
      0 0 0 1px rgba(21, 188, 223, 0.35),
      0 10px 30px -12px rgba(15, 163, 194, 0.6);
  }
  .targo-about .targo-cta:hover {
    background: #3fd0ef;
    box-shadow:
      0 0 0 1px rgba(21, 188, 223, 0.55),
      0 14px 36px -12px rgba(15, 163, 194, 0.8);
  }

  .targo-about-right {
    flex: 1 1 360px;
    min-width: 280px;
    display: flex;
    justify-content: flex-end;
    position: relative;
  }
  /* halo: lifts the white ball off the white background */
  .targo-about-halo {
    position: absolute;
    inset: -6% -4%;
    pointer-events: none;
    background: radial-gradient(
      ellipse 56% 52% at 50% 42%,
      rgba(18, 33, 46, 0.12) 0%,
      rgba(18, 33, 46, 0.04) 55%,
      rgba(18, 33, 46, 0) 72%
    );
  }
  .targo-video-wrap {
    position: relative;
    width: 100%;
    max-width: 644px;
  }
  .targo-video-wrap video {
    width: 100%;
    height: auto;
    display: block;
    filter: contrast(1.06) saturate(1.05);
  }
  .targo-video-tint {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 644px;
    height: 100%;
    background: #15bcdf;
    mix-blend-mode: hue;
    pointer-events: none;
    z-index: 1;
  }
  @media (max-width: 700px) {
    .targo-about {
      padding-left: 20px;
    }
    .targo-about-text {
      margin-right: 20px;
    }
  }
</style>
