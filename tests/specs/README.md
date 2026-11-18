# tests/specs

Chứa các **test file** (`.spec.ts`) — nơi viết test cases theo cấu trúc `describe`/`test`.

## Cấu trúc

```typescript
import { test, expect } from '../fixtures';   // luôn từ fixtures, không từ @playwright/test
import { getAdminUser } from '../data/users';

test.describe('Login Page', () => {
  test('should login successfully with valid credentials', async ({ loginPage }) => {
    const admin = getAdminUser();
    await loginPage.goto();
    await loginPage.fillUsername(admin.username);
    await loginPage.fillPassword(admin.password);
    await loginPage.clickLoginButton();
    await expect(loginPage.page).toHaveURL('/dashboard');  // assert trong spec
  });
});
```

## Quy tắc

1. **Import `test` từ `../fixtures`** — không từ `@playwright/test`:
   ```typescript
   import { test, expect } from '../fixtures';  // ✅
   import { test } from '@playwright/test';     // ❌
   ```

2. **Không `new Page()` trong spec** — inject từ fixture:
   ```typescript
   test('...', async ({ loginPage }) => { ... });  // ✅
   ```

3. **Không dùng `loginPage.page` trực tiếp** — gọi method của Page Object:
   ```typescript
   await homePage.expectTitle(/My App/);            // ✅
   await expect(homePage.page).toHaveTitle(...);    // ❌
   ```

4. **Mỗi test phải độc lập** — không share state, không phụ thuộc thứ tự

5. **Naming**: `kebab-case` + `.spec.ts`, `test` bắt đầu bằng `should`

## Cấu trúc file

```
specs/
├── home.spec.ts
├── login.spec.ts
└── user-management.spec.ts
```
