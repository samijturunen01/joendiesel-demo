import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import { LogoWide } from '@/components/brand/Logo';
import { company, fiTime, primaryPhone } from '@/data/company';
import { mainNav, pages, servicePages } from '@/data/site';

const serviceBlurbs: Record<string, string> = {
  [pages.diagnostics.path]: 'Vianetsintä järjestelmätestereillä, jakohihnat, hehkutulpat.',
  [pages.injection.path]: 'Bosch, Delphi, Denso, Stanadyne ja Zexel – suuttimet ja pumput.',
  [pages.commonRail.path]: 'Kunnostus ja testaus Bosch EPS 815 -koepenkissä.',
};

export function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const subId = useId();
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMenuOpen(false);
    setSubOpen(false);
  }, [pathname]);

  // Mobile menu: lock scroll, Escape closes, focus moves into the panel and back
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a, button');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const servicesActive = pathname.startsWith(pages.services.path);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        menuOpen
          ? 'bg-ink-900 shadow-[0_1px_0_rgb(236_235_230/0.08)]'
          : scrolled
            ? 'bg-ink-900/92 shadow-[0_1px_0_rgb(236_235_230/0.08)] backdrop-blur-md'
            : 'bg-transparent'
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link to="/" className="relative z-10 -my-2 block shrink-0 py-2 text-bone-100" aria-label="Joen Diesel Oy – etusivu">
          <LogoWide className="h-8 w-auto lg:h-9" title="Joen Diesel Oy" />
        </Link>

        <nav aria-label="Päävalikko" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {mainNav.map(({ page, children }) =>
              children ? (
                <li
                  key={page.path}
                  className="group relative"
                  onMouseEnter={() => setSubOpen(true)}
                  onMouseLeave={() => setSubOpen(false)}
                >
                  <div className="flex items-center">
                    <NavLink
                      to={page.path}
                      end
                      className={`nav-link py-3 pr-1 pl-3 ${servicesActive ? 'text-amber-400' : ''}`}
                      aria-current={servicesActive && pathname !== page.path ? 'true' : undefined}
                    >
                      {page.label}
                    </NavLink>
                    <button
                      type="button"
                      className="grid size-8 place-items-center text-bone-100/70 hover:text-amber-400"
                      aria-expanded={subOpen}
                      aria-controls={subId}
                      aria-label="Näytä palvelut"
                      // keyboard (detail 0) toggles; a mouse click must not close a menu its hover just opened
                      onClick={(e) => setSubOpen((v) => (e.detail === 0 ? !v : true))}
                    >
                      <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${subOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  <div
                    id={subId}
                    className={`absolute top-full left-0 w-[25rem] pt-2 transition-[opacity,transform] duration-300 ${
                      subOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                    }`}
                    onBlur={(e) => {
                      if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) setSubOpen(false);
                    }}
                  >
                    <ul className="border border-bone-100/10 bg-ink-850 p-2 shadow-2xl shadow-black/40">
                      {children.map((child, i) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              `group/item grid grid-cols-[2.25rem_1fr] gap-x-2 px-3 py-3 transition-colors hover:bg-ink-700/60 ${isActive ? 'bg-ink-700/50' : ''}`
                            }
                          >
                            <span className="label pt-1 text-amber-400">0{i + 1}</span>
                            <span>
                              <span className="block font-[650] [font-stretch:90%] group-hover/item:text-amber-300">{child.label}</span>
                              <span className="block text-sm leading-snug text-steel-300">{serviceBlurbs[child.path]}</span>
                            </span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={page.path}>
                  <NavLink to={page.path} className={({ isActive }) => `nav-link px-3 py-3 ${isActive ? 'text-amber-400' : ''}`}>
                    {page.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${primaryPhone.e164}`}
            className="hidden items-center gap-2.5 border border-bone-100/25 px-4 py-2.5 text-[0.95rem] font-[620] tabular transition-colors [font-stretch:90%] hover:border-amber-400 hover:text-amber-400 sm:inline-flex"
          >
            <Phone aria-hidden="true" className="size-4 text-amber-400" strokeWidth={2} />
            <span className="sr-only">Soita: </span>
            {primaryPhone.display}
          </a>
          <a
            href={`tel:${primaryPhone.e164}`}
            className="grid size-11 place-items-center text-amber-400 sm:hidden"
            aria-label={`Soita ${primaryPhone.display}`}
          >
            <Phone aria-hidden="true" className="size-5" strokeWidth={2} />
          </a>
          <button
            ref={menuButton}
            type="button"
            className="grid size-11 place-items-center lg:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Sulje valikko' : 'Avaa valikko'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
          </button>
        </div>
      </div>

    </header>

      {/* Mobile menu – outside <header>: a backdrop-filter there would become the containing block of this fixed panel */}
      <div
        id={menuId}
        ref={panel}
        className={`fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-ink-900 transition-[opacity,visibility] duration-300 lg:hidden ${
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav aria-label="Mobiilivalikko" className="shell flex min-h-full flex-col pt-6 pb-10">
          <ul className="border-t border-bone-100/10">
            <li className="border-b border-bone-100/10">
              <NavLink to="/" end className={({ isActive }) => `mobile-link ${isActive ? 'text-amber-400' : ''}`}>
                Etusivu
              </NavLink>
            </li>
            {mainNav.map(({ page, children }) => (
              <li key={page.path} className="border-b border-bone-100/10">
                <NavLink to={page.path} end className={({ isActive }) => `mobile-link ${isActive ? 'text-amber-400' : ''}`}>
                  {page.label}
                </NavLink>
                {children ? (
                  <ul className="-mt-2 pb-4">
                    {servicePages.map((child, i) => (
                      <li key={child.path}>
                        <NavLink
                          to={child.path}
                          className={({ isActive }) => `flex items-baseline gap-3 py-2 text-lg font-[560] ${isActive ? 'text-amber-400' : 'text-bone-200'}`}
                        >
                          <span className="label text-amber-400">0{i + 1}</span>
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-3 pt-10">
            {company.phones.map((p) => (
              <a key={p.e164} href={`tel:${p.e164}`} className="btn btn-ghost justify-between">
                <span className="label text-steel-300">{p.label}</span>
                <span className="tabular">{p.display}</span>
              </a>
            ))}
            <p className="label mt-3 text-steel-300">
              Ma–to {fiTime('08:00')}–{fiTime('16:00')} · Pe {fiTime('08:00')}–{fiTime('14:00')} · {company.address.street}, {company.address.city}
            </p>
            <p className="label text-steel-400">Konseptidemo – ei yrityksen virallinen sivusto.</p>
          </div>
        </nav>
      </div>
    </>
  );
}
