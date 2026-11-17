/**
 * build-og.mjs – renders public/og-kuva.png (1200×630) for link previews, with the site's own
 * fonts and the traced logo, in the locally installed Chrome (Playwright).
 *   node scripts/build-og.mjs
 */
import { chromium } from '@playwright/test';
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { logoGeometry as g } from '../src/brand/logoGeometry.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const font = (p) => pathToFileURL(path.join(root, 'node_modules', p)).href;

const t = g.wordToStacked;
const [vx, vy, vw, vh] = g.viewBox.stacked;
const logo = `<svg viewBox="${vx} ${vy} ${vw} ${vh}" xmlns="http://www.w3.org/2000/svg" fill="#ecebe6">
  <rect x="${g.frameOuter.x}" y="${g.frameOuter.y}" width="${g.frameOuter.w}" height="${g.frameOuter.h}" fill="none" stroke="#ecebe6" stroke-width="${g.frameOuter.stroke}"/>
  <rect x="${g.frameInner.x}" y="${g.frameInner.y}" width="${g.frameInner.w}" height="${g.frameInner.h}" fill="none" stroke="#ecebe6" stroke-width="${g.frameInner.stroke}"/>
  <path d="${g.monogram.j}" fill-rule="evenodd"/><path d="${g.monogram.d}" fill-rule="evenodd"/>
  <g transform="matrix(${t.s} 0 0 ${t.s} ${t.tx} ${t.ty})">${g.word
    .map((l) => `<g transform="translate(${l.stacked.dx / t.s} ${l.stacked.dy / t.s})"><path d="${l.d}" fill-rule="evenodd"/></g>`)
    .join('')}</g></svg>`;

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Saira;src:url(${font('@fontsource-variable/saira/files/saira-latin-standard-normal.woff2')}) format('woff2');font-weight:100 900;font-stretch:50% 125%}
@font-face{font-family:Mono;src:url(${font('@fontsource-variable/martian-mono/files/martian-mono-latin-wght-normal.woff2')}) format('woff2');font-weight:100 800}
html,body{margin:0;width:1200px;height:630px;background:#1a1917;color:#ecebe6;overflow:hidden}
body{display:grid;grid-template-columns:1fr 360px;gap:60px;align-items:center;padding:0 80px;box-sizing:border-box;
  background:radial-gradient(520px 420px at 82% 50%,rgba(230,168,61,.13),transparent 70%),#1a1917;font-family:Saira}
.k{font:500 15px Mono;letter-spacing:.09em;text-transform:uppercase;color:#e6a83d}
h1{margin:26px 0 0;font-weight:820;font-stretch:70%;font-size:132px;line-height:.86;letter-spacing:-.01em}
h1 b{color:#e6a83d}
p{margin:30px 0 0;font-size:25px;line-height:1.35;color:#dad8d1;max-width:560px}
.demo{position:absolute;left:80px;bottom:34px;font:500 12px Mono;letter-spacing:.09em;text-transform:uppercase;color:#94918a}
.r{position:absolute;left:0;right:0;bottom:0;height:10px;background-image:linear-gradient(to right,#ecebe655 1px,transparent 1px),linear-gradient(to right,#ecebe655 1px,transparent 1px);background-size:8px 5px,80px 10px;background-repeat:repeat-x}
svg{width:360px;height:auto;display:block}
</style><body><div><div class="k">Diesellaitteiden erikoiskorjaamo · Joensuu</div><h1>Paine<br>kohdallaan<b>.</b></h1>
<p>Suuttimet, rivi- ja jakajapumput, common <span style="white-space:nowrap">rail -kunnostus</span> ja vianetsintä vuodesta 1990.</p></div>${logo}
<div class="demo">Konseptidemo – ei yrityksen virallinen sivusto</div><div class="r"></div></body>`;

const dir = mkdtempSync(path.join(tmpdir(), 'jd-og-'));
const file = path.join(dir, 'og.html');
writeFileSync(file, html);
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(file).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(root, 'public', 'og-kuva.png') });
await browser.close();
rmSync(dir, { recursive: true, force: true });
console.log('og image: public/og-kuva.png');
