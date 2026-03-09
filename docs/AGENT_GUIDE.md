# AGENT GUIDE — Personal Finance Tracker

> **Dành cho:** AI Agent (không phải tài liệu sản phẩm)
> **Mục đích:** Hướng dẫn agent biết đọc và cập nhật đúng file, đúng lúc

---

## ⚡ Quick Lookup — Đọc ngay, không cần đọc phần còn lại

> Tra bảng → biết đúng file cần đọc → dừng lại, không đọc thêm.

| Tôi cần... | CHỈ đọc file này |
|---|---|
| Implement feature **auth** | `docs/3-features/auth.md` |
| Implement feature **dashboard** | `docs/3-features/dashboard.md` |
| Implement feature **transactions** | `docs/3-features/transactions.md` |
| Implement feature **categories** | `docs/3-features/categories.md` |
| Implement feature **profile** | `docs/3-features/profile.md` |
| Implement **landing page** | `docs/3-features/landing-page.md` |
| Viết bất kỳ đoạn code nào | `docs/4-engineering/coding-conventions.md` |
| Xem tiến độ / update progress | `docs/5-tracking/progress.md` |
| Tạo / xem test case | `docs/5-tracking/testcases-<feature>.md` |
| Hiểu folder structure, data flow | `docs/2-design/system-architecture.md` |
| Hiểu data model / Prisma schema | `docs/2-design/data-model.md` |
| Hiểu API endpoints | `docs/2-design/api-design.md` |
| Cần requirements / acceptance criteria | `docs/1-product/functional-requirements.md` |
| Setup môi trường dev | `docs/4-engineering/environment-setup.md` |
| Deploy lên Vercel | `docs/4-engineering/deployment.md` |

---


## Nguyên tắc đọc docs

**Luôn đọc theo thứ tự ưu tiên này:**

```
1. .agent/README.md           → Xem workflow/skill nào phù hợp với yêu cầu
2. .agent/workflows/<wf>.md   → Đọc quy trình cụ thể
3. docs/3-features/<f>.md     → Nguồn sự thật của feature (Acceptance Criteria, DoD)
4. docs/4-engineering/coding-conventions.md → Quy ước bắt buộc khi code
```

---

## Khi nào cập nhật file nào?

### Sau khi implement một feature

| Hành động | File cần update |
|---|---|
| Implement xong 1 task | `docs/5-tracking/progress.md` → đổi `[ ]` → `[x]` |
| Quyết định kỹ thuật quan trọng | `docs/5-tracking/progress.md` → thêm vào **Technical Notes** |
| Thay đổi Prisma schema | `docs/2-design/data-model.md` → cập nhật ERD + Prisma schema section |
| Thêm API endpoint mới | `docs/2-design/api-design.md` → thêm vào bảng Endpoints Overview + chi tiết |
| Thêm màn hình mới | `docs/2-design/screens.md` → thêm vào bảng danh sách |

### Sau khi tạo test case (`/generate_testcases`)

| Hành động | File cần update |
|---|---|
| Tạo test case cho feature | Tạo mới `docs/5-tracking/testcases-<feature>.md` |
| Cập nhật index | `docs/5-tracking/testcases-index.md` → thêm 1 dòng vào bảng |

### Sau khi BA analysis (`/ba_analysis`)

| Hành động | File cần tạo |
|---|---|
| Lần đầu setup | Tạo toàn bộ cấu trúc `docs/` (xem workflow) |
| Thêm feature mới | Tạo `docs/3-features/<feature>.md` |

---

## Map: Yêu cầu người dùng → Workflow/Skill → File docs liên quan

| Người dùng nói | Dùng | Đọc trước | Output |
|---|---|---|---|
| "phân tích dự án X" | `/ba_analysis` | — | Toàn bộ `docs/` |
| "implement feature Y" | `/implement_feature` | `3-features/Y.md`, `4-engineering/coding-conventions.md` | Code + update `5-tracking/progress.md` |
| "tạo test case cho Y" | `/generate_testcases` | `3-features/Y.md`, `1-product/functional-requirements.md`, `2-design/api-design.md`, `2-design/screens.md` | `5-tracking/testcases-Y.md` |
| "review code này" | `code_reviewer` skill | `4-engineering/coding-conventions.md` | Báo cáo review |
| "giải thích X" | `nextjs_mentor` skill | `2-design/system-architecture.md` | Giải thích 3-layer |
| "build UI component" | `ui_component_builder` skill | `4-engineering/coding-conventions.md` | Component code |
| "thiết kế schema" | `prisma_db_designer` skill | `2-design/data-model.md` | Schema + migration |

---

## Quy tắc cập nhật progress.md

```markdown
# Cú pháp đổi status:
[ ] → [x]  (hoàn thành)
[ ] → [/]  (đang làm — nếu chưa xong)

# Thêm vào Changelog:
| YYYY-MM-DD | [loại] | [mô tả ngắn] |

# Loại changelog:
📋 Docs    → thay đổi tài liệu
✅ Code    → implement feature/task
🐛 Fix     → sửa lỗi
🔼 Priority → thay đổi ưu tiên
⚙️ Config  → thay đổi cấu hình/setup
```

---

## Quy tắc KHÔNG làm

| ❌ KHÔNG | Lý do |
|---|---|
| Tạo file doc ngoài cấu trúc `1-product/`, `2-design/`, `3-features/`, `4-engineering/`, `5-tracking/` | Phá vỡ cấu trúc agent đọc được |
| Xóa file mà không thông báo người dùng | Mất tài liệu không khôi phục được |
| Cập nhật `2-design/` mà không đồng bộ `3-features/` tương ứng | Gây mâu thuẫn giữa design doc và feature spec |
| Để version số trong docs mâu thuẫn nhau | Ví dụ: `coding-conventions.md` ghi v4, `progress.md` ghi v5 → agent đọc sai |

---

## Trạng thái docs hiện tại (cập nhật lần cuối: 2026-03-09)

| Nhóm | Trạng thái | Ghi chú |
|---|---|---|
| `1-product/` | ✅ Hoàn chỉnh | 5 file đầy đủ |
| `2-design/` | ✅ Hoàn chỉnh | 4 file đầy đủ |
| `3-features/` | ✅ Documented | 6 feature docs |
| `4-engineering/` | ✅ Hoàn chỉnh | conventions + setup + deployment |
| `5-tracking/` | 🔄 Active | progress.md đang dùng, testcases chưa có |
