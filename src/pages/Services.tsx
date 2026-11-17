import { useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { EquipmentFinder } from '@/components/home/EquipmentFinder';
import { CrPumpDrawing, InlinePumpDrawing, TesterDrawing } from '@/components/illustrations/Drawings';
import { SectionLabel } from '@/components/ui/primitives';
import { CallBand, FaqList, PageHero } from '@/components/ui/sections';
import { faq } from '@/data/content';
import { pages } from '@/data/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { usePageMotion } from '@/hooks/usePageMotion';

const blocks = [
  {
    page: pages.diagnostics,
    kicker: 'Autossa',
    title: 'Vianetsintä ja huolto',
    points: ['Vianetsintä Bosch KTS 650 ja KTS 570 sekä Denso', 'Jakohihnojen vaihdot', 'Syöttöpumppujen ja suuttimien irrotus ja asennus', 'Hehkutulpat – myös katkenneet'],
    Drawing: TesterDrawing,
  },
  {
    page: pages.injection,
    kicker: 'Korjaamolla',
    title: 'Suuttimet ja pumput',
    points: ['Suuttimet', 'Rivi- ja jakajapumput', 'EDC-rivi- ja jakajapumput', 'Bosch, Delphi, Denso, Stanadyne, Zexel'],
    Drawing: InlinePumpDrawing,
  },
  {
    page: pages.commonRail,
    kicker: 'Koepenkissä',
    title: 'Common rail',
    points: ['Boschin korkeapainepumppujen ja suuttimien kunnostus', 'Testaus Bosch EPS 815 -koepenkissä', 'Delphin ja Denson koepenkkitarkastus', 'VP30- ja VP44-ohjelmointi'],
    Drawing: CrPumpDrawing,
  },
];

export function Services() {
  const root = useRef<HTMLDivElement>(null);
  useDocumentMeta(pages.services);
  usePageMotion(root);

  return (
    <div ref={root}>
      <PageHero
        code="P"
        label="Palvelut"
        trail={[pages.services]}
        title={
          <>
            <span className="hero-line">
              <span style={{ ['--i' as string]: 0 }}>Kolme palvelua,</span>
            </span>
            <span className="hero-line">
              <span style={{ ['--i' as string]: 1 }}>yksi erikoisala.</span>
            </span>
          </>
        }
        lead="Dieselruiskutus on Joen Dieselin erikoisala vuodesta 1990. Työ jakautuu kolmeen osaan: vianetsintä ja huolto autossa, suuttimien ja pumppujen korjaus sekä common rail -laitteiden kunnostus ja koepenkkitestaus."
      />

      <section className="bg-ink-900 py-20 lg:py-28" aria-label="Palvelualueet">
        <div className="shell grid gap-6 lg:grid-cols-3">
          {blocks.map((b, i) => (
            <Link
              key={b.page.path}
              to={b.page.path}
              className="group frame flex flex-col text-bone-100/20 transition-colors duration-500 hover:text-amber-400/70"
              data-reveal=""
            >
              <div className="frame-content flex h-full flex-col p-7 text-bone-100 sm:p-9">
                <div className="flex items-baseline justify-between">
                  <span className="label text-amber-400">0{i + 1}</span>
                  <span className="label text-steel-400">{b.kicker}</span>
                </div>
                <div className="my-8 text-steel-300 transition-colors group-hover:text-bone-200">
                  <b.Drawing className="mx-auto h-40 w-full" />
                </div>
                <h2 className="display-m">{b.title}</h2>
                <ul className="mt-5 space-y-2 text-bone-200">
                  {b.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-amber-400" />
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-2 pt-9 font-[650] group-hover:text-amber-400">
                  {b.title} <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="laitehaku" className="on-paper grain relative py-24 lg:py-32" aria-labelledby="finder-title">
        <div className="shell">
          <SectionLabel code="L" className="text-ink-700">
            Laitehaku
          </SectionLabel>
          <h2 id="finder-title" className="display-l mt-6 max-w-4xl" data-reveal="">
            Huollammeko laitteesi?
          </h2>
          <div className="mt-14" data-reveal="fade">
            <EquipmentFinder />
          </div>
        </div>
      </section>

      <section className="on-paper border-t border-ink-900/10 pb-24 lg:pb-32" aria-labelledby="faq-title">
        <div className="shell grid gap-10 pt-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel code="?" className="text-ink-700">
              Kysyttyä
            </SectionLabel>
            <h2 id="faq-title" className="display-m mt-6">
              Usein kysyttyä
            </h2>
          </div>
          <div className="lg:col-span-8">
            <FaqList items={faq} />
          </div>
        </div>
      </section>

      <CallBand />
    </div>
  );
}
