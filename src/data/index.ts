import * as fs from 'fs';
import * as path from 'path';

import type { Suite } from '@config/env';

export interface User {
  role: string;
  username: string;
  password: string;
}

/** Role the setup project logs in as. Other roles are read with `getUser` when a test needs them. */
export const DEFAULT_ROLE = 'admin';

/**
 * Reads `src/data/<suite>/<file>`. The real files are git-ignored; only `*.example.json` is
 * committed, so a missing file means "copy the example and fill it in".
 */
function loadJson<T>(suite: Suite, file: string): T {
  const filePath = path.join(__dirname, suite, file);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `src/data/${suite}/${file} not found. Copy ${file.replace('.json', '.example.json')} to ${file} and fill it in.`,
    );
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

/** Account with the given role in the suite's environment, for example `admin` or `user`. */
export function getUser(suite: Suite, role: string): User {
  const user = loadJson<User[]>(suite, 'users.json').find((candidate) => candidate.role === role);
  if (!user) {
    throw new Error(`No user with role "${role}" in src/data/${suite}/users.json.`);
  }
  if (!user.username || !user.password) {
    throw new Error(`User "${role}" in src/data/${suite}/users.json has an empty username or password.`);
  }
  return user;
}

/** Data that has to exist on the suite's environment before the tests run. */
export function getPreconditions<T = Record<string, unknown>>(suite: Suite): T {
  return loadJson<T>(suite, 'preconditions.json');
}
