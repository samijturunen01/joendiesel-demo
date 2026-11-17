import { useRef } from 'react';
import { Monogram } from '@/components/brand/Logo';
import { ButtonLink, SectionLabel } from '@/components/ui/primitives';
import { CallBand, PageHero } from '@/components/ui/sections';
import { company } from '@/data/company';
import { timeline } from '@/data/content';
import { workshopTools } from '@/data/equipment';
import { pages } from '@/data/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { usePageMotion } from '@/hooks/usePageMotion';
import { gsap, motionOk, useGSAP } from '@/lib/gsap';

export function Company() {
  const root = useRef<HTMLDivElement>(null);
  useDocumentMeta(pages.company);
  usePageMotion(root);

  // the timeline's spine is drawn as the visitor scrolls through it
  useGSAP(
    () => {
      if (!motionOk()) return;
      gsap.fromTo(
        '.spine-fill',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.spine', start: 'top 70%', end: 'bottom 60%', scrub: 0.5 } },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <PageHero
        code="Y"
        label="Yritys"
        trail={[pages.company]}
        title={
          <>
            <span className="hero-line">
              <span style={{ ['--i' as string]: 0 }}>Dieselin parissa</span>
            </span>
            <span className="hero-line">
              <span style={{ ['--i' as string]: 1 }}>
                vuodesta <span className="fell font-normal text-amber-400">{company.founded}</span>
              </span>
            </span>
          </>
        }
        lead={`${company.name} on Joensuussa toimiva diesellaitteiden erikoiskorjaamo, joka on perustettu vuonna ${company.founded}. Yrittäjinä toimivat ${company.owners[0]} ja ${company.owners[1]}.`}
      />

      <section className="on-paper grain relative py-24 lg:py-36" aria-labelledby="history-title">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionLabel code="H" className="text-ink-700">
                Historia
              </SectionLabel>
              <h2 id="history-title" className="display-l mt-6">
                Nimi pysyi, omistajat vaihtuivat.
              </h2>
              <Monogram className="mt-12 hidden h-44 w-auto text-ink-900 lg:block" title="Joen Diesel Oy:n tunnus" />
            </div>
          </div>
          <div className="spine relative lg:col-span-7 lg:col-start-6">
            <div aria-hidden="true" className="absolute top-2 bottom-2 left-[0.45rem] w-px bg-ink-900/20" />
            <div aria-hidden="true" className="spine-fill absolute top-2 bottom-2 left-[0.35rem] w-[3px] origin-top bg-amber-500" />
            <ol>
              {timeline.map((t) => (
                <li key={t.year} className="relative pb-14 pl-12 last:pb-0" data-reveal="">
                  <span aria-hidden="true" className="absolute top-3 left-0 size-4 border-[3px] border-paper bg-ink-900" />
                  <p className="fell text-[clamp(3.2rem,6vw,5.5rem)] leading-none">{t.year}</p>
                  <h3 className="display-s mt-3">{t.title}</h3>
                  <p className="prose-fi mt-3 max-w-xl text-ink-800">{t.text}</p>
                  <p className="label mt-3 text-ink-600">Lähde: {t.source}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-ink-950 py-24 lg:py-32" aria-labelledby="people-title">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel code="Y" className="text-steel-300">
              Yrittäjät
            </SectionLabel>
            <h2 id="people-title" className="display-l mt-6" data-reveal="">
              Kaksi yrittäjää, sama korjaamo.
            </h2>
          </div>
          <ul className="grid gap-px bg-bone-100/12 sm:grid-cols-2 lg:col-span-7">
            {[
              { name: 'Markus Manninen', note: 'Yrityksessä vuodesta 2015. Isä oli yksi Joen Dieselin perustajista.' },
              { name: 'Jani Rantanen', note: 'Yrityksessä vuodesta 2005.' },
            ].map((p) => (
              <li key={p.name} className="bg-ink-950 py-8 sm:p-8" data-reveal="">
                <p className="label text-amber-400">Yrittäjä</p>
                <p className="mt-4 text-[2.4rem] leading-[0.95] font-[790] [font-stretch:74%]">{p.name}</p>
                <p className="mt-4 text-bone-200">{p.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ink-900 py-24 lg:py-28" aria-labelledby="tools-title">
        <div className="shell">
          <SectionLabel code="K" className="text-steel-300">
            Kalusto
          </SectionLabel>
          <h2 id="tools-title" className="display-m mt-6 max-w-2xl" data-reveal="">
            Korjaamon testauslaitteet
          </h2>
          <dl className="mt-12 grid border-t border-bone-100/15 md:grid-cols-2 lg:grid-cols-4">
            {workshopTools.map((t) => (
              <div key={t.id} className="border-b border-bone-100/15 py-7 md:pr-8" data-reveal="">
                <dt className="label text-steel-400">
                  {t.maker} · {t.kind}
                </dt>
                <dd className="mt-3 text-3xl leading-none font-[780] [font-stretch:74%]">{t.model === 'Järjestelmätesteri' ? 'Denso' : t.model}</dd>
                <dd className="mt-3 text-[0.95rem] text-bone-200">{t.use}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12" data-reveal="">
            <ButtonLink to={pages.services.path} variant="ghost">
              Katso palvelut
            </ButtonLink>
          </div>
        </div>
      </section>

      <CallBand />
    </div>
  );
}
