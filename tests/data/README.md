# tests/data

Chứa test data theo mô hình **cặp `.json` + `.ts`**:
- `.json` — raw data, không có logic
- `.ts` — định nghĩa type, export helper functions

## Cấu trúc

```
data/
├── users.json     # raw data
├── users.ts       # User interface + getAdminUser(), getUserByRole()
├── products.json
└── products.ts
```

## Cách thêm data mới

1. Tạo `<entity>.json` — chỉ chứa data thuần:
```json
[
  { "id": 1, "name": "Item A", "type": "primary" }
]
```

2. Tạo `<entity>.ts` — định nghĩa type và helper:
```typescript
import data from './<entity>.json';

export interface Entity {
  id: number;
  name: string;
  type: 'primary' | 'secondary';
}

export const entities: Entity[] = data;

export const getEntityById = (id: number): Entity => {
  const item = entities.find((e) => e.id === id);
  if (!item) throw new Error(`Entity with id "${id}" not found`);
  return item;
};
```

3. Import trong spec từ `.ts`, không từ `.json` trực tiếp:
```typescript
import { getEntityById } from '../data/<entity>';
```

## Lưu ý

- Không dùng non-null assertion `!` — throw Error với message rõ ràng
- Không index trực tiếp `data[0]` trong spec — luôn dùng helper
- Dữ liệu nhạy cảm (password thật) nên để trong `.env`, không trong JSON
