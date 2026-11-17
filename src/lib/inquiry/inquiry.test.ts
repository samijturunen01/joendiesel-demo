import { describe, expect, it } from 'vitest';
import { prefillFromParams } from './prefill';
import { getTransport, mockTransport } from './transport';
import { emptyInquiry, type InquiryRequest } from './types';
import { isValidEmail, isValidPhone, validateInquiry } from './validation';

const valid: InquiryRequest = {
  ...emptyInquiry,
  topic: 'common-rail',
  message: 'Common rail -suutin vuotaa, kaipaan tarjousta kunnostuksesta.',
  name: 'Testi Asiakas',
  phone: '040 123 4567',
};

describe('validateInquiry', () => {
  it('accepts a complete request', () => {
    expect(validateInquiry(valid)).toEqual({});
  });

  it('requires topic, message, name and a way to reply', () => {
    const e = validateInquiry(emptyInquiry);
    expect(Object.keys(e).sort()).toEqual(['contact', 'message', 'name', 'topic']);
  });

  it('accepts e-mail instead of phone', () => {
    expect(validateInquiry({ ...valid, phone: '', email: 'nimi@esimerkki.fi' })).toEqual({});
  });

  it('flags malformed phone numbers and e-mail addresses', () => {
    const e = validateInquiry({ ...valid, phone: '12ab', email: 'ei-osoite' });
    expect(e.phone).toMatch(/puhelinnumero/i);
    expect(e.email).toMatch(/sähköposti/i);
  });

  it('enforces maximum lengths', () => {
    expect(validateInquiry({ ...valid, partNumber: 'x'.repeat(61) }).partNumber).toMatch(/Enintään 60/);
  });
});

describe('phone / email helpers', () => {
  it('handles Finnish formats', () => {
    expect(isValidPhone('050 313 8438')).toBe(true);
    expect(isValidPhone('+358 13 897 907')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
    expect(isValidEmail('joendiesel@telemail.fi')).toBe(true);
    expect(isValidEmail('joendiesel(a)telemail.fi')).toBe(false);
  });
});

describe('prefillFromParams', () => {
  it('pre-selects known topic, manufacturer and component', () => {
    const r = prefillFromParams(new URLSearchParams('aihe=common-rail&valmistaja=denso&laite=cr-suuttimet'));
    expect([r.topic, r.maker, r.component]).toEqual(['common-rail', 'denso', 'cr-suuttimet']);
  });

  it('ignores unknown values', () => {
    const r = prefillFromParams(new URLSearchParams('aihe=pesu&valmistaja=volvo&laite=turbo'));
    expect([r.topic, r.maker, r.component]).toEqual(['', '', '']);
  });
});

describe('transport', () => {
  it('defaults to the demo transport, which never delivers', async () => {
    const t = getTransport();
    expect(t).toBe(mockTransport);
    expect(t.delivers).toBe(false);
    await expect(t.send(valid)).resolves.toEqual({ ok: true, delivered: false });
  });
});
