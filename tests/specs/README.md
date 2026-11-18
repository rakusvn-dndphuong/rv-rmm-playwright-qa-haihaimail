# tests/specs

Chứa các **test file** (`.spec.ts`), chia thành 2 bộ test theo môi trường:

```
specs/
├── important/        # Important test   → project `important`,    env .env.important
│   └── *.spec.ts
└── all-function/     # All Function test → project `all-function`, env .env.all-function
    └── *.spec.ts
```

Chạy bằng `npm run test:important` hoặc `npm run test:all-function`.

## Cấu trúc spec

```typescript
import { test, expect } from '../../fixtures';   // luôn từ fixtures, không từ @playwright/test
import { getUser } from '../../data';

test.describe('Login Page', () => {
  test('should login successfully with valid credentials', async ({ suite, loginPage }) => {
    const admin = getUser(suite, 'admin');
    await loginPage.goto();
    await loginPage.fillUsername(admin.username);
    await loginPage.fillPassword(admin.password);
    await loginPage.clickLoginButton();
    await expect(loginPage.page).toHaveURL('/dashboard');  // assert trong spec
  });
});
```

## Quy tắc

1. **Import `test` từ `../../fixtures`** — không từ `@playwright/test`:
   ```typescript
   import { test, expect } from '../../fixtures';  // ✅
   import { test } from '@playwright/test';        // ❌
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

6. **Spec đặt đúng thư mục bộ test** — môi trường, tài khoản và data tiền đề của hai bộ khác nhau. Không hardcode URL hay tài khoản; dùng `getUser(suite, role)` và `getPreconditions(suite)`.

7. **Không import spec này từ spec kia** — nếu cần dùng chung logic, đưa vào Page Object hoặc helper.
