import { defineConfig, devices } from "@playwright/test";

/*
 * End-to-end checks of the key flows (sign in, stake, withdraw, swap) and of phone layouts. Runs against a dev
 * server on :3001 (the usual dev port), reused if already running, started otherwise. `npm run test:e2e`.
 */
const PORT = Number(process.env.E2E_PORT ?? 3001);

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
