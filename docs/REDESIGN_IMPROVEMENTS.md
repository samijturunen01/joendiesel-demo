# Redesign improvements – Joen Diesel Oy

What was weak on joendiesel.com (reviewed 17.11.2026), what the concept demo does instead, and why it
matters for this particular business: a two-person diesel fuel-injection specialist in Joensuu whose
customers mostly need to know one thing – *can they fix my injector / pump, and how do I reach them?*

## 1. "Can you service my equipment?" was buried in bullet lists
**Before:** the manufacturer × component information – the single most useful thing on the site – sat in
five unstyled bullet lists on "Korjaus & Huolto", split from the common rail facts on another page.
**Now:** *Laitehaku*, an interactive finder on the homepage and the services page. Pick Bosch, Delphi,
Denso, Stanadyne or Zexel and seven graduated measuring glasses fill for every component type on the
service list; select one to see exactly what is done (repair, refurbishing, bench test, bench check,
programming) and jump to a pre-filled quote request. The "Suuttimet ja pumput" page adds the full
matrix as a printable table.
**Benefit:** fewer "do you do X?" calls that end in "no", more qualified enquiries, and a memorable
moment that is specific to an injection workshop rather than a generic template.

## 2. Generic identity
**Before:** Divi's default blue buttons, Archivo Narrow + Poppins and stock imagery – nothing on the
site except the logo said "Joen Diesel".
**Now:** the creative concept *Avautumispaine* (opening pressure) built from the logo itself: charcoal
and bone from the mark, one accent ("test-oil amber"), Saira for the monogram's squared voice, IM Fell
English SC for the wordmark's old-style voice, Martian Mono for model numbers. The logo's double frame
recurs as the frame for key content; graduated rulers act as dividers.
**Benefit:** the owners recognise their company immediately, but at a far higher level of finish.

## 3. No first impression
**Before:** a stock photo of blue gloves with "Diesellaitteiden korjausta jo vuodesta 1990".
**Now:** "Paine kohdallaan." next to a signature animation: an injector builds pressure, pops, and the
spray mist reveals the authentic JD monogram; the frame is scribed and the wordmark stamped in. It plays
once per session, never blocks the page, can be replayed, and is static with reduced motion.
**Benefit:** a homepage people remember and talk about – and it says "fuel injection" without a word.

## 4. Stock and manufacturer photos
**Before:** five edited stock photos and small Bosch product shots carried the visuals.
**Now:** none are used (rights not established; see ASSET_PROVENANCE.md). The design relies on
typography, the logo and original line illustrations clearly captioned as illustrations.
**Benefit:** nothing on the site misrepresents whose work or products are shown. Real workshop photos
can be added later into an already-designed system.

## 5. Calls and enquiries
**Before:** one generic four-field form on every page (Divi + reCAPTCHA), phone numbers only in the footer
with a stray space ("013- 897 907"), e-mail written as "joendiesel(a)telemail.fi".
**Now:** click-to-call in the header on every page, a large amber call band with both numbers, today's
opening hours highlighted, and a service-specific enquiry form (topic, manufacturer, component, vehicle,
part number) with accessible validation. Pre-filled from the finder and service pages.
**Benefit:** enquiries arrive with the information needed to answer them – part numbers, manufacturer,
vehicle – instead of "hei, soitelkaa".

## 6. Information architecture
**Before:** Etusivu · Korjaus & Huolto · Commonrail · Tuotteet · Rahoitus · Yhteystiedot, with overlapping texts.
**Now:** Palvelut hub → Vianetsintä ja huolto / Suuttimet ja pumput / Common rail, plus Varaosat, Yritys,
Rahoitus, Yhteystiedot and a branded 404. Each service page has its own composition (work-order list,
printed spec matrix, capability sheet with a common rail principle diagram).
**Benefit:** customers find their job by what is broken, not by how the old menu was organised.

## 7. Company story
**Before:** one line: "perustettu v.1990 … Yrittäjinä toimii Markus Manninen ja Jani Rantanen".
**Now:** a sourced timeline (1990 Manninen & Ahlqvist Ay → 1994 Joen Diesel Oy → 2005 Jani → 2015
Markus → 2020 generational change) from the trade register and Yrittäjät.fi.
**Benefit:** 36 years and a second generation are the strongest trust signals a local workshop can have.

## 8. Search visibility (local SEO)
**Before:** no meta descriptions, no structured data, H1s like "Tuotteet", two public template posts.
**Now:** unique titles and descriptions per page, semantic headings, Finnish URLs, prerendered HTML for
every route, `AutoRepair` structured data (address, geo, hours, phones – verified facts only),
breadcrumbs, Open Graph image. The demo itself is `noindex` + robots `Disallow`; production indexing is
one environment variable (`ALLOW_INDEXING=true`) once the domain is connected.
**Benefit:** better chances for searches like "dieselkorjaamo Joensuu", "common rail suuttimet Joensuu",
"ruiskutuspumppu korjaus".

## 9. Trust and hygiene
**Before:** a hidden spam backlink ("123movies") from the map-embed generator on the contact page;
template posts "Artikkeli 2" and "Esimerkki 1" still public.
**Now:** no third-party embeds until the visitor asks (OpenStreetMap loads on click), no spam.
**Benefit:** protects the company's reputation and search ranking.

## 10. Mobile and accessibility
**Before:** desktop layout stacked on phones; reCAPTCHA badge over content.
**Now:** designed phone layouts (finder glasses turn sideways, large tap targets, full-screen menu with
both numbers), WCAG 2.1 AA checked with axe (0 violations on all pages, desktop and mobile), keyboard
navigation, visible focus, reduced-motion support, content readable without JavaScript.

## 11. Financing
**Before:** a Sortter iframe widget and a partner image button.
**Now:** two clear cards (consumers / businesses) with the published terms and the same partner links,
plus the honest note that the workshop itself does not grant credit.
