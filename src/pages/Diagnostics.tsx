import { useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { TesterDrawing } from '@/components/illustrations/Drawings';
import { drawingsById } from '@/components/illustrations/drawingsById';
import { ButtonLink, SectionLabel } from '@/components/ui/primitives';
import { CallBand, PageHero } from '@/components/ui/sections';
import { primaryPhone } from '@/data/company';
import { workshopJobs } from '@/data/content';
import { workshopTools } from '@/data/equipment';
import { inquiryHref, pages } from '@/data/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { usePageMotion } from '@/hooks/usePageMotion';

export function Diagnostics() {
  const root = useRef<HTMLDivElement>(null);
  useDocumentMeta(pages.diagnostics);
  usePageMotion(root);
  const testers = workshopTools.filter((t) => t.kind === 'Järjestelmätesteri');

  return (
    <div ref={root}>
      <PageHero
        code="01"
        label="Palvelut · Autossa"
        trail={[pages.services, pages.diagnostics]}
        title={
          <>
            <span className="hero-line">
              <span style={{ ['--i' as string]: 0 }}>Vianetsintä</span>
            </span>
            <span className="hero-line">
              <span style={{ ['--i' as string]: 1 }}>ja huolto</span>
            </span>
          </>
        }
        lead="Olemme erikoistuneet dieselmoottoreiden vianetsintään ja korjaukseen. Vika paikannetaan suoraan autosta järjestelmätestereillä – ja tarvittavat työt tehdään samassa korjaamossa."
        aside={<TesterDrawing className="w-full" />}
        asideCaption="Järjestelmätesteri – kuvitus"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to={`tel:${primaryPhone.e164}`} icon="phone">
            Varaa aika: {primaryPhone.display}
          </ButtonLink>
          <ButtonLink to={inquiryHref({ aihe: 'vianetsinta' })} variant="ghost">
            Kuvaile vika lomakkeella
          </ButtonLink>
        </div>
      </PageHero>

      <section className="on-paper grain relative py-24 lg:py-32" aria-labelledby="jobs-title">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionLabel code="T" className="text-ink-700">
                Työt
              </SectionLabel>
              <h2 id="jobs-title" className="display-l mt-6">
                Mitä teemme autolle
              </h2>
              <p className="mt-6 max-w-sm text-ink-700">Työt alkuperäisen palvelulistamme mukaan. Jos työtä ei ole listalla, kysy silti.</p>
            </div>
          </div>
          <ol className="lg:col-span-8">
            {workshopJobs.map((job, i) => {
              const Drawing = drawingsById[job.illustration];
              return (
                <li key={job.id} className="grid gap-6 border-t-2 border-ink-900 py-10 first:border-t-[3px] sm:grid-cols-[1fr_14rem] sm:gap-10" data-reveal="">
                  <div>
                    <p className="label text-amber-700">Työ 0{i + 1}</p>
                    <h3 className="display-m mt-3">{job.title}</h3>
                    <p className="prose-fi mt-4 max-w-xl text-ink-800">{job.text}</p>
                  </div>
                  <div className="self-center text-ink-700">
                    <Drawing className="w-full" />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="bg-ink-950 py-24 lg:py-32" aria-labelledby="testers-title">
        <div className="shell">
          <SectionLabel code="K" className="text-steel-300">
            Vianetsinnän kalusto
          </SectionLabel>
          <h2 id="testers-title" className="display-l mt-6 max-w-3xl" data-reveal="">
            Kolme testeriä, yksi tavoite: vian syy.
          </h2>
          <ul className="mt-14 grid border-t border-bone-100/15 md:grid-cols-3">
            {testers.map((t) => (
              <li key={t.id} className="border-b border-bone-100/15 py-8 md:border-r md:border-b-0 md:px-8 md:first:pl-0 md:last:border-r-0" data-reveal="">
                <p className="label text-amber-400">{t.maker}</p>
                <p className="mt-3 text-[clamp(3rem,6vw,5rem)] leading-[0.85] font-[820] [font-stretch:70%]">{t.model === 'Järjestelmätesteri' ? 'Denso' : t.model}</p>
                <p className="mt-4 text-steel-300">Järjestelmätesteri · autossa tapahtuva vianetsintä</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ink-900 py-24 lg:py-28" aria-labelledby="next-title">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="next-title" className="display-m" data-reveal="">
              Kun vika on pumpussa tai suuttimessa
            </h2>
            <p className="mt-5 text-bone-200" data-reveal="">
              Irrotettu laite voidaan korjata, kunnostaa tai testata saman katon alla.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {[pages.injection, pages.commonRail].map((p) => (
              <Link key={p.path} to={p.path} className="group border border-bone-100/20 p-7 transition-colors hover:border-amber-400" data-reveal="">
                <span className="label text-steel-400">Seuraava vaihe</span>
                <span className="mt-4 flex items-center justify-between gap-4 text-2xl font-[720] [font-stretch:78%] group-hover:text-amber-400">
                  {p.label}
                  <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CallBand topic="vianetsinta" title="Kerro oireet." text="Soita ja kerro, miten vika ilmenee – sovitaan, milloin auto tuodaan korjaamolle. Voit myös kuvailla vian tarjouspyynnöllä." />
    </div>
  );
}
