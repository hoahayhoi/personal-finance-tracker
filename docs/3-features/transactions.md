> 🤖 **Agent:** Đọc file này **chỉ khi** implement hoặc test feature `transactions` (`/transactions`). Bỏ qua nếu làm feature khác.
> ✏️ **Update khi:** Thay đổi CRUD flow, filter logic, form fields, hoặc DoD.

# 💸 Feature: Transactions — Personal Finance Tracker

**Feature ID:** FT-TRANS  
**Route:** `/transactions`, `/transactions/new`, `/transactions/:id/edit`  
**Priority:** Must Have  
**Status:** 📋 Documented — Chưa implement  
**Phụ thuộc:** FT-AUTH, FT-CAT (cần có danh mục để chọn khi tạo giao dịch)

---

## 1. Mô tả tổng quan

Module Transactions là **core feature** của app — nơi người dùng thực hiện CRUD toàn bộ giao dịch tài chính (thu nhập & chi tiêu). Hỗ trợ filter đa chiều theo tháng, loại giao dịch, và danh mục.

### Mục tiêu

| # | Mục tiêu | Mô tả |
|---|---|---|
| TRANS-G1 | CRUD hoàn chỉnh | Thêm, xem, sửa, xóa giao dịch |
| TRANS-G2 | Filter linh hoạt | Lọc theo tháng / loại (thu/chi) / danh mục |
| TRANS-G3 | Data integrity | Validate chặt, không cho nhập sai dữ liệu |
| TRANS-G4 | Ownership | Mỗi user chỉ thấy và thao tác giao dịch của mình |

---

## 2. Functional Requirements

| ID | Tính năng | Mô tả | Priority |
|---|---|---|---|
| FR-T01 | Xem danh sách | Hiển thị toàn bộ giao dịch dạng bảng có phân trang | Must Have |
| FR-T02 | Thêm giao dịch | Form nhập với đầy đủ fields bắt buộc | Must Have |
| FR-T03 | Sửa giao dịch | Chỉnh sửa giao dịch đã có, form pre-filled | Must Have |
| FR-T04 | Xóa giao dịch | Xóa với confirm dialog | Must Have |
| FR-T05 | Filter theo tháng | Lọc giao dịch theo tháng/năm | Must Have |
| FR-T06 | Filter theo loại | Lọc Thu / Chi / Tất cả | Should Have |
| FR-T07 | Filter theo danh mục | Dropdown chọn danh mục | Should Have |
| FR-T08 | Tìm kiếm | Tìm theo ghi chú hoặc số tiền | Nice to Have |
| FR-T09 | Phân trang | Pagination 20 items/trang | Should Have |

---

## 3. User Stories & Acceptance Criteria

### US-T01: Thêm giao dịch mới

> As a **user**, I want to **add a new transaction**, so that **I can record my income or expense**.

**Acceptance Criteria:**
- Given tôi ở trang giao dịch, When tôi nhấn "Thêm giao dịch" và điền form hợp lệ, Then giao dịch mới xuất hiện đầu danh sách
- Given form thiếu trường bắt buộc, When tôi submit, Then hiển thị lỗi từng field ngay dưới input
- Given số tiền ≤ 0, When submit, Then lỗi "Số tiền phải lớn hơn 0"
- Given submit thành công, When giao dịch được tạo, Then hiện toast "Đã thêm giao dịch" và danh sách refresh

**Fields form:**

| Field | Kiểu | Bắt buộc | Validation |
|---|---|---|---|
| Loại (Thu/Chi) | Toggle/Radio | ✅ | INCOME hoặc EXPENSE |
| Số tiền | Number | ✅ | > 0, max 999,999,999,999 |
| Danh mục | Select | ✅ | Phải chọn trong danh sách |
| Ngày | Date | ✅ | Không được trống |
| Ghi chú | Textarea | ❌ | Max 255 ký tự |

---

### US-T02: Sửa giao dịch

> As a **user**, I want to **edit a transaction**, so that **I can correct mistakes in my records**.

**Acceptance Criteria:**
- Given tôi click "Sửa" trên một giao dịch, When form mở ra, Then tất cả fields được điền sẵn dữ liệu cũ
- Given tôi thay đổi và submit, When thành công, Then danh sách cập nhật dữ liệu mới + toast "Đã cập nhật"
- Given tôi cố sửa giao dịch không phải của mình (via API), When request đến server, Then trả về 403 Forbidden

---

### US-T03: Xóa giao dịch

> As a **user**, I want to **delete a transaction**, so that **I can remove incorrect entries**.

**Acceptance Criteria:**
- Given tôi click "Xóa", When click, Then xuất hiện confirm dialog "Bạn có chắc muốn xóa không?"
- Given tôi xác nhận xóa, When xóa thành công, Then giao dịch biến mất khỏi danh sách + toast "Đã xóa"
- Given tôi click Cancel trong dialog, When cancel, Then không có gì xảy ra

---

### US-T04: Filter giao dịch

> As a **user**, I want to **filter transactions by month and category**, so that **I can analyze specific periods or spending areas**.

**Acceptance Criteria:**
- Given tôi chọn tháng 1/2026, When filter áp dụng, Then chỉ hiển thị giao dịch trong tháng 1/2026
- Given tôi chọn loại "Chi", When filter, Then ẩn toàn bộ giao dịch INCOME
- Given tôi chọn danh mục "Ăn uống", When filter, Then chỉ hiển thị giao dịch của danh mục đó

---

## 4. UI/UX Screen Specification

### Trang `/transactions`

```
┌────────────────────────────────────────────────────────────┐
│  💸 Giao dịch                       [+ Thêm giao dịch]    │
├────────────────────────────────────────────────────────────┤
│  Filter:  [Tháng 3/2026 ▼]  [Tất cả ▼]  [Danh mục ▼]    │
├────────┬────────────┬──────────────┬──────────┬────────────┤
│  Ngày  │  Danh mục  │   Ghi chú    │  Số tiền │  Actions   │
├────────┼────────────┼──────────────┼──────────┼────────────┤
│ 07/03  │ 🍜 Ăn uống │ Bún bò sáng  │ -150,000 │ ✏️  🗑️     │
│ 01/03  │ 💰 Lương   │ Lương T3     │+15,000,000│ ✏️  🗑️    │
├────────┴────────────┴──────────────┴──────────┴────────────┤
│                    ← 1 2 3 ... →   (Pagination)            │
└────────────────────────────────────────────────────────────┘
```

### Modal Thêm / Sửa giao dịch

```
┌─────────────────────────────────┐
│  Thêm giao dịch           [✕]  │
├─────────────────────────────────┤
│  [  Thu  ] [  Chi  ]            │ ← Toggle
│                                 │
│  Số tiền                        │
│  ┌─────────────────────────┐    │
│  │  150,000           VNĐ  │    │
│  └─────────────────────────┘    │
│  Danh mục                       │
│  ┌─────────────────────────┐    │
│  │  🍜 Ăn uống          ▼  │    │
│  └─────────────────────────┘    │
│  Ngày                           │
│  ┌─────────────────────────┐    │
│  │  07/03/2026             │    │
│  └─────────────────────────┘    │
│  Ghi chú (tuỳ chọn)             │
│  ┌─────────────────────────┐    │
│  │ Bún bò buổi sáng        │    │
│  └─────────────────────────┘    │
│  [Cancel]    [Lưu giao dịch]    │
└─────────────────────────────────┘
```

### Component breakdown

| Component | File đề xuất | Mô tả |
|---|---|---|
| `<TransactionTable />` | `components/transactions/TransactionTable.tsx` | Bảng danh sách + actions |
| `<FilterBar />` | `components/transactions/FilterBar.tsx` | Tháng, loại, danh mục |
| `<TransactionModal />` | `components/transactions/TransactionModal.tsx` | Modal thêm/sửa |
| `<TransactionForm />` | `components/transactions/TransactionForm.tsx` | Form bên trong modal |
| `<DeleteDialog />` | `components/transactions/DeleteDialog.tsx` | Confirm xóa |
| Transactions page | `app/(app)/transactions/page.tsx` | Server Component |

---

## 5. API Endpoints

| Method | Path | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/api/transactions` | Lấy danh sách (có filter + pagination) | Required |
| `POST` | `/api/transactions` | Tạo giao dịch mới | Required |
| `PATCH` | `/api/transactions/:id` | Cập nhật giao dịch | Required, owner only |
| `DELETE` | `/api/transactions/:id` | Xóa giao dịch | Required, owner only |

### Query params cho GET

| Param | Type | Mô tả |
|---|---|---|
| `month` | number | Tháng (1-12) |
| `year` | number | Năm |
| `type` | `INCOME\|EXPENSE` | Lọc theo loại |
| `categoryId` | string | Lọc theo danh mục |
| `page` | number | Trang (default: 1) |
| `limit` | number | Items/trang (default: 20) |

---

## 6. Data Schema liên quan

```prisma
model Transaction {
  id         String          @id @default(cuid())
  amount     Decimal         @db.Decimal(15, 0)
  type       TransactionType // INCOME | EXPENSE
  note       String?         @db.VarChar(255)
  date       DateTime
  userId     String
  user       User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryId String
  category   Category        @relation(fields: [categoryId], references: [id])
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt
}
```

---

## 7. Risks & Considerations

| # | Rủi ro | Mức độ | Mitigation |
|---|---|---|---|
| R1 | User xóa nhầm giao dịch | Medium | Confirm dialog bắt buộc |
| R2 | Số tiền format hiển thị sai | Low | Dùng `Intl.NumberFormat` cho VNĐ |
| R3 | Unauthorized access via API | High | Validate `userId` trong mọi PATCH/DELETE |
| R4 | Chọn danh mục sai loại | Low | Filter danh sách danh mục theo loại thu/chi đang chọn |

---

## 8. Definition of Done

- [ ] Danh sách transactions hiển thị đúng, kèm icon + màu danh mục
- [ ] Filter tháng hoạt động, URL params được cập nhật
- [ ] Filter loại (Thu/Chi/Tất cả) hoạt động
- [ ] Filter danh mục hoạt động
- [ ] Pagination hoạt động (20 items/page)
- [ ] Modal thêm giao dịch validate đúng, submit thành công
- [ ] Modal sửa pre-filled đúng dữ liệu cũ
- [ ] Xóa có confirm dialog, sau xóa list refresh
- [ ] Số tiền Thu hiển thị màu xanh (+), Chi màu đỏ (-)
- [ ] Unauthorized access bị block 403
