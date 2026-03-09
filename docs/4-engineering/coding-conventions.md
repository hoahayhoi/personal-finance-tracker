# 📐 Coding Conventions — Personal Finance Tracker

> Tài liệu này định nghĩa quy ước code cho toàn bộ dự án.
> **Agent phải đọc và tuân thủ file này khi implement bất kỳ feature nào.**

---

## 1. Tech Stack chuẩn

> **Tiêu chí chọn version:** Ưu tiên bản **LTS / Stable** mà doanh nghiệp thực tế đang dùng (tính đến 2025). Tránh dùng bản RC/Beta trong môi trường production.

| Layer | Công nghệ | Version | Ghi chú |
|---|---|---|---|
| Framework | Next.js App Router | **15 LTS** | LTS đến Oct 2026; doanh nghiệp ưu tiên 15 thay vì 16 mới nhất |
| Language | TypeScript (strict mode) | **5.x** | Không dùng `any`, luôn type đầy đủ |
| Styling | Tailwind CSS | **v4** | CSS-first config; v4 stable từ Jan 2025, khuyến nghị cho project mới |
| Component UI | shadcn/ui | **latest** | Copy-paste components, không phải dependency; build trên Radix UI |
| Auth | Auth.js (NextAuth) | **v4 stable** ⚠️ | v5 vẫn còn beta — chỉ dùng v5 nếu chấp nhận rủi ro breaking changes |
| Database | PostgreSQL (Neon / Supabase) | **PostgreSQL 16** | Neon/Supabase cung cấp free tier, phù hợp learning lẫn production |
| ORM | Prisma | **6.x** | v7 mới release (Nov 2025), enterprise nên dùng 6.x ổn định; singleton tại `src/lib/db.ts` |
| Validation | Zod | **3.x** | Validate mọi input từ user và API |
| State (URL) | `nuqs` + `useSearchParams` | **latest** | Filter, pagination, sorting — shareable & SEO-friendly |
| State (Global) | Zustand | **5.x** | UI state không cần URL: theme, modal, auth context |
| Charts | Recharts | **2.x** | Dùng `<ResponsiveContainer>` bao ngoài |
| Toast | Sonner | **latest** | Notification system; import từ `sonner` |

### ⚠️ Lưu ý quan trọng về Auth.js

```
- Auth.js v5 (next-auth@beta): App Router-first, API mới hoàn toàn — CHƯA stable
- Auth.js v4 (next-auth@^4): Stable, được dùng rộng rãi trong production
- Dự án này dùng v4. Nếu upgrade lên v5, phải đọc migration guide và test kỹ.
- Tutorial trên mạng phần lớn vẫn dùng v4 — cẩn thận khi copy code v5.
```

---

## 2. Quy tắc Server vs Client Component

### Nguyên tắc vàng

```
Mặc định → Server Component
Chỉ thêm 'use client' khi THỰC SỰ cần:
  ✅ useState, useEffect, useReducer
  ✅ onClick, onChange, event handlers
  ✅ Browser APIs (window, localStorage)
  ✅ Third-party client-only libraries (Recharts...)
```

### Pattern chuẩn: Push 'use client' xuống sâu nhất có thể

```tsx
// ✅ ĐÚNG — Page là Server Component
// app/(app)/transactions/page.tsx
export default async function TransactionsPage() {
  const transactions = await getTransactions() // fetch ở server
  return <TransactionTable data={transactions} /> // truyền xuống client
}

// components/transactions/TransactionTable.tsx
'use client' // chỉ file này là client
export function TransactionTable({ data }) {
  const [filter, setFilter] = useState('all')
  // ...
}
```

```tsx
// ❌ SAI — Không biến cả page thành client chỉ vì cần 1 button
'use client'
export default function TransactionsPage() { // client không cần thiết
  const [data, setData] = useState([])
  useEffect(() => { fetch('/api/transactions')... }) // tệ hơn
}
```

---

## 3. Naming Conventions

### Files & Folders

| Loại | Convention | Ví dụ |
|---|---|---|
| Component files | `PascalCase.tsx` | `TransactionTable.tsx` |
| Page files | `page.tsx` | `app/(app)/dashboard/page.tsx` |
| Layout files | `layout.tsx` | `app/(app)/layout.tsx` |
| Utility/lib | `camelCase.ts` | `formatCurrency.ts` |
| Server Actions | `camelCase.ts` | `createTransaction.ts` |
| Types | `camelCase.ts` hoặc `index.ts` | `src/types/index.ts` |
| Folders | `kebab-case` hoặc lowercase | `components/transaction-form/` |

### Functions & Variables

```typescript
// Components — PascalCase
export function TransactionTable() {}
export function SummaryCard() {}

// Functions — camelCase
async function getDashboardSummary() {}
function formatCurrency(amount: number) {}

// Constants — UPPER_SNAKE_CASE
const DEFAULT_PAGE_SIZE = 20
const MAX_NOTE_LENGTH = 255

// Types & Interfaces — PascalCase
type TransactionType = 'INCOME' | 'EXPENSE'
interface DashboardSummary { balance: number; ... }

// Zod schemas — camelCase + Schema suffix
const createTransactionSchema = z.object({ ... })
```

---

## 4. Folder Structure Chi tiết

```
src/
├── app/
│   ├── (auth)/                   # Route group — không ảnh hưởng URL
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx            # Layout centered, không sidebar
│   ├── (app)/                    # Route group — protected routes
│   │   ├── layout.tsx            # Sidebar + header layout
│   │   ├── dashboard/page.tsx
│   │   ├── transactions/page.tsx
│   │   ├── categories/page.tsx
│   │   └── profile/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── transactions/
│   │   │   ├── route.ts          # GET, POST
│   │   │   └── [id]/route.ts     # PATCH, DELETE
│   │   └── categories/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── layout.tsx                # Root layout — font, metadata
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # shadcn/ui components (auto-generated, KHÔNG tự viết)
│   │   ├── button.tsx            # npx shadcn@latest add button
│   │   ├── input.tsx
│   │   ├── dialog.tsx            # thay thế Modal thủ công
│   │   └── sonner.tsx            # Toast wrapper
│   ├── layout/                   # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── BottomNav.tsx
│   ├── dashboard/
│   ├── transactions/
│   ├── categories/
│   ├── profile/
│   └── landing/
├── stores/                       # Zustand global state stores
│   ├── useUIStore.ts             # Modal open/close, sidebar state
│   └── useFilterStore.ts         # (nếu cần — ưu tiên URL state trước)
├── lib/
│   ├── auth.ts                   # Auth.js config + helpers
│   ├── db.ts                     # Prisma singleton
│   ├── utils.ts                  # Helpers: formatCurrency, cn()...
│   └── validations.ts            # Zod schemas
├── actions/                      # Server Actions (tách riêng)
│   ├── transaction.actions.ts
│   ├── category.actions.ts
│   └── auth.actions.ts
└── types/
    └── index.ts                  # Shared types
```

---

## 5. shadcn/ui — Quy tắc dùng

### Cài đặt component

```bash
# Dùng CLI — KHÔNG copy-paste thủ công
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add sonner
```

### Import và dùng

```tsx
// ✅ ĐÚNG — import từ components/ui/ (shadcn generate sẵn)
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'

// ✅ ĐÚNG — Customize qua className (Tailwind), không sửa file ui/ trực tiếp
<Button className="w-full mt-4">Thêm giao dịch</Button>

// ❌ SAI — Tự viết Button từ đầu khi shadcn đã có
function Button({ children }) {
  return <button className="px-4 py-2 ...">{children}</button>
}
```

### Nguyên tắc

```
✅ Ưu tiên dùng shadcn/ui component trước khi tự viết
✅ Có thể sửa nội dung file trong components/ui/ nếu cần customize sâu
✅ Dùng cn() helper để extend className
❌ Không import trực tiếp từ @radix-ui — dùng qua shadcn wrapper
```

---

## 6. State Management — Quy tắc

### Khi nào dùng gì?

```
┌─────────────────────────────┬──────────────────────────────────────┐
│ Loại state                  │ Giải pháp                            │
├─────────────────────────────┼──────────────────────────────────────┤
│ Filter, pagination, search  │ URL state (nuqs / useSearchParams)   │
│ Modal open/close, sidebar   │ Zustand (useUIStore)                 │
│ Theme, user preferences     │ Zustand (persist to localStorage)    │
│ Server data (transactions…) │ Server Component + Server Actions    │
│ Form state                  │ react-hook-form (local component)    │
└─────────────────────────────┴──────────────────────────────────────┘
```

### URL State — dùng nuqs

```tsx
// app/(app)/transactions/page.tsx
import { parseAsString, useQueryState } from 'nuqs'

// ✅ Filter qua URL → shareable, SEO-friendly, persist khi refresh
export default function TransactionsPage({
  searchParams,
}: {
  searchParams: { month?: string; type?: string }
}) {
  // Server Component đọc trực tiếp từ searchParams
  const { month, type } = searchParams
  const transactions = await getTransactions({ month, type })
  return <TransactionTable data={transactions} />
}

// components/transactions/TransactionFilters.tsx
'use client'
import { useQueryState } from 'nuqs'

export function TransactionFilters() {
  const [month, setMonth] = useQueryState('month')
  const [type, setType] = useQueryState('type')
  // Thay đổi filter → URL thay đổi → page re-render với data mới
}
```

### Zustand Store — dùng cho UI state

```typescript
// src/stores/useUIStore.ts
import { create } from 'zustand'

interface UIState {
  isAddTransactionOpen: boolean
  openAddTransaction: () => void
  closeAddTransaction: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isAddTransactionOpen: false,
  openAddTransaction: () => set({ isAddTransactionOpen: true }),
  closeAddTransaction: () => set({ isAddTransactionOpen: false }),
}))

// Usage trong bất kỳ Client Component nào
'use client'
import { useUIStore } from '@/stores/useUIStore'

function AddButton() {
  const openAddTransaction = useUIStore((s) => s.openAddTransaction)
  return <Button onClick={openAddTransaction}>+ Thêm</Button>
}
```

---

## 7. Server Actions — Pattern chuẩn

```typescript
// src/actions/transaction.actions.ts
'use server'

import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// 1. Define schema
const createTransactionSchema = z.object({
  amount: z.number().positive('Số tiền phải lớn hơn 0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().min(1, 'Bắt buộc chọn danh mục'),
  date: z.string(),
  note: z.string().max(255).optional(),
})

// 2. Return type rõ ràng
type ActionResult = { success: true } | { success: false; error: string }

export async function createTransaction(
  data: z.infer<typeof createTransactionSchema>
): Promise<ActionResult> {
  // 3. Always check auth first
  const session = await getSession()
  if (!session) return { success: false, error: 'Unauthorized' }

  // 4. Validate input
  const parsed = createTransactionSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  // 5. DB operation
  try {
    await db.transaction.create({
      data: { ...parsed.data, userId: session.user.id }
    })
    revalidatePath('/transactions')
    revalidatePath('/dashboard')
    return { success: true }
  } catch {
    return { success: false, error: 'Lỗi hệ thống, thử lại sau' }
  }
}
```

---

## 8. Route Handler — Pattern chuẩn

```typescript
// app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  // 1. Auth check
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse query params
  const { searchParams } = req.nextUrl
  const month = searchParams.get('month')

  // 3. Query DB
  const transactions = await db.transaction.findMany({
    where: { userId: session.user.id },
    include: { category: true },
    orderBy: { date: 'desc' },
  })

  // 4. Return response
  return NextResponse.json({ data: transactions })
}
```

---

## 9. Prisma — Quy tắc dùng

```typescript
// src/lib/db.ts — Singleton pattern (bắt buộc)
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

```typescript
// ✅ ĐÚNG — import từ @/lib/db
import { db } from '@/lib/db'

// ❌ SAI — tạo instance mới mỗi lần
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

---

## 10. TypeScript — Quy tắc

```typescript
// ✅ Luôn type props đầy đủ
interface TransactionTableProps {
  data: Transaction[]
  onDelete: (id: string) => void
}

// ✅ Dùng type từ Prisma khi cần
import type { Transaction, Category } from '@prisma/client'

// ✅ Tạo type mở rộng khi cần join
type TransactionWithCategory = Transaction & {
  category: Category
}

// ❌ Không dùng any
function process(data: any) {} // SAI

// ❌ Không bỏ qua error TS bằng @ts-ignore, dùng type cast đúng cách
```

---

## 11. Tailwind CSS — Quy tắc

```tsx
// ✅ Dùng cn() helper để merge class có điều kiện
import { cn } from '@/lib/utils'

function Button({ variant, className, ...props }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
        className
      )}
      {...props}
    />
  )
}

// ❌ Không dùng inline style khi có thể dùng Tailwind
<div style={{ color: 'red' }}>  // SAI
<div className="text-red-500">  // ĐÚNG
```

---

## 12. Formatting số tiền VNĐ

```typescript
// src/lib/utils.ts — Luôn dùng hàm này, không format thủ công
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

// Usage
formatCurrency(150000) // → "150.000 ₫"
```

---

## 13. Error Handling & Toast

```tsx
// Pattern chuẩn cho Client Component gọi Server Action
'use client'
import { toast } from 'sonner' // Dự án này dùng Sonner — xem bảng tech stack

async function handleSubmit(data) {
  const result = await createTransaction(data)

  if (!result.success) {
    toast.error(result.error)
    return
  }

  toast.success('Đã thêm giao dịch')
  onClose?.()
}
```

---

## 14. Checklist trước khi commit code

- [ ] Không có `console.log` bị bỏ quên
- [ ] Không có type `any`
- [ ] Tất cả Server Actions có auth check
- [ ] Tất cả inputs đã được validate bằng Zod
- [ ] Component mới có type Props đầy đủ
- [ ] `revalidatePath` được gọi sau mutation
- [ ] Dùng shadcn/ui component thay vì tự viết từ đầu
- [ ] State đúng loại: filter/search → URL state; UI state → Zustand
- [ ] Responsive: test trên màn hình nhỏ
