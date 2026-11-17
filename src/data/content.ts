/**
 * Editorial content: history, workshop jobs, parts, financing, FAQ.
 * Sources (see docs/CONTENT_SOURCES.md): [S1] joendiesel.com, [S2] PRH/YTJ, [S3] Yrittäjät.fi 2020 & 2021.
 */
import { company } from './company';

export interface TimelineEntry {
  year: string;
  title: string;
  text: string;
  /** One-liner for the homepage teaser */
  short: string;
  source: string;
}

export const timeline: TimelineEntry[] = [
  {
    year: '1990',
    short: 'Avoin yhtiö Joen Diesel Manninen & Ahlqvist kaupparekisteriin.',
    title: 'Joen Diesel perustetaan',
    text: 'Avoin yhtiö Joen Diesel Manninen & Ahlqvist merkitään kaupparekisteriin marraskuussa 1990.',
    source: 'Kaupparekisteri (PRH)',
  },
  {
    year: '1994',
    short: 'Nimeksi tulee Joen Diesel Oy.',
    title: 'Joen Diesel Oy',
    text: 'Yhtiön nimeksi tulee Joen Diesel Oy – nimi, jolla korjaamo tunnetaan edelleen.',
    source: 'Kaupparekisteri (PRH)',
  },
  {
    year: '2005',
    short: 'Jani Rantanen aloittaa yrityksessä.',
    title: 'Jani Rantanen taloon',
    text: 'Jani Rantanen aloittaa työt Joen Dieselillä.',
    source: 'Yrittäjät.fi 2020',
  },
  {
    year: '2015',
    short: 'Markus Manninen tulee taloon.',
    title: 'Markus Manninen taloon',
    text: 'Markus Manninen tulee yritykseen valmistuttuaan.',
    source: 'Yrittäjät.fi 2020',
  },
  {
    year: '2020',
    short: 'Yrittäjiksi Markus Manninen ja Jani Rantanen.',
    title: 'Sukupolvenvaihdos',
    text: 'Vuodenvaihteessa 2019–2020 yrittäjiksi siirtyvät Markus Manninen ja Jani Rantanen. Markuksen isä oli yksi yrityksen perustajista, joten omistajanvaihdos oli myös sukupolvenvaihdos. Nimi pysyi samana.',
    source: 'Yrittäjät.fi 2020',
  },
];

/** In-vehicle / engine work listed on joendiesel.com/korjaamme-huollamme [S1]. */
export const workshopJobs = [
  {
    id: 'vianetsinta',
    title: 'Vianetsintä',
    text: 'Olemme erikoistuneet dieselmoottoreiden vianetsintään ja korjaukseen. Autossa tapahtuvaan vianetsintään käytämme Boschin KTS 650- ja KTS 570 -järjestelmätestereitä sekä Denson järjestelmätesteriä.',
    illustration: 'tester',
  },
  {
    id: 'irrotus',
    title: 'Syöttöpumppujen ja suuttimien irrotus ja asennus',
    text: 'Irrotamme ja asennamme syöttöpumput ja suuttimet. Irrotettu laite voidaan tarvittaessa korjata, kunnostaa tai testata saman katon alla.',
    illustration: 'injector',
  },
  {
    id: 'jakohihnat',
    title: 'Jakohihnan vaihto',
    text: 'Teemme dieselmoottoreiden jakohihnojen vaihdot.',
    illustration: 'belt',
  },
  {
    id: 'hehkutulpat',
    title: 'Hehkutulpat – myös katkenneet',
    text: 'Vaihdamme hehkutulpat ja irrotamme myös katkenneet hehkutulpat.',
    illustration: 'glowplug',
  },
] as const;

/** joendiesel.com/tuotteet and /commonrail [S1]. */
export const partsGroups = [
  {
    id: 'hylly',
    code: 'H',
    title: 'Hyllytavara',
    text: 'Meiltä löytyy hyllytavarana kattavasti dieselkoneiden huoltoon tarvittavat tarvikkeet ja varaosat.',
  },
  {
    id: 'vaihto',
    code: 'V',
    title: 'Kunnostetut vaihtoyksiköt',
    text: 'Varastossa on kunnostettuja common rail -vaihtopumppuja ja -suuttimia. Kysy saatavuutta laitteellesi.',
  },
  {
    id: 'tilaus',
    code: 'T',
    title: 'Tilaustavara',
    text: 'Tilaustavarana pystymme toimittamaan haastavatkin tilaukset.',
  },
] as const;

/** Product types pictured on the original /tuotteet page (manufacturer photos – not republished). */
export const productTypes = [
  { name: 'Common rail -korkeapainepumput', example: 'esim. Bosch CP1 ja CP1H' },
  { name: 'Common rail -suuttimet', example: 'Bosch' },
  { name: 'Jakajapumput', example: 'esim. Bosch VP30' },
  { name: 'Rivipumput', example: 'Bosch' },
  { name: 'Pumppu- ja suutinsarjat', example: 'pumppu ja suuttimet' },
] as const;

/** joendiesel.com/rahoitus [S1]. */
export const financing = {
  consumers: {
    title: 'Kuluttajille',
    provider: 'Sortter Oy',
    providerAddress: 'Bulevardi 21, 00180 Helsinki',
    text: 'Hae lainatarjouksia useammalta rahoittajalta yhdellä hakemuksella Sortterin palvelussa.',
    cta: 'Hae lainatarjoukset',
    href: 'https://www.sortter.fi/',
  },
  business: {
    title: 'Yrityksille',
    provider: 'Rahoitusturva',
    text: 'Kumppanimme Rahoitusturvan kautta voit hakea helpon ja kilpailukykyisen rahoituksen ostoksellesi tai investoinnillesi. Laina-aika voi olla 6–48 kuukautta, ja rahoituksen saaminen edellyttää myönteistä luottopäätöstä.',
    cta: 'Hae rahoitusta yritykselle',
    href: 'https://rahoitusturva.fi/lainahakemus/?kumppani=200',
  },
} as const;

export interface Faq {
  q: string;
  a: string;
}

export const faq: Faq[] = [
  {
    q: 'Minkä valmistajien ruiskutuslaitteita korjaatte?',
    a: 'Boschin, Delphin (Lucas, CAV, Simms), Denson, Stanadynen ja Zexelin (Kiki) suuttimia sekä rivi- ja jakajapumppuja – laitekohtaisesti vaihdellen. Tarkista oma laitteesi laitehausta tai soita.',
  },
  {
    q: 'Testaatteko common rail -suuttimia ja -pumppuja?',
    a: 'Kyllä. Boschin korkeapainepumput ja suuttimet kunnostetaan ja testataan Bosch EPS 815 -koepenkissä. Koepenkkitarkastuksen voi tehdä myös Delphin ja Denson korkeapainepumpuille ja suuttimille.',
  },
  {
    q: 'Onko teillä vaihtopumppuja tai -suuttimia?',
    a: 'Varastossa on kunnostettuja common rail -vaihtopumppuja ja -suuttimia. Saatavuus vaihtelee, joten kysy omaa laitettasi puhelimitse tai tarjouspyynnöllä.',
  },
  {
    q: 'Ohjelmoitteko VP30- ja VP44-jakajapumppuja?',
    a: 'Kyllä, VP30- ja VP44-jakajapumput ohjelmoidaan koepenkissä.',
  },
  {
    q: 'Voiko korjauksen rahoittaa?',
    a: 'Kuluttajat voivat hakea lainatarjouksia Sortterin palvelussa ja yritykset rahoitusta kumppanimme Rahoitusturvan kautta (laina-aika 6–48 kk, edellyttää myönteistä luottopäätöstä).',
  },
  {
    q: 'Milloin olette avoinna?',
    a: `Maanantaista torstaihin klo 8.00–16.00 ja perjantaisin klo 8.00–14.00. Osoite on ${company.address.street}, ${company.address.postalCode} ${company.address.city}.`,
  },
];
