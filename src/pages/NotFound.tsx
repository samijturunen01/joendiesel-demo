import { Link } from 'react-router';
import { Monogram } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/primitives';
import { primaryPhone } from '@/data/company';
import { pages, servicePages } from '@/data/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export function NotFound() {
  useDocumentMeta(pages.notFound);
  return (
    <section className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink-900 pt-28 pb-20">
      <div className="shell grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label text-amber-400">Virhe 404</p>
          <h1 className="display-l mt-6">
            Tämä linja
            <br />
            on tukossa.
          </h1>
          <p className="lead mt-8 max-w-xl text-bone-200">Hakemaasi sivua ei löytynyt. Se on voinut siirtyä, tai osoitteessa on kirjoitusvirhe.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to="/">Etusivulle</ButtonLink>
            <ButtonLink to={`tel:${primaryPhone.e164}`} variant="ghost" icon="phone">
              {primaryPhone.display}
            </ButtonLink>
          </div>
          <nav aria-label="Palvelut" className="mt-14">
            <p className="label text-steel-400">Ehkä etsit</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {[...servicePages, pages.parts, pages.contact].map((p) => (
                <li key={p.path}>
                  <Link className="link" to={p.path}>
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <Monogram className="w-full text-bone-100/15" title="Joen Diesel Oy" />
        </div>
      </div>
    </section>
  );
}
