import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const paths = ['', 'palvelut', 'palvelut/vianetsinta-ja-huolto', 'palvelut/suuttimet-ja-pumput', 'palvelut/common-rail', 'varaosat', 'yritys', 'rahoitus', 'yhteystiedot', 'ei-ole'];

for (const vp of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  test.describe(`axe – ${vp.name}`, () => {
    for (const path of paths) {
      test(`/${path} has no WCAG 2.1 A/AA violations`, async ({ browser }) => {
        // reduced motion: audit the final, fully revealed state of every element
        const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce' });
        const page = await ctx.newPage();
        await page.goto(path, { waitUntil: 'networkidle' });
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
        expect(summary).toEqual([]);
        await ctx.close();
      });
    }
  });
}
