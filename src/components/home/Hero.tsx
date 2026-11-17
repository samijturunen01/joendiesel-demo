import type { CSSProperties } from 'react';
import { LogoIntro } from '@/components/brand/LogoIntro';
import { ButtonLink } from '@/components/ui/primitives';
import { company, fiTime, primaryPhone } from '@/data/company';
import { inquiryHref } from '@/data/site';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export function Hero() {
  const facts = [
    { k: 'Perustettu', v: String(company.founded) },
    { k: 'Korjaamo', v: `${company.address.street}, ${company.address.city}` },
    { k: 'Avoinna', v: [`Ma–to ${fiTime('08:00')}–${fiTime('16:00')}`, `Pe ${fiTime('08:00')}–${fiTime('14:00')}`] },
    { k: 'Koepenkki', v: 'Bosch EPS 815' },
  ];

  return (
    <section className="grain relative overflow-hidden bg-ink-900" aria-labelledby="hero-title">
      {/* work-light + graduations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_40rem_at_78%_42%,rgb(43_42_40/0.95),transparent_70%)]" />
      <div aria-hidden="true" className="ruler-v absolute top-0 bottom-0 left-[max(0.5rem,calc((100vw-92rem)/2+0.5rem))] hidden text-bone-100 md:block" />

      <div className="shell relative grid min-h-[100svh] grid-cols-1 content-center gap-x-10 pt-24 pb-10 lg:grid-cols-12 lg:pt-28 lg:pb-14">
        <div className="lg:col-span-7 lg:self-center xl:col-span-7">
          <h1 id="hero-title">
            <span className="label hero-fade block text-amber-400" style={i(0)}>
              Diesellaitteiden erikoiskorjaamo · {company.address.city}
            </span>
            <span className="display-xl mt-6 block text-bone-100 lg:mt-8">
              <span className="hero-line">
                <span style={i(0)}>Paine</span>
              </span>
              <span className="hero-line">
                <span style={i(1)}>
                  kohdallaan<span className="text-amber-400">.</span>
                </span>
              </span>
            </span>
          </h1>

          {/* phone-sized screens: the logo animation sits between headline and text */}
          <div className="mx-auto my-8 w-full max-w-[17rem] xs:max-w-[19rem] lg:hidden">
            <LogoIntro className="aspect-[993/1371] w-full" />
          </div>

          <p className="lead hero-fade max-w-[36rem] text-bone-200 lg:mt-10" style={i(2)}>
            Kunnostamme ja testaamme dieselmoottoreiden suuttimet, rivi- ja jakajapumput sekä common <span className="whitespace-nowrap">rail -korkeapainepumput</span>. Viat paikannetaan
            järjestelmätestereillä, ja common rail -osat testataan Bosch&nbsp;EPS&nbsp;815 -koepenkissä.
          </p>

          <div className="hero-fade mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap" style={i(3)}>
            <ButtonLink to={`tel:${primaryPhone.e164}`} icon="phone">
              Soita {primaryPhone.display}
            </ButtonLink>
            <ButtonLink to={inquiryHref()} variant="ghost">
              Jätä tarjouspyyntö
            </ButtonLink>
          </div>
          <p className="hero-fade mt-5 text-[0.95rem] text-steel-300" style={i(4)}>
            Yrittäjinä {company.owners[0]} ja {company.owners[1]}.
          </p>
        </div>

        <div className="hidden lg:col-span-5 lg:flex lg:items-center lg:justify-center xl:col-span-5">
          <LogoIntro className="aspect-[993/1371] h-[min(74svh,46rem)] max-w-full" />
        </div>

        <dl className="hero-fade mt-14 grid grid-cols-2 gap-px border-t border-bone-100/12 pt-6 lg:col-span-12 lg:mt-12 lg:grid-cols-4" style={i(5)}>
          {facts.map((f) => (
            <div key={f.k} className="pr-4 pb-4">
              <dt className="label text-steel-400">{f.k}</dt>
              <dd className="mt-1.5 text-[0.98rem] leading-snug font-[560] text-bone-100 [font-stretch:92%]">
                {Array.isArray(f.v) ? f.v.map((line) => (<span key={line} className="block xl:inline xl:after:content-['_·_'] xl:last:after:content-none">{line}</span>)) : f.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
