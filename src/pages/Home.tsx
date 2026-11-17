import { useRef } from 'react';
import { EquipmentFinder } from '@/components/home/EquipmentFinder';
import { Hero } from '@/components/home/Hero';
import { HeritageTeaser, PartsAndFinance, Workshop } from '@/components/home/Sections';
import { ServiceIndex } from '@/components/home/ServiceIndex';
import { SectionLabel } from '@/components/ui/primitives';
import { CallBand } from '@/components/ui/sections';
import { pages } from '@/data/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { usePageMotion } from '@/hooks/usePageMotion';

export function Home() {
  const root = useRef<HTMLDivElement>(null);
  useDocumentMeta(pages.home);
  usePageMotion(root);

  return (
    <div ref={root}>
      <Hero />
      <ServiceIndex />

      <section id="laitehaku" className="on-paper grain relative py-24 lg:py-36" aria-labelledby="finder-title">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionLabel code="02" className="text-ink-700">
                Laitehaku
              </SectionLabel>
              <h2 id="finder-title" className="display-l mt-6" data-reveal="">
                Huollammeko laitteesi?
              </h2>
            </div>
            <p className="lead self-end text-ink-800 lg:col-span-5" data-reveal="">
              Valitse valmistaja. Mittalasit täyttyvät niiden laitetyyppien kohdalla, jotka ovat palvelulistallamme – kuten koepenkissä, kaikki samaan
              kalibrointiviivaan.
            </p>
          </div>
          <div className="mt-14 lg:mt-20" data-reveal="fade">
            <EquipmentFinder />
          </div>
        </div>
      </section>

      <Workshop />
      <HeritageTeaser />
      <PartsAndFinance />
      <CallBand />
    </div>
  );
}
