import * as fs from 'fs';
import * as path from 'path';

import { parse } from 'dotenv';

/**
 * The two suites run against two different environments, so nothing here reads `process.env`:
 * each suite has its own `.env.<suite>` file, parsed on demand. Parsing instead of loading keeps
 * the two environments from leaking into each other inside one Playwright process.
 */
export const SUITES = ['important', 'all-function'] as const;
export type Suite = (typeof SUITES)[number];

const ROOT = path.resolve(__dirname, '..', '..');

/** Session file written by `tests/setup/auth.setup.ts`, one per suite because the tenants differ. */
export function storageStateOf(suite: Suite): string {
  return `playwright/.auth/${suite}.json`;
}

/**
 * Base URL of the suite's tenant, with a trailing slash so relative navigation resolves under
 * the tenant path: `https://<host>/<tenant>/`.
 *
 * Returns `undefined` rather than throwing when the file or the value is missing. This is read by
 * `playwright.config.ts`, and a throw there would stop every project, including ones that never
 * touch the tenant. A test that needs the tenant fails at its first navigation instead; the setup
 * project checks it explicitly so the message says what to do.
 */
export function baseUrlOf(suite: Suite): string | undefined {
  const file = path.join(ROOT, `.env.${suite}`);
  if (!fs.existsSync(file)) {
    return undefined;
  }
  const value = parse(fs.readFileSync(file))['BASE_URL']?.trim();
  if (!value) {
    return undefined;
  }
  return value.endsWith('/') ? value : `${value}/`;
}

/** Same lookup as `baseUrlOf`, but fails with a message that says which file to fill in. */
export function requireBaseUrl(suite: Suite): string {
  const url = baseUrlOf(suite);
  if (!url) {
    throw new Error(
      `BASE_URL is not set for suite "${suite}". Fill it in .env.${suite} ` +
        '(for example https://<host>/<tenant>/) — see .env.example.',
    );
  }
  return url;
}

/**
 * The app routes through a front controller — `index.php?action=<X>` — rather than by path.
 * Jumping straight to an action is cheaper and far less brittle than clicking down menus.
 *
 * Relative on purpose: it resolves against the project's `baseURL`, so page objects never need to
 * know which suite they are running in.
 */
export function actionUrl(action: string, params: Record<string, string | number> = {}): string {
  const query = new URLSearchParams({ action });
  for (const [key, value] of Object.entries(params)) {
    query.set(key, String(value));
  }
  return `index.php?${query.toString()}`;
}
