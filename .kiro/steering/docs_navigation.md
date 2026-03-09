---
inclusion: always
---

# Docs Navigation Guide

Hướng dẫn agent biết đọc và cập nhật đúng file docs, đúng lúc.

## Quick Lookup — Tra file cần đọc

| Tôi cần... | Đọc file này |
|---|---|
| Implement feature auth | `docs/3-features/auth.md` |
| Implement feature dashboard | `docs/3-features/dashboard.md` |
| Implement feature transactions | `docs/3-features/transactions.md` |
| Implement feature categories | `docs/3-features/categories.md` |
| Implement feature profile | `docs/3-features/profile.md` |
| Implement landing page | `docs/3-features/landing-page.md` |
| Viết bất kỳ code nào | `docs/4-engineering/coding-conventions.md` |
| Xem/update tiến độ | `docs/5-tracking/progress.md` |
| Tạo/xem test case | `docs/5-tracking/testcases-<feature>.md` |
| Hiểu folder structure | `docs/2-design/system-architecture.md` |
| Hiểu data model | `docs/2-design/data-model.md` |
| Hiểu API endpoints | `docs/2-design/api-design.md` |
| Requirements | `docs/1-product/functional-requirements.md` |
| Setup môi trường | `docs/4-engineering/environment-setup.md` |
| Deploy | `docs/4-engineering/deployment.md` |

## Thứ tự đọc docs

Luôn đọc theo thứ tự ưu tiên:

1. Workflow/skill phù hợp (trong `.kiro/steering/`)
2. Feature spec: `docs/3-features/<feature>.md` — nguồn sự thật
3. Coding conventions: `docs/4-engineering/coding-conventions.md` — quy ước bắt buộc
4. System architecture: `docs/2-design/system-architecture.md` — folder structure

## Khi nào cập nhật file nào

### Sau implement feature

| Hành động | File update |
|---|---|
| Implement xong task | `docs/5-tracking/progress.md` → `[ ]` → `[x]` |
| Quyết định kỹ thuật | `docs/5-tracking/progress.md` → Technical Notes |
| Thay đổi Prisma schema | `docs/2-design/data-model.md` → ERD + schema |
| Thêm API endpoint | `docs/2-design/api-design.md` → bảng + chi tiết |
| Thêm màn hình | `docs/2-design/screens.md` → bảng danh sách |

### Sau tạo test case

| Hành động | File update |
|---|---|
| Tạo test case | Tạo `docs/5-tracking/testcases-<feature>.md` |
| Cập nhật index | `docs/5-tracking/testcases-index.md` → thêm dòng |

### Sau BA analysis

| Hành động | File tạo |
|---|---|
| Lần đầu setup | Toàn bộ cấu trúc `docs/` |
| Thêm feature mới | `docs/3-features/<feature>.md` |

## Map: Yêu cầu → Workflow → Docs

| Người dùng nói | Workflow/Skill | Đọc trước | Output |
|---|---|---|---|
| "phân tích dự án" | ba_analysis_workflow | — | Toàn bộ docs/ |
| "implement feature" | implement_feature_workflow | 3-features/, coding-conventions | Code + progress |
| "tạo test case" | generate_testcases_workflow | 3-features/, api-design, screens | testcases-*.md |
| "review code" | code_reviewer | coding-conventions | Báo cáo review |
| "giải thích" | nextjs_mentor | system-architecture | Giải thích 3-layer |

## Quy tắc cập nhật progress.md

```markdown
# Status:
[ ] → [x]  (hoàn thành)
[ ] → [/]  (đang làm)

# Changelog:
| YYYY-MM-DD | [loại] | [mô tả] |

# Loại:
📋 Docs    → thay đổi tài liệu
✅ Code    → implement feature
🐛 Fix     → sửa lỗi
🔼 Priority → thay đổi ưu tiên
⚙️ Config  → thay đổi config
```

## Quy tắc KHÔNG làm

- ❌ Tạo file doc ngoài cấu trúc 1-5
- ❌ Xóa file không thông báo
- ❌ Cập nhật 2-design/ mà không đồng bộ 3-features/
- ❌ Để version số mâu thuẫn giữa các file

## Trạng thái docs hiện tại

| Nhóm | Trạng thái |
|---|---|
| 1-product/ | ✅ Hoàn chỉnh (5 files) |
| 2-design/ | ✅ Hoàn chỉnh (4 files) |
| 3-features/ | ✅ Documented (6 features) |
| 4-engineering/ | ✅ Hoàn chỉnh (3 files) |
| 5-tracking/ | 🔄 Active (progress.md) |
