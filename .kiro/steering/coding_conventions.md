---
inclusion: always
---

# Coding Conventions — Personal Finance Tracker

Quy ước code bắt buộc cho toàn bộ dự án. Agent phải tuân thủ khi implement bất kỳ feature nào.

## Tech Stack

| Layer | Công nghệ | Version |
|---|---|---|
| Framework | Next.js App Router | 15 LTS |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS | v4 |
| Component UI | shadcn/ui | latest |
| Auth | Auth.js (NextAuth) | v4 stable |
| Database | PostgreSQL (Neon) | 16 |
| ORM | Prisma | 6.x |
| Validation | Zod | 3.x |
| State (URL) | nuqs | latest |
| State (Global) | Zustand | 5.x |
| Charts | Recharts | 2.x |
| Toast | Sonner | latest |

## Server vs Client Component

**Nguyên tắc:** Mặc định Server Component. Chỉ thêm 'use client' khi cần:
- useState, useEffect, useReducer
- onClick, onChange, event handlers
- Browser APIs (window, localStorage)
- Third-party client-only libraries

**Pattern:** Push 'use client' xuống sâu nhất có thể

```tsx
// ✅ Page là Server Component
export default async function TransactionsPage() {
  const transactions = await getTransactions()
  return <TransactionTable data={transactions} />
}

// ✅ Chỉ component cần state là client
'use client'
export function TransactionTable({ data }) {
  const [filter, setFilter] = useState('all')
}
```

## Naming Conventions

| Loại | Convention | Ví dụ |
|---|---|---|
| Component files | PascalCase.tsx | TransactionTable.tsx |
| Page files | page.tsx | app/(app)/dashboard/page.tsx |
| Utility/lib | camelCase.ts | formatCurrency.ts |
| Server Actions | camelCase.ts | createTransaction.ts |
| Folders | kebab-case | transaction-form/ |
| Components | PascalCase | TransactionTable() |
| Functions | camelCase | getDashboardSummary() |
| Constants | UPPER_SNAKE_CASE | DEFAULT_PAGE_SIZE |
| Types/Interfaces | PascalCase | TransactionType |
| Zod schemas | camelCase + Schema | createTransactionSchema |

## Folder Structure

```
src/
├── app/
│   ├── (auth)/          # Route group — login, register
│   ├── (app)/           # Protected routes — dashboard, transactions
│   ├── api/             # Route handlers
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # shadcn/ui (auto-generated)
│   ├── layout/          # Sidebar, Header, BottomNav
│   ├── dashboard/
│   ├── transactions/
│   └── categories/
├── stores/              # Zustand stores
├── lib/
│   ├── auth.ts
│   ├── db.ts            # Prisma singleton
│   ├── utils.ts
│   └── validations.ts
├── actions/             # Server Actions
└── types/
```

## shadcn/ui Rules

```bash
# Cài component qua CLI
npx shadcn@latest add button
npx shadcn@latest add dialog
```

```tsx
// ✅ Import từ components/ui/
import { Button } from '@/components/ui/button'

// ✅ Customize qua className
<Button className="w-full mt-4">Thêm</Button>

// ❌ Không tự viết Button khi shadcn có
```

## State Management

| Loại state | Giải pháp |
|---|---|
| Filter, pagination, search | URL state (nuqs) |
| Modal open/close, sidebar | Zustand |
| Theme, preferences | Zustand + localStorage |
| Server data | Server Component + Actions |
| Form state | react-hook-form |

## Server Actions Pattern

```typescript
'use server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  amount: z.number().positive(),
})

type ActionResult = { success: true } | { success: false; error: string }

export async function createTransaction(data: z.infer<typeof schema>): Promise<ActionResult> {
  // 1. Check auth
  const session = await getSession()
  if (!session) return { success: false, error: 'Unauthorized' }
  
  // 2. Validate
  const parsed = schema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.message }
  
  // 3. DB operation
  try {
    await db.transaction.create({
      data: { ...parsed.data, userId: session.user.id }
    })
    revalidatePath('/transactions')
    return { success: true }
  } catch {
    return { success: false, error: 'Lỗi hệ thống' }
  }
}
```

## Prisma Singleton

```typescript
// src/lib/db.ts — BẮT BUỘC dùng
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

```typescript
// ✅ Import từ @/lib/db
import { db } from '@/lib/db'

// ❌ Không tạo instance mới
const prisma = new PrismaClient()
```

## TypeScript Rules

```typescript
// ✅ Type props đầy đủ
interface TransactionTableProps {
  data: Transaction[]
  onDelete: (id: string) => void
}

// ✅ Dùng type từ Prisma
import type { Transaction } from '@prisma/client'

// ❌ Không dùng any
function process(data: any) {}
```

## Tailwind + cn()

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  'rounded-lg p-4',
  isExpense ? 'border-destructive/30' : 'border-green-500/30',
  className
)} />
```

## Format Currency

```typescript
// src/lib/utils.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}
```

## Error Handling + Toast

```tsx
'use client'
import { toast } from 'sonner'

async function handleSubmit(data) {
  const result = await createTransaction(data)
  
  if (!result.success) {
    toast.error(result.error)
    return
  }
  
  toast.success('Đã thêm giao dịch')
}
```

## Checklist trước commit

- [ ] Không có console.log
- [ ] Không có type any
- [ ] Server Actions có auth check
- [ ] Inputs đã validate bằng Zod
- [ ] Props có type đầy đủ
- [ ] revalidatePath sau mutation
- [ ] Dùng shadcn/ui thay vì tự viết
- [ ] State đúng loại (URL vs Zustand)
- [ ] Test responsive
