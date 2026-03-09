---
name: ui_component_builder
description: >
  Kích hoạt khi agent cần build UI component với shadcn/ui + Tailwind CSS v4.
  Skill này đảm bảo output là UI đẹp, responsive, đúng pattern production —
  không phải UI placeholder hay thiếu mobile.
---

# Skill: UI Component Builder

## Khi nào dùng skill này?

- Agent cần tạo page, component, layout mới
- Agent cần build form, table, modal, dialog
- Bất kỳ khi nào viết JSX/TSX có Tailwind class

---

## Nguyên tắc cốt lõi

### 1. shadcn/ui trước, tự viết sau

```
Trước khi viết bất kỳ UI nào → hỏi: "shadcn/ui có component này không?"

✅ Có → dùng: npx shadcn@latest add <component>
❌ Không → tự build nhưng dùng Radix UI primitives
```

**Danh sách shadcn/ui hay dùng trong dự án:**

| Component | Dùng cho |
|---|---|
| `Button` | Mọi nút bấm |
| `Input` | Text input |
| `Form` + `react-hook-form` | Tất cả form có validation |
| `Dialog` | Modal thêm/sửa |
| `AlertDialog` | Confirm xóa |
| `Table` | Danh sách transactions |
| `Select` | Category select, month picker |
| `Card` | Summary cards, category cards |
| `Skeleton` | Loading states |
| `Sonner` | Toast notifications |
| `Tabs` | Phân loại Thu/Chi |
| `Badge` | Transaction type tag |
| `Separator` | Divider |

---

### 2. Responsive — Mobile First

```tsx
// ✅ ĐÚNG — mobile first, breakpoint lên dần
<div className="flex flex-col gap-4 md:flex-row md:gap-6">

// ❌ SAI — desktop first rồi override mobile
<div className="flex flex-row gap-6 sm:flex-col">
```

**Breakpoints chuẩn dự án:**

| Breakpoint | Tailwind | Dùng cho |
|---|---|---|
| Mobile | default (< 768px) | Bottom nav, stacked layout |
| Tablet+ | `md:` (≥ 768px) | Sidebar hiện, grid |
| Desktop | `lg:` (≥ 1024px) | Wider content, more columns |

---

### 3. Luôn có đủ 3 state

Mỗi màn hình có data **phải** handle đủ 3 trạng thái:

```tsx
// Loading state
if (isLoading) return <TransactionTableSkeleton />

// Empty state
if (transactions.length === 0) return <EmptyState />

// Data state
return <TransactionTable data={transactions} />
```

**Empty State pattern:**
```tsx
function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4">📭</div>
      <h3 className="text-lg font-medium text-foreground">{message}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Bắt đầu bằng cách thêm mục đầu tiên của bạn
      </p>
      {action}
    </div>
  )
}
```

---

### 4. Skeleton Loading — không dùng spinner đơn

```tsx
// ✅ ĐÚNG — Skeleton giữ layout, tránh layout shift
import { Skeleton } from "@/components/ui/skeleton"

function TransactionTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  )
}

// ❌ SAI — Spinner không giữ layout
if (loading) return <div>Loading...</div>
```

---

### 5. Form Pattern — react-hook-form + Zod + shadcn

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  amount: z.coerce.number().positive('Số tiền phải lớn hơn 0'),
})

export function TransactionForm({ onSubmit }: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0 },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage /> {/* hiển thị lỗi validation tự động */}
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Lưu</Button>
      </form>
    </Form>
  )
}
```

---

### 6. Dialog / Modal Pattern

```tsx
'use client'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'

// ✅ Controlled dialog — agent có thể mở từ bên ngoài
export function AddTransactionDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm giao dịch</DialogTitle>
        </DialogHeader>
        <TransactionForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}
```

---

### 7. Toast Pattern — Sonner

```tsx
import { toast } from 'sonner'

// Sau khi gọi Server Action:
const result = await createTransaction(data)

if (!result.success) {
  toast.error(result.error)
  return
}
toast.success('Đã thêm giao dịch ✓')
onOpenChange(false) // đóng dialog
```

---

### 8. Màu sắc — dùng CSS variables của shadcn/ui

```tsx
// ✅ ĐÚNG — semantic color, tự động dark mode
<p className="text-foreground">Tên</p>
<p className="text-muted-foreground">Phụ</p>
<div className="bg-background border border-border">...</div>
<span className="text-destructive">Lỗi</span>

// ❌ SAI — hardcode màu, không support dark mode
<p className="text-gray-900">Tên</p>
<div className="bg-white border-gray-200">...</div>
```

---

### 9. cn() — luôn dùng khi merge class

```tsx
import { cn } from '@/lib/utils'

// Khi class có điều kiện
<div className={cn(
  'rounded-lg p-4 border',
  isExpense ? 'border-destructive/30 bg-destructive/5' : 'border-green-500/30 bg-green-500/5',
  className  // cho phép override từ ngoài
)} />
```

---

## Checklist trước khi hoàn thành component

- [ ] Mobile layout hoạt động đúng (≥ 375px)
- [ ] Loading state dùng Skeleton (không dùng spinner text)
- [ ] Empty state có message + action button
- [ ] Error messages hiển thị đúng vị trí (trong `FormMessage`)
- [ ] Màu dùng CSS variables (`text-foreground`, `bg-background`...)
- [ ] shadcn/ui component được dùng thay vì tự viết
- [ ] `cn()` được dùng khi merge class có điều kiện
- [ ] Không có `console.log` debug bị bỏ quên
