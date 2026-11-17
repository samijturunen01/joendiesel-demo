# Project status – Joen Diesel Oy concept demo

_Last updated: 17.11.2026_

## Current phase
Phase 12–13: deployment to GitHub Pages and live verification.

## Completed
- Research of joendiesel.com (all 6 pages, WP REST media list), PRH/YTJ register, Yrittäjät.fi articles (2020, 2021).
- Authentic logo traced to vectors (`scripts/build-logo.mjs` → `src/brand/logoGeometry.ts`), verified against the originals (diff ≈ 0.3 % of pixels, anti-aliasing only).
- Creative concept **"Avautumispaine"** (opening pressure): charcoal/bone from the logo + test-oil amber; Saira (monogram voice), IM Fell English SC (wordmark voice), Martian Mono (data).
- Signature homepage intro: injector pressure build → nozzle "pop" → spray mist reveals JD → double frame scribed → wordmark stamped. Once per session, replay button, reduced-motion static, mobile-light.
- Pages: Etusivu, Palvelut, Vianetsintä ja huolto, Suuttimet ja pumput, Common rail, Varaosat, Yritys, Rahoitus, Yhteystiedot, 404.
- Laitehaku (equipment finder) with measuring-glass visualisation; prefilled quote links.
- Inquiry form with validation, URL prefill, demo-only mock transport; Apps Script + reCAPTCHA transport prepared but inactive.
- Static prerendering of all routes (+ 404.html), noindex, robots Disallow, structured data (AutoRepair, BreadcrumbList).
- Unit/component tests (31) pass; Playwright e2e (23) + axe WCAG 2.1 AA scans (20 page/viewport combinations, 0 violations) pass; ESLint + TypeScript clean.
- Logo outlines defined once per page (SVG sprite); single hero logo instance. Throttled mobile (1.6 Mbps, 4× CPU, no gzip): FCP = LCP 2.2 s, CLS 0. Desktop LCP 0.3 s.
- Docs: CONTENT_SOURCES, ASSET_PROVENANCE, REDESIGN_IMPROVEMENTS, BACKEND_INTEGRATION, README. OG image rendered from the logo.

## Deployment
- 17.11.2026: user confirmed permission to publish the logo in this public, noindex demo.
- Repo: https://github.com/samijturunen01/joendiesel-demo (public). Pages: GitHub Actions (`.github/workflows/deploy.yml`), every push to `main` deploys.
- Live: https://samijturunen01.github.io/joendiesel-demo/ (noindex, robots Disallow, mock form).

## Design decisions
- No photographs: the old site's backgrounds are edited stock images and the product pictures are Bosch manufacturer images – publication rights not established, so excluded. Visuals are typography, the authentic logo and abstract line illustrations (captioned "kuvitus").
- Hubot Sans was replaced by Saira because Hubot's zero has a crossbar ("θ") – unacceptable for phone numbers and years.
- No manual chunk splitting in Vite (it duplicated React).

## Known issues / environment notes
- Windows: run from any cwd – `vite.config.ts` and `scripts/vitest.mjs` normalise the drive letter (c:\ vs C:\ caused duplicate React / Vitest).
- Git Bash rewrites `/path` arguments: use `MSYS_NO_PATHCONV=1` for scripts taking URL paths.
- Port 4173 is used by another local project; preview here with `node scripts/serve-dist.mjs 4183`.

## Next recommended action
Present to the owners. Collect: confirmation of opening hours, e-invoice operator name, stock of exchange units, and real workshop photos. Production: domain/DNS, HTTPS check, Apps Script + reCAPTCHA (docs/BACKEND_INTEGRATION.md), privacy notice, ALLOW_INDEXING=true.
