import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

/**
 * Windows: a shell started in "c:\…" (lower-case drive) and the "@" alias resolving to "C:\…" made
 * the bundler see the same files under two ids and bundle React twice. Normalise the drive letter
 * and pin `root` so every module id uses the same spelling, whatever the caller's cwd.
 */
const normalizeDrive = (p: string) => p.replace(/^[a-z](?=:)/, (d) => d.toUpperCase());
const fromRoot = (p: string) => normalizeDrive(fileURLToPath(new URL(p, import.meta.url)));

/**
 * Base path. GitHub Pages serves project sites from /<repository>/, so the demo
 * defaults to /joendiesel-demo/. Override with VITE_BASE_PATH=/ when the site is
 * eventually hosted at a domain root.
 */
const base = process.env.VITE_BASE_PATH ?? '/joendiesel-demo/';

if (process.platform === 'win32' && /^[a-z]:/.test(process.cwd())) process.chdir(normalizeDrive(process.cwd()));

export default defineConfig({
  root: fromRoot('.'),
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fromRoot('./src'),
    },
  },
  optimizeDeps: {
    // Pre-bundle in one pass so the dev server never serves two copies of React.
    include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-router', 'gsap', 'gsap/ScrollTrigger', '@gsap/react', 'lucide-react'],
  },
  build: {
    target: 'es2022',
    cssMinify: true,
    // No manual chunk splitting: splitting GSAP/@gsap/react away from React made the bundler
    // duplicate React's hooks into the motion chunk (two React copies → hydration crash).
  },
  ssr: {
    // Bundle these into the prerender build so Node does not have to resolve their ESM/CJS entry points.
    noExternal: ['gsap', '@gsap/react', 'lucide-react'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
