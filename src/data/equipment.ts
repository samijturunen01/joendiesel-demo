/**
 * Which manufacturers' injection equipment the workshop services, and how.
 *
 * Source [S1]: joendiesel.com/korjaamme-huollamme (manufacturer lists under "Korjaus ja huolto",
 * plus "Tarkistamme korkeapainepumput ja suuttimet: Delphi, Denso") and joendiesel.com/commonrail
 * ("Kunnostamme Bosch:n korkeapainepumput ja suuttimet … Koepenkki tarkastuksen voi suorittaa myös
 * Delphi ja Denso korkeapainepumpuille ja suuttimille. Koepenkissä ohjelmoidaan myös VP 30 ja VP 44").
 *
 * Only combinations that appear in those lists are marked. Everything else is shown as
 * "not listed – ask", never as "not serviced".
 */

export type ComponentId = 'suuttimet' | 'rivipumput' | 'jakajapumput' | 'edc' | 'cr-pumput' | 'cr-suuttimet' | 'vp';

export type Capability = 'korjaus' | 'kunnostus' | 'koepenkki' | 'tarkastus' | 'ohjelmointi';

export interface ComponentType {
  id: ComponentId;
  name: string;
  short: string;
  /** Service page that covers this component */
  page: 'suuttimet-ja-pumput' | 'common-rail';
}

export const components: ComponentType[] = [
  { id: 'suuttimet', name: 'Suuttimet', short: 'Suuttimet', page: 'suuttimet-ja-pumput' },
  { id: 'rivipumput', name: 'Rivipumput', short: 'Rivipumput', page: 'suuttimet-ja-pumput' },
  { id: 'jakajapumput', name: 'Jakajapumput', short: 'Jakajapumput', page: 'suuttimet-ja-pumput' },
  { id: 'edc', name: 'EDC-rivi- ja jakajapumput', short: 'EDC-pumput', page: 'suuttimet-ja-pumput' },
  { id: 'vp', name: 'VP30- ja VP44-jakajapumput', short: 'VP30 / VP44', page: 'common-rail' },
  { id: 'cr-pumput', name: 'Common rail -korkeapainepumput', short: 'CR-pumput', page: 'common-rail' },
  { id: 'cr-suuttimet', name: 'Common rail -suuttimet', short: 'CR-suuttimet', page: 'common-rail' },
];

export const capabilityLabels: Record<Capability, string> = {
  korjaus: 'Korjaus ja huolto',
  kunnostus: 'Kunnostus',
  koepenkki: 'Testaus koepenkissä',
  tarkastus: 'Koepenkkitarkastus',
  ohjelmointi: 'Ohjelmointi koepenkissä',
};

export interface Manufacturer {
  id: 'bosch' | 'delphi' | 'denso' | 'stanadyne' | 'zexel';
  name: string;
  /** Former / related brand names as written on the original site */
  aka?: string;
  services: Partial<Record<ComponentId, Capability[]>>;
  /** Extra note shown with the result */
  note?: string;
}

export const manufacturers: Manufacturer[] = [
  {
    id: 'bosch',
    name: 'Bosch',
    services: {
      suuttimet: ['korjaus'],
      rivipumput: ['korjaus'],
      jakajapumput: ['korjaus'],
      edc: ['korjaus'],
      vp: ['korjaus', 'ohjelmointi'],
      'cr-pumput': ['kunnostus', 'koepenkki'],
      'cr-suuttimet': ['kunnostus', 'koepenkki'],
    },
    note: 'Kunnostettuja common rail -vaihtopumppuja ja -suuttimia on varastossa.',
  },
  {
    id: 'delphi',
    name: 'Delphi',
    aka: 'Lucas, CAV, Simms',
    services: {
      suuttimet: ['korjaus'],
      rivipumput: ['korjaus'],
      jakajapumput: ['korjaus'],
      'cr-pumput': ['tarkastus'],
      'cr-suuttimet': ['tarkastus'],
    },
  },
  {
    id: 'denso',
    name: 'Denso',
    services: {
      suuttimet: ['korjaus'],
      rivipumput: ['korjaus'],
      jakajapumput: ['korjaus'],
      'cr-pumput': ['tarkastus'],
      'cr-suuttimet': ['tarkastus'],
    },
  },
  {
    id: 'stanadyne',
    name: 'Stanadyne',
    services: {
      suuttimet: ['korjaus'],
      jakajapumput: ['korjaus'],
    },
  },
  {
    id: 'zexel',
    name: 'Zexel',
    aka: 'Kiki',
    services: {
      suuttimet: ['korjaus'],
      rivipumput: ['korjaus'],
      jakajapumput: ['korjaus'],
    },
  },
];

export const findManufacturer = (id: string | null | undefined) => manufacturers.find((m) => m.id === id);
export const findComponent = (id: string | null | undefined) => components.find((c) => c.id === id);

/** Human-readable summary, e.g. "Kunnostus · Testaus koepenkissä" */
export function describeCapabilities(caps: Capability[] | undefined): string {
  return (caps ?? []).map((c) => capabilityLabels[c]).join(' · ');
}

/** Workshop tools named on the original site [S1]. */
export const workshopTools = [
  {
    id: 'eps815',
    maker: 'Bosch',
    model: 'EPS 815',
    kind: 'Koepenkki',
    use: 'Common rail -korkeapainepumppujen ja -suuttimien testaus. Tarkastukset myös Delphin ja Denson korkeapainepumpuille ja suuttimille sekä VP30- ja VP44-jakajapumppujen ohjelmointi.',
  },
  {
    id: 'kts650',
    maker: 'Bosch',
    model: 'KTS 650',
    kind: 'Järjestelmätesteri',
    use: 'Vianetsintä suoraan autosta.',
  },
  {
    id: 'kts570',
    maker: 'Bosch',
    model: 'KTS 570',
    kind: 'Järjestelmätesteri',
    use: 'Vianetsintä suoraan autosta.',
  },
  {
    id: 'denso',
    maker: 'Denso',
    model: 'Järjestelmätesteri',
    kind: 'Järjestelmätesteri',
    use: 'Vianetsintä suoraan autosta.',
  },
] as const;
