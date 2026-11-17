/**
 * prerender.mjs – turns every route into static HTML after `vite build`.
 *
 *   npm run build   (= build:client → build:ssr → prerender)
 *
 * For each route in src/data/site.ts it renders the React tree to HTML and writes
 *   dist/<route>.html  and  dist/<route>/index.html
 * so GitHub Pages serves /yhteystiedot and /yhteystiedot/ directly (HTTP 200 for deep links,
 * content visible without JavaScript, page-specific <title>/description/Open Graph).
 * dist/404.html is the branded "page not found" – GitHub Pages serves it for unknown paths.
 *
 * Environment:
 *   SITE_URL        absolute origin + base, no trailing slash (Open Graph image URLs; canonical when indexing)
 *   ALLOW_INDEXING  "true" only on the company's own production domain. Default: noindex everywhere.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const SITE_URL = (process.env.SITE_URL ?? '').replace(/\/+$/, '');
const ALLOW_INDEXING = process.env.ALLOW_INDEXING === 'true';

const server = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const { render, pages, prerenderPaths, findPageByPath, company, baseUrl, servicePages } = server;

const template = readFileSync(path.join(dist, 'index.html'), 'utf8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const abs = (p) => (SITE_URL ? `${SITE_URL}${p}` : `${baseUrl}${p.replace(/^\//, '')}`);
const json = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

// Preload the variable fonts used above the fold (latin subsets) so the headline does not reflow.
const assetsDir = path.join(dist, 'assets');
const fontPreloads = readdirSync(assetsDir)
  .filter((f) => /^(saira-latin-standard-normal|martian-mono-latin-wght-normal)[-.].*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="${baseUrl}assets/${f}" as="font" type="font/woff2" crossorigin>`);

/** Only verified facts (docs/CONTENT_SOURCES.md). No ratings, prices or service areas. */
function businessData() {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: company.name,
    description: 'Diesellaitteiden erikoiskorjaamo Joensuussa: suuttimet, rivi- ja jakajapumput, common rail -kunnostus ja koepenkkitestaus sekä dieselmoottoreiden vianetsintä.',
    foundingDate: String(company.founded),
    telephone: company.phones.map((p) => p.e164),
    email: company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      postalCode: company.address.postalCode,
      addressLocality: company.address.city,
      addressCountry: company.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: company.geo.lat, longitude: company.geo.lon },
    openingHoursSpecification: company.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => dayNames[d - 1]),
      opens: h.opens,
      closes: h.closes,
    })),
    image: abs('/og-kuva.png'),
    logo: abs('/apple-touch-icon.png'),
    identifier: { '@type': 'PropertyValue', propertyID: 'Y-tunnus', value: company.businessId },
  };
  // The demo is not the company's official site: only claim a URL on the authorised domain.
  if (ALLOW_INDEXING && SITE_URL) data.url = `${SITE_URL}/`;
  return json(data);
}

function breadcrumbData(routePath) {
  const trail = [];
  if (routePath.startsWith(pages.services.path) && routePath !== pages.services.path) trail.push(pages.services);
  trail.push(findPageByPath(routePath));
  return json({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Etusivu', path: '/' }, ...trail.map((p) => ({ name: p.label, path: p.path }))].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path === '/' ? '/' : c.path),
    })),
  });
}

function head(page, routePath, { notFound = false } = {}) {
  const tags = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}">`,
    ALLOW_INDEXING && !notFound ? '<meta name="robots" content="index,follow">' : '<meta name="robots" content="noindex,nofollow">',
    `<meta property="og:type" content="website">`,
    `<meta property="og:locale" content="fi_FI">`,
    // Link previews of the demo must not pass for the official site.
    `<meta property="og:site_name" content="${esc(ALLOW_INDEXING ? company.name : `${company.name} – konseptidemo`)}">`,
    `<meta property="og:title" content="${esc(page.title)}">`,
    `<meta property="og:description" content="${esc(page.description)}">`,
    `<meta property="og:image" content="${esc(abs('/og-kuva.png'))}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="Joen Diesel Oy:n logo ja teksti: diesellaitteiden erikoiskorjaamo Joensuussa vuodesta 1990">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    ...fontPreloads,
  ];
  if (!notFound) tags.push(`<meta property="og:url" content="${esc(abs(routePath === '/' ? '/' : routePath))}">`);
  if (ALLOW_INDEXING && SITE_URL && !notFound) tags.push(`<link rel="canonical" href="${esc(abs(routePath === '/' ? '/' : routePath))}">`);
  if (!notFound && (routePath === pages.home.path || routePath === pages.contact.path)) tags.push(businessData());
  if (!notFound && routePath !== pages.home.path) tags.push(breadcrumbData(routePath));
  return tags.join('\n    ');
}

function write(file, html) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, html);
}

function build(routePath, { notFound = false } = {}) {
  const page = notFound ? pages.notFound : findPageByPath(routePath);
  const appHtml = render(notFound ? '/__404__' : routePath);
  return template.replace('<!--app-head-->', head(page, routePath, { notFound })).replace('<!--app-html-->', appHtml);
}

let count = 0;
for (const routePath of prerenderPaths) {
  const html = build(routePath);
  if (routePath === '/') {
    write(path.join(dist, 'index.html'), html);
  } else {
    const rel = routePath.replace(/^\//, '');
    write(path.join(dist, `${rel}.html`), html);
    write(path.join(dist, rel, 'index.html'), html);
  }
  count++;
}
write(path.join(dist, '404.html'), build('/404', { notFound: true }));

// Search engines: sitemap only on an authorised production domain; the demo disallows crawling.
if (ALLOW_INDEXING && SITE_URL) {
  const urls = prerenderPaths.map((p) => `  <url><loc>${esc(abs(p === '/' ? '/' : p))}</loc></url>`).join('\n');
  write(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  write(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
} else {
  write(path.join(dist, 'robots.txt'), `# Konseptidemo – ei indeksoida.\nUser-agent: *\nDisallow: /\n`);
}

if (existsSync(ssrDir)) rmSync(ssrDir, { recursive: true, force: true });

console.log(
  `prerender: ${count} routes + 404.html → dist/ (${ALLOW_INDEXING ? 'indexable' : 'noindex'}${SITE_URL ? `, ${SITE_URL}` : ''}); services: ${servicePages.length}`,
);
