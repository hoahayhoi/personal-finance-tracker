# Personal Finance Tracker - Django Backend

Django REST API backend cho Personal Finance Tracker.

## Tech Stack

- Django 5.1.7
- Django REST Framework 3.15.2
- PostgreSQL (psycopg 3.2.13)
- JWT Authentication (djangorestframework-simplejwt)
- CORS Headers

## Setup

### 1. Tạo virtual environment

```bash
python -m venv venv
```

### 2. Activate virtual environment

Windows:
```bash
venv\Scripts\activate
```

Linux/Mac:
```bash
source venv/bin/activate
```

### 3. Cài đặt dependencies

```bash
pip install -r requirements.txt
```

### 4. Cấu hình database

Tạo PostgreSQL database:
```sql
CREATE DATABASE finance_db;
```

Cập nhật file `.env` với thông tin database của bạn.

### 5. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Tạo superuser

```bash
python manage.py createsuperuser
```

### 7. Run development server

```bash
python manage.py runserver
```

API sẽ chạy tại: `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Đăng ký user mới
- `POST /api/auth/login/` - Đăng nhập (lấy JWT token)
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET/PATCH /api/auth/profile/` - Xem/cập nhật profile

### Transactions
- `GET /api/transactions/` - Danh sách giao dịch
- `POST /api/transactions/` - Tạo giao dịch mới
- `GET /api/transactions/{id}/` - Chi tiết giao dịch
- `PATCH /api/transactions/{id}/` - Cập nhật giao dịch
- `DELETE /api/transactions/{id}/` - Xóa giao dịch

### Categories
- `GET /api/categories/` - Danh sách danh mục
- `POST /api/categories/` - Tạo danh mục mới
- `GET /api/categories/{id}/` - Chi tiết danh mục
- `PATCH /api/categories/{id}/` - Cập nhật danh mục
- `DELETE /api/categories/{id}/` - Xóa danh mục

### Dashboard
- `GET /api/dashboard/summary/` - Tổng hợp tài chính

## Query Parameters

### Transactions
- `month` - Lọc theo tháng (1-12)
- `year` - Lọc theo năm
- `type` - Lọc theo loại (INCOME/EXPENSE)
- `category` - Lọc theo category ID
- `page` - Số trang (pagination)

### Categories
- `type` - Lọc theo loại (INCOME/EXPENSE)

## Authentication

API sử dụng JWT Bearer token. Thêm header:

```
Authorization: Bearer <access_token>
```

## Project Structure

```
backend/
├── config/              # Django settings
├── users/              # User model & auth
├── transactions/       # Transaction model & API
├── categories/         # Category model & API
├── dashboard/          # Dashboard summary API
├── manage.py
└── requirements.txt
```

## Admin Panel

Truy cập Django admin tại: `http://localhost:8000/admin`
