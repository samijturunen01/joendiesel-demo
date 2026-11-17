import { useRef, useState } from 'react';
import { Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { SectionLabel } from '@/components/ui/primitives';
import { FaqList, HoursTable, PageHero } from '@/components/ui/sections';
import { company } from '@/data/company';
import { faq } from '@/data/content';
import { pages } from '@/data/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { usePageMotion } from '@/hooks/usePageMotion';

export function Contact() {
  const root = useRef<HTMLDivElement>(null);
  useDocumentMeta(pages.contact);
  usePageMotion(root);

  return (
    <div ref={root}>
      <PageHero
        code="@"
        label="Yhteystiedot"
        trail={[pages.contact]}
        title={
          <>
            <span className="hero-line">
              <span style={{ ['--i' as string]: 0 }}>Aspitie 15,</span>
            </span>
            <span className="hero-line text-bone-100/55">
              <span style={{ ['--i' as string]: 1 }}>Joensuu.</span>
            </span>
          </>
        }
        lead="Soita, lähetä sähköpostia tai tule käymään korjaamolla aukioloaikoina. Tarjouspyynnön voit jättää alla olevalla lomakkeella."
      />

      <section className="bg-ink-900 py-20 lg:py-28" aria-labelledby="reach-title">
        <h2 id="reach-title" className="sr-only">
          Yhteystiedot ja aukioloajat
        </h2>
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ul className="border-t border-bone-100/15">
              {company.phones.map((p) => (
                <li key={p.e164} className="border-b border-bone-100/15">
                  <a href={`tel:${p.e164}`} className="group flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-6">
                    <span className="label flex items-center gap-2 text-steel-300">
                      <Phone aria-hidden="true" className="size-4 text-amber-400" />
                      {p.label}
                    </span>
                    <span className="text-[clamp(2.2rem,5.6vw,4.4rem)] leading-none font-[800] tabular transition-colors [font-stretch:70%] group-hover:text-amber-400">
                      {p.display}
                    </span>
                  </a>
                </li>
              ))}
              <li className="border-b border-bone-100/15">
                <a href={`mailto:${company.email}`} className="group flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-6">
                  <span className="label flex items-center gap-2 text-steel-300">
                    <Mail aria-hidden="true" className="size-4 text-amber-400" />
                    Sähköposti
                  </span>
                  <span className="text-[clamp(1.35rem,2.8vw,2.2rem)] leading-none font-[720] break-all transition-colors [font-stretch:80%] group-hover:text-amber-400">
                    {company.email}
                  </span>
                </a>
              </li>
            </ul>

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <HoursTable />
              <div>
                <p className="label mb-3 text-steel-300">Käyntiosoite</p>
                <address className="text-lg leading-snug font-[600] not-italic">
                  {company.name}
                  <br />
                  {company.address.street}
                  <br />
                  {company.address.postalCode} {company.address.city}
                </address>
                <div className="mt-4 flex flex-col items-start gap-2">
                  <a className="link inline-flex items-center gap-2" href={company.maps.directions} target="_blank" rel="noopener noreferrer">
                    <Navigation aria-hidden="true" className="size-4 text-amber-400" />
                    Reittiohjeet
                    <span className="sr-only"> (Google Maps, avautuu uuteen välilehteen)</span>
                  </a>
                  <a className="link inline-flex items-center gap-2" href={company.maps.osm} target="_blank" rel="noopener noreferrer">
                    <MapPin aria-hidden="true" className="size-4 text-amber-400" />
                    OpenStreetMap
                    <span className="sr-only"> (avautuu uuteen välilehteen)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <MapCard />
            <div className="mt-10 border-t border-bone-100/15 pt-8">
              <h3 className="label text-amber-400">Laskutustiedot</h3>
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[0.95rem]">
                <dt className="text-steel-300">Y-tunnus</dt>
                <dd className="tabular">{company.businessId}</dd>
                <dt className="text-steel-300">Verkkolaskuosoite</dt>
                <dd className="tabular">{company.billing.eInvoiceAddress}</dd>
                <dt className="text-steel-300">Välittäjä</dt>
                <dd>{company.billing.operator}</dd>
                <dt className="text-steel-300">Välittäjätunnus</dt>
                <dd className="tabular">{company.billing.operatorId}</dd>
              </dl>
              <p className="mt-5 text-[0.95rem] text-bone-200">
                Paperiset ostolaskut pyydämme lähettämään osoitteeseen: {company.billing.paperInvoices.name}, {company.billing.paperInvoices.co},{' '}
                {company.billing.paperInvoices.street}, {company.billing.paperInvoices.postalCode} {company.billing.paperInvoices.city}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="tarjouspyynto" className="on-paper grain relative scroll-mt-20 py-24 lg:py-32" aria-labelledby="form-title">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionLabel code="T" className="text-ink-700">
                Tarjouspyyntö
              </SectionLabel>
              <h2 id="form-title" className="display-l mt-6">
                Kerro laitteesta.
              </h2>
              <p className="mt-6 max-w-sm text-ink-800">
                Valmistaja, laitetyyppi ja osanumero auttavat vastaamaan nopeasti. Jos et tiedä niitä, kerro auton tai koneen tiedot.
              </p>
            </div>
          </div>
          <div className="lg:col-span-8">
            <InquiryForm />
          </div>
        </div>
      </section>

      <section className="on-paper border-t border-ink-900/10 pb-24 lg:pb-32" aria-labelledby="faq-title">
        <div className="shell grid gap-10 pt-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="faq-title" className="display-m">
              Usein kysyttyä
            </h2>
          </div>
          <div className="lg:col-span-8">
            <FaqList items={faq} />
          </div>
        </div>
      </section>
    </div>
  );
}

/** The map loads only on request: no third-party requests or cookies before the visitor asks. */
function MapCard() {
  const [show, setShow] = useState(false);
  return (
    <figure>
      <div className="frame aspect-[4/3] text-bone-100/25">
        <div className="frame-content absolute inset-[10px] overflow-hidden bg-ink-850">
          {show ? (
            <iframe
              title="Kartta: Aspitie 15, Joensuu (OpenStreetMap)"
              src={company.maps.osmEmbed}
              className="h-full w-full border-0 grayscale-[0.4]"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="relative grid h-full place-items-center p-6 text-center">
              {/* abstract locator – not a map */}
              <svg aria-hidden="true" viewBox="0 0 200 150" className="absolute inset-0 h-full w-full text-bone-100/10" preserveAspectRatio="xMidYMid slice">
                <path d="M0 40H200M0 95H200M60 0V150M150 0V150M0 130L200 10" stroke="currentColor" strokeWidth="1" fill="none" />
                <circle cx="100" cy="70" r="30" stroke="currentColor" fill="none" />
                <circle cx="100" cy="70" r="55" stroke="currentColor" fill="none" />
              </svg>
              <div className="relative">
                <MapPin aria-hidden="true" className="mx-auto size-8 text-amber-400" />
                <p className="mt-3 font-[650]">Aspitie 15, 80100 Joensuu</p>
                <button type="button" onClick={() => setShow(true)} className="btn btn-ghost mt-5 min-h-11 py-2 text-[0.95rem]">
                  Näytä kartta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <figcaption className="label mt-3 text-steel-400">
        {show ? '© OpenStreetMapin tekijät' : 'Kartta ladataan OpenStreetMapista vasta pyynnöstä.'}
      </figcaption>
    </figure>
  );
}
