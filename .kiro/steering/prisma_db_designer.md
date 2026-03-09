---
inclusion: auto
fileMatchPattern: "**/prisma/**"
---

# Prisma DB Designer

Khi thiết kế hoặc chỉnh sửa Prisma schema, tuân thủ các nguyên tắc sau:

## 1. Singleton — bắt buộc

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

## 2. ID — dùng CUID2

```prisma
// ✅ ĐÚNG
model User {
  id String @id @default(cuid())
}

// ❌ SAI — Int dễ đoán
model User {
  id Int @id @default(autoincrement())
}
```

## 3. Timestamps — luôn có

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

## 4. Cascade Delete — khai báo rõ

```prisma
// ✅ ĐÚNG
model Transaction {
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Cascade strategy:**
- User → Transaction: `Cascade`
- User → Category: `Cascade`
- Category → Transaction: `Restrict`

## 5. Unique Constraint

```prisma
// ✅ ĐÚNG — DB enforce
model Category {
  name   String
  type   TransactionType
  userId String
  @@unique([name, type, userId])
}
```

## 6. Decimal cho tiền tệ

```prisma
// ✅ ĐÚNG
amount Decimal @db.Decimal(15, 0)

// ❌ SAI — Float có rounding error
amount Float
```

## 7. Query Patterns

### Luôn filter theo userId

```typescript
const transactions = await db.transaction.findMany({
  where: {
    userId: session.user.id,
    ...(month && { date: { gte: startOfMonth, lte: endOfMonth } }),
  },
  include: { category: true },
  orderBy: { date: 'desc' },
})
```

### Aggregate (tính tổng)

```typescript
const income = await db.transaction.aggregate({
  where: { userId: session.user.id, type: 'INCOME' },
  _sum: { amount: true },
})

const totalIncome = Number(income._sum.amount ?? 0)
```

## Migration Strategy

| Tình huống | Command |
|---|---|
| Dev: thêm field nullable | `npx prisma db push` |
| Production: mọi thay đổi | `npx prisma migrate dev --name "..."` |

## Seed Pattern

```typescript
// prisma/seed.ts
await prisma.category.upsert({
  where: { /* unique field */ },
  update: {},
  create: { name: 'Ăn uống', type: 'EXPENSE', icon: '🍜' },
})
```

## Checklist

- [ ] `@id @default(cuid())`
- [ ] `createdAt` và `updatedAt` có đủ
- [ ] `onDelete` khai báo rõ
- [ ] Tiền dùng `Decimal`
- [ ] `@@unique` thay vì check trong code
- [ ] Field nullable chỉ khi thực sự cần
