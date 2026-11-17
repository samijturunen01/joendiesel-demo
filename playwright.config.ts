import { defineConfig } from '@playwright/test';

/**
 * Browser tests against the BUILT site (npm run build first), served exactly like GitHub Pages
 * under /joendiesel-demo/ by scripts/serve-dist.mjs. Uses the locally installed Chrome.
 */
const PORT = Number(process.env.E2E_PORT ?? 4183);
/** Set E2E_BASE_URL (e.g. the live GitHub Pages URL, with trailing slash) to test a deployed site instead. */
const REMOTE = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: 'e2e',
  timeout: 45_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: REMOTE ?? `http://localhost:${PORT}/joendiesel-demo/`,
    channel: process.env.CI ? undefined : 'chrome',
    trace: 'off',
  },
  webServer: REMOTE
    ? undefined
    : {
        command: `node scripts/serve-dist.mjs ${PORT}`,
        url: `http://localhost:${PORT}/joendiesel-demo/`,
        reuseExistingServer: true,
        timeout: 20_000,
      },
});
