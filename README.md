# rv-rmm-playwright-qa-haihaimail

E2E test automation cho Haihai Mail (RMM) sử dụng Playwright + TypeScript theo cấu trúc Page Object Model (POM).

Có **2 bộ test chạy trên 2 môi trường riêng**:

| Bộ test | Project | Thư mục spec | File env |
|---------|---------|--------------|----------|
| Important test | `important` | `tests/specs/important/` | `.env.important` |
| All Function test | `all-function` | `tests/specs/all-function/` | `.env.all-function` |

POM (`pages/`, `components/`) và `fixtures/` **dùng chung** cho cả hai bộ. Môi trường, tài khoản và data tiền đề được **tách theo bộ test**.

## Setup

```bash
# 1. Cài dependencies
npm install

# 2. Điền BASE_URL cho từng môi trường
#    .env.important      → môi trường của Important test
#    .env.all-function   → môi trường của All Function test
```

3. Tạo data theo bộ test (file thật bị gitignore, chỉ commit file `*.example.json`):

```bash
cp tests/data/important/users.example.json         tests/data/important/users.json
cp tests/data/important/preconditions.example.json tests/data/important/preconditions.json
cp tests/data/all-function/users.example.json         tests/data/all-function/users.json
cp tests/data/all-function/preconditions.example.json tests/data/all-function/preconditions.json
```

## Chạy test

| Lệnh | Mô tả |
|------|-------|
| `npm run test:important` | Chạy Important test |
| `npm run test:all-function` | Chạy All Function test |
| `npm run test` | Chạy cả hai bộ |
| `npm run test:ui` | Mở UI mode để debug / viết test mới |
| `npm run test:headed` | Chạy với browser hiển thị |
| `npm run test:report` | Xem HTML report sau khi chạy |
| `npm run lint` | Kiểm tra lỗi ESLint |
| `npm run lint:fix` | Tự động sửa lỗi ESLint |
| `npm run format` | Format code với Prettier |

## Đổi môi trường

Sửa `BASE_URL` trong file env của bộ test tương ứng (`.env.important` hoặc `.env.all-function`). Mỗi project đọc file env riêng nên hai bộ không lẫn môi trường và có thể chạy song song.

## Cấu trúc thư mục

```
.env.important            # BASE_URL của Important test      (gitignore)
.env.all-function         # BASE_URL của All Function test   (gitignore)
.env.example              # mẫu
tests/
├── pages/                # Page Objects — dùng chung
├── components/           # Component Objects — dùng chung
├── fixtures/             # Custom Playwright fixtures — dùng chung
├── data/
│   ├── index.ts          # getUser(suite, role), getPreconditions(suite)
│   ├── important/        # users.json, preconditions.json (gitignore) + *.example.json
│   └── all-function/     # users.json, preconditions.json (gitignore) + *.example.json
└── specs/
    ├── important/        # Test files của Important test
    └── all-function/     # Test files của All Function test
```

Xem chi tiết quy tắc tại [CONVENTIONS.md](./CONVENTIONS.md).
