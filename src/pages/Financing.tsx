import { useRef } from 'react';
import { ButtonLink, SectionLabel } from '@/components/ui/primitives';
import { CallBand, PageHero } from '@/components/ui/sections';
import { financing } from '@/data/content';
import { pages } from '@/data/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { usePageMotion } from '@/hooks/usePageMotion';

export function Financing() {
  const root = useRef<HTMLDivElement>(null);
  useDocumentMeta(pages.financing);
  usePageMotion(root);
  const cards = [
    { ...financing.consumers, code: 'K', footnote: `Palvelun tarjoaa ${financing.consumers.provider}, ${financing.consumers.providerAddress}.` },
    { ...financing.business, code: 'Y', footnote: 'Rahoituksen myöntää kumppani. Ehdot ja hinnat selviävät hakemuksen yhteydessä.' },
  ];

  return (
    <div ref={root}>
      <PageHero
        code="R"
        label="Rahoitus"
        trail={[pages.financing]}
        title={
          <>
            <span className="hero-line">
              <span style={{ ['--i' as string]: 0 }}>Korjaus nyt,</span>
            </span>
            <span className="hero-line text-bone-100/55">
              <span style={{ ['--i' as string]: 1 }}>maksu sovitusti.</span>
            </span>
          </>
        }
        lead="Isompi korjaus tai hankinta voidaan rahoittaa. Kuluttajat voivat hakea lainatarjouksia Sortterin palvelussa ja yritykset rahoitusta kumppanimme Rahoitusturvan kautta."
      />

      <section className="on-paper grain relative py-24 lg:py-32" aria-labelledby="fin-title">
        <div className="shell">
          <SectionLabel code="2" className="text-ink-700">
            Kaksi reittiä
          </SectionLabel>
          <h2 id="fin-title" className="sr-only">
            Rahoitusvaihtoehdot
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {cards.map((c) => (
              <article key={c.title} className="frame text-ink-900" data-reveal="">
                <div className="frame-content flex h-full flex-col p-8 sm:p-12">
                  <div className="flex items-start justify-between gap-6">
                    <h3 className="display-l">{c.title}</h3>
                    <span aria-hidden="true" className="text-[4.5rem] leading-[0.8] font-[830] text-amber-500 [font-stretch:70%]">
                      {c.code}
                    </span>
                  </div>
                  <p className="label mt-6 text-ink-600">Kumppani: {c.provider}</p>
                  <p className="prose-fi mt-4 max-w-lg text-lg text-ink-800">{c.text}</p>
                  <div className="mt-auto pt-10">
                    <ButtonLink to={c.href} variant="dark" icon="external" srHint={`(${c.provider}, avautuu uuteen välilehteen)`}>
                      {c.cta}
                    </ButtonLink>
                    <p className="mt-4 text-sm text-ink-600">{c.footnote}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-10 max-w-3xl text-sm text-ink-700">
            Painikkeet vievät kumppanien omiin palveluihin, joissa hakemus tehdään. Joen Diesel ei myönnä luottoa. Rahoituksen saaminen edellyttää myönteistä
            luottopäätöstä.
          </p>
        </div>
      </section>

      <CallBand topic="rahoitus" />
    </div>
  );
}
