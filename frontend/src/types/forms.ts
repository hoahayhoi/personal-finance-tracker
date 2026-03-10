// Form input types
import type { TransactionType } from './base'

// ===== FORM INPUT TYPES =====
export interface CreateTransactionInput {
  amount: number
  type: TransactionType
  note?: string
  date: Date
  categoryId: string
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {
  id: string
}

export interface CreateCategoryInput {
  name: string
  type: TransactionType
  icon?: string
  color?: string
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  name?: string
}