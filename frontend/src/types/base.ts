// Base types từ Prisma và core types
export type { User, Transaction, Category, TransactionType } from '@prisma/client'

// ===== UTILITY TYPES =====
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// ===== CONSTANTS =====
export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'] as const
export const SORT_OPTIONS = ['date', 'amount', 'createdAt'] as const
export const SORT_ORDERS = ['asc', 'desc'] as const

// ===== TYPE GUARDS =====
export function isTransactionType(value: string): value is TransactionType {
  return TRANSACTION_TYPES.includes(value as TransactionType)
}