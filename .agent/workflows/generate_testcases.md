---
description: Workflow tạo test case checklist đầy đủ cho một feature, đọc từ cấu trúc docs hiện tại
---

# Generate Test Cases Workflow

Workflow này hướng dẫn agent (đóng vai QA Tester) đọc docs và sinh ra file
test case checklist hoàn chỉnh cho một feature cụ thể.

// turbo-all

## Bước 1: Xác định feature cần test

Nếu người dùng chưa chỉ rõ feature, liệt kê các feature có sẵn và hỏi:

```
Các feature hiện có trong docs/3-features/:
- auth          → Authentication (đăng ký, đăng nhập)
- dashboard     → Dashboard (tổng quan tài chính)
- transactions  → Transactions (CRUD giao dịch)
- categories    → Categories (danh mục)
- profile       → Profile (hồ sơ cá nhân)
- landing-page  → Landing Page

Bạn muốn tạo test case cho feature nào?
```

## Bước 2: Đọc tài liệu nguồn (đọc song song 4 file)

Đọc đầy đủ các file sau:

1. **`docs/3-features/<feature>.md`** — nguồn chính
   - Acceptance Criteria của từng User Story
   - UI/Screen specification
   - Logic Flow
   - Definition of Done (DoD)

2. **`docs/1-product/functional-requirements.md`**
   - ID tính năng (FR-xxx), mô tả, priority

3. **`docs/2-design/api-design.md`**
   - Endpoints liên quan đến feature
   - Request/response format
   - Error codes

4. **`docs/2-design/screens.md`**
   - Navigation flow
   - Components của màn hình
   - Auth requirement (Public / Protected)

## Bước 3: Phân tích và mapping

Trước khi viết test case, lập bảng mapping:

```
Feature: [Tên]

Acceptance Criteria cần cover:
- AC-1: Given... When... Then... → sẽ tạo HP-01, NEG-01
- AC-2: Given... When... Then... → sẽ tạo HP-02, NEG-02

API Endpoints cần test:
- GET /api/...  → API-01
- POST /api/... → API-02, API-03 (valid + invalid)

Screens cần test:
- /route → UI-01 (loading), UI-02 (empty), UI-03 (responsive)
```

## Bước 4: Sinh test case theo 6 loại

Sinh test case đầy đủ theo thứ tự:

### Thứ tự sinh:
1. **Happy Path** — từ Acceptance Criteria "Given điều kiện đúng"
2. **Negative Tests** — từng field validation + conflict cases
3. **Auth Tests** — kiểm tra Protected routes, data isolation
4. **UI/UX Tests** — loading, empty, feedback, responsive
5. **API Tests** — từng endpoint trong api-design.md
6. **Performance** — cơ bản theo NFR

### Quy tắc ID:
```
HP-XX   → Happy Path
NEG-XX  → Negative
AUTH-XX → Authentication/Authorization
UI-XX   → UI/UX
API-XX  → API
PERF-XX → Performance
```

## Bước 5: Tạo file test case

Tạo file tại: **`docs/5-tracking/testcases-<feature>.md`**

Dùng template chuẩn từ skill `qa_tester`:

```markdown
# Test Cases: [Tên Feature]

> **Nguồn:** docs/3-features/<feature>.md
> **Ngày tạo:** YYYY-MM-DD
> **Feature ID:** FT-XXX

---

## Tóm tắt

| Loại | Số lượng |
|---|---|
| 🟢 Happy Path | X |
| 🔴 Negative | X |
| 🟡 Auth | X |
| 🟡 UI/UX | X |
| 🔵 API | X |
| ⚡ Performance | X |
| **Tổng** | **X** |

---

[6 sections test case đầy đủ]

---

## Definition of Done — Re-check

- [ ] DoD item 1 (copy từ feature doc)
- [ ] DoD item 2
```

## Bước 6: Cập nhật index test cases

Cập nhật hoặc tạo file **`docs/5-tracking/testcases-index.md`**:

```markdown
# Test Cases Index

| Feature | File | Tổng TC | Ngày tạo | Status |
|---|---|---|---|---|
| Authentication | [testcases-auth.md](./testcases-auth.md) | XX | YYYY-MM-DD | ⬜ Pending |
| Dashboard | [testcases-dashboard.md](./testcases-dashboard.md) | XX | YYYY-MM-DD | ⬜ Pending |
```

Status options: `⬜ Pending` | `🔄 In Progress` | `✅ Done` | `❌ Failed`

## Bước 7: Báo cáo cho người dùng

Tóm tắt output:
- File đã tạo: `docs/5-tracking/testcases-<feature>.md`
- Tổng số test case theo từng loại
- Highlight các test case có risk cao (auth, data isolation)
- Gợi ý: test case nào nên chạy thủ công, test case nào có thể tự động hóa sau
