import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { CrPumpDrawing, InlinePumpDrawing, TesterDrawing } from '@/components/illustrations/Drawings';
import { SectionLabel } from '@/components/ui/primitives';
import { pages } from '@/data/site';

const services = [
  {
    page: pages.diagnostics,
    title: 'Vianetsintä ja huolto',
    text: 'Dieselmoottoreiden vianetsintä Boschin ja Denson järjestelmätestereillä, jakohihnat, syöttöpumppujen ja suuttimien irrotus ja asennus sekä hehkutulpat – myös katkenneet.',
    tags: ['KTS 650', 'KTS 570', 'Denso'],
    Drawing: TesterDrawing,
    caption: 'Järjestelmätesteri – kuvitus',
  },
  {
    page: pages.injection,
    title: 'Suuttimet ja pumput',
    text: 'Suuttimien sekä rivi- ja jakajapumppujen korjaus ja huolto viideltä valmistajalta: Bosch, Delphi, Denso, Stanadyne ja Zexel.',
    tags: ['Rivipumput', 'Jakajapumput', 'EDC'],
    Drawing: InlinePumpDrawing,
    caption: 'Rivipumppu – kuvitus',
  },
  {
    page: pages.commonRail,
    title: 'Common rail',
    text: 'Boschin korkeapainepumppujen ja suuttimien kunnostus ja testaus koepenkissä. Kunnostettuja vaihtoyksiköitä varastossa.',
    tags: ['EPS 815', 'Vaihtoyksiköt', 'VP30 / VP44'],
    Drawing: CrPumpDrawing,
    caption: 'Korkeapainepumppu – kuvitus',
  },
] as const;

export function ServiceIndex() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-ink-900 py-24 lg:py-36" aria-labelledby="services-title">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel code="01" className="text-steel-300" >
              Palvelut
            </SectionLabel>
            <h2 id="services-title" className="display-l mt-6" data-reveal="">
              Ruiskutus&shy;laitteet autosta koepenkkiin.
            </h2>
          </div>
          <p className="lead self-end text-bone-200 lg:col-span-5 lg:col-start-8" data-reveal="">
            Vianetsintä autossa, laitteen irrotus ja asennus, korjaus, kunnostus ja koepenkkitestaus – samassa korjaamossa Joensuussa.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12">
          <ol className="lg:col-span-7">
            {services.map((s, i) => {
              const isActive = active === i;
              return (
                <li key={s.page.path} className="border-t border-bone-100/15 last:border-b" data-reveal="">
                  <Link
                    to={s.page.path}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group grid grid-cols-[3rem_1fr_auto] items-start gap-x-4 py-8 sm:grid-cols-[4.5rem_1fr_auto] lg:py-10"
                  >
                    <span className={`label pt-3 transition-colors ${isActive ? 'text-amber-400' : 'text-steel-400'}`}>0{i + 1}</span>
                    <span>
                      <span
                        className={`block text-[clamp(2rem,4.4vw,3.9rem)] leading-[0.95] font-[780] transition-colors [font-stretch:72%] ${
                          isActive ? 'text-bone-100' : 'text-bone-100/70'
                        } group-hover:text-amber-300`}
                      >
                        {s.title}
                      </span>
                      <span className="mt-4 block max-w-xl text-bone-200">{s.text}</span>
                      <span className="mt-5 flex flex-wrap gap-2">
                        {s.tags.map((t) => (
                          <span key={t} className="label border border-bone-100/20 px-2 py-1 text-steel-300">
                            {t}
                          </span>
                        ))}
                      </span>
                      {/* small screens: the drawing sits with its row */}
                      <span className="mt-8 block max-w-sm text-steel-300 lg:hidden">
                        <s.Drawing className="w-full" />
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className={`mt-2 size-7 transition-[transform,color] duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 ${
                        isActive ? 'text-amber-400' : 'text-steel-400'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="hidden lg:col-span-5 lg:block">
            <figure className="sticky top-28">
              <div className="frame relative aspect-[4/3.6] text-bone-100/25">
                <div className="frame-content absolute inset-0 grid place-items-center p-10">
                  {services.map((s, i) => (
                    <div
                      key={s.page.path}
                      aria-hidden={active !== i}
                      className={`absolute inset-10 grid place-items-center text-steel-300 transition-[opacity,transform] duration-700 ease-[var(--ease-pressure)] ${
                        active === i ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
                      }`}
                    >
                      <s.Drawing className="max-h-full w-full" />
                    </div>
                  ))}
                </div>
                <span aria-hidden="true" className="label absolute top-4 right-5 text-amber-400">
                  0{active + 1} / 03
                </span>
              </div>
              <figcaption className="label mt-3 text-steel-400">{services[active]?.caption}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
