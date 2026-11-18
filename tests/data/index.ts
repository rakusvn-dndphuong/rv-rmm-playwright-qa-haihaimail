import * as fs from 'fs';
import * as path from 'path';

export type Suite = 'important' | 'all-function';

export interface User {
  role: string;
  username: string;
  password: string;
}

/**
 * Đọc dữ liệu của đúng bộ test: tests/data/<suite>/<file>.json
 * File thật (users.json) bị gitignore — copy từ users.example.json rồi điền giá trị.
 */
const loadJson = <T>(suite: Suite, file: string): T => {
  const filePath = path.join(__dirname, suite, file);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `${path.relative(process.cwd(), filePath)} not found. Copy ${file.replace('.json', '.example.json')} → ${file} and fill in your values.`,
    );
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
};

/** Lấy tài khoản theo role (vd: 'admin', 'user') của bộ test hiện tại. */
export const getUser = (suite: Suite, role: string): User => {
  const user = loadJson<User[]>(suite, 'users.json').find((u) => u.role === role);
  if (!user) throw new Error(`User with role "${role}" not found in data/${suite}/users.json`);
  return user;
};

/** Lấy data tiền đề (precondition) của bộ test hiện tại. */
export const getPreconditions = <T = Record<string, unknown>>(suite: Suite): T =>
  loadJson<T>(suite, 'preconditions.json');
