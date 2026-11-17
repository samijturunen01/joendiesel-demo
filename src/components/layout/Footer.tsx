import { Link } from 'react-router';
import { Monogram } from '@/components/brand/Logo';
import { Ruler } from '@/components/ui/primitives';
import { company, fiTime } from '@/data/company';
import { mainNav, pages, servicePages } from '@/data/site';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-bone-200">
      <div className="shell pt-20 pb-10 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Monogram className="h-28 w-auto text-bone-100" title="Joen Diesel Oy" />
            <p className="fell mt-7 text-2xl leading-tight text-bone-100">Joen Diesel Oy</p>
            <p className="mt-1 max-w-xs text-steel-300">Diesellaitteiden erikoiskorjaamo Joensuussa vuodesta {company.founded}.</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            <div>
              <h2 className="label mb-4 text-amber-400">Yhteystiedot</h2>
              <address className="not-italic leading-relaxed">
                {company.address.street}
                <br />
                {company.address.postalCode} {company.address.city}
              </address>
              <ul className="mt-3 space-y-1">
                {company.phones.map((p) => (
                  <li key={p.e164}>
                    <a className="link tabular" href={`tel:${p.e164}`}>
                      {p.display}
                    </a>
                  </li>
                ))}
                <li>
                  <a className="link break-all" href={`mailto:${company.email}`}>
                    {company.email}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="label mb-4 text-amber-400">Aukioloajat</h2>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 tabular">
                {company.hours.map((h) => (
                  <div key={h.label} className="contents">
                    <dt>{h.label}</dt>
                    <dd>
                      {fiTime(h.opens)}–{fiTime(h.closes)}
                    </dd>
                  </div>
                ))}
                <dt>La–su</dt>
                <dd>suljettu</dd>
              </dl>
            </div>

            <nav aria-label="Alatunnisteen palvelulinkit">
              <h2 className="label mb-4 text-amber-400">Palvelut</h2>
              <ul className="space-y-1.5">
                {servicePages.map((p) => (
                  <li key={p.path}>
                    <Link className="link" to={p.path}>
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Alatunnisteen sivulinkit">
              <h2 className="label mb-4 text-amber-400">Sivut</h2>
              <ul className="space-y-1.5">
                {mainNav
                  .filter((n) => n.page.path !== pages.services.path)
                  .map(({ page }) => (
                    <li key={page.path}>
                      <Link className="link" to={page.path}>
                        {page.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>
        </div>

        <Ruler className="mt-16 text-bone-100" />

        <div className="mt-6 flex flex-col gap-3 text-sm text-steel-400 md:flex-row md:items-baseline md:justify-between">
          <p>
            © {company.name} · Y-tunnus {company.businessId}
          </p>
          <p className="max-w-xl md:text-right">
            Konseptidemo – ei {company.name}:n virallinen verkkosivusto. Suunnittelu ja toteutus: Hades Design.
          </p>
        </div>
      </div>
    </footer>
  );
}
