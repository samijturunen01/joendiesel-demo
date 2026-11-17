# Asset provenance – Joen Diesel Oy concept demo

Every image, logo and font in the demo, where it comes from and whether it may be published.

## Published in the demo

| Local file | Original / origin | Description | Usage | Publication rights |
|-----------|-------------------|-------------|-------|--------------------|
| `assets-src/brand/joendiesel.jpg` | https://joendiesel.com/wp-content/uploads/2023/03/joendiesel.jpg | Original stacked logo, 1150×1438 | Source bitmap for the vector trace (not served to visitors) | Company's own logo – see "Logo" below |
| `assets-src/brand/joenlogo.jpg` | https://joendiesel.com/wp-content/uploads/2023/03/joenlogo.jpg | Original horizontal logo, 2341×485 | Source bitmap for the wordmark trace (not served) | Company's own logo – see "Logo" below |
| `src/brand/logoGeometry.ts` | Derived by `scripts/build-logo.mjs` (potrace) from the two bitmaps above | Vector paths: frame, J, D, 12 wordmark letters | Header, footer, hero intro, 404 | Same as the logo |
| `public/favicon.svg`, `public/apple-touch-icon.png` | Derived from the logo geometry (`scripts/build-icons.mjs`) | Monogram icons | Browser tab, home screen | Same as the logo |
| `public/og-kuva.png` | Rendered by `scripts/build-og.mjs` from the logo geometry + site typography | 1200×630 link preview, labelled "Konseptidemo" | Open Graph image | Same as the logo; no third-party material |
| SVG line illustrations (`src/components/illustrations/Drawings.tsx`, injector in `LogoIntro.tsx`) | Drawn for this demo by Hades Design | Abstract injector, pumps, tester, belt, glow plug, common rail principle | Decorative, captioned "kuvitus" / "periaatekuva" | Original work – no restrictions |
| Saira (variable) | Google Fonts / Fontsource `@fontsource-variable/saira` | Display and body typeface | Site-wide | SIL Open Font License 1.1 |
| IM Fell English SC | Google Fonts / Fontsource `@fontsource/im-fell-english-sc` (Igino Marini) | Old-style small caps for years and accents | Site-wide | SIL Open Font License 1.1 |
| Martian Mono (variable) | Google Fonts / Fontsource `@fontsource-variable/martian-mono` (Evil Martians) | Labels and data | Site-wide | SIL Open Font License 1.1 |
| Lucide icons | `lucide-react` | UI icons | Site-wide | ISC License |
| OpenStreetMap embed | openstreetmap.org (loaded only after the visitor clicks "Näytä kartta") | Map tiles | Contact page | © OpenStreetMap contributors, ODbL |

### Logo

The logo is Joen Diesel Oy's own brand mark. The brief authorises publishing original company assets
for this demo where the usage and publication permission has been established. The logo is reproduced
faithfully (shapes, proportions, counters and the rough edges of the wordmark unchanged; trace verified
against the originals, ≈ 0.3 % of pixels differ, all on anti-aliased edges) and is only shown in a demo
that is clearly labelled as unofficial and kept out of search engines (noindex, robots Disallow).
**Deployment status of the logo: see docs/PROJECT_STATUS.md.**

## Not used (rights not established)

| Original URL | Description | Reason |
|--------------|-------------|--------|
| …/2023/03/taustakuva-2023-03-17T133620.804.jpg | Blue-gloved hands tightening common rail injectors, colour-graded | Appears to be licensed stock photography edited in a design tool (file names "taustakuva (99)", 2000×1100 export size); the licence is the company's or its web agency's and does not transfer to us |
| …/2023/03/taustakuva-2023-03-17T133541.869.jpg | Common rail engine bay | As above |
| …/2023/03/taustakuva-2023-03-17T133609.399.jpg | Isolated diesel engine on a light background | As above |
| …/2023/03/taustakuva-99.jpg | Pistons and connecting rods, high-contrast edit | As above |
| …/2023/03/taustakuva-100.jpg | Engine fan and alternator on a blue-grey background | As above |
| …/2023/03/0445110189PH07WHCO0000LA.jpg, …PH13WHCO0000LA.jpg, bosch-suutin-063(.jpg, -2.jpg), bosch-cp1.jpg, bosch-cp1h.jpg, bosch-cp1-mb.jpg, bosch-vp30.jpg, bosch-rivi.jpg, 0986437312.png, pumppusuuttimet.jpg | Bosch product photos (225–560 px) | Manufacturer images; low resolution; may not be presented as the company's own products or work |
| …/2025/05/Hae-rahoitusta-yritykselle.png | Rahoitusturva button graphic | Partner's graphic – replaced by a native button |
| …/2023/03/cropped-joendiesel.jpg | 512 px site icon | Superseded by vector icons derived from the logo |

The originals were inspected in the session scratchpad only and are not part of the repository.

## Missing material that would improve the site

- Real photographs of the workshop, the Bosch EPS 815 test bench, the testers and the owners at work.
- A vector original of the logo (the trace is faithful, but an original file is always preferable).
- Approved descriptions of typical customers and jobs, if the owners want them on the site.
