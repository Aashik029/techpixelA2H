/** Scroll-reveal action: adds .in when element enters viewport.
 *  Respects prefers-reduced-motion (reveals immediately). */
export function reveal(node: HTMLElement, options: { threshold?: number; rootMargin?: string } = {}) {
  const { threshold = 0.12, rootMargin = '0px 0px -8% 0px' } = options;

  if (typeof window === 'undefined') return {};

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    node.classList.add('in');
    return {};
  }

  node.classList.add('reveal');
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          // stagger via data-delay (ms)
          const delay = Number((e.target as HTMLElement).dataset.delay ?? 0);
          if (delay > 0) {
            (e.target as HTMLElement).style.transitionDelay = `${delay}ms`;
          }
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    },
    { threshold, rootMargin }
  );
  io.observe(node);

  return {
    destroy() {
      io.disconnect();
    }
  };
}
