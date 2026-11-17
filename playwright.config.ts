import { defineConfig } from '@playwright/test';

/**
 * Browser tests against the BUILT site (npm run build first), served exactly like GitHub Pages
 * under /joendiesel-demo/ by scripts/serve-dist.mjs. Uses the locally installed Chrome.
 */
const PORT = Number(process.env.E2E_PORT ?? 4183);

export default defineConfig({
  testDir: 'e2e',
  timeout: 45_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}/joendiesel-demo/`,
    channel: process.env.CI ? undefined : 'chrome',
    trace: 'off',
  },
  webServer: {
    command: `node scripts/serve-dist.mjs ${PORT}`,
    url: `http://localhost:${PORT}/joendiesel-demo/`,
    reuseExistingServer: true,
    timeout: 20_000,
  },
});
