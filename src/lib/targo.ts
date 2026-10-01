/** Prefetch a video file into the HTTP cache (once per URL) so a
 *  subsequent route change can play it instantly instead of fetching +
 *  decoding multi-MB files after navigation lands. Call on link
 *  pointerenter/focus — zero cost if the user never navigates. */
const prefetched = new Set<string>();

export function prefetchVideo(href: string) {
  if (typeof document === 'undefined' || prefetched.has(href)) return;
  prefetched.add(href);
  try {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'video';
    link.href = href;
    document.head.appendChild(link);
  } catch {
    /* ignore */
  }
}
/** True when the user prefers reduced motion (SSR-safe: false on server). */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}
/** Shared autoplay helper for the Targo sections.
 *  Guarantees playback without any cursor interaction:
 *  - plays ASAP on canplay/loadeddata (muted + playsinline)
 *  - treats a non-paused video as settled
 *  - retries on an interval AND on any user activation (pointerdown,
 *    touchstart, click, keydown) for browsers that block muted autoplay
 *    until first gesture. All rejections swallowed.
 *  Reduced-motion guard (C6): when the user prefers reduced motion the
 *  video is left paused on its poster — callers render an explicit
 *  pause/play control so playback stays user-initiated. */
export function armAutoplay(video: HTMLVideoElement | null) {
  if (!video || typeof document === 'undefined') return () => {};

  // Reduced-motion users: never autoplay; leave the poster frame in place.
  if (prefersReducedMotion()) {
    try {
      video.pause();
    } catch {
      /* ignore */
    }
    return () => {};
  }

  let settled = false;

  const markSettled = () => {
    if (!settled) {
      settled = true;
      cleanup();
    }
  };

  const tryPlay = () => {
    if (!video.isConnected) {
      cleanup();
      return;
    }
    // Already playing (e.g. native autoplay won) — nothing to do.
    if (!video.paused && !video.ended) {
      markSettled();
      return;
    }
    try {
      video.muted = true;
      const p = video.play();
      if (p && typeof p.then === 'function') {
        p.then(markSettled, () => {
          /* keep retrying */
        });
      } else {
        markSettled();
      }
    } catch {
      /* keep retrying */
    }
  };

  const interval = window.setInterval(tryPlay, 800);

  video.addEventListener('canplay', tryPlay);
  video.addEventListener('loadeddata', tryPlay);

  const gestures: Array<keyof DocumentEventMap> = ['pointerdown', 'touchstart', 'click', 'keydown'];
  for (const g of gestures) document.addEventListener(g, tryPlay, { passive: true });

  function cleanup() {
    window.clearInterval(interval);
    video?.removeEventListener('canplay', tryPlay);
    video?.removeEventListener('loadeddata', tryPlay);
    for (const g of gestures) document.removeEventListener(g, tryPlay);
  }

  try {
    video.load();
  } catch {
    /* ignore */
  }
  tryPlay();
  return cleanup;
}
