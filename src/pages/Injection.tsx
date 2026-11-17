import { Fragment, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { DistributorPumpDrawing, InjectorDrawing, InlinePumpDrawing } from '@/components/illustrations/Drawings';
import { ButtonLink, SectionLabel } from '@/components/ui/primitives';
import { CallBand, PageHero } from '@/components/ui/sections';
import { capabilityLabels, components, manufacturers } from '@/data/equipment';
import { inquiryHref, pages } from '@/data/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { usePageMotion } from '@/hooks/usePageMotion';

const capAbbr: Record<string, string> = {
  korjaus: 'K',
  kunnostus: 'KU',
  koepenkki: 'T',
  tarkastus: 'TA',
  ohjelmointi: 'O',
};

const kinds = [
  {
    title: 'Suuttimet',
    text: 'Suutin ruiskuttaa polttoaineen sylinteriin hienojakoisena sumuna. Kulunut tai likaantunut suutin voi näkyä esimerkiksi savutuksena, käyntihäiriöinä tai tehon puutteena.',
    Drawing: InjectorDrawing,
  },
  {
    title: 'Rivipumput',
    text: 'Rivipumpussa jokaisella sylinterillä on oma pumppuelementtinsä rivissä. Rakenne on tuttu erityisesti vanhemmista ja raskaammista dieseleistä.',
    Drawing: InlinePumpDrawing,
  },
  {
    title: 'Jakajapumput',
    text: 'Jakajapumppu annostelee polttoaineen kaikille sylintereille. EDC-pumpuissa ja Boschin VP30- ja VP44-pumpuissa annostelua ohjataan sähköisesti.',
    Drawing: DistributorPumpDrawing,
  },
];

export function Injection() {
  const root = useRef<HTMLDivElement>(null);
  useDocumentMeta(pages.injection);
  usePageMotion(root);

  return (
    <div ref={root}>
      <PageHero
        code="02"
        label="Palvelut · Korjaamolla"
        trail={[pages.services, pages.injection]}
        title={
          <>
            <span className="hero-line">
              <span style={{ ['--i' as string]: 0 }}>Suuttimet</span>
            </span>
            <span className="hero-line">
              <span style={{ ['--i' as string]: 1 }}>ja pumput</span>
            </span>
          </>
        }
        lead="Korjaamme ja huollamme dieselruiskutuksen suuttimia sekä rivi- ja jakajapumppuja viideltä valmistajalta: Bosch, Delphi (Lucas, CAV, Simms), Denso, Stanadyne ja Zexel (Kiki)."
        aside={<InlinePumpDrawing className="w-full" />}
        asideCaption="Rivipumppu – kuvitus"
      >
        <ButtonLink to={inquiryHref({ aihe: 'suuttimet-ja-pumput' })}>Pyydä tarjous laitteelle</ButtonLink>
      </PageHero>

      <section className="on-paper grain relative py-24 lg:py-32" aria-labelledby="matrix-title">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionLabel code="L" className="text-ink-700">
                Palvelulista
              </SectionLabel>
              <h2 id="matrix-title" className="display-l mt-6" data-reveal="">
                Valmistajittain
              </h2>
            </div>
            <div className="self-end lg:col-span-5" data-reveal="">
              <p className="text-ink-800">Taulukko kokoaa alkuperäisen palvelulistamme. Tyhjä solu tarkoittaa, ettei yhdistelmä ole listalla – kysy silti.</p>
              <dl className="label mt-5 flex flex-wrap gap-x-5 gap-y-2 text-ink-700">
                {Object.entries(capAbbr).map(([k, a]) => (
                  <div key={k} className="flex gap-1.5">
                    <dt className="font-[650] text-amber-700">{a}</dt>
                    <dd>{capabilityLabels[k as keyof typeof capabilityLabels]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Desktop / tablet: one printed sheet */}
          <div className="mt-14 hidden overflow-x-auto md:block" data-reveal="">
            <table className="w-full min-w-[56rem] border-collapse text-left">
              <caption className="sr-only">Valmistajat ja laitetyypit, joita Joen Diesel korjaa, kunnostaa, testaa tai ohjelmoi</caption>
              <thead>
                <tr className="border-y-[3px] border-ink-900">
                  <th scope="col" className="label w-[13rem] py-4 pr-4 font-[500]">
                    Valmistaja
                  </th>
                  {components.map((c) => (
                    <th key={c.id} scope="col" className="label px-2 py-4 align-bottom font-[500] leading-snug">
                      {c.short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {manufacturers.map((m) => (
                  <tr key={m.id} className="border-b border-ink-900/25">
                    <th scope="row" className="py-5 pr-4 align-top">
                      <span className="block text-xl leading-none font-[780] uppercase [font-stretch:76%]">{m.name}</span>
                      {m.aka ? <span className="mt-1 block text-sm font-[450] text-ink-600">{m.aka}</span> : null}
                    </th>
                    {components.map((c) => {
                      const caps = m.services[c.id];
                      return (
                        <td key={c.id} className="px-2 py-5 align-top">
                          {caps ? (
                            <span className="flex flex-wrap gap-1">
                              {caps.map((k) => (
                                <abbr key={k} title={capabilityLabels[k]} className="label border border-ink-900 bg-amber-400 px-1.5 py-1 font-[600] text-ink-950 no-underline">
                                  {capAbbr[k]}
                                </abbr>
                              ))}
                            </span>
                          ) : (
                            <span aria-label="ei listalla" className="text-ink-600/60">
                              —
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phones: one card per manufacturer */}
          <div className="mt-12 grid gap-4 md:hidden">
            {manufacturers.map((m) => (
              <section key={m.id} className="border-t-[3px] border-ink-900 pt-4" aria-label={m.name} data-reveal="">
                <h3 className="text-2xl leading-none font-[780] uppercase [font-stretch:76%]">{m.name}</h3>
                {m.aka ? <p className="text-sm text-ink-600">{m.aka}</p> : null}
                <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[0.95rem]">
                  {components
                    .filter((c) => m.services[c.id])
                    .map((c) => (
                      <Fragment key={c.id}>
                        <dt className="font-[560]">{c.name}</dt>
                        <dd className="text-right text-ink-700">{m.services[c.id]!.map((k) => capabilityLabels[k]).join(', ')}</dd>
                      </Fragment>
                    ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-900 py-24 lg:py-32" aria-labelledby="kinds-title">
        <div className="shell">
          <SectionLabel code="?" className="text-steel-300">
            Tunnista laitteesi
          </SectionLabel>
          <h2 id="kinds-title" className="display-l mt-6 max-w-3xl" data-reveal="">
            Suutin, rivipumppu vai jakajapumppu?
          </h2>
          <div className="mt-16 grid gap-px bg-bone-100/12 md:grid-cols-3">
            {kinds.map((k) => (
              <article key={k.title} className="bg-ink-900 p-0 pt-10 md:px-8 md:first:pl-0 md:last:pr-0" data-reveal="">
                <div className="flex h-36 items-center text-steel-300">
                  <k.Drawing className="max-h-full w-full" />
                </div>
                <h3 className="display-s mt-8">{k.title}</h3>
                <p className="prose-fi mt-3 text-bone-200">{k.text}</p>
              </article>
            ))}
          </div>
          <p className="label mt-10 text-steel-400">Kuvitukset ovat suuntaa antavia, eivät tiettyjen laitteiden piirustuksia.</p>
          <Link to={pages.commonRail.path} className="link mt-10 inline-flex items-center gap-2 text-lg font-[600]" data-reveal="">
            Common rail -pumput ja -suuttimet <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>

      <CallBand topic="suuttimet-ja-pumput" title="Tuo laite tai soita." text="Kerro valmistaja, laitetyyppi ja mielellään osanumero – niin saat nopeimmin vastauksen korjauksesta ja aikataulusta." />
    </div>
  );
}
