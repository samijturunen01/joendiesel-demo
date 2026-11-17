/**
 * serve-dist.mjs – serves dist/ the way GitHub Pages does, under the same sub-path.
 *   node scripts/serve-dist.mjs [port]      → http://localhost:4173/joendiesel-demo/
 * /foo → foo.html or foo/index.html; unknown paths → 404.html with status 404.
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.argv[2] ?? 4173);
const base = (process.env.VITE_BASE_PATH ?? '/joendiesel-demo/').replace(/\/?$/, '/');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
};

const isFile = (p) => existsSync(p) && statSync(p).isFile();

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (!pathname.startsWith(base) && pathname + '/' !== base) {
    res.writeHead(404).end('outside base');
    return;
  }
  pathname = pathname.slice(base.length - 1) || '/';
  const candidates = pathname.endsWith('/')
    ? [path.join(root, pathname, 'index.html')]
    : [path.join(root, pathname), path.join(root, `${pathname}.html`), path.join(root, pathname, 'index.html')];
  const file = candidates.find((c) => c.startsWith(root) && isFile(c));
  if (!file) {
    res.writeHead(404, { 'Content-Type': types['.html'] }).end(readFileSync(path.join(root, '404.html')));
    return;
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
}).listen(port, () => console.log(`dist → http://localhost:${port}${base}`));
