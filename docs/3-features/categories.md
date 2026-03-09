# 🏷️ Feature: Categories — Personal Finance Tracker

**Feature ID:** FT-CAT  
**Route:** `/categories`  
**Priority:** Must Have  
**Status:** 📋 Documented — Chưa implement  
**Phụ thuộc:** FT-AUTH; FT-TRANS phụ thuộc vào module này

---

## 1. Mô tả tổng quan

Module Categories cho phép người dùng quản lý danh mục để phân loại giao dịch. Hệ thống tự động tạo **13 danh mục mặc định** khi user đăng ký. Người dùng có thể tạo thêm danh mục tùy chỉnh theo nhu cầu cá nhân.

### Mục tiêu

| # | Mục tiêu | Mô tả |
|---|---|---|
| CAT-G1 | Phân loại giao dịch | Mỗi giao dịch phải thuộc 1 danh mục |
| CAT-G2 | Onboarding mượt | Danh mục mặc định sẵn sàng ngay sau đăng ký |
| CAT-G3 | Cá nhân hóa | User tạo thêm danh mục theo thói quen riêng |
| CAT-G4 | Data integrity | Không xóa danh mục đang có giao dịch liên kết |

---

## 2. Functional Requirements

| ID | Tính năng | Mô tả | Priority |
|---|---|---|---|
| FR-C01 | Xem danh mục | Grid danh mục, phân tab Thu/Chi | Must Have |
| FR-C02 | Thêm danh mục | Tạo mới với tên, icon, màu, loại | Must Have |
| FR-C03 | Sửa danh mục | Chỉnh sửa danh mục tùy chỉnh | Should Have |
| FR-C04 | Xóa danh mục | Chỉ xóa được khi không có giao dịch liên kết | Should Have |
| FR-C05 | Danh mục mặc định | Seed 13 danh mục khi user đăng ký | Must Have |

---

## 3. User Stories & Acceptance Criteria

### US-C01: Xem danh sách danh mục

> As a **user**, I want to **see all my categories organized by type**, so that **I can manage them easily**.

**Acceptance Criteria:**
- Given tôi vào `/categories`, When page load, Then thấy grid danh mục với 2 tab: "Chi tiêu" và "Thu nhập"
- Given tôi switch tab, When click tab "Thu nhập", Then chỉ hiển thị danh mục loại INCOME
- Given mỗi danh mục card, When render, Then hiển thị: icon, tên, màu nền, badge "Mặc định" nếu là default

---

### US-C02: Thêm danh mục tùy chỉnh

> As a **user**, I want to **create custom categories**, so that **I can organize transactions to fit my lifestyle**.

**Acceptance Criteria:**
- Given tôi nhập tên + chọn loại và submit, When thành công, Then danh mục mới xuất hiện trong grid + toast "Đã thêm"
- Given tên danh mục đã tồn tại (cùng loại, cùng user), When submit, Then lỗi "Danh mục đã tồn tại"
- Given tôi không nhập tên, When submit, Then lỗi "Tên danh mục không được trống"

**Fields form:**

| Field | Bắt buộc | Mô tả |
|---|---|---|
| Tên danh mục | ✅ | Max 50 ký tự |
| Loại (Thu/Chi) | ✅ | INCOME hoặc EXPENSE |
| Icon (emoji) | ❌ | Mặc định: 📌 |
| Màu sắc | ❌ | Color picker, mặc định: #6B7280 |

---

### US-C03: Xóa danh mục

> As a **user**, I want to **delete a custom category I no longer need**, so that **my category list stays clean**.

**Acceptance Criteria:**
- Given danh mục không có giao dịch, When tôi xóa, Then danh mục bị xóa + toast "Đã xóa"
- Given danh mục đang có giao dịch liên kết, When tôi cố xóa, Then lỗi "Không thể xóa — danh mục đang có N giao dịch"
- Given danh mục là `isDefault = true`, When tôi cố xóa, Then nút xóa bị disabled hoặc ẩn

---

### US-C04: Danh mục mặc định khi đăng ký

> As a **new user**, I want to **have default categories pre-created**, so that **I can start adding transactions immediately**.

**Acceptance Criteria:**
- Given tôi vừa đăng ký xong, When vào `/categories`, Then thấy đầy đủ 13 danh mục mặc định (8 Chi + 5 Thu)
- Given danh mục mặc định, When render, Then hiển thị badge "Mặc định" và không có nút xóa

---

## 4. UI/UX Screen Specification

### Trang `/categories`

```
┌──────────────────────────────────────────────────────────┐
│  🏷️ Danh mục                         [+ Thêm danh mục]  │
├──────────────────────────────────────────────────────────┤
│  [ Chi tiêu ]  [ Thu nhập ]                              │ ← Tabs
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐              │
│  │    🍜     │ │    🚗     │ │    🛍️    │              │
│  │  Ăn uống  │ │  Đi lại   │ │  Mua sắm  │              │ ← Category Grid
│  │ [Mặc định]│ │ [Mặc định]│ │ [Mặc định]│              │
│  └───────────┘ └───────────┘ └───────────┘              │
│                                                          │
│  ┌───────────┐                                          │
│  │    🐶     │                                          │
│  │  Thú cưng │                                          │ ← Custom category
│  │  ✏️  🗑️  │                                          │
│  └───────────┘                                          │
└──────────────────────────────────────────────────────────┘
```

### Modal Thêm / Sửa danh mục

```
┌───────────────────────────────┐
│  Thêm danh mục          [✕]  │
├───────────────────────────────┤
│  Loại                         │
│  [ Chi tiêu ] [ Thu nhập ]    │ ← Toggle
│                               │
│  Tên danh mục                 │
│  ┌─────────────────────────┐  │
│  │ Thú cưng                │  │
│  └─────────────────────────┘  │
│                               │
│  Icon (emoji)                 │
│  ┌────┐                       │
│  │ 🐶 │  ← Click để chọn     │
│  └────┘                       │
│                               │
│  Màu sắc                      │
│  🟠 🔵 🟢 🔴 🟣 ⚫           │
│                               │
│  [Cancel]    [Lưu danh mục]   │
└───────────────────────────────┘
```

### Component breakdown

| Component | File đề xuất | Mô tả |
|---|---|---|
| `<CategoryGrid />` | `components/categories/CategoryGrid.tsx` | Grid hiển thị cards |
| `<CategoryCard />` | `components/categories/CategoryCard.tsx` | Card đơn: icon, tên, actions |
| `<CategoryModal />` | `components/categories/CategoryModal.tsx` | Modal thêm/sửa |
| `<CategoryForm />` | `components/categories/CategoryForm.tsx` | Form bên trong modal |
| Categories page | `app/(app)/categories/page.tsx` | Server Component |

---

## 5. API Endpoints

| Method | Path | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/api/categories` | Lấy danh sách (filter by type) | Required |
| `POST` | `/api/categories` | Tạo danh mục mới | Required |
| `PATCH` | `/api/categories/:id` | Cập nhật danh mục | Required, owner only |
| `DELETE` | `/api/categories/:id` | Xóa danh mục | Required, owner only |

**Error 409 DELETE:** Nếu category đang có transaction liên kết

---

## 6. Seed Data — 13 Danh mục mặc định

| Loại | Tên | Icon | Màu |
|---|---|---|---|
| Chi | Ăn uống | 🍜 | #FF6B6B |
| Chi | Đi lại | 🚗 | #4ECDC4 |
| Chi | Mua sắm | 🛍️ | #45B7D1 |
| Chi | Nhà ở & Tiện ích | 🏠 | #96CEB4 |
| Chi | Giải trí | 🎬 | #FFEAA7 |
| Chi | Sức khỏe | 💊 | #DDA0DD |
| Chi | Giáo dục | 📚 | #98D8C8 |
| Chi | Khác | 💸 | #B8B8B8 |
| Thu | Lương | 💰 | #2ECC71 |
| Thu | Thưởng | 🎁 | #3498DB |
| Thu | Đầu tư | 📈 | #9B59B6 |
| Thu | Thu nhập phụ | 💼 | #E67E22 |
| Thu | Khác | 💵 | #95A5A6 |

---

## 7. Data Schema liên quan

```prisma
model Category {
  id           String          @id @default(cuid())
  name         String
  icon         String?
  color        String?
  type         TransactionType // INCOME | EXPENSE
  isDefault    Boolean         @default(false)
  userId       String
  user         User            @relation(...)
  transactions Transaction[]
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt

  @@unique([name, type, userId])
}
```

---

## 8. Definition of Done

- [ ] Tab Chi/Thu switch đúng danh mục
- [ ] Danh mục mặc định có badge, không có nút xóa
- [ ] Modal thêm danh mục validate: tên bắt buộc, không trùng
- [ ] Thêm thành công → xuất hiện ngay trong grid
- [ ] Sửa danh mục custom: pre-filled form, cập nhật đúng
- [ ] Xóa: có confirm dialog, block nếu có giao dịch liên kết
- [ ] Khi đăng ký: 13 danh mục mặc định được tạo đúng
