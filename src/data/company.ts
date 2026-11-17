/**
 * Company facts. Every value is taken from a source listed in docs/CONTENT_SOURCES.md:
 *   [S1] joendiesel.com (all pages, fetched 17.11.2026)
 *   [S2] PRH / YTJ open data, business ID 0819625-5 (fetched 17.11.2026)
 *   [S3] Yrittäjät.fi news articles 17.6.2020 and 13.8.2021 ("Ammattitaitoista diesellaitteiden korjausta")
 * Nothing here is invented. Items that should be re-confirmed with the owners are marked VERIFY.
 */

export interface Phone {
  label: string;
  display: string;
  /** For tel: links */
  e164: string;
}

export interface OpeningHours {
  /** 1 = Monday … 7 = Sunday */
  days: number[];
  label: string;
  opens: string;
  closes: string;
}

const LANDLINE: Phone = { label: 'Puhelin', display: '013 897 907', e164: '+35813897907' };
const MOBILE: Phone = { label: 'Matkapuhelin', display: '050 313 8438', e164: '+358503138438' };

export const company = {
  name: 'Joen Diesel Oy',
  shortName: 'Joen Diesel',
  businessId: '0819625-5', // [S1][S2]
  /** Registered in the trade register 9.11.1990 [S2] */
  founded: 1990,
  registeredOn: '1990-11-09',
  description: 'Diesellaitteiden erikoiskorjaamo Joensuussa', // [S1]
  owners: ['Markus Manninen', 'Jani Rantanen'], // [S1][S3]
  address: {
    street: 'Aspitie 15', // [S1][S2]
    postalCode: '80100',
    city: 'Joensuu',
    country: 'FI',
  },
  // [S1] – the site lists both numbers without labels; the 013 number is a landline, 050 a mobile number.
  phones: [LANDLINE, MOBILE] as Phone[],
  /** [S1] written as "joendiesel(a)telemail.fi" on the old site */
  email: 'joendiesel@telemail.fi',
  hours: [
    { days: [1, 2, 3, 4], label: 'Ma–to', opens: '08:00', closes: '16:00' },
    { days: [5], label: 'Pe', opens: '08:00', closes: '14:00' },
  ] satisfies OpeningHours[], // [S1] VERIFY: holidays / summer hours not published
  billing: {
    // [S1] /yhteystiedot – VERIFY: the operator "Liaison Technologies Oy" has since been renamed (OpenText).
    eInvoiceAddress: '003708196255',
    operator: 'Liaison Technologies Oy',
    operatorId: '003708599126',
    paperInvoices: {
      name: 'Joen Diesel Oy',
      co: 'C/O Kirjanpitotoimisto Lehtinen Oy',
      street: 'Mustolankatu 7',
      postalCode: '80200',
      city: 'Joensuu',
    },
  },
  /** OpenStreetMap / Nominatim house-level match for "Aspitie 15, 80100 Joensuu" (17.11.2026) */
  geo: { lat: 62.62963, lon: 29.78532 },
  maps: {
    google: 'https://www.google.com/maps/search/?api=1&query=Aspitie+15%2C+80100+Joensuu',
    directions: 'https://www.google.com/maps/dir/?api=1&destination=Aspitie+15%2C+80100+Joensuu',
    osm: 'https://www.openstreetmap.org/?mlat=62.62963&mlon=29.78532#map=16/62.62963/29.78532',
    osmEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=29.7745%2C62.6262%2C29.7961%2C62.6331&layer=mapnik&marker=62.62963%2C29.78532',
  },
} as const;

/** The mobile number is shown first in calls to action (it is listed on every page of the original site). */
export const primaryPhone: Phone = MOBILE;
export const landline: Phone = LANDLINE;

/** Opening hours for a weekday (1 = Monday … 7 = Sunday), or null when closed. */
export function hoursForDay(day: number): OpeningHours | null {
  return company.hours.find((h) => h.days.includes(day)) ?? null;
}

/** "08.00" – Finnish time notation */
export const fiTime = (hhmm: string) => hhmm.replace(':', '.');

export const yearsInBusiness = (now = new Date()) => now.getFullYear() - company.founded;
