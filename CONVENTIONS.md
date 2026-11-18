# Naming Conventions

## Files & Classes

| Loại | Format | Ví dụ |
|------|--------|-------|
| Page Object | `PascalCase` + `Page.ts` | `LoginPage.ts`, `DashboardPage.ts` |
| Component | `PascalCase` + `.ts` | `Header.ts`, `LoginModal.ts` |
| Spec/Test | `kebab-case` + `.spec.ts`, đặt trong `specs/<suite>/` | `login.spec.ts`, `user-management.spec.ts` |
| Test data (raw, theo bộ test) | `camelCase` + `.json`, đặt trong `data/<suite>/` | `data/important/users.json`, `data/all-function/preconditions.json` |
| Test data mẫu | `<tên>.example.json` (commit), file thật gitignore | `users.example.json` |
| Test data (logic) | helper trong `data/index.ts` | `getUser(suite, role)` |
| Env | `.env.<suite>` | `.env.important`, `.env.all-function` |
| Fixtures | `index.ts` | `tests/fixtures/index.ts` |

## Bộ test (suite)

Có 2 bộ test chạy trên 2 môi trường khác nhau, tương ứng 2 project Playwright:

| Suite | Thư mục spec | Env |
|-------|--------------|-----|
| `important` | `tests/specs/important/` | `.env.important` |
| `all-function` | `tests/specs/all-function/` | `.env.all-function` |

- Pages, Components, Fixtures **dùng chung** cho cả hai bộ
- Môi trường (`BASE_URL`), tài khoản (`users.json`) và data tiền đề (`preconditions.json`) **tách theo bộ**
- Không hardcode URL, tài khoản trong spec — dùng `baseURL` của project và `getUser(suite, role)`
- Spec chỉ được nằm trong thư mục của bộ mình, không import spec bộ khác
- `.env.*`, `users.json`, `preconditions.json` thật **không commit**; chỉ commit `.env.example` và `*.example.json`

## Locators

Dùng `camelCase`, tên = **đối tượng + loại element**:

```typescript
// ✅ Đúng
usernameInput
passwordInput
loginButton
errorMessage
userDropdown

// ❌ Sai
btnLogin       // prefix type trước noun
txt_error      // snake_case
Username       // PascalCase
```

## Methods

```typescript
// Actions — động từ + danh từ
fillUsername(value: string)
clickLoginButton()
selectRole(role: string)

// Getters
getErrorMessage()
getTitle()

// Navigation
// BasePage: protected navigate(path: string) — nội bộ
// Page subclass: async goto() — public, không cần param
await loginPage.goto();

// Predicates — trả boolean, KHÔNG assert
isLoggedIn(): Promise<boolean>
isModalVisible(): Promise<boolean>
```

## Assertions

- **Page Object** chỉ được chứa **generic assertion helpers** (ẩn implementation detail):
  ```typescript
  await homePage.expectTitle(/My App/);  // ✅ generic
  ```
- **Business assertions** phải nằm trong **spec file**:
  ```typescript
  await expect(page).toHaveURL('/dashboard');  // ✅ trong spec
  await loginPage.expectLoginSuccess();        // ❌ business assertion trong Page Object
  ```

## Test blocks

```typescript
test.describe('Login Page', () => {
  test('should login successfully with valid credentials', ...)
  test('should show error with invalid password', ...)
})
```

- `describe`: tên trang/tính năng
- `test`: bắt đầu bằng `should`, mô tả hành vi mong đợi

## Quy tắc bắt buộc

1. **Không `new Page()` trong spec** — luôn dùng fixture:
   ```typescript
   // ✅
   test('...', async ({ loginPage }) => { ... });
   // ❌
   test('...', async ({ page }) => { const loginPage = new LoginPage(page); });
   ```

2. **Không dùng `.page` trực tiếp trong spec** — luôn qua method của Page Object:
   ```typescript
   await homePage.expectTitle(/My App/);        // ✅
   await expect(homePage.page).toHaveTitle(...); // ❌
   ```

3. **Test phải độc lập** (`fullyParallel: true`) — không share state, không phụ thuộc thứ tự chạy.

4. **Data helper** — không index trực tiếp, dùng helper function:
   ```typescript
   const admin = getUser(suite, 'admin');   // ✅
   const admin = users[0];                  // ❌
   ```

5. **Import `test` từ fixtures**, không từ `@playwright/test`:
   ```typescript
   import { test, expect } from '../../fixtures';  // ✅ (spec nằm trong specs/<suite>/)
   import { test } from '@playwright/test';        // ❌ trong spec
   ```
