# Auth Flow - cURL Commands for Postman

Base URL: `http://127.0.0.1:8000`

## 1. Register User

**Endpoint:** `POST /api/auth/register/`

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "full_name": "Nguyen Van Test"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "test@example.com",
    "full_name": "Nguyen Van Test",
    "created_at": "2026-03-10T10:30:00Z"
  },
  "message": "Đăng ký thành công"
}
```

---

## 2. Login & Get JWT Token

**Endpoint:** `POST /api/auth/login/`

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxMDI0NzIwMCwidXNlcl9pZCI6MX0.abc123...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEwMTYwODAwLCJ1c2VyX2lkIjoxfQ.def456..."
  },
  "message": "Đăng nhập thành công"
}
```

**⚠️ Save the `access` token for next requests!**

---

## 3. Get User Profile

**Endpoint:** `GET /api/auth/profile/`

```bash
curl -X GET http://127.0.0.1:8000/api/auth/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "test@example.com",
    "full_name": "Nguyen Van Test",
    "created_at": "2026-03-10T10:30:00Z",
    "updated_at": "2026-03-10T10:30:00Z"
  },
  "message": "Lấy thông tin profile thành công"
}
```

---

## 4. Refresh Access Token

**Endpoint:** `POST /api/auth/token/refresh/`

```bash
curl -X POST http://127.0.0.1:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "YOUR_REFRESH_TOKEN"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.NEW_ACCESS_TOKEN..."
  },
  "message": "Làm mới token thành công"
}
```

---

## Error Responses

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": {
    "email": ["This field is required."],
    "password": ["This field is required."]
  }
}
```

### 401 Unauthorized - Invalid Credentials
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng"
}
```

### 401 Unauthorized - Invalid/Expired Token
```json
{
  "success": false,
  "message": "Refresh token không hợp lệ hoặc đã hết hạn"
}
```

---

## Postman Collection Setup

### Environment Variables
Create environment with:
- `base_url`: `http://127.0.0.1:8000`
- `access_token`: (will be set after login)
- `refresh_token`: (will be set after login)

### Request Headers
For authenticated requests, add:
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

### Auto-save tokens (Postman Script)
Add this to **Tests** tab of login request:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data) {
        pm.environment.set("access_token", response.data.access);
        pm.environment.set("refresh_token", response.data.refresh);
    }
}
```

---

## Test Flow Sequence

1. **Register** → Get user ID
2. **Login** → Get access & refresh tokens
3. **Get Profile** → Verify authentication works
4. **Refresh Token** → Get new access token
5. **Get Profile** (with new token) → Verify refresh works

---

## Common Issues

### 1. CORS Error
If testing from browser, add CORS headers to Django settings.

### 2. Token Expired
- Access token expires in 5 minutes (default)
- Use refresh token to get new access token
- Refresh token expires in 1 day (default)

### 3. Database Not Found
```bash
cd backend
python manage.py migrate
```

### 4. Server Not Running
```bash
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

---

## JWT Token Structure

**Access Token Payload:**
```json
{
  "token_type": "access",
  "exp": 1710160800,
  "iat": 1710160500,
  "jti": "abc123...",
  "user_id": 1
}
```

**Refresh Token Payload:**
```json
{
  "token_type": "refresh",
  "exp": 1710247200,
  "iat": 1710160500,
  "jti": "def456...",
  "user_id": 1
}
```

---

## Next Steps

After auth flow works, test other endpoints:
- Categories: `/api/categories/`
- Transactions: `/api/transactions/`
- Dashboard: `/api/dashboard/summary/`

All require `Authorization: Bearer <access_token>` header.