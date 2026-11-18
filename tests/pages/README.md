# tests/pages

Chứa **Page Object** — mỗi file đại diện cho một trang/route cụ thể của ứng dụng.

## Chức năng

- Bọc các locator và action của một trang vào một class
- Ẩn chi tiết DOM/selector khỏi spec file
- Tái sử dụng logic UI giữa nhiều test

## Cấu trúc

```
pages/
├── BasePage.ts     # Abstract class — chứa navigate(), expectTitle(), getTitle()
├── LoginPage.ts    # Trang login
├── HomePage.ts     # Trang chủ
└── ...
```

## Cách tạo Page mới

1. Tạo file `<TenPage>Page.ts`
2. Extends `BasePage`
3. Khai báo locators ở đầu class
4. Override `goto()` với route cụ thể
5. Thêm fixture vào `tests/fixtures/index.ts`

```typescript
import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator = this.page.getByLabel('Username');
  readonly passwordInput: Locator = this.page.getByLabel('Password');
  readonly loginButton: Locator = this.page.getByRole('button', { name: 'Login' });
  readonly errorMessage: Locator = this.page.getByRole('alert');

  async goto(): Promise<void> {
    await this.navigate('/login');
  }

  async fillUsername(value: string): Promise<void> {
    await this.usernameInput.fill(value);
  }

  async fillPassword(value: string): Promise<void> {
    await this.passwordInput.fill(value);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async isLoggedIn(): Promise<boolean> {
    return this.page.url().includes('/dashboard');
  }
}
```

## Lưu ý

- `navigate(path)` là `protected` — chỉ dùng bên trong subclass
- `goto()` là `public`, không nhận tham số
- Không assert business logic trong Page Object
- Locator dùng `camelCase`: `loginButton`, `usernameInput`
