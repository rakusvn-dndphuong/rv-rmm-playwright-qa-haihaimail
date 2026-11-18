import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

type Suite = 'important' | 'all-function';

/** Đọc .env.<suite> của từng bộ test (không ghi đè process.env để 2 bộ không lẫn nhau). */
const loadEnv = (suite: Suite): Record<string, string> => {
  const file = path.resolve(__dirname, `.env.${suite}`);
  return fs.existsSync(file) ? dotenv.parse(fs.readFileSync(file)) : {};
};

const env = {
  important: loadEnv('important'),
  'all-function': loadEnv('all-function'),
};

export default defineConfig<{ suite: Suite }>({
  fullyParallel: true,
  timeout: 60_000,
  expect: {
    timeout: 5_000,
  },
  retries: process.env.CI ? 1 : 0,
  reporter: [['html'], ['list']],
  use: {
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'important',
      testDir: './tests/specs/important',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.important.BASE_URL,
        suite: 'important',
      },
    },
    {
      name: 'all-function',
      testDir: './tests/specs/all-function',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env['all-function'].BASE_URL,
        suite: 'all-function',
      },
    },
  ],
});
