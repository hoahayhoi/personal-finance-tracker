---
inclusion: auto
keywords: ["review", "check", "kiểm tra", "đúng chưa", "code review"]
---

# Code Reviewer

Khi review code Next.js, kiểm tra theo thứ tự ưu tiên sau:

## 🔴 Priority 1: Security (Bắt buộc sửa ngay)

### 1. Missing auth check trong Server Action / Route Handler

```typescript
// ❌ CRITICAL
export async function deleteTransaction(id: string) {
  await db.transaction.delete({ where: { id } })
}

// ✅ ĐÚNG
export async function deleteTransaction(id: string) {
  const session = await getSession()
  if (!session) return { success: false, error: 'Unauthorized' }
  
  const tx = await db.transaction.findUnique({ where: { id } })
  if (!tx || tx.userId !== session.user.id) {
    return { success: false, error: 'Forbidden' }
  }
  await db.transaction.delete({ where: { id } })
}
```

### 2. Missing userId filter trong DB query

```typescript
// ❌ CRITICAL — lấy tất cả transactions, lộ data người khác
const transactions = await db.transaction.findMany()

// ✅ ĐÚNG
const transactions = await db.transaction.findMany({
  where: { userId: session.user.id }
})
```

## 🔴 Priority 2: Correctness

### 3. Input validation bị bỏ qua

```typescript
// ❌ SAI
export async function createTransaction(data: unknown) {
  await db.transaction.create({ data: data as any })
}

// ✅ ĐÚNG
const parsed = schema.safeParse(data)
if (!parsed.success) return { success: false, error: parsed.error.message }
```

### 4. Thiếu revalidatePath sau mutation

```typescript
// ❌ SAI
await db.transaction.create({ data: ... })
return { success: true }

// ✅ ĐÚNG
await db.transaction.create({ data: ... })
revalidatePath('/transactions')
revalidatePath('/dashboard')
return { success: true }
```

### 5. Không handle lỗi DB

```typescript
// ✅ ĐÚNG
try {
  await db.transaction.create({ data })
  return { success: true }
} catch {
  return { success: false, error: 'Lỗi hệ thống, thử lại sau' }
}
```

## 🟡 Priority 3: Architecture

### 6. 'use client' không cần thiết

```typescript
// ✅ Page là Server Component, push 'use client' xuống component nhỏ
export default async function TransactionsPage() {
  const data = await getTransactions()
  return <TransactionTable data={data} />
}
```

### 7. Tạo PrismaClient mới thay vì dùng singleton

```typescript
// ❌ SAI
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// ✅ ĐÚNG
import { db } from '@/lib/db'
```

## 🟡 Priority 4: TypeScript

### 8. Dùng 'any'

```typescript
// ❌ SAI
function process(data: any) {}

// ✅ ĐÚNG
function process(data: Transaction) {}
```

### 9. Props không có type

```typescript
// ✅ ĐÚNG
interface TransactionTableProps {
  data: TransactionWithCategory[]
  onDelete: (id: string) => void
}
function TransactionTable({ data, onDelete }: TransactionTableProps) {}
```

## 🟢 Priority 5: Code Quality

### 10. console.log bị bỏ quên
### 11. Hardcode giá trị nên là constant
### 12. formatCurrency không được dùng

```typescript
// ❌ SAI
<span>{amount.toLocaleString()} VNĐ</span>

// ✅ ĐÚNG
import { formatCurrency } from '@/lib/utils'
<span>{formatCurrency(amount)}</span>
```

## Format báo cáo review

```
## Kết quả Review

### 🔴 Critical (phải sửa ngay)
- [file:line] Mô tả vấn đề + cách sửa

### 🟡 Warning (nên sửa)
- [file:line] Mô tả vấn đề + cách sửa

### 🟢 OK
- ✅ Auth check có đầy đủ
- ✅ TypeScript types đầy đủ

### 📊 Tổng kết
Critical: X | Warning: Y | OK: Z
→ [Pass / Cần sửa trước khi commit]
```
