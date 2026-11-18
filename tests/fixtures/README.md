# tests/fixtures

Chứa custom Playwright fixtures — nơi khởi tạo và inject Page Objects, Components vào test.

## Tại sao dùng fixtures?

- Không cần `new LoginPage(page)` thủ công trong mỗi test
- Page Objects được khởi tạo tự động, sẵn sàng dùng qua destructuring
- Dễ quản lý lifecycle (setup/teardown) cho toàn bộ test suite

## Cấu trúc

```typescript
import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { Header } from '../components/Header';

type Fixtures = {
  homePage: HomePage;
  header: Header;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
});

export { expect } from '@playwright/test';
```

## Cách thêm fixture mới

1. Import class mới (Page hoặc Component)
2. Thêm vào type `Fixtures`
3. Thêm vào `base.extend()`
4. Trong spec: thêm tên fixture vào destructuring

```typescript
// Thêm vào index.ts
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPage;  // ← thêm
  header: Header;
};

export const test = base.extend<Fixtures>({
  // ...
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

// Dùng trong spec
test('...', async ({ loginPage }) => { ... });
```

## Lưu ý

- Mọi spec file phải `import { test, expect } from '../../fixtures'` (spec nằm trong `specs/important/` hoặc `specs/all-function/`)
- `expect` cũng được re-export từ đây để tiện dùng
- Fixture `suite` (`'important'` | `'all-function'`) do `use.suite` của từng project trong `playwright.config.ts` set; dùng để lấy đúng data: `getUser(suite, 'admin')`
