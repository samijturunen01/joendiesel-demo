import { describe, expect, it } from 'vitest';
import { company, hoursForDay } from './company';
import { faq, timeline } from './content';
import { capabilityLabels, components, manufacturers } from './equipment';
import { findPageByPath, inquiryHref, pages, prerenderPaths } from './site';

describe('site map', () => {
  it('has unique paths and titles', () => {
    const all = Object.values(pages);
    expect(new Set(all.map((p) => p.path)).size).toBe(all.length);
    expect(new Set(all.map((p) => p.title)).size).toBe(all.length);
  });

  it('keeps meta descriptions within search-result length', () => {
    for (const p of Object.values(pages)) expect(p.description.length, p.path).toBeLessThanOrEqual(220);
  });

  it('resolves paths with or without a trailing slash, unknown paths to 404', () => {
    expect(findPageByPath('/palvelut/common-rail/')).toBe(pages.commonRail);
    expect(findPageByPath('/ei-ole')).toBe(pages.notFound);
    expect(prerenderPaths).not.toContain('/404');
  });

  it('builds inquiry links with only the given parameters', () => {
    expect(inquiryHref()).toBe('/yhteystiedot#tarjouspyynto');
    expect(inquiryHref({ aihe: 'varaosat' })).toBe('/yhteystiedot?aihe=varaosat#tarjouspyynto');
  });
});

describe('equipment matrix', () => {
  it('only references known components and capabilities', () => {
    const ids = new Set(components.map((c) => c.id));
    for (const m of manufacturers) {
      for (const [component, caps] of Object.entries(m.services)) {
        expect(ids.has(component as never), `${m.id}/${component}`).toBe(true);
        for (const c of caps ?? []) expect(capabilityLabels[c]).toBeTruthy();
      }
    }
  });

  it('matches the original service list (spot checks)', () => {
    const find = (id: string) => manufacturers.find((m) => m.id === id)!;
    expect(find('bosch').services['cr-pumput']).toEqual(['kunnostus', 'koepenkki']);
    expect(find('delphi').services['cr-suuttimet']).toEqual(['tarkastus']);
    expect(find('stanadyne').services.rivipumput).toBeUndefined();
    expect(find('zexel').aka).toBe('Kiki');
  });
});

describe('company facts', () => {
  it('has the verified basics', () => {
    expect(company.businessId).toBe('0819625-5');
    expect(company.founded).toBe(1990);
    expect(hoursForDay(1)?.closes).toBe('16:00');
    expect(hoursForDay(5)?.closes).toBe('14:00');
    expect(hoursForDay(6)).toBeNull();
  });

  it('keeps the timeline in order and sourced', () => {
    const years = timeline.map((t) => Number(t.year));
    expect([...years].sort((a, b) => a - b)).toEqual(years);
    for (const t of timeline) expect(t.source).toBeTruthy();
    expect(faq.length).toBeGreaterThan(3);
  });
});
