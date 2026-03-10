# API Response Format - Standardized

Tất cả API endpoints đều sử dụng format response thống nhất.

## Success Response Format

```json
{
  "success": true,
  "data": <response_data>,
  "message": "<optional_success_message>"
}
```

### Examples

**Single Object:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ăn uống",
    "type": "EXPENSE"
  },
  "message": "Tạo category thành công"
}
```

**Array/List:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "amount": 150000,
      "type": "EXPENSE"
    },
    {
      "id": 2,
      "amount": 15000000,
      "type": "INCOME"
    }
  ],
  "message": "Lấy danh sách transactions thành công"
}
```

**Empty Data (Delete):**
```json
{
  "success": true,
  "data": null,
  "message": "Xóa transaction thành công"
}
```

---

## Error Response Format

```json
{
  "success": false,
  "message": "<error_message>",
  "errors": <optional_detailed_errors>
}
```

### Examples

**Simple Error:**
```json
{
  "success": false,
  "message": "Không tìm thấy transaction"
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": {
    "amount": ["This field is required."],
    "category": ["Invalid pk \"999\" - object does not exist."]
  }
}
```

**Business Logic Error:**
```json
{
  "success": false,
  "message": "Không thể xóa category đang có giao dịch liên kết"
}
```

---

## HTTP Status Codes

| Code | Usage | Example |
|------|-------|---------|
| 200 | Success (GET, PATCH) | Lấy data, cập nhật thành công |
| 201 | Created (POST) | Tạo mới thành công |
| 204 | No Content (DELETE) | Xóa thành công |
| 400 | Bad Request | Validation error, dữ liệu không hợp lệ |
| 401 | Unauthorized | Chưa đăng nhập, token không hợp lệ |
| 403 | Forbidden | Không có quyền truy cập resource |
| 404 | Not Found | Resource không tồn tại |
| 409 | Conflict | Business logic conflict |
| 500 | Internal Server Error | Lỗi hệ thống |

---

## JWT Token Response (Updated)

Login và refresh endpoints giờ cũng sử dụng standardized format:

**Login Response:**
```json
{
  "success": true,
  "data": {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Đăng nhập thành công"
}
```

**Refresh Token Response:**
```json
{
  "success": true,
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Làm mới token thành công"
}
```

---

## Implementation

Response utils được implement trong `utils/responses.py`:

```python
from utils.responses import responseSuccess, responseError

# Success response
return responseSuccess(
    data=serializer.data,
    status_code=201,
    message='Tạo thành công'
)

# Error response
return responseError(
    message='Dữ liệu không hợp lệ',
    status_code=400,
    errors=serializer.errors
)
```

---

## Benefits

1. **Consistency** - Tất cả endpoints có format giống nhau
2. **Frontend Friendly** - Dễ handle response ở frontend
3. **Error Handling** - Standardized error format
4. **Success Detection** - `success` field để check nhanh
5. **User Messages** - `message` field cho user feedback

---

## Migration Notes

- Tất cả endpoints đã được update để sử dụng format mới
- JWT endpoints (login, refresh) giờ cũng sử dụng standardized format
- Frontend cần update để handle `success` và `data` fields cho tất cả endpoints