# my-automation

E2E test automation project sử dụng Playwright + TypeScript theo cấu trúc Page Object Model (POM).

## Setup

```bash
# 1. Cài dependencies
npm install

# 2. Copy file env và điền BASE_URL
cp .env.example .env
# Sửa .env: BASE_URL=https://dev.site.com
```

## Chạy test

| Lệnh | Mô tả |
|------|-------|
| `npm run test` | Chạy toàn bộ test (headless) |
| `npm run test:ui` | Mở UI mode để debug / viết test mới |
| `npm run test:headed` | Chạy với browser hiển thị |
| `npm run test:report` | Xem HTML report sau khi chạy |
| `npm run lint` | Kiểm tra lỗi ESLint |
| `npm run lint:fix` | Tự động sửa lỗi ESLint |
| `npm run format` | Format code với Prettier |

## Đổi môi trường

Chỉnh `.env` và bỏ comment dòng tương ứng:

```env
# BASE_URL=https://dev.site.com
BASE_URL=https://staging.site.com
# BASE_URL=https://site.com
```

Hoặc override trực tiếp qua PowerShell:

```powershell
$env:BASE_URL="https://staging.site.com"; npm run test
```

## Cấu trúc thư mục

```
tests/
├── pages/       # Page Objects — mỗi file = 1 trang/route
├── components/  # Component Objects — UI elements dùng lại
├── data/        # Test data (cặp .json + .ts)
├── fixtures/    # Custom Playwright fixtures
└── specs/       # Test files (.spec.ts)
```

Xem chi tiết quy tắc tại [CONVENTIONS.md](./CONVENTIONS.md).
