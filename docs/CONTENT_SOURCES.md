# Content sources – Joen Diesel Oy concept demo

All company-specific content on the demo comes from the sources below. Nothing has been invented:
no testimonials, prices, statistics, certifications, guarantees, customer projects, service areas or
customer groups. Facts that should be re-confirmed with the owners before production are marked **VERIFY**.

Research date: 17.11.2026.

## Sources

| Id | Source | Notes |
|----|--------|-------|
| S1 | https://joendiesel.com/ – Etusivu, /korjaamme-huollamme/, /commonrail/, /tuotteet/, /rahoitus/, /yhteystiedot/ | Primary source. WordPress/Divi site by nettisivu.net. Pages last modified 2023-03 … 2025-05 (WP REST API). |
| S2 | PRH / YTJ open data API, business ID 0819625-5 | Official trade register. |
| S3 | Yrittäjät.fi, "Ammattitaitoista diesellaitteiden korjausta" (17.6.2020) and the same story republished 13.8.2021 | Text and photo: Janika Utriainen. Used only for history facts; photo not used. |
| S4 | OpenStreetMap / Nominatim | Coordinates of Aspitie 15 (map link, structured data). |
| S5 | Fonecta directory (search snippet only; page returned 403) | Used only to cross-check; not quoted. |

## Facts used on the site

| Fact | Value on the demo | Source | Status |
|------|-------------------|--------|--------|
| Company name | Joen Diesel Oy | S1, S2 | Verified |
| Business ID | 0819625-5 | S1, S2 | Verified |
| Founded | 1990 (registered 9.11.1990) | S1, S2 | Verified |
| Original trade name | Avoin yhtiö Joen Diesel Manninen & Ahlqvist (1990–1994) | S2 | Verified – **VERIFY** the owners are happy to show it |
| Name Joen Diesel Oy | from 31.8.1994 | S2 | Verified |
| Business | Diesellaitteiden erikoiskorjaamo, Joensuu | S1 | Verified |
| Owners | Markus Manninen, Jani Rantanen | S1, S3 | Verified |
| Ownership change | Turn of the year 2019–2020, generational change (Markus's father one of the founders), name unchanged | S3 | Verified (2020 article) |
| Jani Rantanen in the company since | 2005 | S3 | Verified (2020 article) |
| Markus Manninen in the company since | 2015, after graduating | S3 | Verified (2020 article) |
| Address | Aspitie 15, 80100 Joensuu | S1, S2 | Verified |
| Phones | 013 897 907, 050 313 8438 | S1 (S5 lists 050 313 8438) | Verified. Labels "Puhelin" / "Matkapuhelin" are by number type – the old site has no labels. |
| E-mail | joendiesel@telemail.fi (old site writes "(a)") | S1 | Verified |
| Opening hours | Ma–to 8.00–16.00, pe 8.00–14.00, la–su closed | S1 | **VERIFY** – a directory snippet (S5) showed partially different days; holiday/summer hours are not published |
| E-invoice address | 003708196255 | S1 | Verified as published |
| E-invoice operator | Liaison Technologies Oy, 003708599126 | S1 | **VERIFY** – Liaison Technologies has since become part of OpenText; the operator code is likely still valid but the name may be outdated |
| Paper invoices | C/O Kirjanpitotoimisto Lehtinen Oy, Mustolankatu 7, 80200 Joensuu | S1 | Verified as published |
| Diagnostics tools | Bosch KTS 650, Bosch KTS 570, Denso system tester | S1 | Verified as published |
| Test bench | Bosch EPS 815 | S1 | Verified as published |
| Workshop jobs | Diesel engine fault finding and repair; timing belts; feed (injection) pump and injector removal/installation; glow plugs incl. broken ones | S1 | Verified as published |
| Common rail | Refurbishing Bosch HP pumps and injectors; refurbished exchange pumps and injectors in stock; bench checks also for Delphi and Denso HP pumps and injectors; VP30/VP44 programming on the bench | S1 | Verified as published. **VERIFY** stock situation is still current |
| Manufacturer list | Bosch; Delphi (Lucas, CAV, Simms); Stanadyne; Zexel (Kiki); Denso – component types per manufacturer as in `src/data/equipment.ts` | S1 | Verified as published |
| Parts | Shelf goods for diesel maintenance; special orders, "haastavatkin tilaukset" | S1 | Verified as published |
| Product types shown | CR HP pumps (e.g. Bosch CP1, CP1H), CR injectors, distributor pump (Bosch VP30), inline pump, pump+injector set | S1 (/tuotteet image file names) | Product *types* only – the manufacturer photos are not used |
| Consumer financing | Loan offers via Sortter Oy, Bulevardi 21, 00180 Helsinki | S1 | Verified as published. Linked to sortter.fi (the old site embeds Sortter's widget) |
| Business financing | Rahoitusturva, 6–48 months, positive credit decision required; partner link `?kumppani=200` | S1 | Verified as published – same link as the old site |
| Coordinates | 62.62963, 29.78532 | S4 | House-level match |

## General (non company-specific) explanations

The demo contains short explanations of what common rail, inline pumps, distributor pumps and injectors
are (e.g. "Rivipumpussa jokaisella sylinterillä on oma pumppuelementtinsä"). These are general technical
knowledge, not claims about the company, and are written cautiously ("voi näkyä …").

## Deliberately NOT used

- "No other diesel repair shop in the Joensuu area" (S3, 2020): competitive claim, possibly outdated.
- "Former owners help during busy periods" (S3): likely outdated.
- Revenue figures (S5) and any statistics.
- Customer groups (cars / trucks / tractors / machinery): never stated by the company.
- Prices: none published by the company.

## Issues found on the old site (for the owners)

- `/yhteystiedot` contains a hidden spam link "123movies" injected by the free map-embed generator (embedgooglemap.net).
- Two WordPress template posts from 2020, "Artikkeli 2" and "Esimerkki 1", are still public (`/yleinen/…`).
- No meta descriptions, no structured data, and the generic Divi blue (#2b87da) is not part of the brand.
- HTTPS works (Let's Encrypt, valid until 5.2.2027) and http → https redirects correctly.
