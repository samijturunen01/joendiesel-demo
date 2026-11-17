# Joen Diesel Oy – konseptidemo

Speculative website redesign for **Joen Diesel Oy**, a diesel fuel-injection specialist workshop in Joensuu
(original site: https://joendiesel.com/). Designed and built by Hades Design.

> This is a concept demo, **not** the company's official website. It is `noindex`, the enquiry form sends
> nothing, and the company's live site, domain, DNS and e-mail are untouched.

## Concept: "Avautumispaine" (opening pressure)

The moment an injector reaches its opening pressure and sprays – the defining instant of the company's
craft – drives the identity: the homepage intro pops an injector whose spray mist reveals the authentic
JD monogram; measuring glasses from the test bench power the *Laitehaku* equipment finder. Palette and
type come from the logo itself (charcoal, bone, test-oil amber; Saira, IM Fell English SC, Martian Mono).

## Stack

React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · React Router 8 · GSAP + ScrollTrigger · Lucide.
Every route is prerendered to static HTML (`scripts/prerender.mjs`) for GitHub Pages.

## Commands

```bash
npm install
npm run dev          # http://localhost:5173/joendiesel-demo/
npm run check        # typecheck + lint + unit tests + production build
npm run build        # dist/ (client build → SSR build → prerender)
npm run preview      # serve dist/ like GitHub Pages: http://localhost:4173/joendiesel-demo/
npm run test:e2e     # Playwright + axe (installed Chrome) against dist/; E2E_BASE_URL=<live url/> tests the deployed site
npm run logo         # re-derive the logo vectors from assets-src/brand/*.jpg
node scripts/build-icons.mjs   # favicon + apple-touch-icon from the logo vectors
node scripts/build-og.mjs      # public/og-kuva.png
```

Build environment variables: `VITE_BASE_PATH` (default `/joendiesel-demo/`), `SITE_URL`,
`ALLOW_INDEXING` (`true` only on the approved production domain), `VITE_INQUIRY_TRANSPORT`
(`mock` default; see `docs/BACKEND_INTEGRATION.md`).

## Structure

```
src/brand/          logoGeometry.ts (generated from the original logo)
src/components/     brand (Logo, LogoIntro), layout, home, forms, illustrations, ui
src/data/           company facts, equipment matrix, content, routes + metadata
src/lib/inquiry/    validation, prefill, transports (mock / Apps Script)
src/pages/          one file per route
scripts/            logo trace, icons, OG image, prerender, preview server, test launcher
docs/               CONTENT_SOURCES, ASSET_PROVENANCE, REDESIGN_IMPROVEMENTS, BACKEND_INTEGRATION, PROJECT_STATUS
e2e/                Playwright browser + axe accessibility tests
```

## Documentation

- `docs/CONTENT_SOURCES.md` – where every fact comes from, items to verify with the owners
- `docs/ASSET_PROVENANCE.md` – logo, fonts, illustrations; excluded stock and manufacturer images
- `docs/REDESIGN_IMPROVEMENTS.md` – weaknesses of the old site and the business value of each change
- `docs/BACKEND_INTEGRATION.md` – enabling the form with Google Apps Script + reCAPTCHA
- `docs/PROJECT_STATUS.md` – current state and next steps
