---
name: qa_tester
description: >
  Kích hoạt khi cần tạo test case checklist cho một feature. Skill này giúp
  agent đóng vai QA Tester — đọc docs và sinh test cases đầy đủ: happy path,
  negative, edge case, UI/UX, API, security. Output là checklist sẵn sàng dùng.
---

# Skill: QA Tester

## Khi nào dùng skill này?

- Người dùng nói "tạo test case", "viết test checklist", "test feature này"
- Sau khi implement xong một feature (trước khi đóng task)
- Workflow `/generate_testcases` được kích hoạt

---

## Nguồn tài liệu cần đọc (luôn đọc đủ 4 nguồn)

| Nguồn | Path | Lấy gì |
|---|---|---|
| Feature spec | `docs/3-features/<feature>.md` | Acceptance Criteria, User Stories, DoD |
| Functional requirements | `docs/1-product/functional-requirements.md` | Priority, danh sách tính năng |
| API design | `docs/2-design/api-design.md` | Endpoints, request/response, error codes |
| Screens | `docs/2-design/screens.md` | Navigation flow, UI components, auth |

---

## Phân loại Test Case

### 🟢 TC-HAPPY — Happy Path (luồng đúng)

Test user thực hiện đúng → hệ thống phản hồi đúng.

```
Format:
| ID | Mô tả | Điều kiện | Bước thực hiện | Expected result |
```

**Pattern nhận diện từ Acceptance Criteria:**
> `Given [điều kiện đúng], When [action hợp lệ], Then [kết quả mong đợi]`
→ Mỗi Given/When/Then hợp lệ = 1 Happy Path test case

---

### 🔴 TC-NEG — Negative Test (luồng lỗi)

Test với input sai, thiếu, không hợp lệ → hệ thống xử lý đúng lỗi.

**Checklist negative cases cần cover:**
- [ ] Field bắt buộc để trống → validation error đúng field
- [ ] Format sai (email không đúng, số âm, ngày tương lai...)
- [ ] Giá trị vượt giới hạn (max length, max value...)
- [ ] Data đã tồn tại → conflict error (email trùng, tên danh mục trùng...)
- [ ] Submit form 2 lần liên tiếp nhanh (double submit)

---

### 🟡 TC-AUTH — Authentication & Authorization

**Luôn kiểm tra:**
- [ ] Chưa đăng nhập → truy cập route protected → redirect `/login`
- [ ] Đã đăng nhập → truy cập `/login`, `/register` → redirect `/dashboard`
- [ ] Đã đăng nhập → thao tác trên data của **người dùng khác** → 403/không thấy data
- [ ] Session hết hạn giữa chừng → redirect login, không crash

---

### 🟡 TC-UI — UI/UX

- [ ] **Loading state** — hiển thị Skeleton khi đang fetch data
- [ ] **Empty state** — hiển thị đúng message khi chưa có data
- [ ] **Success feedback** — Toast "thành công" sau mỗi action
- [ ] **Error feedback** — Toast "lỗi" hoặc inline error message khi thất bại
- [ ] **Responsive mobile** — layout đúng trên màn < 768px
- [ ] **Responsive desktop** — layout đúng trên màn ≥ 1024px
- [ ] **Confirm trước khi xóa** — AlertDialog xuất hiện, phải xác nhận

---

### 🔵 TC-API — API / Route Handler

Với mỗi endpoint trong `docs/2-design/api-design.md`:

- [ ] `GET` không có auth → 401
- [ ] `GET` với auth → 200 + data đúng format
- [ ] `GET` với filter params → data đúng, filter hoạt động
- [ ] `POST` với data hợp lệ → 201 + resource mới
- [ ] `POST` với data thiếu field bắt buộc → 400 + error message
- [ ] `PATCH` của người khác → 403
- [ ] `DELETE` của người khác → 403
- [ ] `DELETE` resource đang bị reference → 409

---

### ⚡ TC-PERF — Performance (cơ bản)

- [ ] Page load lần đầu < 2 giây (LCP)
- [ ] Action (thêm/sửa/xóa) phản hồi < 500ms
- [ ] Dashboard với 100+ giao dịch vẫn render đúng
- [ ] Pagination hoạt động khi có nhiều records

---

## Template Output — Test Case Checklist

```markdown
# Test Cases: [Tên Feature]

> **Nguồn tài liệu:** docs/3-features/<feature>.md
> **Tester:** AI QA Agent
> **Ngày tạo:** YYYY-MM-DD

---

## Tóm tắt

| Loại | Số lượng | Status |
|---|---|---|
| 🟢 Happy Path | X | - |
| 🔴 Negative | X | - |
| 🟡 Auth | X | - |
| 🟡 UI/UX | X | - |
| 🔵 API | X | - |
| ⚡ Performance | X | - |
| **Tổng** | **X** | - |

---

## 🟢 Happy Path

| ID | Test Case | Precondition | Steps | Expected |
|---|---|---|---|---|
| HP-01 | [mô tả] | [điều kiện] | [các bước] | [kết quả mong đợi] |

---

## 🔴 Negative Tests

| ID | Test Case | Input lỗi | Expected Error |
|---|---|---|---|
| NEG-01 | [mô tả] | [input sai] | [lỗi hiển thị] |

---

## 🟡 Auth & Security

- [ ] AUTH-01: Chưa đăng nhập truy cập route → redirect /login
- [ ] AUTH-02: ...

---

## 🟡 UI/UX

- [ ] UI-01: Loading state hiển thị Skeleton
- [ ] UI-02: Empty state có message + action button
- [ ] UI-03: ...

---

## 🔵 API Tests

| ID | Method | Path | Input | Expected Status | Expected Body |
|---|---|---|---|---|---|
| API-01 | GET | /api/... | no auth | 401 | `{"error":"Unauthorized"}` |

---

## ⚡ Performance

- [ ] PERF-01: Page load < 2s (First Contentful Paint)
- [ ] PERF-02: Action response < 500ms

---

## Definition of Done — Re-check

> Copy từ docs/3-features/<feature>.md phần DoD và tick lại:

- [ ] DoD item 1
- [ ] DoD item 2
```

---

## Quy tắc viết test case

1. **Mỗi Acceptance Criteria → ít nhất 1 happy path + 1 negative test**
2. **ID phải unique** trong file: HP-01, NEG-01, AUTH-01, UI-01, API-01, PERF-01
3. **Steps phải cụ thể** — không viết "submit form", phải viết "nhấn nút Lưu"
4. **Expected phải đo được** — không viết "hiển thị lỗi", phải viết 'hiển thị toast "Email đã được sử dụng"'
5. **Không test logic server** — test từ góc độ user: UI behavior và API response
