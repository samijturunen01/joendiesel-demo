/**
 * build-logo.mjs
 *
 * Derives vector geometry from Joen Diesel Oy's ORIGINAL logo bitmaps so the mark
 * can be animated part by part without redrawing or reinterpreting it.
 *
 *   node scripts/build-logo.mjs [preview-dir]
 *
 * Sources (downloaded from joendiesel.com, see docs/ASSET_PROVENANCE.md):
 *   assets-src/brand/joendiesel.jpg  1150×1438  stacked lockup (monogram above wordmark)
 *   assets-src/brand/joenlogo.jpg    2341×485   horizontal lockup (monogram left of wordmark)
 *
 * What is derived, and how:
 *   - "J" and "D" of the monogram: traced 1:1 with potrace from the stacked bitmap
 *     (the larger of the two renderings). Counters and cut-outs are kept as holes.
 *   - Double frame: two rectangles, measured from the stacked bitmap (edge positions
 *     found with sub-pixel accuracy from the grey-level profile). Drawn as strokes so
 *     they can be "scribed" in the intro animation.
 *   - Wordmark "Joen Diesel Oy": every letter traced separately with potrace from the
 *     horizontal bitmap (higher resolution for the lettering). The rough, letterpress-like
 *     edges of the original typeface are preserved – they are part of the identity.
 *   - Lockups: both originals place the same elements at the same relative scale; the
 *     transforms below are computed from matching bounding boxes in the two bitmaps.
 *
 * Output: src/brand/logoGeometry.ts (generated – do not edit by hand)
 *         + preview PNGs for side-by-side comparison with the originals when a dir is given.
 */
import sharp from 'sharp';
import potrace from 'potrace';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STACKED = path.join(root, 'assets-src/brand/joendiesel.jpg');
const WIDE = path.join(root, 'assets-src/brand/joenlogo.jpg');
const outFile = path.join(root, 'src/brand/logoGeometry.ts');
const previewDir = process.argv[2] ? path.resolve(process.argv[2]) : null;

const UPSCALE = 4; // trace from an upscaled crop: smoother sub-pixel edges, same shapes

async function grey(file) {
  const { data, info } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true });
  return { data, W: info.width, H: info.height };
}

/** Connected components of light pixels (the logo is light-on-charcoal). */
function components(img, threshold = 128) {
  const { data, W, H } = img;
  const lab = new Int32Array(W * H).fill(-1);
  const out = [];
  for (let s = 0; s < W * H; s++) {
    if (lab[s] >= 0 || data[s] <= threshold) continue;
    const st = [s];
    lab[s] = out.length;
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, n = 0;
    while (st.length) {
      const i = st.pop();
      const x = i % W, y = (i / W) | 0;
      n++;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const X = x + dx, Y = y + dy;
        if (X < 0 || Y < 0 || X >= W || Y >= H) continue;
        const j = Y * W + X;
        if (lab[j] < 0 && data[j] > threshold) { lab[j] = out.length; st.push(j); }
      }
    }
    out.push({ x0, y0, x1, y1, n });
  }
  return out.filter((c) => c.n > 40);
}

/** Sub-pixel edges of a light band crossing a scan line: returns [start, end] in px (edge = 50 % grey). */
function bandEdges(img, { x, y, horizontal, from, to }) {
  const { data, W } = img;
  const v = (t) => (horizontal ? data[y * W + t] : data[t * W + x]);
  const lo = 42, hi = 236; // measured background / foreground grey
  const frac = (t) => (v(t) - lo) / (hi - lo);
  let start = null, end = null;
  for (let t = from; t < to; t++) {
    if (start === null && frac(t) >= 0.5) start = t - (frac(t) - 0.5) / Math.max(1e-3, frac(t) - frac(t - 1));
    if (start !== null && frac(t) < 0.5) { end = t - (0.5 - frac(t)) / Math.max(1e-3, frac(t - 1) - frac(t)); break; }
  }
  return [start, end];
}

function trace(buffer) {
  return new Promise((resolve, reject) => {
    const p = new potrace.Potrace();
    p.setParameters({ threshold: 128, turdSize: 20 * UPSCALE, optTolerance: 0.25, alphaMax: 1, blackOnWhite: false });
    p.loadImage(buffer, (err) => {
      if (err) return reject(err);
      const tag = p.getPathTag();
      const d = /d="([^"]+)"/.exec(tag)?.[1];
      if (!d) return reject(new Error('potrace returned no path'));
      resolve(d);
    });
  });
}

/** Rewrites every coordinate of a potrace path: (x, y) -> (x / UPSCALE + ox, y / UPSCALE + oy). */
function placePath(d, ox, oy) {
  // potrace emits absolute M / L / C commands with comma or space separated pairs
  const tokens = d.match(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/gi);
  let out = '';
  let pair = [];
  for (const tok of tokens) {
    if (/^[MLCZ]$/i.test(tok)) {
      out += tok.toUpperCase();
      pair = [];
      continue;
    }
    pair.push(Number(tok));
    if (pair.length === 2) {
      const [x, y] = pair;
      out += `${+(x / UPSCALE + ox).toFixed(1)} ${+(y / UPSCALE + oy).toFixed(1)} `;
      pair = [];
    }
  }
  return out.replace(/ ([MLCZ])/g, '$1').trim();
}

async function traceRegion(file, x0, y0, x1, y1) {
  const pad = 6;
  const left = x0 - pad, top = y0 - pad, width = x1 - x0 + 1 + 2 * pad, height = y1 - y0 + 1 + 2 * pad;
  const buf = await sharp(file)
    .extract({ left, top, width, height })
    .greyscale()
    .resize(width * UPSCALE, height * UPSCALE, { kernel: 'lanczos3' })
    .png()
    .toBuffer();
  return placePath(await trace(buf), left, top);
}

/* ------------------------------------------------------------------ */
/* 1. Stacked bitmap: frame + monogram                                  */
/* ------------------------------------------------------------------ */
const st = await grey(STACKED);
const stComps = components(st);
// the frame components are the two largest-area bounding boxes that contain everything else
const byArea = [...stComps].sort((a, b) => (b.x1 - b.x0) * (b.y1 - b.y0) - (a.x1 - a.x0) * (a.y1 - a.y0));
const outerBox = byArea[0];
const innerBox = byArea[1];
const midY = Math.round((outerBox.y0 + outerBox.y1) / 2);
const midX = Math.round((outerBox.x0 + outerBox.x1) / 2);
const [oL0, oL1] = bandEdges(st, { y: midY, horizontal: true, from: outerBox.x0 - 4, to: outerBox.x0 + 40 });
const [iL0, iL1] = bandEdges(st, { y: midY, horizontal: true, from: innerBox.x0 - 4, to: innerBox.x0 + 20 });
const [oT0, oT1] = bandEdges(st, { x: midX + 160, horizontal: false, from: outerBox.y0 - 4, to: outerBox.y0 + 40 });
const [iT0, iT1] = bandEdges(st, { x: midX + 160, horizontal: false, from: innerBox.y0 - 4, to: innerBox.y0 + 20 });
// right / bottom bands: scan from inside the band outwards
const [oR0, oR1] = bandEdges(st, { y: midY, horizontal: true, from: outerBox.x1 - 30, to: outerBox.x1 + 4 });
const [iR0, iR1] = bandEdges(st, { y: midY, horizontal: true, from: innerBox.x1 - 12, to: innerBox.x1 + 4 });
const [oB0, oB1] = bandEdges(st, { x: midX + 160, horizontal: false, from: outerBox.y1 - 30, to: outerBox.y1 + 4 });
const [iB0, iB1] = bandEdges(st, { x: midX + 160, horizontal: false, from: innerBox.y1 - 12, to: innerBox.y1 + 4 });
const outerStroke = +(((oL1 - oL0) + (oT1 - oT0) + (oR1 - oR0) + (oB1 - oB0)) / 4).toFixed(2);
const innerStroke = +(((iL1 - iL0) + (iT1 - iT0) + (iR1 - iR0) + (iB1 - iB0)) / 4).toFixed(2);
// centre lines of the four measured bands
const rectFrom = (l, t, r, b, stroke) => {
  const x0 = (l[0] + l[1]) / 2, y0 = (t[0] + t[1]) / 2, x1 = (r[0] + r[1]) / 2, y1 = (b[0] + b[1]) / 2;
  return { x: +x0.toFixed(2), y: +y0.toFixed(2), w: +(x1 - x0).toFixed(2), h: +(y1 - y0).toFixed(2), stroke };
};
const frameOuter = rectFrom([oL0, oL1], [oT0, oT1], [oR0, oR1], [oB0, oB1], outerStroke);
const frameInner = rectFrom([iL0, iL1], [iT0, iT1], [iR0, iR1], [iB0, iB1], innerStroke);

const inside = stComps.filter((c) => c !== outerBox && c !== innerBox && c.y1 < outerBox.y1 && c.y0 > outerBox.y0);
const [jBox, dBox] = inside.sort((a, b) => a.x0 - b.x0);
const monoJ = await traceRegion(STACKED, jBox.x0, jBox.y0, jBox.x1, jBox.y1);
const monoD = await traceRegion(STACKED, dBox.x0, dBox.y0, dBox.x1, dBox.y1);
const stWord = stComps.filter((c) => c.y0 > outerBox.y1).sort((a, b) => a.x0 - b.x0);

/* ------------------------------------------------------------------ */
/* 2. Wide bitmap: wordmark letters (and the frame position for the lockup) */
/* ------------------------------------------------------------------ */
const wd = await grey(WIDE);
const wdComps = components(wd);
const wdOuter = [...wdComps].sort((a, b) => (b.x1 - b.x0) * (b.y1 - b.y0) - (a.x1 - a.x0) * (a.y1 - a.y0))[0];
const letters = wdComps.filter((c) => c.x0 > wdOuter.x1 + 20).sort((a, b) => a.x0 - b.x0);
const CHARS = ['J', 'O', 'E', 'N', 'D', 'I', 'E', 'S', 'E', 'L', 'O', 'Y'];
const WORD_OF = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2];
if (letters.length !== CHARS.length) throw new Error(`expected ${CHARS.length} letters, found ${letters.length}`);
const word = [];
for (let i = 0; i < letters.length; i++) {
  const c = letters[i];
  word.push({ ch: CHARS[i], word: WORD_OF[i], d: await traceRegion(WIDE, c.x0, c.y0, c.x1, c.y1) });
}

/* ------------------------------------------------------------------ */
/* 3. Lockup transforms                                                 */
/* ------------------------------------------------------------------ */
// Wordmark (wide coords) -> stacked coords: match the overall wordmark extents.
const wW0 = letters[0].x0, wW1 = letters.at(-1).x1, wY0 = Math.min(...letters.map((c) => c.y0)), wY1 = Math.max(...letters.map((c) => c.y1));
const sW0 = stWord[0].x0, sW1 = stWord.at(-1).x1, sY0 = Math.min(...stWord.map((c) => c.y0)), sY1 = Math.max(...stWord.map((c) => c.y1));
const kWord = ((sW1 - sW0) / (wW1 - wW0) + (sY1 - sY0) / (wY1 - wY0)) / 2;
const wordToStacked = { s: +kWord.toFixed(5), tx: +(sW0 - wW0 * kWord).toFixed(2), ty: +(sY0 - wY0 * kWord).toFixed(2) };
// The stacked original spaces its letters very slightly differently: place each letter by matching
// its bounding-box centre (common scale), so the stacked lockup reproduces that original exactly.
if (stWord.length !== letters.length) throw new Error('stacked wordmark letter count mismatch');
for (let i = 0; i < letters.length; i++) {
  const a = letters[i], b = stWord[i];
  const cxA = (a.x0 + a.x1) / 2, cyA = (a.y0 + a.y1) / 2, cxB = (b.x0 + b.x1) / 2, cyB = (b.y0 + b.y1) / 2;
  word[i].stacked = { dx: +(cxB - (cxA * kWord + wordToStacked.tx)).toFixed(2), dy: +(cyB - (cyA * kWord + wordToStacked.ty)).toFixed(2) };
}
// Monogram + frame (stacked coords) -> wide coords: match the outer frame boxes.
const kMono = ((wdOuter.x1 - wdOuter.x0) / (outerBox.x1 - outerBox.x0) + (wdOuter.y1 - wdOuter.y0) / (outerBox.y1 - outerBox.y0)) / 2;
const monoToWide = { s: +kMono.toFixed(5), tx: +(wdOuter.x0 - outerBox.x0 * kMono).toFixed(2), ty: +(wdOuter.y0 - outerBox.y0 * kMono).toFixed(2) };

// Tight view boxes (original margins kept proportionally small)
const m = 4;
const stackedViewBox = [outerBox.x0 - m, outerBox.y0 - m, Math.max(outerBox.x1, sW1) - Math.min(outerBox.x0, sW0) + 2 * m, sY1 - outerBox.y0 + 2 * m];
stackedViewBox[0] = Math.min(outerBox.x0, sW0) - m;
const wideViewBox = [wdOuter.x0 - m, wdOuter.y0 - m, wW1 - wdOuter.x0 + 2 * m, wdOuter.y1 - wdOuter.y0 + 2 * m];
const monoViewBox = [outerBox.x0 - m, outerBox.y0 - m, outerBox.x1 - outerBox.x0 + 1 + 2 * m, outerBox.y1 - outerBox.y0 + 1 + 2 * m];

// Colours measured from the bitmaps
const COLORS = { background: '#2b2a28', foreground: '#ececec' };

const geometry = {
  colors: COLORS,
  frameOuter,
  frameInner,
  monogram: { j: monoJ, d: monoD },
  word,
  wordToStacked,
  monoToWide,
  viewBox: { stacked: stackedViewBox, wide: wideViewBox, monogram: monoViewBox },
};

mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(
  outFile,
  `/* Generated by scripts/build-logo.mjs from the original Joen Diesel Oy logo bitmaps – do not edit by hand. */\n` +
    `/* eslint-disable */\n` +
    `export const logoGeometry = ${JSON.stringify(geometry, null, 2)} as const;\n`,
);
console.log('frameOuter', frameOuter, 'frameInner', frameInner);
console.log('wordToStacked', wordToStacked, 'monoToWide', monoToWide);
console.log('viewBoxes', geometry.viewBox);
console.log(`wrote ${path.relative(root, outFile)}`);

/* ------------------------------------------------------------------ */
/* 4. Optional previews (rendered from the geometry, on the original canvas) */
/* ------------------------------------------------------------------ */
if (previewDir) {
  mkdirSync(previewDir, { recursive: true });
  const fg = COLORS.foreground;
  const rects = (fo, fi) =>
    `<rect x="${fo.x}" y="${fo.y}" width="${fo.w}" height="${fo.h}" fill="none" stroke="${fg}" stroke-width="${fo.stroke}"/>` +
    `<rect x="${fi.x}" y="${fi.y}" width="${fi.w}" height="${fi.h}" fill="none" stroke="${fg}" stroke-width="${fi.stroke}"/>`;
  const mono = `${rects(frameOuter, frameInner)}<path d="${monoJ}" fill="${fg}" fill-rule="evenodd"/><path d="${monoD}" fill="${fg}" fill-rule="evenodd"/>`;
  const wordPaths = word.map((l) => `<path d="${l.d}" fill="${fg}" fill-rule="evenodd"/>`).join('');
  const wordPathsStacked = word.map((l) => `<path transform="translate(${l.stacked.dx / wordToStacked.s} ${l.stacked.dy / wordToStacked.s})" d="${l.d}" fill="${fg}" fill-rule="evenodd"/>`).join('');
  const stackedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${st.W}" height="${st.H}" viewBox="0 0 ${st.W} ${st.H}"><rect width="100%" height="100%" fill="${COLORS.background}"/>${mono}<g transform="matrix(${wordToStacked.s} 0 0 ${wordToStacked.s} ${wordToStacked.tx} ${wordToStacked.ty})">${wordPathsStacked}</g></svg>`;
  const wideSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${wd.W}" height="${wd.H}" viewBox="0 0 ${wd.W} ${wd.H}"><rect width="100%" height="100%" fill="${COLORS.background}"/><g transform="matrix(${monoToWide.s} 0 0 ${monoToWide.s} ${monoToWide.tx} ${monoToWide.ty})">${mono}</g>${wordPaths}</svg>`;
  for (const [name, svg, orig] of [['stacked', stackedSvg, STACKED], ['wide', wideSvg, WIDE]]) {
    const rendered = await sharp(Buffer.from(svg)).png().toBuffer();
    writeFileSync(path.join(previewDir, `logo-${name}-traced.png`), rendered);
    // difference image: white where the trace and the original disagree
    const a = await sharp(rendered).greyscale().raw().toBuffer({ resolveWithObject: true });
    const b = await sharp(orig).greyscale().raw().toBuffer();
    const diff = Buffer.alloc(a.data.length);
    let bad = 0;
    for (let i = 0; i < diff.length; i++) {
      const dlt = Math.abs(a.data[i] - b[i]);
      diff[i] = dlt > 96 ? 255 : 0;
      if (dlt > 96) bad++;
    }
    await sharp(diff, { raw: { width: a.info.width, height: a.info.height, channels: 1 } }).png().toFile(path.join(previewDir, `logo-${name}-diff.png`));
    console.log(`${name}: ${((bad / diff.length) * 100).toFixed(3)} % of pixels differ by > 96 grey levels`);
  }
}
