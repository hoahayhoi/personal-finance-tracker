# Personal Finance Tracker - Frontend

Next.js 15 frontend kết nối với Django REST API backend.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript 5.x
- Tailwind CSS v4
- shadcn/ui components
- Zustand (state management)
- Recharts (charts)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Django API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Database (optional - nếu dùng Prisma)
DATABASE_URL=postgresql://...

# Auth (optional - nếu dùng NextAuth)
AUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Integration

Frontend gọi Django API thông qua `src/lib/api.ts`:

```typescript
import { apiClient } from '@/lib/api'

// Login
const { access, refresh } = await apiClient.login({ email, password })

// Get transactions
const transactions = await apiClient.getTransactions({ month: 3, year: 2026 })

// Create transaction
await apiClient.createTransaction({
  amount: 50000,
  type: 'EXPENSE',
  category_id: 'uuid',
  date: '2026-03-09',
  note: 'Lunch'
})
```

## Authentication

Sử dụng JWT tokens từ Django:

```typescript
import { useAuth } from '@/hooks/useAuth'

function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  
  const handleLogin = async () => {
    await login(email, password)
    // Token được lưu tự động
  }
}
```

## Project Structure

```
src/
├── app/              # Next.js pages
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── lib/             # Utilities
│   ├── api.ts       # Django API client
│   └── utils.ts     # Helper functions
├── hooks/           # Custom hooks
│   └── useAuth.ts   # Auth hook
└── types/           # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Notes

- Backend phải chạy trước tại `http://localhost:8000`
- JWT tokens được lưu trong localStorage
- CORS đã được cấu hình trong Django backend
