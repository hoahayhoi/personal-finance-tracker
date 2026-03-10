# Backend API Testing Guide

Hướng dẫn test API backend Django REST Framework với JWT authentication.

## Prerequisites

1. Backend server đang chạy tại `http://127.0.0.1:8000`
2. Database đã được migrate
3. Có `jq` (cho bash script) hoặc PowerShell 5.1+ (cho .ps1)

## Quick Start

### Option 1: Bash Script (Linux/Mac/Git Bash)

```bash
cd backend
chmod +x test_flow.sh
./test_flow.sh
```

### Option 2: PowerShell Script (Windows)

```powershell
cd backend
.\test_flow.ps1
```

### Option 3: Manual cURL Commands

Xem phần [Manual Testing](#manual-testing) bên dưới.

---

## Test Flow Overview

Script sẽ test theo thứ tự:

1. **Register** - Tạo user mới
2. **Login** - Lấy JWT access & refresh token
3. **Get Profile** - Verify authentication
4. **Get Categories** - List categories (empty ban đầu)
5. **Create Category (EXPENSE)** - Tạo danh mục chi tiêu
6. **Create Category (INCOME)** - Tạo danh mục thu nhập
7. **Create Transaction (INCOME)** - Tạo giao dịch thu
8. **Create Transaction (EXPENSE)** - Tạo giao dịch chi
9. **Get All Transactions** - List tất cả
10. **Get Transaction by ID** - Chi tiết 1 transaction
11. **Update Transaction** - Sửa amount và note
12. **Filter Transactions** - Lọc theo type=EXPENSE
13. **Dashboard Summary** - Tổng hợp tài chính
14. **Refresh Token** - Làm mới JWT token
15. **Delete Transaction** - Xóa transaction
16. **Verify Deletion** - Confirm đã xóa (404)

---

## Manual Testing

### 1. Register User

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "full_name": "Nguyen Van Test"
  }'
```

**Expected Response:**
```json
{
  "id": 1,
  "email": "test@example.com",
  "full_name": "Nguyen Van Test"
}
```

---

### 2. Login & Get JWT Token

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

**Expected Response:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the access token:**
```bash
export TOKEN="<your_access_token>"
```

---

### 3. Get User Profile

```bash
curl -X GET http://127.0.0.1:8000/api/auth/profile/ \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. Create Category

```bash
curl -X POST http://127.0.0.1:8000/api/categories/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ăn uống",
    "type": "EXPENSE",
    "icon": "🍜",
    "color": "#FF6B6B"
  }'
```

**Save category ID:**
```bash
export CATEGORY_ID="<returned_id>"
```

---

### 5. Create Transaction

```bash
curl -X POST http://127.0.0.1:8000/api/transactions/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 150000,
    \"type\": \"EXPENSE\",
    \"category\": \"$CATEGORY_ID\",
    \"date\": \"2026-03-07\",
    \"note\": \"Bún bò buổi sáng\"
  }"
```

---

### 6. Get All Transactions

```bash
curl -X GET http://127.0.0.1:8000/api/transactions/ \
  -H "Authorization: Bearer $TOKEN"
```

**With filters:**
```bash
# Filter by type
curl -X GET "http://127.0.0.1:8000/api/transactions/?type=EXPENSE" \
  -H "Authorization: Bearer $TOKEN"

# Filter by month/year
curl -X GET "http://127.0.0.1:8000/api/transactions/?month=3&year=2026" \
  -H "Authorization: Bearer $TOKEN"

# Filter by category
curl -X GET "http://127.0.0.1:8000/api/transactions/?category=$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 7. Get Transaction by ID

```bash
export TRANSACTION_ID="<transaction_id>"

curl -X GET http://127.0.0.1:8000/api/transactions/$TRANSACTION_ID/ \
  -H "Authorization: Bearer $TOKEN"
```

---

### 8. Update Transaction

```bash
curl -X PATCH http://127.0.0.1:8000/api/transactions/$TRANSACTION_ID/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 200000,
    "note": "Bún bò + cà phê"
  }'
```

---

### 9. Delete Transaction

```bash
curl -X DELETE http://127.0.0.1:8000/api/transactions/$TRANSACTION_ID/ \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** HTTP 204 No Content

---

### 10. Dashboard Summary

```bash
curl -X GET http://127.0.0.1:8000/api/dashboard/summary/ \
  -H "Authorization: Bearer $TOKEN"
```

**With filters:**
```bash
curl -X GET "http://127.0.0.1:8000/api/dashboard/summary/?month=3&year=2026" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 11. Refresh Token

```bash
export REFRESH_TOKEN="<your_refresh_token>"

curl -X POST http://127.0.0.1:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d "{
    \"refresh\": \"$REFRESH_TOKEN\"
  }"
```

---

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | No | Đăng ký user mới |
| POST | `/api/auth/login/` | No | Login, lấy JWT token |
| POST | `/api/auth/token/refresh/` | No | Refresh access token |
| GET | `/api/auth/profile/` | Yes | Thông tin user hiện tại |
| GET | `/api/categories/` | Yes | List categories |
| POST | `/api/categories/` | Yes | Tạo category |
| GET | `/api/categories/:id/` | Yes | Chi tiết category |
| PATCH | `/api/categories/:id/` | Yes | Cập nhật category |
| DELETE | `/api/categories/:id/` | Yes | Xóa category |
| GET | `/api/transactions/` | Yes | List transactions |
| POST | `/api/transactions/` | Yes | Tạo transaction |
| GET | `/api/transactions/:id/` | Yes | Chi tiết transaction |
| PATCH | `/api/transactions/:id/` | Yes | Cập nhật transaction |
| DELETE | `/api/transactions/:id/` | Yes | Xóa transaction |
| GET | `/api/dashboard/summary/` | Yes | Dashboard summary |

---

## Common Issues

### 1. "401 Unauthorized"
- Token đã hết hạn → dùng refresh token
- Token không hợp lệ → login lại

### 2. "403 Forbidden"
- Đang cố xóa/sửa resource của user khác
- Verify ownership trong database

### 3. "400 Bad Request"
- Validation error → check request body format
- Missing required fields

### 4. "404 Not Found"
- Resource không tồn tại
- Check ID có đúng không

---

## Notes

- JWT access token có thời hạn (default: 5 phút)
- Refresh token có thời hạn dài hơn (default: 1 ngày)
- Tất cả endpoints (trừ auth) đều cần Authorization header
- Date format: `YYYY-MM-DD`
- Amount: số nguyên (VND)

---

## Cleanup

Để xóa test data và reset database:

```bash
cd backend
rm db.sqlite3
python manage.py migrate
```
