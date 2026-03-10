// Zod validation schemas với TypeScript inference
// Đảm bảo type safety cho forms và API

import { z } from 'zod'

// ===== ENUMS FROM DJANGO =====
export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE'
} as const

export type TransactionType = typeof TransactionType[keyof typeof TransactionType]

// ===== TRANSACTION SCHEMAS =====
export const createTransactionSchema = z.object({
  amount: z
    .number({ required_error: 'Số tiền là bắt buộc' })
    .positive('Số tiền phải lớn hơn 0')
    .max(999999999999, 'Số tiền quá lớn'),
  
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Loại giao dịch là bắt buộc'
  }),
  
  note: z
    .string()
    .max(255, 'Ghi chú không được quá 255 ký tự')
    .optional(),
  
  date: z
    .date({ required_error: 'Ngày giao dịch là bắt buộc' })
    .max(new Date(), 'Không thể chọn ngày trong tương lai'),
  
  categoryId: z
    .string({ required_error: 'Danh mục là bắt buộc' })
    .uuid('ID danh mục không hợp lệ')
})

export const updateTransactionSchema = createTransactionSchema
  .partial()
  .extend({
    id: z.string().uuid('ID giao dịch không hợp lệ')
  })

// ===== CATEGORY SCHEMAS =====
export const createCategorySchema = z.object({
  name: z
    .string({ required_error: 'Tên danh mục là bắt buộc' })
    .min(1, 'Tên danh mục không được để trống')
    .max(50, 'Tên danh mục không được quá 50 ký tự')
    .trim(),
  
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Loại danh mục là bắt buộc'
  }),
  
  icon: z
    .string()
    .max(10, 'Icon không được quá 10 ký tự')
    .optional(),
  
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Màu phải có định dạng hex (#RRGGBB)')
    .optional()
})

export const updateCategorySchema = createCategorySchema
  .partial()
  .extend({
    id: z.string().cuid('ID danh mục không hợp lệ')
  })

// ===== AUTH SCHEMAS =====
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email là bắt buộc' })
    .email('Email không hợp lệ')
    .toLowerCase()
    .trim(),
  
  password: z
    .string({ required_error: 'Mật khẩu là bắt buộc' })
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(1, 'Tên không được để trống')
    .max(100, 'Tên không được quá 100 ký tự')
    .trim()
    .optional(),
  
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  }
)

// ===== FILTER SCHEMAS =====
export const transactionFiltersSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().uuid().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  search: z.string().max(100).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['date', 'amount', 'created_at']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return data.dateFrom <= data.dateTo
    }
    return true
  },
  {
    message: 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc',
    path: ['dateTo']
  }
)

export const categoryFiltersSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  search: z.string().max(100).optional(),
  includeDefault: z.boolean().default(true)
})

// ===== API RESPONSE SCHEMAS =====
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional()
})

export const paginatedResponseSchema = apiResponseSchema.extend({
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0)
  }).optional()
})

// ===== TYPE INFERENCE =====
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type TransactionFilters = z.infer<typeof transactionFiltersSchema>
export type CategoryFilters = z.infer<typeof categoryFiltersSchema>

// ===== VALIDATION HELPERS =====
export function validateTransactionData(data: unknown) {
  return createTransactionSchema.safeParse(data)
}

export function validateCategoryData(data: unknown) {
  return createCategorySchema.safeParse(data)
}

export function validateFilters(data: unknown) {
  return transactionFiltersSchema.safeParse(data)
}

// ===== FORM FIELD CONFIGS =====
export const TRANSACTION_FORM_FIELDS = {
  amount: {
    label: 'Số tiền',
    placeholder: '0',
    type: 'number' as const
  },
  type: {
    label: 'Loại giao dịch',
    options: [
      { value: 'INCOME', label: 'Thu nhập' },
      { value: 'EXPENSE', label: 'Chi tiêu' }
    ]
  },
  note: {
    label: 'Ghi chú',
    placeholder: 'Mô tả giao dịch...',
    type: 'text' as const
  },
  date: {
    label: 'Ngày giao dịch',
    type: 'date' as const
  },
  categoryId: {
    label: 'Danh mục',
    placeholder: 'Chọn danh mục'
  }
} as const

export const CATEGORY_FORM_FIELDS = {
  name: {
    label: 'Tên danh mục',
    placeholder: 'Ví dụ: Ăn uống',
    type: 'text' as const
  },
  type: {
    label: 'Loại danh mục',
    options: [
      { value: 'INCOME', label: 'Thu nhập' },
      { value: 'EXPENSE', label: 'Chi tiêu' }
    ]
  },
  icon: {
    label: 'Icon',
    placeholder: '🍜',
    type: 'text' as const
  },
  color: {
    label: 'Màu sắc',
    type: 'color' as const
  }
} as const