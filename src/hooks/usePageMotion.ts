import type { RefObject } from 'react';
import { gsap, motionOk, ScrollTrigger, useGSAP } from '@/lib/gsap';

/**
 * Scroll-triggered reveals for a page:
 *   [data-reveal]        fades/slides in once when it enters the viewport (batched)
 *   [data-draw]          an SVG whose stroked shapes (pathLength="1") are drawn in
 *   [data-fill]          measuring-glass columns: --fill animates from 0 to the element's data-fill value
 * Hidden start states exist only under html.motion-ok (see index.css), so content is visible
 * without JavaScript and with prefers-reduced-motion.
 */
export function usePageMotion(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !motionOk()) return;

      const reveal = gsap.utils.toArray<HTMLElement>('[data-reveal]', root);
      if (reveal.length) {
        ScrollTrigger.batch(reveal, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.95, stagger: 0.08, ease: 'power3.out', overwrite: true }),
        });
      }

      for (const svg of gsap.utils.toArray<SVGSVGElement>('[data-draw]', root)) {
        const strokes = svg.querySelectorAll('[pathLength]');
        const fills = svg.querySelectorAll('[data-draw-fill]');
        const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 88%', once: true } });
        tl.to(strokes, { strokeDashoffset: 0, duration: 1.5, stagger: 0.025, ease: 'power2.inOut' });
        if (fills.length) tl.from(fills, { opacity: 0, duration: 0.8, stagger: 0.05 }, '-=0.7');
      }

      for (const el of gsap.utils.toArray<HTMLElement>('[data-fill]', root)) {
        const target = Number(el.dataset.fill ?? 0);
        gsap.fromTo(
          el,
          { '--fill': 0 },
          { '--fill': target, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } },
        );
      }

      // Late-loading fonts change heights: recompute trigger positions once they are ready.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  );
}
