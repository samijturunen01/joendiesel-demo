import { useRef } from 'react';
import { CrPumpDrawing, DistributorPumpDrawing, InjectorDrawing } from '@/components/illustrations/Drawings';
import { ButtonLink, SectionLabel } from '@/components/ui/primitives';
import { CallBand, PageHero } from '@/components/ui/sections';
import { partsGroups, productTypes } from '@/data/content';
import { inquiryHref, pages } from '@/data/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { usePageMotion } from '@/hooks/usePageMotion';

export function Parts() {
  const root = useRef<HTMLDivElement>(null);
  useDocumentMeta(pages.parts);
  usePageMotion(root);

  return (
    <div ref={root}>
      <PageHero
        code="V"
        label="Varaosat ja tarvikkeet"
        trail={[pages.parts]}
        title={
          <>
            <span className="hero-line">
              <span style={{ ['--i' as string]: 0 }}>Osat hyllystä.</span>
            </span>
            <span className="hero-line text-bone-100/55">
              <span style={{ ['--i' as string]: 1 }}>Haastavatkin tilauksesta.</span>
            </span>
          </>
        }
        lead="Meiltä löytyy hyllytavarana kattavasti dieselkoneiden huoltoon tarvittavat tarvikkeet ja varaosat. Tilaustavarana pystymme toimittamaan haastavatkin tilaukset."
      >
        <ButtonLink to={inquiryHref({ aihe: 'varaosat' })}>Tee varaosakysely</ButtonLink>
      </PageHero>

      <section className="on-paper grain relative py-24 lg:py-32" aria-labelledby="groups-title">
        <div className="shell">
          <SectionLabel code="3" className="text-ink-700">
            Kolme tapaa saada osa
          </SectionLabel>
          <h2 id="groups-title" className="sr-only">
            Hyllytavara, vaihtoyksiköt ja tilaustavara
          </h2>
          <ol className="mt-12 grid gap-6 lg:grid-cols-3">
            {partsGroups.map((g, i) => (
              <li key={g.id} className="frame text-ink-900" data-reveal="">
                <div className="frame-content flex h-full flex-col p-8 sm:p-10">
                  <div className="flex items-start justify-between">
                    <span className="text-[5.5rem] leading-[0.8] font-[830] text-amber-500 [font-stretch:70%]" aria-hidden="true">
                      {g.code}
                    </span>
                    <span className="label text-ink-600">0{i + 1}</span>
                  </div>
                  <h3 className="display-m mt-8">{g.title}</h3>
                  <p className="prose-fi mt-4 text-ink-800">{g.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-ink-900 py-24 lg:py-32" aria-labelledby="types-title">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel code="T" className="text-steel-300">
              Tuoteryhmiä
            </SectionLabel>
            <h2 id="types-title" className="display-l mt-6" data-reveal="">
              Esimerkkejä tarjoamistamme tuotteista
            </h2>
            <p className="mt-6 max-w-md text-bone-200" data-reveal="">
              Valikoima on laajempi kuin tämä lista. Kerro laite ja mielellään osanumero, niin tarkistamme saatavuuden ja hinnan.
            </p>
            <figure className="mt-12" aria-hidden="true">
              <div className="frame text-bone-100/25">
                <div className="frame-content grid grid-cols-3 items-center gap-x-6 gap-y-4 p-7 text-steel-300">
                  <CrPumpDrawing className="w-full" />
                  <InjectorDrawing className="col-span-2 w-full" />
                  <DistributorPumpDrawing className="col-span-3 mx-auto w-4/5" />
                </div>
              </div>
              <figcaption className="label mt-3 text-steel-400">Kuvitus – ei tuotekuvia</figcaption>
            </figure>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="border-t border-bone-100/15">
              {productTypes.map((p) => (
                <li key={p.name} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-bone-100/15 py-6" data-reveal="">
                  <span className="text-[1.6rem] leading-tight font-[720] [font-stretch:78%]">{p.name}</span>
                  <span className="label text-steel-400">{p.example}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 border-l-4 border-amber-400 pl-5" data-reveal="">
              <p className="font-[650]">Hinnat ja saatavuus</p>
              <p className="mt-1 text-bone-200">Hinnat ja varastotilanne vaihtelevat, joten niitä ei julkaista sivustolla. Kysy puhelimitse tai varaosakyselyllä.</p>
            </div>
          </div>
        </div>
      </section>

      <CallBand topic="varaosat" title="Kysy osaa." text="Osanumero laitteen kyljestä tai auton tiedot riittävät alkuun. Soita tai lähetä varaosakysely." />
    </div>
  );
}
