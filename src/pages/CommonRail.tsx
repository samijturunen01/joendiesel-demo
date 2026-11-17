import { useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { CrPumpDrawing, RailDiagram } from '@/components/illustrations/Drawings';
import { ButtonLink, SectionLabel } from '@/components/ui/primitives';
import { CallBand, PageHero } from '@/components/ui/sections';
import { inquiryHref, pages } from '@/data/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { usePageMotion } from '@/hooks/usePageMotion';

const capabilities = [
  { k: 'Kunnostus', t: 'Boschin korkeapainepumput ja suuttimet', d: 'Kunnostamme Boschin common rail -korkeapainepumput ja -suuttimet.' },
  { k: 'Vaihtoyksiköt', t: 'Varastossa', d: 'Varastossa on kunnostettuja vaihtopumppuja ja -suuttimia. Kysy saatavuutta laitteellesi.' },
  { k: 'Testaus', t: 'Bosch EPS 815', d: 'Testaukset tehdään Bosch EPS 815 -koepenkissä. Koepenkkitarkastuksen voi tehdä myös Delphin ja Denson korkeapainepumpuille ja suuttimille.' },
  { k: 'Ohjelmointi', t: 'VP30 ja VP44', d: 'Koepenkissä ohjelmoidaan myös Boschin VP30- ja VP44-jakajapumput.' },
];

export function CommonRail() {
  const root = useRef<HTMLDivElement>(null);
  useDocumentMeta(pages.commonRail);
  usePageMotion(root);

  return (
    <div ref={root}>
      <PageHero
        code="03"
        label="Palvelut · Koepenkissä"
        trail={[pages.services, pages.commonRail]}
        title={
          <>
            <span className="hero-line">
              <span style={{ ['--i' as string]: 0 }}>Common rail</span>
            </span>
            <span className="hero-line text-bone-100/55">
              <span style={{ ['--i' as string]: 1 }}>yhteispaine&shy;ruiskutus</span>
            </span>
          </>
        }
        lead="Kunnostamme Boschin korkeapainepumput ja suuttimet ja testaamme ne Bosch EPS 815 -koepenkissä. Varastossa on kunnostettuja vaihtopumppuja ja -suuttimia."
        aside={<CrPumpDrawing className="mx-auto w-full max-w-sm" />}
        asideCaption="Korkeapainepumppu – kuvitus"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to={inquiryHref({ aihe: 'common-rail' })}>Kysy kunnostusta tai vaihtoyksikköä</ButtonLink>
        </div>
      </PageHero>

      <section className="bg-ink-950 py-24 lg:py-32" aria-labelledby="cap-title">
        <div className="shell">
          <SectionLabel code="C" className="text-steel-300">
            Mitä teemme
          </SectionLabel>
          <h2 id="cap-title" className="sr-only">
            Common rail -palvelut
          </h2>
          <ol className="mt-12 grid gap-px bg-bone-100/12 sm:grid-cols-2">
            {capabilities.map((c, i) => (
              <li key={c.k} className="bg-ink-950 py-10 sm:p-10 sm:first:pt-10" data-reveal="">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="label text-amber-400">0{i + 1}</span>
                  <span className="label text-steel-400">{c.t}</span>
                </div>
                <p className="mt-6 text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.88] font-[810] [font-stretch:70%]">{c.k}</p>
                <p className="prose-fi mt-5 max-w-md text-bone-200">{c.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="on-paper grain relative py-24 lg:py-32" aria-labelledby="principle-title">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel code="?" className="text-ink-700">
              Periaate
            </SectionLabel>
            <h2 id="principle-title" className="display-m mt-6" data-reveal="">
              Mitä yhteispaine&shy;ruiskutus tarkoittaa?
            </h2>
            <div className="prose-fi mt-6 space-y-4 text-ink-800" data-reveal="">
              <p>
                Common rail -järjestelmässä korkeapainepumppu ylläpitää painetta yhteisessä putkessa eli railissa, josta kaikki suuttimet saavat polttoaineensa.
              </p>
              <p>Ohjainyksikkö määrää sähköisesti, milloin ja kuinka paljon kukin suutin ruiskuttaa. Siksi pumpun ja suuttimien kunto ratkaisee, miten moottori käy.</p>
            </div>
          </div>
          <figure className="lg:col-span-8" data-reveal="fade">
            <div className="frame p-5 text-ink-900 sm:p-8">
              <div className="frame-content text-ink-800">
                <RailDiagram className="w-full" />
              </div>
            </div>
            <figcaption className="label mt-3 text-ink-600">Periaatekuva, yksinkertaistettu – ei mittakaavassa</figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-ink-900 py-20" aria-label="Lisää palveluita">
        <div className="shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="display-s max-w-2xl" data-reveal="">
            Delphin tai Denson laite? Katso laitehausta, mitä sille tehdään.
          </p>
          <Link to={`${pages.services.path}#laitehaku`} className="btn btn-ghost shrink-0" data-reveal="">
            Avaa laitehaku <ArrowRight aria-hidden="true" className="btn-arrow size-4.5" />
          </Link>
        </div>
      </section>

      <CallBand topic="common-rail" title="Kysy vaihto­yksikköä." text="Saatavuus vaihtelee laitteittain. Soita tai lähetä osanumero tarjouspyynnöllä, niin tarkistamme tilanteen." />
    </div>
  );
}
