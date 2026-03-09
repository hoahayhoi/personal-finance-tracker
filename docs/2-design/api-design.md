# API Design — Personal Finance Tracker

> **Loại tài liệu:** Design
> **Cập nhật lần cuối:** 2026-03-09
>
> Tất cả Route Handlers đều yêu cầu session hợp lệ (trừ auth endpoints).
> Base URL: `/api`

---

## Endpoints Overview

| Method | Path | Mô tả | Auth |
|---|---|---|---|
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth handler | Public |
| `GET` | `/api/transactions` | Danh sách giao dịch | Required |
| `POST` | `/api/transactions` | Tạo giao dịch | Required |
| `PATCH` | `/api/transactions/:id` | Cập nhật giao dịch | Required |
| `DELETE` | `/api/transactions/:id` | Xóa giao dịch | Required |
| `GET` | `/api/categories` | Danh sách danh mục | Required |
| `POST` | `/api/categories` | Tạo danh mục | Required |
| `PATCH` | `/api/categories/:id` | Cập nhật danh mục | Required |
| `DELETE` | `/api/categories/:id` | Xóa danh mục | Required |
| `GET` | `/api/dashboard/summary` | Tổng hợp tài chính | Required |

---

## Authentication (NextAuth)

| Method | Path | Mô tả |
|---|---|---|
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth handler (login, logout, session) |

---

## Transactions

### `GET /api/transactions`

**Query params:**
| Param | Type | Required | Mô tả |
|---|---|---|---|
| `month` | `number` | No | Tháng (1-12) |
| `year` | `number` | No | Năm |
| `type` | `INCOME\|EXPENSE` | No | Lọc theo loại |
| `categoryId` | `string` | No | Lọc theo danh mục |
| `page` | `number` | No | Trang (default: 1) |
| `limit` | `number` | No | Số item/trang (default: 20) |

**Response 200:**
```json
{
  "data": [
    {
      "id": "clx123abc",
      "amount": 150000,
      "type": "EXPENSE",
      "note": "Bún bò buổi sáng",
      "date": "2026-03-07T00:00:00.000Z",
      "category": {
        "id": "clx456def",
        "name": "Ăn uống",
        "icon": "🍜",
        "color": "#FF6B6B"
      },
      "createdAt": "2026-03-07T04:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

---

### `POST /api/transactions`

**Request body:**
```json
{
  "amount": 150000,
  "type": "EXPENSE",
  "categoryId": "clx456def",
  "date": "2026-03-07",
  "note": "Bún bò buổi sáng"
}
```

**Response 201:** Transaction object mới tạo

**Error 400:**
```json
{
  "errors": {
    "amount": "Số tiền phải lớn hơn 0",
    "categoryId": "Bắt buộc chọn danh mục"
  }
}
```

---

### `PATCH /api/transactions/:id`

**Request body:** (chỉ các field cần cập nhật)
```json
{
  "amount": 200000,
  "note": "Bún bò + cà phê"
}
```

**Response 200:** Transaction object đã cập nhật

**Error 403:** Nếu `userId` không khớp với chủ giao dịch

---

### `DELETE /api/transactions/:id`

**Response 204:** No content

**Error 403:** Nếu không phải chủ giao dịch

---

## Categories

### `GET /api/categories`

**Query params:** `type` (INCOME | EXPENSE)

**Response 200:**
```json
{
  "data": [
    {
      "id": "clx456def",
      "name": "Ăn uống",
      "icon": "🍜",
      "color": "#FF6B6B",
      "type": "EXPENSE",
      "isDefault": true
    }
  ]
}
```

---

### `POST /api/categories`

**Request body:**
```json
{
  "name": "Thú cưng",
  "type": "EXPENSE",
  "icon": "🐶",
  "color": "#F0A500"
}
```

**Response 201:** Category object mới

**Error 409:** Nếu tên danh mục đã tồn tại trong cùng loại

---

### `PATCH /api/categories/:id`

**Response 200:** Category object đã cập nhật

---

### `DELETE /api/categories/:id`

**Response 204:** No content

**Error 409:** Nếu category đang có giao dịch liên kết (không cho xóa)

---

## Dashboard

### `GET /api/dashboard/summary`

**Query params:** `month`, `year`

**Response 200:**
```json
{
  "balance": 5200000,
  "totalIncome": 15000000,
  "totalExpense": 9800000,
  "dailyData": [
    { "date": "2026-03-01", "income": 0, "expense": 150000 },
    { "date": "2026-03-02", "income": 15000000, "expense": 0 }
  ],
  "categoryBreakdown": [
    { "categoryId": "clx456def", "name": "Ăn uống", "total": 2500000, "color": "#FF6B6B" }
  ]
}
```

---

## HTTP Error Codes

| Code | Ý nghĩa |
|---|---|
| `400` | Bad Request — Validation lỗi |
| `401` | Unauthorized — Chưa đăng nhập |
| `403` | Forbidden — Không có quyền truy cập tài nguyên |
| `404` | Not Found |
| `409` | Conflict — Trùng dữ liệu |
| `500` | Internal Server Error |
