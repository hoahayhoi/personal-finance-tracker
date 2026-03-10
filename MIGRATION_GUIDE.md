# Migration Guide - Tách Backend và Frontend

Hướng dẫn chi tiết về việc tách project thành Django backend và Next.js frontend.

## Tổng quan thay đổi

### Trước (Monolith)
```
personal-finance-tracker/
├── src/              # Next.js code
├── prisma/           # Database schema
├── package.json
└── ...
```

### Sau (Separated)
```
personal-finance-tracker/
├── backend/          # Django REST API
├── frontend/         # Next.js App
└── docs/            # Shared docs
```

## Các thay đổi chính

### 1. Database Layer

**Trước:** Prisma ORM trong Next.js
```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()
```

**Sau:** Django ORM trong backend
```python
# backend/transactions/models.py
from django.db import models

class Transaction(models.Model):
    amount = models.DecimalField(max_digits=15, decimal_places=0)
    # ...
```

### 2. Authentication

**Trước:** NextAuth.js (Auth.js)
```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth'
```

**Sau:** JWT tokens từ Django
```typescript
// frontend/src/hooks/useAuth.ts
const { access, refresh } = await apiClient.login({ email, password })
```

### 3. API Layer

**Trước:** Next.js API Routes
```typescript
// src/app/api/transactions/route.ts
export async function GET() {
  const transactions = await db.transaction.findMany()
  return Response.json(transactions)
}
```

**Sau:** Django REST Framework
```python
# backend/transactions/views.py
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
```

### 4. Frontend Data Fetching

**Trước:** Server Actions
```typescript
'use server'
export async function getTransactions() {
  return await db.transaction.findMany()
}
```

**Sau:** API Client
```typescript
// frontend/src/lib/api.ts
export const apiClient = {
  async getTransactions() {
    return fetch(`${API_URL}/api/transactions/`)
  }
}
```

## Migration Steps

### Bước 1: Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Setup database
createdb finance_db

# Configure .env
cp .env.example .env
# Edit database credentials

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed categories
python manage.py seed_categories

# Start server
python manage.py runserver
```

### Bước 2: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add: NEXT_PUBLIC_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

### Bước 3: Update Code

#### 3.1. Replace Server Actions với API Calls

**Trước:**
```typescript
// src/actions/transactions.ts
'use server'
export async function createTransaction(data) {
  return await db.transaction.create({ data })
}
```

**Sau:**
```typescript
// frontend/src/lib/api.ts
await apiClient.createTransaction({
  amount: 50000,
  type: 'EXPENSE',
  category_id: 'uuid',
  date: '2026-03-09'
})
```

#### 3.2. Update Authentication

**Trước:**
```typescript
import { getSession } from '@/lib/auth'
const session = await getSession()
```

**Sau:**
```typescript
import { useAuth } from '@/hooks/useAuth'
const { user, isAuthenticated } = useAuth()
```

#### 3.3. Update Data Types

**Trước:**
```typescript
import type { Transaction } from '@prisma/client'
```

**Sau:**
```typescript
// frontend/src/types/index.ts
export interface Transaction {
  id: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  // ...
}
```

## Checklist Migration

### Backend
- [x] Django project initialized
- [x] Models created (User, Category, Transaction)
- [x] REST API endpoints
- [x] JWT authentication
- [x] CORS configured
- [x] Admin panel setup
- [ ] Data migration from Prisma to Django

### Frontend
- [x] Code moved to frontend/
- [x] API client created
- [x] Auth hook with JWT
- [x] Environment variables updated
- [ ] Replace all Server Actions với API calls
- [ ] Update authentication flow
- [ ] Test all features

### Testing
- [ ] Backend API endpoints work
- [ ] Frontend can call backend
- [ ] Authentication flow works
- [ ] CRUD operations work
- [ ] Dashboard data loads correctly

## Common Issues

### Issue 1: CORS Error

**Error:** `Access to fetch blocked by CORS policy`

**Solution:** Check Django settings:
```python
# backend/config/settings.py
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
```

### Issue 2: 401 Unauthorized

**Error:** API returns 401

**Solution:** Ensure JWT token is sent:
```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

### Issue 3: Database Connection

**Error:** `connection to server failed`

**Solution:** Check PostgreSQL is running and .env is correct

## Next Steps

1. Migrate existing data từ Prisma database sang Django
2. Update tất cả components để dùng API client
3. Remove Prisma dependencies từ frontend
4. Test thoroughly
5. Deploy backend và frontend riêng biệt

## Resources

- Django REST Framework: https://www.django-rest-framework.org/
- Next.js Data Fetching: https://nextjs.org/docs/app/building-your-application/data-fetching
- JWT Authentication: https://django-rest-framework-simplejwt.readthedocs.io/
