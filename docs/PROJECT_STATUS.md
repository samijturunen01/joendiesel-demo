# Project status – Joen Diesel Oy concept demo

_Last updated: 17.11.2026_

## Current phase
Phase 10–11: visual QA and technical testing. Next: e2e tests, docs, deployment.

## Completed
- Research of joendiesel.com (all 6 pages, WP REST media list), PRH/YTJ register, Yrittäjät.fi articles (2020, 2021).
- Authentic logo traced to vectors (`scripts/build-logo.mjs` → `src/brand/logoGeometry.ts`), verified against the originals (diff ≈ 0.3 % of pixels, anti-aliasing only).
- Creative concept **"Avautumispaine"** (opening pressure): charcoal/bone from the logo + test-oil amber; Saira (monogram voice), IM Fell English SC (wordmark voice), Martian Mono (data).
- Signature homepage intro: injector pressure build → nozzle "pop" → spray mist reveals JD → double frame scribed → wordmark stamped. Once per session, replay button, reduced-motion static, mobile-light.
- Pages: Etusivu, Palvelut, Vianetsintä ja huolto, Suuttimet ja pumput, Common rail, Varaosat, Yritys, Rahoitus, Yhteystiedot, 404.
- Laitehaku (equipment finder) with measuring-glass visualisation; prefilled quote links.
- Inquiry form with validation, URL prefill, demo-only mock transport; Apps Script + reCAPTCHA transport prepared but inactive.
- Static prerendering of all routes (+ 404.html), noindex, robots Disallow, structured data (AutoRepair, BreadcrumbList).
- Unit/component tests (31) pass; ESLint + TypeScript clean.

## Design decisions
- No photographs: the old site's backgrounds are edited stock images and the product pictures are Bosch manufacturer images – publication rights not established, so excluded. Visuals are typography, the authentic logo and abstract line illustrations (captioned "kuvitus").
- Hubot Sans was replaced by Saira because Hubot's zero has a crossbar ("θ") – unacceptable for phone numbers and years.
- No manual chunk splitting in Vite (it duplicated React).

## Known issues / environment notes
- Windows: run from any cwd – `vite.config.ts` and `scripts/vitest.mjs` normalise the drive letter (c:\ vs C:\ caused duplicate React / Vitest).
- Git Bash rewrites `/path` arguments: use `MSYS_NO_PATHCONV=1` for scripts taking URL paths.
- Port 4173 is used by another local project; preview here with `node scripts/serve-dist.mjs 4183`.

## Next recommended action
E2E browser tests → docs (CONTENT_SOURCES, REDESIGN_IMPROVEMENTS, ASSET_PROVENANCE, BACKEND_INTEGRATION) → OG image → confirm logo publication right with the user → GitHub repo + Pages deploy → verify live.
