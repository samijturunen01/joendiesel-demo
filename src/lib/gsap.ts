import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** True when the pre-paint script in index.html decided that motion is allowed. */
export const motionOk = (): boolean => typeof document !== 'undefined' && document.documentElement.classList.contains('motion-ok');

/** Small screens / coarse pointers get lighter versions of the expensive effects. */
export const isLightweight = (): boolean =>
  typeof window !== 'undefined' && (window.matchMedia('(max-width: 767px)').matches || window.matchMedia('(pointer: coarse)').matches);

export { gsap, ScrollTrigger, useGSAP };
