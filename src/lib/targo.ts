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

/** True when the connection can't afford a multi-MB decorative video:
 *  an explicit Save-Data toggle, or a 2G effective type. `connection` is
 *  Chromium-only, hence the feature-detected typing. SSR-safe: false. */
export function prefersDataSaver(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      mozConnection?: { saveData?: boolean; effectiveType?: string };
      webkitConnection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (!conn) return false;
  if (conn.saveData === true) return true;
  return conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g';
}

/** Pick the lighter of two video sources on small screens.
 *  The desktop clips are 1080p HEVC (~3 MB); the `-mobile` twins are 540p
 *  H.264 (~284 KB), which is a ~91% saving and additionally decodes on
 *  Android Chrome, where HEVC-in-MP4 is frequently unsupported — that was the
 *  video silently never playing. Must run BEFORE armAutoplay's load(), so
 *  exactly one file is ever requested. SSR-safe: always returns desktopSrc. */
export function pickVideoSrc(desktopSrc: string, mobileSrc: string): string {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return desktopSrc;
  try {
    return window.matchMedia('(max-width: 700px)').matches ? mobileSrc : desktopSrc;
  } catch {
    return desktopSrc;
  }
}
/** Shared autoplay helper for the Targo sections.
 *  Guarantees playback without any cursor interaction:
 *  - plays ASAP on canplay/loadeddata (muted + playsinline)
 *  - treats a non-paused video as settled
 *  - retries on an interval AND on user activation (pointerdown, keydown) for
 *    browsers that block muted autoplay until first gesture. Retries are
 *    BOUNDED — see MAX_ATTEMPTS below. All rejections swallowed.
 *  Reduced-motion guard (C6): when the user prefers reduced motion the
 *  video is left paused on its poster — callers render an explicit
 *  pause/play control so playback stays user-initiated.
 *  Data-saver guard: on Save-Data / 2G the video is left on its poster
 *  and the play() retry loop never starts, so not one video byte is
 *  fetched over a metered or slow link. */
export function armAutoplay(video: HTMLVideoElement | null) {
  if (!video || typeof document === 'undefined') return () => {};

  // Reduced-motion / data-saver users: never autoplay; leave the poster.
  if (prefersReducedMotion() || prefersDataSaver()) {
    try {
      video.pause();
    } catch {
      /* ignore */
    }
    return () => {};
  }

  let settled = false;
  let attempts = 0;
  let sawGesture = false;

  // Hard ceiling on retries. When autoplay is blocked (iOS Low Power Mode,
  // memory pressure, low-end Android) play() rejects *forever*; the previous
  // unbounded 800ms loop then pegged the main thread for the life of the page
  // and every tap queued three more rejected promises — that is what made the
  // site feel frozen on mobile and left the video stuck buffering. Bounded
  // attempts give up cleanly and leave the poster on screen.
  const MAX_ATTEMPTS = 10;
  const MAX_GESTURE_ATTEMPTS = 3;

  const markSettled = () => {
    if (!settled) {
      settled = true;
      cleanup();
    }
  };

  const tryPlay = () => {
    if (!video.isConnected) {
      markSettled();
      return;
    }
    // Already playing (e.g. native autoplay won) — nothing to do.
    if (!video.paused && !video.ended) {
      markSettled();
      return;
    }
    const cap = MAX_ATTEMPTS + (sawGesture ? MAX_GESTURE_ATTEMPTS : 0);
    if (attempts >= cap) {
      markSettled();
      return;
    }
    attempts++;
    try {
      video.muted = true;
      const p = video.play();
      if (p && typeof p.then === 'function') {
        p.then(markSettled, () => {
          /* keep retrying, but only until the cap above */
        });
      } else {
        markSettled();
      }
    } catch {
      /* keep retrying, but only until the cap above */
    }
  };

  const interval = window.setInterval(tryPlay, 800);

  video.addEventListener('canplay', tryPlay);
  video.addEventListener('loadeddata', tryPlay);
  // Authoritative success signal: play() resolving is not guaranteed to mean
  // frames are actually advancing, but `playing` firing is.
  video.addEventListener('playing', markSettled);

  // pointerdown already fires for touch input on every engine that matters, so
  // touchstart + click were duplicate listeners that tripled the work per tap.
  const onGesture = () => {
    sawGesture = true;
    tryPlay();
  };
  const gestures: Array<keyof DocumentEventMap> = ['pointerdown', 'keydown'];
  for (const g of gestures) document.addEventListener(g, onGesture, { passive: true });

  function cleanup() {
    window.clearInterval(interval);
    video?.removeEventListener('canplay', tryPlay);
    video?.removeEventListener('loadeddata', tryPlay);
    video?.removeEventListener('playing', markSettled);
    for (const g of gestures) document.removeEventListener(g, onGesture);
  }

  // load() is REQUIRED: with preload="none" the element never enters the
  // resource-selection algorithm on its own, so play() alone would leave it at
  // readyState 0 forever and the video would never start. Verified by test.
  try {
    video.load();
  } catch {
    /* ignore */
  }
  tryPlay();
  return cleanup;
}
