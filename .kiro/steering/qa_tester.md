---
inclusion: auto
keywords: ["test case", "qa", "testing", "checklist", "test"]
---

# QA Tester

Khi tạo test case checklist cho feature, đọc đủ 4 nguồn docs:

1. `docs/3-features/<feature>.md` — Acceptance Criteria, DoD
2. `docs/1-product/functional-requirements.md` — Priority
3. `docs/2-design/api-design.md` — Endpoints, error codes
4. `docs/2-design/screens.md` — Navigation, auth

## Phân loại Test Case

### 🟢 TC-HAPPY — Happy Path
Test user thực hiện đúng → hệ thống phản hồi đúng

### 🔴 TC-NEG — Negative Test
- Field bắt buộc để trống
- Format sai (email, số âm, ngày tương lai)
- Giá trị vượt giới hạn
- Data đã tồn tại (conflict)
- Double submit

### 🟡 TC-AUTH — Authentication
- Chưa đăng nhập → redirect `/login`
- Thao tác trên data người khác → 403
- Session hết hạn → redirect login

### 🟡 TC-UI — UI/UX
- Loading state — Skeleton
- Empty state — message + action
- Success feedback — Toast
- Error feedback — Toast/inline error
- Responsive mobile/desktop
- Confirm trước khi xóa

### 🔵 TC-API — API Tests
- GET không auth → 401
- GET với auth → 200 + data
- POST data hợp lệ → 201
- POST thiếu field → 400
- PATCH/DELETE của người khác → 403

### ⚡ TC-PERF — Performance
- Page load < 2s
- Action response < 500ms
- Dashboard với 100+ records

## Template Output

```markdown
# Test Cases: [Feature]

> **Nguồn:** docs/3-features/<feature>.md
> **Ngày tạo:** YYYY-MM-DD

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

## 🟢 Happy Path

| ID | Test Case | Precondition | Steps | Expected |
|---|---|---|---|---|
| HP-01 | ... | ... | ... | ... |

## 🔴 Negative Tests

| ID | Test Case | Input lỗi | Expected Error |
|---|---|---|---|
| NEG-01 | ... | ... | ... |

## 🟡 Auth & Security

- [ ] AUTH-01: Chưa đăng nhập → redirect /login
- [ ] AUTH-02: ...

## 🟡 UI/UX

- [ ] UI-01: Loading state Skeleton
- [ ] UI-02: Empty state message
- [ ] UI-03: ...

## 🔵 API Tests

| ID | Method | Path | Expected Status |
|---|---|---|---|
| API-01 | GET | /api/... | 401 |

## ⚡ Performance

- [ ] PERF-01: Page load < 2s
- [ ] PERF-02: Action < 500ms

## Definition of Done

- [ ] DoD item 1
- [ ] DoD item 2
```

## Quy tắc

1. Mỗi Acceptance Criteria → ít nhất 1 happy + 1 negative
2. ID unique: HP-01, NEG-01, AUTH-01, UI-01, API-01, PERF-01
3. Steps cụ thể — không viết "submit form", viết "nhấn nút Lưu"
4. Expected đo được — không viết "hiển thị lỗi", viết 'toast "Email đã được sử dụng"'
