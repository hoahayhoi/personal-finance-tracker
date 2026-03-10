# Personal Finance Tracker - Project Structure

Dự án được tách thành 2 phần: Backend (Django) và Frontend (Next.js)

## Cấu trúc thư mục

```
personal-finance-tracker/
├── backend/                 # Django REST API
│   ├── config/             # Django settings
│   ├── users/              # User authentication
│   ├── transactions/       # Transaction management
│   ├── categories/         # Category management
│   ├── dashboard/          # Dashboard analytics
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend/               # Next.js App (code hiện tại)
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── README.md
│
└── docs/                   # Shared documentation
    ├── 1-product/
    ├── 2-design/
    ├── 3-features/
    ├── 4-engineering/
    └── 5-tracking/
```

## Tech Stack

### Backend (Django)
- Framework: Django 5.1.7
- API: Django REST Framework 3.15.2
- Database: PostgreSQL
- ORM: Django ORM
- Auth: JWT (djangorestframework-simplejwt)

### Frontend (Next.js)
- Framework: Next.js 15 (App Router)
- Language: TypeScript 5.x
- Styling: Tailwind CSS v4
- UI Components: shadcn/ui
- State Management: Zustand + nuqs
- Charts: Recharts

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Tạo virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Cài dependencies
pip install -r requirements.txt

# Tạo database
createdb finance_db

# Cấu hình .env
cp .env.example .env
# Chỉnh sửa .env với thông tin database

# Run migrations
python manage.py migrate

# Tạo superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

Backend chạy tại: `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend

# Cài dependencies
npm install

# Cấu hình .env.local
cp .env.example .env.local
# Thêm NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
```

Frontend chạy tại: `http://localhost:3000`

## API Integration

Frontend sẽ gọi API từ Django backend:

```typescript
// frontend/src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchTransactions(token: string) {
  const response = await fetch(`${API_URL}/api/transactions/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  return response.json()
}
```

## Database

Cả 2 phần đều sử dụng cùng PostgreSQL database:

- Backend: Django ORM
- Frontend: Có thể giữ Prisma để seed data hoặc migration tools

## Authentication Flow

1. User đăng ký/đăng nhập qua Django API
2. Backend trả về JWT access token + refresh token
3. Frontend lưu token (localStorage/cookie)
4. Mọi request đều gửi kèm Bearer token
5. Token hết hạn → dùng refresh token để lấy token mới

## Development Workflow

1. Backend developer: Làm việc trong `backend/`
2. Frontend developer: Làm việc trong `frontend/`
3. Shared docs: Cập nhật trong `docs/`

## Deployment

### Backend
- Deploy Django lên: Railway, Render, DigitalOcean
- Database: Neon, Supabase, Railway PostgreSQL

### Frontend
- Deploy Next.js lên: Vercel, Netlify
- Environment variable: `NEXT_PUBLIC_API_URL` → URL backend production

## Next Steps

1. ✅ Backend đã init xong
2. ⏳ Cần di chuyển code Next.js hiện tại vào folder `frontend/`
3. ⏳ Tạo API client trong Next.js để gọi Django backend
4. ⏳ Cập nhật authentication flow để dùng JWT
5. ⏳ Test integration giữa frontend và backend
