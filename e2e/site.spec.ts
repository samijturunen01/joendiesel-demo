import { expect, test, type Page } from '@playwright/test';

const routes = [
  ['', /Paine/],
  ['palvelut', /Kolme palvelua/],
  ['palvelut/vianetsinta-ja-huolto', /Vianetsintä/],
  ['palvelut/suuttimet-ja-pumput', /Suuttimet/],
  ['palvelut/common-rail', /Common rail/],
  ['varaosat', /Osat hyllystä/],
  ['yritys', /Dieselin parissa/],
  ['rahoitus', /Korjaus nyt/],
  ['yhteystiedot', /Aspitie 15/],
] as const;

/** Collects console errors, page errors and failed requests for a page. */
function watch(page: Page) {
  const problems: string[] = [];
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('response', (r) => r.status() >= 400 && problems.push(`http ${r.status()}: ${r.url()}`));
  return problems;
}

const skipIntro = (page: Page) => page.addInitScript(() => sessionStorage.setItem('jd-intro', '1'));

test.describe('every route', () => {
  for (const [path, h1] of routes) {
    test(`/${path} – direct load, metadata, no errors`, async ({ page }) => {
      const problems = watch(page);
      await skipIntro(page);
      const res = await page.goto(path, { waitUntil: 'networkidle' });
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toContainText(h1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
      expect(await page.title()).toMatch(/Joen Diesel/);
      expect(problems).toEqual([]);
    });
  }

  test('trailing slash and .html variants also resolve', async ({ page }) => {
    for (const p of ['palvelut/common-rail/', 'yhteystiedot.html']) {
      const res = await page.goto(p);
      expect(res?.status(), p).toBe(200);
    }
  });

  test('unknown path → branded 404 with status 404', async ({ page }) => {
    const res = await page.goto('ei-tallaista-sivua');
    expect(res?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('tukossa');
    await page.getByRole('link', { name: 'Etusivulle' }).click();
    await expect(page).toHaveURL(/\/joendiesel-demo\/?$/);
    await expect(page.locator('h1')).toContainText('Paine');
  });
});

test.describe('layout at three sizes', () => {
  for (const vp of [
    { width: 390, height: 844 },
    { width: 834, height: 1112 },
    { width: 1440, height: 900 },
  ]) {
    test(`no horizontal overflow at ${vp.width}px`, async ({ page }) => {
      await page.setViewportSize(vp);
      await skipIntro(page);
      for (const [path] of routes) {
        await page.goto(path, { waitUntil: 'networkidle' });
        const sw = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(sw, `/${path}`).toBeLessThanOrEqual(vp.width);
      }
    });
  }
});

test.describe('navigation', () => {
  test('client-side navigation is immediate and back/forward work', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await skipIntro(page);
    await page.goto('', { waitUntil: 'networkidle' });
    const nav = page.getByRole('navigation', { name: 'Päävalikko' });
    await nav.getByRole('link', { name: 'Varaosat' }).click();
    await expect(page).toHaveURL(/\/varaosat$/);
    await expect(page.locator('h1')).toContainText('Osat hyllystä', { timeout: 1000 });
    await nav.getByRole('link', { name: 'Yritys' }).click();
    await expect(page.locator('h1')).toContainText('Dieselin parissa');
    await page.goBack();
    await expect(page.locator('h1')).toContainText('Osat hyllystä');
    await page.goForward();
    await expect(page.locator('h1')).toContainText('Dieselin parissa');
  });

  test('services submenu opens with the button', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await skipIntro(page);
    await page.goto('');
    await page.getByRole('button', { name: 'Näytä palvelut' }).click();
    await page.getByRole('link', { name: /Common rail.*Kunnostus/ }).click();
    await expect(page).toHaveURL(/palvelut\/common-rail$/);
  });

  test('mobile menu opens, traps Escape and navigates', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await skipIntro(page);
    await page.goto('');
    const toggle = page.getByRole('button', { name: 'Avaa valikko' });
    await toggle.click();
    const menu = page.getByRole('navigation', { name: 'Mobiilivalikko' });
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await menu.getByRole('link', { name: 'Yhteystiedot' }).click();
    await expect(page).toHaveURL(/yhteystiedot$/);
    await expect(menu).toBeHidden();
  });
});

test.describe('logo intro', () => {
  test('plays once per session and settles on the full logo', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('');
    const letters = page.locator('.jd-letter').filter({ visible: true });
    // mid-intro the wordmark is not stamped yet
    await page.waitForTimeout(600);
    expect(Number(await letters.first().evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(0.5);
    // the page is usable meanwhile
    await expect(page.getByRole('link', { name: /Soita 050 313 8438/ })).toBeVisible();
    await page.waitForTimeout(3200);
    expect(Number(await letters.last().evaluate((el) => getComputedStyle(el).opacity))).toBe(1);
    expect(await page.evaluate(() => sessionStorage.getItem('jd-intro'))).toBe('1');
    // replay is available
    await expect(page.getByRole('button', { name: 'Toista ruiskutus' })).toBeVisible();
  });

  test('reduced motion: everything is visible immediately, no intro', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('');
    expect(await page.evaluate(() => document.documentElement.className)).not.toMatch(/motion-ok|intro-pending/);
    const opacity = await page.locator('.jd-letter').filter({ visible: true }).first().evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBe(1);
    await page.getByRole('heading', { name: 'Huollammeko laitteesi?' }).scrollIntoViewIfNeeded();
    const reveal = await page.locator('[data-reveal]').first().evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(reveal)).toBe(1);
    await ctx.close();
  });

  test('without JavaScript the prerendered content is complete', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('palvelut/common-rail');
    await expect(page.locator('h1')).toContainText('Common rail');
    await expect(page.locator('main').getByText(/Bosch EPS 815 -koepenkissä/).first()).toBeVisible();
    await ctx.close();
  });
});

test.describe('Laitehaku → tarjouspyyntö', () => {
  test('finder result links to a pre-filled demo form', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await skipIntro(page);
    await page.goto('palvelut#laitehaku');
    const finder = page.locator('#laitehaku');
    await finder.getByText('Delphi', { exact: true }).click();
    await expect(finder.getByText(/5\/7 laitetyyppiä/)).toBeVisible();
    await finder.getByRole('button', { name: /CR-pumput/ }).click();
    await expect(finder.getByRole('heading', { level: 3 })).toContainText('Delphi – common rail -korkeapainepumput');
    await finder.getByRole('link', { name: 'Pyydä tarjous tästä' }).click();
    await expect(page).toHaveURL(/yhteystiedot\?aihe=common-rail&valmistaja=delphi&laite=cr-pumput#tarjouspyynto$/);
    const form = page.locator('#tarjouspyynto');
    await expect(form.getByLabel(/^Aihe/)).toHaveValue('common-rail');
    await expect(form.getByLabel(/^Laitteen valmistaja/)).toHaveValue('delphi');
    await expect(form.getByLabel(/^Laite/, { exact: false }).last()).toHaveValue('cr-pumput');
  });

  test('form validates and never claims delivery; no request leaves the site', async ({ page }) => {
    await skipIntro(page);
    const external: string[] = [];
    page.on('request', (r) => !r.url().startsWith('http://localhost') && external.push(r.url()));
    await page.goto('yhteystiedot#tarjouspyynto', { waitUntil: 'networkidle' });
    const form = page.locator('#tarjouspyynto');
    await form.getByRole('button', { name: /Kokeile lähetystä/ }).click();
    await expect(form.getByRole('alert')).toContainText('Tarkista 4 kohtaa');
    await form.getByLabel(/^Aihe/).selectOption('vianetsinta');
    await form.getByLabel(/^Viesti/).fill('Auto savuttaa ja käynnistyy huonosti kylmänä.');
    await form.getByLabel(/^Nimi/).fill('Testi Asiakas');
    await form.getByLabel(/^Sähköposti/).fill('testi@example.com');
    await form.getByRole('button', { name: /Kokeile lähetystä/ }).click();
    await expect(form.getByRole('heading', { name: 'Demoversio – viestiä ei lähetetty.' })).toBeVisible();
    expect(external).toEqual([]);
  });

  test('map loads only on request', async ({ page }) => {
    await skipIntro(page);
    await page.goto('yhteystiedot', { waitUntil: 'networkidle' });
    await expect(page.locator('iframe')).toHaveCount(0);
    await page.getByRole('button', { name: 'Näytä kartta' }).click();
    await expect(page.locator('iframe[title^="Kartta"]')).toHaveCount(1);
  });
});
