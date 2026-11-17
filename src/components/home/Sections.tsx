import { useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ButtonLink, SectionLabel } from '@/components/ui/primitives';
import { company } from '@/data/company';
import { financing, partsGroups, timeline } from '@/data/content';
import { workshopTools } from '@/data/equipment';
import { inquiryHref, pages } from '@/data/site';
import { gsap, motionOk, useGSAP } from '@/lib/gsap';

/* ------------------------------------------------------------------ */
/* 03 Kalusto – the test bench                                          */
/* ------------------------------------------------------------------ */
export function Workshop() {
  const root = useRef<HTMLElement>(null);
  const [bench, ...testers] = workshopTools;

  useGSAP(
    () => {
      if (!motionOk()) return;
      // scroll-linked gauge: the needle rises as the section passes through the viewport
      gsap.fromTo(
        '.gauge-fill',
        { scaleX: 0.04 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.gauge', start: 'top 85%', end: 'bottom 35%', scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="grain relative overflow-hidden bg-ink-950 py-24 lg:py-36" aria-labelledby="workshop-title">
      <div className="shell grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel code="03" className="text-steel-300">
            Kalusto
          </SectionLabel>
          <h2 id="workshop-title" className="display-l mt-6" data-reveal="">
            Koepenkki ei arvaa.
          </h2>
          <div className="prose-fi mt-8 space-y-5 text-bone-200" data-reveal="">
            <p className="lead">
              Common rail -korkeapainepumput ja -suuttimet testataan Bosch EPS 815 -koepenkissä – Boschin osien lisäksi myös Delphin ja Denson.
            </p>
            <p>Samassa koepenkissä ohjelmoidaan VP30- ja VP44-jakajapumput. Autossa tapahtuvaan vianetsintään käytössämme ovat Boschin KTS 650- ja KTS 570 -järjestelmätesterit sekä Denson järjestelmätesteri.</p>
          </div>
          <Link to={pages.commonRail.path} className="link mt-8 inline-flex items-center gap-2 font-[600]" data-reveal="">
            Common rail -kunnostus <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="lg:col-span-7" data-reveal="">
          <div className="frame text-bone-100/30">
            <div className="frame-content p-7 text-bone-100 sm:p-10">
              <div className="flex items-baseline justify-between gap-4">
                <span className="label text-steel-300">{bench.maker}</span>
                <span className="label text-amber-400">{bench.kind}</span>
              </div>
              <p className="mt-4 text-[clamp(4.2rem,13vw,10.5rem)] leading-[0.8] font-[820] tabular [font-stretch:70%]" aria-label={`${bench.maker} ${bench.model}`}>
                {bench.model}
              </p>
              {/* gauge: decorative, scroll-linked */}
              <div className="gauge relative mt-8 h-8" aria-hidden="true">
                <div className="ruler absolute inset-x-0 bottom-0 text-bone-100" />
                <div className="gauge-fill absolute bottom-[1px] left-0 h-[3px] w-full origin-left bg-amber-400" />
              </div>
              <p className="mt-6 max-w-xl text-bone-200">{bench.use}</p>

              <dl className="mt-10 grid gap-px border-t border-bone-100/15 sm:grid-cols-3">
                {testers.map((t) => (
                  <div key={t.id} className="border-b border-bone-100/15 py-5 sm:border-b-0 sm:pr-5">
                    <dt className="label text-steel-400">
                      {t.maker} · {t.kind}
                    </dt>
                    <dd className="mt-2 text-2xl leading-none font-[760] [font-stretch:76%]">{t.model === 'Järjestelmätesteri' ? 'Denso' : t.model}</dd>
                    <dd className="mt-2 text-sm text-steel-300">{t.use}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 04 Yritys – heritage teaser                                          */
/* ------------------------------------------------------------------ */
export function HeritageTeaser() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionOk()) return;
      gsap.fromTo(
        '.heritage-line',
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.heritage-track', start: 'top 85%', end: 'bottom 55%', scrub: 0.5 } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="on-paper grain relative overflow-hidden py-24 lg:py-36" aria-labelledby="heritage-title">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel code="04" className="text-ink-700">
              Yritys
            </SectionLabel>
            <h2 id="heritage-title" className="display-l mt-6" data-reveal="">
              Sama nimi vuodesta {company.founded}.
            </h2>
          </div>
          <div className="prose-fi self-end lg:col-span-5 lg:col-start-8" data-reveal="">
            <p className="lead text-ink-800">
              Joen Diesel perustettiin Joensuussa vuonna {company.founded}. Vuodenvaihteessa 2019–2020 yrittäjiksi siirtyivät talossa jo ennestään työskennelleet
              Markus Manninen ja Jani Rantanen.
            </p>
            <p className="mt-4 text-ink-700">Markuksen isä oli yksi yrityksen perustajista – omistajanvaihdos oli samalla sukupolvenvaihdos.</p>
          </div>
        </div>

        <div className="heritage-track relative mt-20 lg:mt-28">
          <div aria-hidden="true" className="absolute top-[2.15rem] right-0 left-0 hidden h-px bg-ink-900/20 md:block" />
          <div aria-hidden="true" className="heritage-line absolute top-[2.1rem] right-0 left-0 hidden h-[3px] origin-left bg-amber-500 md:block" />
          <ol className="grid gap-10 md:grid-cols-5 md:gap-6">
            {timeline.map((t) => (
              <li key={t.year} className="relative md:pt-16" data-reveal="">
                <span aria-hidden="true" className="absolute top-[1.7rem] left-0 hidden size-4 border-[3px] border-paper bg-ink-900 md:block" />
                <p className="fell text-[clamp(2.6rem,4.2vw,3.75rem)] leading-none text-ink-900">{t.year}</p>
                <p className="mt-3 font-[700] [font-stretch:88%]">{t.title}</p>
                <p className="mt-1 text-[0.95rem] leading-snug text-ink-700">{t.short}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14" data-reveal="">
          <ButtonLink to={pages.company.path} variant="ghost">
            Yrityksen tarina
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 05 Varaosat + rahoitus                                               */
/* ------------------------------------------------------------------ */
export function PartsAndFinance() {
  return (
    <section className="bg-ink-900 py-24 lg:py-36" aria-labelledby="parts-title">
      <div className="shell grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel code="05" className="text-steel-300">
            Varaosat
          </SectionLabel>
          <h2 id="parts-title" className="display-l mt-6" data-reveal="">
            Hyllystä, vaihdosta tai tilauksesta.
          </h2>
          <ul className="mt-12 border-t border-bone-100/15">
            {partsGroups.map((g) => (
              <li key={g.id} className="grid grid-cols-[3.25rem_1fr] gap-x-5 border-b border-bone-100/15 py-7" data-reveal="">
                <span aria-hidden="true" className="grid size-12 place-items-center border-2 border-bone-100/70 text-xl font-[800] text-amber-400 [font-stretch:70%] outline outline-1 outline-offset-[-6px] outline-bone-100/40">
                  {g.code}
                </span>
                <div>
                  <h3 className="display-s">{g.title}</h3>
                  <p className="mt-2 max-w-xl text-bone-200">{g.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal="">
            <ButtonLink to={inquiryHref({ aihe: 'varaosat' })}>Kysy osaa</ButtonLink>
            <ButtonLink to={pages.parts.path} variant="ghost">
              Varaosat ja tarvikkeet
            </ButtonLink>
          </div>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9 lg:self-end" aria-labelledby="finance-title" data-reveal="">
          <div className="frame text-bone-100/30">
            <div className="frame-content p-8 text-bone-100">
              <p className="label text-amber-400">Rahoitus</p>
              <h3 id="finance-title" className="display-s mt-4">
                Korjaus tai hankinta rahoituksella
              </h3>
              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="font-[650]">{financing.consumers.title}</dt>
                  <dd className="mt-1 text-[0.95rem] text-bone-200">Lainatarjoukset Sortterin palvelun kautta.</dd>
                </div>
                <div>
                  <dt className="font-[650]">{financing.business.title}</dt>
                  <dd className="mt-1 text-[0.95rem] text-bone-200">{financing.business.provider}, laina-aika 6–48 kuukautta. Edellyttää myönteistä luottopäätöstä.</dd>
                </div>
              </dl>
              <Link to={pages.financing.path} className="link mt-7 inline-flex items-center gap-2 font-[600]">
                Lue lisää rahoituksesta <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
