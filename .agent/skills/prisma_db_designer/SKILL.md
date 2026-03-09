---
name: prisma_db_designer
description: >
  Kích hoạt khi cần thiết kế hoặc chỉnh sửa Prisma schema, migration, seed data.
  Skill này đảm bảo schema đúng chuẩn production: type-safe, có index phù hợp,
  cascade delete đúng, không có design trap phổ biến.
---

# Skill: Prisma DB Designer

## Khi nào dùng skill này?

- Cần thiết kế schema mới hoặc thêm model
- Cần chỉnh sửa relation, thêm field
- Cần viết seed data
- Người dùng hỏi về DB design, migration, query optimization

---

## Nguyên tắc 1: Singleton — bắt buộc

```typescript
// src/lib/db.ts — KHÔNG bao giờ tạo PrismaClient ngoài file này
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

---

## Nguyên tắc 2: ID — dùng CUID2, không phải Int

```prisma
// ✅ ĐÚNG — CUID an toàn, không đoán được
model User {
  id String @id @default(cuid())
}

// ❌ SAI — Int auto-increment dễ đoán, dễ bị enumeration attack
model User {
  id Int @id @default(autoincrement())
}
```

---

## Nguyên tắc 3: Timestamps — luôn có createdAt và updatedAt

```prisma
// ✅ Mọi model đều phải có
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt   // @updatedAt tự cập nhật khi record thay đổi
```

---

## Nguyên tắc 4: Cascade Delete — phải khai báo rõ

```prisma
// ✅ ĐÚNG — khi User bị xóa, toàn bộ Transaction của họ cũng bị xóa
model Transaction {
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ❌ SAI — thiếu onDelete, Prisma sẽ báo lỗi hoặc dùng mặc định không an toàn
model Transaction {
  userId String
  user   User   @relation(fields: [userId], references: [id])
}
```

**Cascade strategy cho dự án này:**

| Relation | onDelete |
|---|---|
| User → Transaction | `Cascade` — xóa user thì xóa hết transactions |
| User → Category | `Cascade` — xóa user thì xóa hết categories |
| Category → Transaction | `Restrict` — không xóa category khi có transaction |

---

## Nguyên tắc 5: Unique Constraint — dùng @@unique thay vì logic app

```prisma
// ✅ ĐÚNG — DB enforce, không thể bypass qua code
model Category {
  name   String
  type   TransactionType
  userId String
  // Không cho trùng tên + loại trong cùng user
  @@unique([name, type, userId])
}

// ❌ SAI — chỉ check trong code, race condition có thể tạo duplicate
// if (await db.category.findFirst({ where: { name, type, userId } })) ...
```

---

## Nguyên tắc 6: Decimal cho tiền tệ — không dùng Float

```prisma
// ✅ ĐÚNG — Decimal tránh floating point error
amount Decimal @db.Decimal(15, 0)  // 15 digits, 0 decimal (VNĐ không có xu)

// ❌ SAI — Float có rounding error: 0.1 + 0.2 = 0.30000000000000004
amount Float
```

---

## Nguyên tắc 7: Nullable vs Required — suy nghĩ kỹ

```prisma
// Câu hỏi: field này CÓ THỂ không có giá trị không?
// Nếu có → String?  | Nếu không → String

model User {
  name           String?  // nullable — user có thể chưa set tên
  email          String   // required — bắt buộc để login
  hashedPassword String?  // nullable — null nếu dùng OAuth
}

model Transaction {
  note String? @db.VarChar(255)  // nullable — ghi chú tùy chọn
  date DateTime                   // required — không thể thiếu ngày
}
```

---

## Migration Strategy

### Dev environment

```bash
# Thay đổi schema → push ngay (không tạo migration file)
npx prisma db push

# Xem thay đổi trực quan
npx prisma studio
```

### Production (staging → production)

```bash
# Tạo migration file có tên rõ ràng
npx prisma migrate dev --name "add_category_color_field"

# Trước khi deploy, review migration file trong prisma/migrations/
# Deploy → chạy migration
npx prisma migrate deploy
```

### Khi nào dùng gì?

| Tình huống | Command |
|---|---|
| Dev: thêm field nullable | `db push` — nhanh |
| Dev: xóa field, thay đổi type | `db push` (cẩn thận với data loss) |
| Production: mọi thay đổi | `migrate dev` → `migrate deploy` |

---

## Seed Data Pattern

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding...')

  // Dùng upsert để seed có thể chạy nhiều lần an toàn
  await prisma.category.upsert({
    where: { /* unique field */ },
    update: {},   // không update nếu đã có
    create: { name: 'Ăn uống', type: 'EXPENSE', icon: '🍜' },
  })

  console.log('Seeding done.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

```json
// package.json — đăng ký seed command
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## Query Patterns chuẩn

### Luôn filter theo userId

```typescript
// ✅ Luôn có where: { userId: session.user.id }
const transactions = await db.transaction.findMany({
  where: {
    userId: session.user.id,
    // thêm filter khác
    ...(month && { date: { gte: startOfMonth, lte: endOfMonth } }),
  },
  include: { category: true },
  orderBy: { date: 'desc' },
  take: limit,
  skip: (page - 1) * limit,
})
```

### Select chỉ field cần thiết (tránh over-fetching)

```typescript
// ✅ ĐÚNG — chỉ lấy field cần
const categories = await db.category.findMany({
  where: { userId: session.user.id },
  select: { id: true, name: true, icon: true, color: true, type: true },
})

// ❌ Tránh khi có relation lớn
// const categories = await db.category.findMany({
//   include: { transactions: true }  // có thể lấy hàng nghìn records
// })
```

### Aggregate (tính tổng thu/chi)

```typescript
// Tính tổng thu và chi trong tháng
const [income, expense] = await Promise.all([
  db.transaction.aggregate({
    where: { userId: session.user.id, type: 'INCOME', date: { gte: start, lte: end } },
    _sum: { amount: true },
  }),
  db.transaction.aggregate({
    where: { userId: session.user.id, type: 'EXPENSE', date: { gte: start, lte: end } },
    _sum: { amount: true },
  }),
])

const totalIncome  = Number(income._sum.amount ?? 0)
const totalExpense = Number(expense._sum.amount ?? 0)
const balance = totalIncome - totalExpense
```

> **Lưu ý:** `Decimal` từ Prisma cần convert sang `Number` trước khi dùng trong JS.

---

## Checklist trước khi thay đổi schema

- [ ] `@id @default(cuid())` — không dùng Int autoincrement
- [ ] `createdAt` và `updatedAt` có đủ
- [ ] `onDelete` được khai báo rõ ràng cho mọi relation
- [ ] Tiền tệ dùng `Decimal`, không dùng `Float`
- [ ] `@@unique` thay vì chỉ check trong code
- [ ] Field nullable (`?`) chỉ khi thực sự có thể null
- [ ] Đã test `db push` thành công trên local
- [ ] Seed có thể chạy nhiều lần (upsert thay vì create)
