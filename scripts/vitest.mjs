/**
 * vitest.mjs – starts Vitest from a normalised working directory.
 *
 * On Windows a terminal opened in "c:\…" (lower-case drive letter) makes Vitest load its own
 * module once as c:\… and once as C:\… ("Cannot read properties of undefined (reading 'config')").
 * Spawning it with an upper-case cwd avoids that. Elsewhere this is a plain pass-through.
 *   node scripts/vitest.mjs run      (npm test)
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const normalize = (p) => p.replace(/^[a-z](?=:)/, (d) => d.toUpperCase());
const root = normalize(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const require = createRequire(path.join(root, 'package.json'));
const bin = path.join(path.dirname(require.resolve('vitest/package.json')), 'vitest.mjs');

const child = spawn(process.execPath, [bin, ...process.argv.slice(2)], { cwd: root, stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 1));
