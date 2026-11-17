import { maxLengths, topicOptions, type InquiryErrors, type InquiryRequest } from './types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS = /^[+()\-\s\d]+$/;

export function isValidPhone(value: string): boolean {
  const v = value.trim();
  if (!PHONE_CHARS.test(v)) return false;
  const digits = v.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export function isValidEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}

/** Client-side validation. The future backend must validate again – this only helps the visitor. */
export function validateInquiry(r: InquiryRequest): InquiryErrors {
  const e: InquiryErrors = {};

  if (!r.topic || !topicOptions.some((t) => t.id === r.topic)) e.topic = 'Valitse, mitä asia koskee.';

  if (r.message.trim().length < 10) e.message = 'Kerro lyhyesti, mitä laitteelle tai autolle pitäisi tehdä (vähintään 10 merkkiä).';

  if (r.name.trim().length < 2) e.name = 'Kirjoita nimesi.';

  const phone = r.phone.trim();
  const email = r.email.trim();
  if (!phone && !email) {
    e.contact = 'Anna puhelinnumero tai sähköpostiosoite, jotta voimme vastata.';
  } else {
    if (phone && !isValidPhone(phone)) e.phone = 'Tarkista puhelinnumero – esimerkiksi 040 123 4567.';
    if (email && !isValidEmail(email)) e.email = 'Tarkista sähköpostiosoite – esimerkiksi nimi@esimerkki.fi.';
  }

  for (const [field, max] of Object.entries(maxLengths) as [keyof InquiryRequest, number][]) {
    if (r[field].length > max && !e[field]) e[field] = `Enintään ${max} merkkiä.`;
  }

  return e;
}

/** Field order for focusing the first error. */
export const fieldOrder: (keyof InquiryErrors)[] = ['topic', 'maker', 'component', 'vehicle', 'partNumber', 'message', 'name', 'contact', 'phone', 'email'];
