import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { ScrollTrigger } from '@/lib/gsap';
import { Footer } from './Footer';
import { Header } from './Header';

/**
 * Page chrome. Navigation is immediate: no curtains, overlays or loading screens.
 * After a client-side navigation the window scrolls to the top (or to #hash) and focus
 * moves to <main> so keyboard and screen-reader users start at the new content.
 */
export function Layout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
    // new page content: let ScrollTrigger measure again
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, hash]);

  return (
    <>
      <a href="#sisalto" className="skip-link">
        Siirry sisältöön
      </a>
      <Header />
      <main id="sisalto" ref={main} tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <DemoBadge />
    </>
  );
}

function DemoBadge() {
  return (
    <p
      className="label pointer-events-none fixed bottom-2 left-2 z-40 hidden border border-bone-100/15 bg-ink-950/85 px-2 py-1 text-[0.58rem] text-steel-300 backdrop-blur-sm md:block"
      title="Konseptidemo – ei yrityksen virallinen sivusto"
    >
      Konseptidemo
    </p>
  );
}
