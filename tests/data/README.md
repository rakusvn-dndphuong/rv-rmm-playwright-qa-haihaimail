# tests/data

Chứa test data, **tách theo bộ test** vì Important test và All Function test chạy trên 2 môi trường khác nhau (tài khoản và data tiền đề khác nhau).

## Cấu trúc

```
data/
├── index.ts                         # getUser(suite, role), getPreconditions(suite)
├── important/
│   ├── users.example.json           # mẫu (commit)
│   ├── users.json                   # tài khoản thật (gitignore)
│   ├── preconditions.example.json   # mẫu (commit)
│   └── preconditions.json           # data tiền đề thật (gitignore)
└── all-function/                    # cấu trúc giống important/
```

## Tài khoản

`users.json` là mảng nhiều tài khoản, phân biệt bằng `role`:

```json
[
  { "role": "admin", "username": "...", "password": "..." },
  { "role": "user",  "username": "...", "password": "..." }
]
```

Dùng trong spec thông qua fixture `suite`:

```typescript
import { test } from '../../fixtures';
import { getUser } from '../../data';

test('should ...', async ({ suite, loginPage }) => {
  const admin = getUser(suite, 'admin');
  // ...
});
```

`suite` do project trong `playwright.config.ts` set (`important` hoặc `all-function`), nên cùng một đoạn code tự lấy đúng tài khoản của bộ đang chạy.

## Data tiền đề

`preconditions.json` chứa data cần có sẵn trên môi trường (ví dụ danh sách địa chỉ, mail có sẵn). Lấy bằng `getPreconditions<T>(suite)`. Nội dung tự định nghĩa theo từng bộ test.

## Lưu ý

- File thật (`users.json`, `preconditions.json`) bị gitignore — chỉ commit file `*.example.json`
- Thiếu file thì helper throw Error chỉ rõ file nào cần copy từ `*.example.json`
- Không dùng non-null assertion `!` — throw Error với message rõ ràng
- Không index trực tiếp `data[0]` trong spec — luôn dùng helper
- Import từ `../../data` (file `index.ts`), không đọc `.json` trực tiếp
