---
name: code_reviewer
description: >
  Kích hoạt khi cần review code Next.js theo chuẩn dự án. Skill này đảm bảo
  code được kiểm tra về correctness, security, performance và conventions
  trước khi commit hoặc được chấp nhận là "done".
---

# Skill: Code Reviewer

## Khi nào dùng skill này?

- Người dùng nói "review code này", "check lại code", "code đúng chưa"
- Sau khi agent implement xong một feature (self-review)
- Trước khi đánh dấu task là `[x]` trong progress tracker

---

## Quy trình review — theo thứ tự ưu tiên

### 🔴 Priority 1: Security (Bảo mật)

Lỗi bảo mật nghiêm trọng nhất — phải sửa ngay:

```
1. Missing auth check trong Server Action / Route Handler

   // ❌ CRITICAL — không check auth
   export async function deleteTransaction(id: string) {
     await db.transaction.delete({ where: { id } })
   }

   // ✅ ĐÚNG — luôn check auth và ownership
   export async function deleteTransaction(id: string) {
     const session = await getSession()
     if (!session) return { success: false, error: 'Unauthorized' }

     // ⚠️ Phải verify ownership — không tin id từ client
     const tx = await db.transaction.findUnique({ where: { id } })
     if (!tx || tx.userId !== session.user.id) {
       return { success: false, error: 'Forbidden' }
     }
     await db.transaction.delete({ where: { id } })
   }

2. Missing userId filter trong DB query

   // ❌ CRITICAL — lấy tất cả transactions, lộ data người khác!
   const transactions = await db.transaction.findMany()

   // ✅ ĐÚNG — luôn filter theo userId
   const transactions = await db.transaction.findMany({
     where: { userId: session.user.id }
   })

3. Environment variable bị lộ trong client code

   // ❌ CRITICAL — biến không có NEXT_PUBLIC_ sẽ undefined trên client
   // nhưng nếu dùng API key trong Client Component sẽ bị lộ
   const apiKey = process.env.SECRET_API_KEY  // dùng trong Client Component
```

---

### 🔴 Priority 2: Correctness (Chính xác)

```
4. Input validation bị bỏ qua

   // ❌ SAI — tin data từ client không validate
   export async function createTransaction(data: unknown) {
     await db.transaction.create({ data: data as any })
   }

   // ✅ ĐÚNG — validate bằng Zod trước khi dùng
   const parsed = schema.safeParse(data)
   if (!parsed.success) return { success: false, error: parsed.error.message }

5. Thiếu revalidatePath sau mutation

   // ❌ SAI — UI không cập nhật sau khi thêm/sửa/xóa
   await db.transaction.create({ data: ... })
   return { success: true }

   // ✅ ĐÚNG
   await db.transaction.create({ data: ... })
   revalidatePath('/transactions')
   revalidatePath('/dashboard')
   return { success: true }

6. Không handle lỗi DB (thiếu try/catch)

   // ❌ SAI — nếu DB lỗi, app crash
   export async function createTransaction(data) {
     await db.transaction.create({ data })
     return { success: true }
   }

   // ✅ ĐÚNG
   try {
     await db.transaction.create({ data })
     return { success: true }
   } catch {
     return { success: false, error: 'Lỗi hệ thống, thử lại sau' }
   }
```

---

### 🟡 Priority 3: Architecture (Cấu trúc)

```
7. 'use client' không cần thiết

   // ❌ Cả page là client chỉ vì 1 button interactive
   'use client'
   export default function TransactionsPage() {
     const [data, setData] = useState([])
     useEffect(() => { fetch('/api/transactions')... }, [])
   }

   // ✅ Page là Server Component, push 'use client' xuống component nhỏ
   export default async function TransactionsPage() {
     const data = await getTransactions()
     return <TransactionTable data={data} />  // TransactionTable mới là 'use client'
   }

8. Tạo PrismaClient mới thay vì dùng singleton

   // ❌ SAI — mỗi request tạo connection mới → connection pool exhausted
   import { PrismaClient } from '@prisma/client'
   const prisma = new PrismaClient()

   // ✅ ĐÚNG — dùng singleton
   import { db } from '@/lib/db'

9. File đặt sai vị trí

   // Kiểm tra theo docs/2-design/system-architecture.md:
   // Server Actions → src/actions/*.actions.ts
   // UI Components → src/components/<feature>/
   // shadcn primitives → src/components/ui/
   // Helpers → src/lib/utils.ts
   // Types → src/types/index.ts
```

---

### 🟡 Priority 4: TypeScript (Type Safety)

```
10. Dùng 'any'

    // ❌ SAI
    function process(data: any) {}
    async function handleSubmit(data: any) {}

    // ✅ ĐÚNG — type cụ thể hoặc infer từ Zod/Prisma
    function process(data: Transaction) {}
    async function handleSubmit(data: z.infer<typeof schema>) {}

11. Props không có type

    // ❌ SAI
    function TransactionTable({ data }) {}

    // ✅ ĐÚNG
    interface TransactionTableProps {
      data: TransactionWithCategory[]
      onDelete: (id: string) => void
    }
    function TransactionTable({ data, onDelete }: TransactionTableProps) {}

12. Bỏ qua TypeScript error bằng @ts-ignore

    // ❌ SAI
    // @ts-ignore
    const result = someFunction()

    // ✅ ĐÚNG — fix type đúng cách hoặc dùng type assertion có lý do
```

---

### 🟢 Priority 5: Code Quality

```
13. console.log bị bỏ quên

    // ❌ SAI — không commit console.log
    console.log('data:', data)
    console.log('session:', session)

14. Hardcode giá trị nên là constant

    // ❌ SAI
    if (note.length > 255) ...
    const items = data.slice(0, 20)

    // ✅ ĐÚNG
    const MAX_NOTE_LENGTH = 255
    const DEFAULT_PAGE_SIZE = 20

15. State management sai loại

    // ❌ SAI — filter dùng useState sẽ không bookmark được
    const [month, setMonth] = useState('2026-03')

    // ✅ ĐÚNG — filter dùng URL state
    const [month, setMonth] = useQueryState('month')

16. formatCurrency không được dùng

    // ❌ SAI — format thủ công, thiếu nhất quán
    <span>{amount.toLocaleString()} VNĐ</span>

    // ✅ ĐÚNG — dùng helper chuẩn
    import { formatCurrency } from '@/lib/utils'
    <span>{formatCurrency(amount)}</span>
```

---

## Format báo cáo review

Khi review xong, trả kết quả theo format:

```
## Kết quả Review

### 🔴 Critical (phải sửa ngay)
- [file:line] Mô tả vấn đề + cách sửa

### 🟡 Warning (nên sửa)
- [file:line] Mô tả vấn đề + cách sửa

### 🟢 OK
- ✅ Auth check có đầy đủ
- ✅ Prisma dùng singleton
- ✅ TypeScript types đầy đủ

### 📊 Tổng kết
Critical: X | Warning: Y | OK: Z
→ [Kết luận: Pass / Cần sửa trước khi commit]
```

---

## Checklist nhanh (self-review)

```
Security:
- [ ] Mọi Server Action và Route Handler đều check auth
- [ ] Mọi DB query đều filter theo userId
- [ ] Không có sensitive data trong Client Component

Correctness:
- [ ] Input validate bằng Zod trước khi dùng
- [ ] revalidatePath gọi sau mọi mutation
- [ ] try/catch wrap mọi DB operation

Architecture:
- [ ] 'use client' chỉ ở component thực sự cần
- [ ] Dùng db từ @/lib/db (không tạo instance mới)
- [ ] File đúng vị trí theo system-architecture.md

TypeScript:
- [ ] Không có 'any'
- [ ] Props interface đầy đủ
- [ ] Không có @ts-ignore

Quality:
- [ ] Không có console.log
- [ ] formatCurrency() được dùng cho số tiền
- [ ] State đúng loại (URL state vs Zustand vs useState)
```
