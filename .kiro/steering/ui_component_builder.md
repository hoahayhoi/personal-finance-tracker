---
inclusion: auto
fileMatchPattern: "**/*.tsx"
---

# UI Component Builder

Khi build UI component với shadcn/ui + Tailwind CSS v4, tuân thủ các nguyên tắc sau:

## 1. shadcn/ui trước, tự viết sau

Trước khi viết UI → kiểm tra shadcn/ui có component này không:

```bash
npx shadcn@latest add <component>
```

**Components hay dùng:** Button, Input, Form, Dialog, AlertDialog, Table, Select, Card, Skeleton, Sonner, Tabs, Badge, Separator

## 2. Responsive — Mobile First

```tsx
// ✅ ĐÚNG — mobile first
<div className="flex flex-col gap-4 md:flex-row md:gap-6">

// ❌ SAI — desktop first
<div className="flex flex-row gap-6 sm:flex-col">
```

**Breakpoints:** Mobile (default < 768px) | Tablet+ (`md:` ≥ 768px) | Desktop (`lg:` ≥ 1024px)

## 3. Luôn có đủ 3 state

```tsx
// Loading state
if (isLoading) return <TransactionTableSkeleton />

// Empty state
if (transactions.length === 0) return <EmptyState />

// Data state
return <TransactionTable data={transactions} />
```

## 4. Skeleton Loading — không dùng spinner đơn

```tsx
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
        </div>
      ))}
    </div>
  )
}
```

## 5. Form Pattern — react-hook-form + Zod + shadcn

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const schema = z.object({
  amount: z.coerce.number().positive('Số tiền phải lớn hơn 0'),
})

export function TransactionForm({ onSubmit }: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
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
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Lưu</Button>
      </form>
    </Form>
  )
}
```

## 6. Toast Pattern — Sonner

```tsx
import { toast } from 'sonner'

const result = await createTransaction(data)
if (!result.success) {
  toast.error(result.error)
  return
}
toast.success('Đã thêm giao dịch ✓')
```

## 7. Màu sắc — dùng CSS variables

```tsx
// ✅ ĐÚNG — semantic color, tự động dark mode
<p className="text-foreground">Tên</p>
<p className="text-muted-foreground">Phụ</p>
<div className="bg-background border border-border">...</div>

// ❌ SAI — hardcode màu
<p className="text-gray-900">Tên</p>
```

## 8. cn() — luôn dùng khi merge class

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  'rounded-lg p-4 border',
  isExpense ? 'border-destructive/30' : 'border-green-500/30',
  className
)} />
```

## Checklist

- [ ] Mobile layout hoạt động (≥ 375px)
- [ ] Loading state dùng Skeleton
- [ ] Empty state có message + action
- [ ] Màu dùng CSS variables
- [ ] shadcn/ui component được dùng
- [ ] `cn()` dùng khi merge class có điều kiện
