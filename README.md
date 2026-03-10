# Personal Finance Tracker

Ứng dụng quản lý tài chính cá nhân với Django REST API backend và Next.js frontend.

## Cấu trúc Project

```
personal-finance-tracker/
├── backend/          # Django REST API
├── frontend/         # Next.js App
└── docs/            # Documentation
```

## Tech Stack

### Backend
- Django 5.1.7 + Django REST Framework
- PostgreSQL
- JWT Authentication

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand + nuqs

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
createdb finance_db

# Configure .env
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed default categories
python manage.py seed_categories

# Run server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add: NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

## API Endpoints

- `POST /api/auth/register/` - Register
- `POST /api/auth/login/` - Login (get JWT)
- `GET /api/transactions/` - List transactions
- `POST /api/transactions/` - Create transaction
- `GET /api/categories/` - List categories
- `GET /api/dashboard/summary/` - Dashboard data

## Documentation

Xem thêm trong folder `docs/`:
- Product requirements
- System design
- Feature specifications
- Engineering guides

## Development

- Backend: `cd backend && python manage.py runserver`
- Frontend: `cd frontend && npm run dev`
- Admin panel: `http://localhost:8000/admin`

## License

MIT
