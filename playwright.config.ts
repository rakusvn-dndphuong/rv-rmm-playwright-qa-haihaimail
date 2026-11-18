import { defineConfig, devices } from '@playwright/test';

import { baseUrlOf, storageStateOf } from './src/config/env';
import type { TestOptions } from './src/fixtures/options';

// Computed once in the main process and passed down through `use`, so every worker in a run
// shares the same data prefix.
const runId = process.env.E2E_RUN_ID ?? new Date().toISOString().replace(/\D/g, '').slice(0, 14);

export default defineConfig<TestOptions>({
  testDir: './tests',
  outputDir: './test-results',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  // One worker, and the reason is the app rather than the tests: every project shares one tenant
  // session, and the app keeps its double-submit token in that session. Concurrent tabs overwrite
  // each other's token, so posts start coming back as the login screen. The two suites point at
  // different environments, so run them in separate terminals if you want them side by side.
  workers: 1,

  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],

  use: {
    runId,

    // The test hosts serve self-signed certificates. Without this every navigation dies with
    // ERR_CERT_AUTHORITY_INVALID.
    ignoreHTTPSErrors: true,

    // The app runs in Japanese here, and delivery scheduling is computed in JST.
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Playwright defaults both of these to 0, meaning wait forever. Finite ceilings make a hung
    // app fail at the action that caused it instead of burning the full test timeout.
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // ── Important test ───────────────────────────────────────────────
    {
      name: 'setup-important',
      testDir: './tests/setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], suite: 'important', baseURL: baseUrlOf('important') },
    },
    {
      name: 'important',
      testDir: './tests/important',
      use: {
        ...devices['Desktop Chrome'],
        suite: 'important',
        baseURL: baseUrlOf('important'),
        storageState: storageStateOf('important'),
      },
      dependencies: ['setup-important'],
    },

    // ── All Function test ────────────────────────────────────────────
    {
      name: 'setup-all-function',
      testDir: './tests/setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], suite: 'all-function', baseURL: baseUrlOf('all-function') },
    },
    {
      name: 'all-function',
      testDir: './tests/all-function',
      use: {
        ...devices['Desktop Chrome'],
        suite: 'all-function',
        baseURL: baseUrlOf('all-function'),
        storageState: storageStateOf('all-function'),
      },
      dependencies: ['setup-all-function'],
    },
  ],
});
