# tests/components

Chứa **Component Object** — các UI element dùng lại ở nhiều trang khác nhau.

## Chức năng

- Đại diện cho các UI phức tạp xuất hiện ở nhiều trang: navbar, modal, sidebar, date picker...
- Tránh lặp code locator giữa các Page Object

## Khi nào nên tách component?

Tách thành component khi:
- Element xuất hiện ở **2 trang trở lên** (Header, Footer, Modal...)
- Element có **logic phức tạp** riêng (DatePicker, SearchBar, Dropdown...)

Không cần tách nếu element chỉ dùng ở 1 trang duy nhất → đặt locator trong Page đó.

## Cấu trúc

```typescript
import { Locator, Page } from '@playwright/test';

export class Header {
  readonly navBar: Locator;
  readonly logoLink: Locator;

  constructor(private readonly page: Page) {
    this.navBar = page.getByRole('navigation');
    this.logoLink = page.getByRole('link', { name: /logo/i });
  }

  async clickLogo(): Promise<void> {
    await this.logoLink.click();
  }

  async isVisible(): Promise<boolean> {
    return this.navBar.isVisible();
  }
}
```

## Lưu ý

- Component **không** extends `BasePage` (vì không phải 1 trang)
- Nhận `Page` qua constructor
- Method: `isVisible()` trả boolean, không assert trực tiếp
- Đặt tên: `PascalCase` không cần suffix `Component`
