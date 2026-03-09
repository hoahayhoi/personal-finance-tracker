---
inclusion: auto
keywords: ["implement", "code", "feature", "build", "tạo", "viết code"]
---

# Implement Feature Workflow

Workflow implement một feature Next.js theo chuẩn dự án Personal Finance Tracker.

## Bước 1: Đọc tài liệu liên quan

Trước khi viết code, đọc đầy đủ 3 file:

1. `docs/3-features/<tên_feature>.md` — Yêu cầu, User Stories, Screen spec, DoD
2. `docs/4-engineering/coding-conventions.md` — Quy ước code bắt buộc
3. `docs/2-design/system-architecture.md` — Folder structure, data flow

Nếu feature doc chưa tồn tại, hỏi người dùng trước khi tiếp tục.

## Bước 2: Kiểm tra tiến độ

Đọc `docs/5-tracking/progress.md`:
- Xác định phase và task cần làm
- Kiểm tra dependency đã hoàn thành chưa
- Nếu dependency chưa xong, thông báo người dùng

## Bước 3: Lập kế hoạch implement

Liệt kê rõ:
- Các file cần TẠO MỚI
- Các file cần CHỈNH SỬA
- Thứ tự implement (từ dependency thấp đến cao):
  1. Types & Schema (Prisma, Zod)
  2. Server Actions hoặc Route Handlers
  3. Server Components (pages)
  4. Client Components (forms, modals, dialogs)
  5. Layout / Navigation updates

Thông báo kế hoạch và chờ xác nhận nếu scope > 5 files.

## Bước 4: Implement theo thứ tự

### Server Actions (`src/actions/*.actions.ts`):
- Thêm `'use server'` ở đầu file
- Check auth bằng `getSession()` — LUÔN là bước đầu
- Validate input bằng Zod schema
- Wrap DB operation trong try/catch
- Gọi `revalidatePath()` sau mọi mutation
- Return `{ success: true }` hoặc `{ success: false; error: string }`

### Route Handlers (`app/api/**/*.ts`):
- Check auth — return 401 nếu chưa đăng nhập
- Validate query params / request body
- Return `NextResponse.json()` với status code rõ ràng
- Không để lộ stack trace trong error response

### Server Components (pages):
- Không có `'use client'`
- Fetch data trực tiếp trong component body (async/await)
- Truyền data xuống Client Component qua props
- Thêm `export const metadata` nếu là page

### Client Components:
- Thêm `'use client'` ở đầu file
- Nhận data từ props (không tự fetch bằng useEffect nếu có thể)
- Handle loading state và error state
- Gọi Server Action khi submit form, hiển thị toast qua `sonner`
- Dùng shadcn/ui components — không tự build

### Zustand Store (`src/stores/*.ts`):
- Chỉ dùng cho UI state: modal open/close, sidebar, theme
- Filter/pagination → dùng URL state (nuqs) thay vì store

## Bước 5: Kiểm tra Coding Conventions

Sau khi viết xong mỗi file, tự kiểm tra:

- [ ] Không có `any` trong TypeScript
- [ ] Naming đúng chuẩn (PascalCase component, camelCase function)
- [ ] File đặt đúng folder theo system-architecture.md
- [ ] Prisma dùng singleton từ `@/lib/db`
- [ ] Số tiền dùng `formatCurrency()` từ `@/lib/utils`
- [ ] Tailwind dùng `cn()` khi merge class có điều kiện
- [ ] Auth check có trong mọi Server Action và Route Handler
- [ ] Dùng shadcn/ui components trước khi tự viết
- [ ] State đúng loại: filter → URL state, UI state → Zustand

## Bước 6: Kiểm tra Definition of Done

Đọc lại phần DoD trong `docs/3-features/<tên_feature>.md`.
Liệt kê từng item DoD và xác nhận:

```
DoD Checklist:
✅ [x] Item đã implement
⚠️ [ ] Item chưa implement — lý do: ...
```

Nếu có item chưa implement, giải thích lý do và hỏi người dùng.

## Bước 7: Cập nhật Progress Tracker

Sau khi implement xong, cập nhật `docs/5-tracking/progress.md`:

1. Đổi `[ ]` → `[x]` cho task đã hoàn thành
2. Cập nhật số liệu trong bảng tổng tiến độ
3. Thêm entry vào Changelog:
   ```
   | YYYY-MM-DD | ✅ Code | Implement [Feature Name] — mô tả ngắn |
   ```
4. Nếu có quyết định kỹ thuật đáng ghi lại, thêm vào Technical Notes

## Bước 8: Báo cáo kết quả

Tổng kết với người dùng:
- Các file đã tạo/sửa
- DoD items đã đáp ứng
- Điểm nào cần test thủ công
- Gợi ý bước tiếp theo trong Progress Tracker
