/** Routes, navigation and page metadata (titles / descriptions are prerendered into every page). */

export interface PageMeta {
  key: string;
  path: string;
  title: string;
  description: string;
  /** Short label for navigation and breadcrumbs */
  label: string;
}

const p = (key: string, path: string, label: string, title: string, description: string): PageMeta => ({ key, path, label, title, description });

export const pages = {
  home: p(
    'home',
    '/',
    'Etusivu',
    'Joen Diesel Oy – diesellaitteiden erikoiskorjaamo Joensuussa',
    'Dieselruiskutuksen erikoiskorjaamo Joensuussa vuodesta 1990: suuttimet, rivi- ja jakajapumput, common rail -kunnostus Bosch EPS 815 -koepenkissä sekä dieselmoottoreiden vianetsintä.',
  ),
  services: p(
    'services',
    '/palvelut',
    'Palvelut',
    'Palvelut – vianetsintä, suuttimet, pumput ja common rail | Joen Diesel',
    'Dieselmoottoreiden vianetsintä ja huolto, suuttimien ja ruiskutuspumppujen korjaus sekä common rail -laitteiden kunnostus ja koepenkkitestaus Joensuussa.',
  ),
  diagnostics: p(
    'diagnostics',
    '/palvelut/vianetsinta-ja-huolto',
    'Vianetsintä ja huolto',
    'Dieselmoottorin vianetsintä ja huolto Joensuussa | Joen Diesel',
    'Dieselmoottoreiden vianetsintä Bosch KTS 650- ja KTS 570- sekä Denson järjestelmätestereillä, jakohihnat, suuttimien ja pumppujen irrotus ja asennus sekä hehkutulpat – myös katkenneet.',
  ),
  injection: p(
    'injection',
    '/palvelut/suuttimet-ja-pumput',
    'Suuttimet ja pumput',
    'Dieselsuuttimien ja ruiskutuspumppujen korjaus | Joen Diesel',
    'Korjaamme ja huollamme Boschin, Delphin (Lucas, CAV, Simms), Denson, Stanadynen ja Zexelin (Kiki) suuttimia sekä rivi- ja jakajapumppuja Joensuussa.',
  ),
  commonRail: p(
    'commonRail',
    '/palvelut/common-rail',
    'Common rail',
    'Common rail -pumppujen ja -suuttimien kunnostus | Joen Diesel',
    'Boschin common rail -korkeapainepumppujen ja -suuttimien kunnostus, testaus Bosch EPS 815 -koepenkissä, Delphin ja Denson koepenkkitarkastukset sekä VP30/VP44-ohjelmointi.',
  ),
  parts: p(
    'parts',
    '/varaosat',
    'Varaosat',
    'Diesellaitteiden varaosat ja huoltotarvikkeet | Joen Diesel',
    'Dieselkoneiden huoltotarvikkeet ja varaosat hyllystä, kunnostetut common rail -vaihtopumput ja -suuttimet sekä haastavatkin tilaustuotteet Joensuusta.',
  ),
  company: p(
    'company',
    '/yritys',
    'Yritys',
    'Yritys – dieselin erikoiskorjaamo vuodesta 1990 | Joen Diesel',
    'Joen Diesel Oy on joensuulainen diesellaitteiden erikoiskorjaamo, joka on perustettu vuonna 1990. Yrittäjinä toimivat Markus Manninen ja Jani Rantanen.',
  ),
  financing: p(
    'financing',
    '/rahoitus',
    'Rahoitus',
    'Rahoitus korjauksiin ja hankintoihin | Joen Diesel',
    'Hae rahoitusta korjaukseen tai hankintaan: kuluttajille lainatarjoukset Sortterin kautta, yrityksille rahoitus Rahoitusturvan kautta 6–48 kuukauden laina-ajalla.',
  ),
  contact: p(
    'contact',
    '/yhteystiedot',
    'Yhteystiedot',
    'Yhteystiedot ja tarjouspyyntö | Joen Diesel, Aspitie 15, Joensuu',
    'Joen Diesel Oy, Aspitie 15, 80100 Joensuu. Puh. 013 897 907 tai 050 313 8438. Avoinna ma–to 8–16 ja pe 8–14. Lähetä tarjouspyyntö tai varaosakysely.',
  ),
  notFound: p('notFound', '/404', 'Sivua ei löytynyt', 'Sivua ei löytynyt | Joen Diesel', 'Hakemaasi sivua ei löytynyt. Palaa etusivulle tai ota yhteyttä Joen Dieseliin.'),
} as const satisfies Record<string, PageMeta>;

export type PageKey = keyof typeof pages;

export const prerenderPaths = Object.values(pages)
  .filter((page) => page.key !== 'notFound')
  .map((page) => page.path);

export function findPageByPath(path: string): PageMeta {
  const clean = path.replace(/\/+$/, '') || '/';
  return Object.values(pages).find((page) => page.path === clean) ?? pages.notFound;
}

export const servicePages = [pages.diagnostics, pages.injection, pages.commonRail] as const;

export interface NavItem {
  page: PageMeta;
  children?: readonly PageMeta[];
}

export const mainNav: NavItem[] = [
  { page: pages.services, children: servicePages },
  { page: pages.parts },
  { page: pages.company },
  { page: pages.financing },
  { page: pages.contact },
];

/** Link to the inquiry form with pre-selected values. */
export function inquiryHref(params: { aihe?: string; valmistaja?: string; laite?: string } = {}): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) q.set(k, v);
  const qs = q.toString();
  return `${pages.contact.path}${qs ? `?${qs}` : ''}#tarjouspyynto`;
}
