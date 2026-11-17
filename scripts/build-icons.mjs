/**
 * build-icons.mjs – favicon.svg and apple-touch-icon.png from the traced logo geometry.
 *   node scripts/build-icons.mjs
 * (Node ≥ 22.18 strips TypeScript types, so the generated geometry module can be imported directly.)
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { logoGeometry as g } from '../src/brand/logoGeometry.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (f) => path.join(root, 'public', f);

const [mx, my, mw, mh] = g.viewBox.monogram;
const pad = 0.12;
const size = Math.max(mw, mh) * (1 + pad * 2);
const ox = mx - (size - mw) / 2;
const oy = my - (size - mh) / 2;
const fg = g.colors.foreground;
const bg = g.colors.background;

const mono = (stroke = 1) =>
  `<rect x="${g.frameOuter.x}" y="${g.frameOuter.y}" width="${g.frameOuter.w}" height="${g.frameOuter.h}" fill="none" stroke="${fg}" stroke-width="${g.frameOuter.stroke * stroke}"/>` +
  `<rect x="${g.frameInner.x}" y="${g.frameInner.y}" width="${g.frameInner.w}" height="${g.frameInner.h}" fill="none" stroke="${fg}" stroke-width="${g.frameInner.stroke * stroke}"/>` +
  `<path d="${g.monogram.j}" fill="${fg}" fill-rule="evenodd"/><path d="${g.monogram.d}" fill="${fg}" fill-rule="evenodd"/>`;

// Favicon: slightly heavier hairline so it survives 16–32 px.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ox} ${oy} ${size} ${size}"><rect x="${ox}" y="${oy}" width="${size}" height="${size}" rx="${size * 0.14}" fill="${bg}"/>${mono(1.6)}</svg>`;
writeFileSync(out('favicon.svg'), favicon);

const touch = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="${ox} ${oy} ${size} ${size}"><rect x="${ox}" y="${oy}" width="${size}" height="${size}" fill="${bg}"/>${mono(1.2)}</svg>`;
await sharp(Buffer.from(touch)).resize(180, 180).png({ compressionLevel: 9 }).toFile(out('apple-touch-icon.png'));

console.log('icons: public/favicon.svg, public/apple-touch-icon.png');
