import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronRight, MapPin, Plus } from 'lucide-react';
import { company, fiTime, hoursForDay } from '@/data/company';
import type { Faq } from '@/data/content';
import { inquiryHref, type PageMeta } from '@/data/site';
import { useMounted } from '@/hooks/useMounted';
import { helsinkiWeekday } from '@/lib/hours';
import { ButtonLink, Ruler, SectionLabel } from './primitives';

/* ------------------------------------------------------------------ */
/* Sub-page hero                                                        */
/* ------------------------------------------------------------------ */
export function PageHero({
  code,
  label,
  title,
  lead,
  aside,
  asideCaption = 'Kuvitus',
  trail = [],
  children,
}: {
  code: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  asideCaption?: string;
  trail?: PageMeta[];
  children?: ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden bg-ink-900 pt-28 lg:pt-40">
      <div aria-hidden="true" className="ruler-v absolute top-0 bottom-0 left-[max(0.5rem,calc((100vw-92rem)/2+0.5rem))] hidden text-bone-100 md:block" />
      <div className="shell relative">
        {trail.length ? (
          <nav aria-label="Murupolku" className="label mb-10 text-steel-300">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link className="hover:text-amber-400" to="/">
                  Etusivu
                </Link>
              </li>
              {trail.map((p, i) => (
                <li key={p.path} className="flex items-center gap-1.5">
                  <ChevronRight aria-hidden="true" className="size-3 opacity-60" />
                  {i === trail.length - 1 ? (
                    <span aria-current="page" className="text-bone-100">
                      {p.label}
                    </span>
                  ) : (
                    <Link className="hover:text-amber-400" to={p.path}>
                      {p.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <div className="grid items-end gap-12 pb-16 lg:grid-cols-12 lg:pb-24">
          <div className={aside ? 'lg:col-span-7' : 'lg:col-span-10'}>
            <SectionLabel code={code} className="hero-fade text-steel-300">
              {label}
            </SectionLabel>
            <h1 className="display-l mt-6 text-bone-100">{title}</h1>
            {lead ? <div className="lead hero-fade mt-8 max-w-2xl text-bone-200" style={{ ['--i' as string]: 2 }}>{lead}</div> : null}
            {children ? <div className="hero-fade mt-10" style={{ ['--i' as string]: 3 }}>{children}</div> : null}
          </div>
          {aside ? (
            <figure className="hero-fade lg:col-span-5" style={{ ['--i' as string]: 3 }}>
              <div className="frame p-6 text-bone-100/25 sm:p-8">
                <div className="frame-content text-steel-300">{aside}</div>
              </div>
              <figcaption className="label mt-3 text-steel-400">{asideCaption}</figcaption>
            </figure>
          ) : null}
        </div>
      </div>
      <Ruler className="text-bone-100" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Amber call band – the closing section of most pages                  */
/* ------------------------------------------------------------------ */
export function CallBand({ topic, title = 'Soita ja kysy.', text }: { topic?: string; title?: string; text?: string }) {
  return (
    <section className="relative overflow-hidden bg-amber-400 text-ink-950" aria-labelledby="callband-title">
      <div className="shell grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-5">
          <p className="label text-ink-800">Yhteydenotto</p>
          <h2 id="callband-title" className="display-l mt-5">
            {title}
          </h2>
          <p className="mt-6 max-w-md text-lg text-ink-800">
            {text ?? 'Laitteen kunnosta, saatavuudesta ja aikatauluista saa nopeimmin selvää puhelimessa. Voit myös jättää tarjouspyynnön.'}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to={inquiryHref({ aihe: topic })} variant="dark">
              Jätä tarjouspyyntö
            </ButtonLink>
          </div>
        </div>
        <div className="lg:col-span-7">
          <ul className="border-t-2 border-ink-950">
            {company.phones.map((p) => (
              <li key={p.e164} className="border-b-2 border-ink-950">
                <a
                  href={`tel:${p.e164}`}
                  className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 transition-colors hover:bg-ink-950 hover:text-amber-400 sm:px-2"
                >
                  <span className="label text-ink-800 group-hover:text-amber-300">{p.label}</span>
                  <span className="text-[clamp(2.3rem,6.4vw,5.6rem)] leading-[0.95] font-[800] tabular [font-stretch:70%]">{p.display}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <HoursTable tone="amber" />
            <div>
              <p className="label mb-3 text-ink-800">Osoite</p>
              <p className="text-lg leading-snug font-[600]">
                {company.address.street}
                <br />
                {company.address.postalCode} {company.address.city}
              </p>
              <a className="link mt-2 inline-flex items-center gap-1.5 font-[600]" href={company.maps.google} target="_blank" rel="noopener noreferrer">
                <MapPin aria-hidden="true" className="size-4" />
                Avaa kartalla
                <span className="sr-only"> (Google Maps, avautuu uuteen välilehteen)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Opening hours – today is highlighted in the browser only              */
/* ------------------------------------------------------------------ */
export function HoursTable({ tone = 'dark' }: { tone?: 'dark' | 'paper' | 'amber' }) {
  const mounted = useMounted();
  const today = mounted ? helsinkiWeekday() : null;
  const rows = [
    { days: [1, 2, 3, 4], label: 'Maanantai–torstai' },
    { days: [5], label: 'Perjantai' },
    { days: [6, 7], label: 'Lauantai–sunnuntai' },
  ];
  const muted = tone === 'dark' ? 'text-steel-300' : 'text-ink-800';
  const mark = tone === 'dark' ? 'text-amber-400' : tone === 'amber' ? 'bg-ink-950 text-amber-400' : 'text-amber-700';
  return (
    <div>
      <p className={`label mb-3 ${muted}`}>Aukioloajat</p>
      <table className="w-full text-left tabular">
        <caption className="sr-only">Aukioloajat</caption>
        <tbody>
          {rows.map((r) => {
            const h = hoursForDay(r.days[0]!);
            const isToday = today !== null && r.days.includes(today);
            return (
              <tr key={r.label} className={tone === 'amber' ? 'border-b border-ink-950/20' : 'border-b border-current/10'}>
                <th scope="row" className="py-1.5 pr-4 font-[500]">
                  {r.label}
                  {isToday ? <span className={`label ml-2 px-1.5 py-0.5 ${mark}`}>tänään</span> : null}
                </th>
                <td className="py-1.5 text-right font-[600]">{h ? `${fiTime(h.opens)}–${fiTime(h.closes)}` : 'suljettu'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ – native <details>, keyboard and screen-reader friendly          */
/* ------------------------------------------------------------------ */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="border-t border-current/15">
      {items.map((f) => (
        <details key={f.q} className="group border-b border-current/15">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-[1.2rem] leading-snug font-[650] [font-stretch:90%] marker:hidden hover:text-amber-700 [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus aria-hidden="true" className="mt-1 size-5 shrink-0 transition-transform duration-300 group-open:rotate-45" />
          </summary>
          <p className="prose-fi max-w-3xl pb-7 text-ink-700">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
