// Filter và search types
import type { TransactionType } from './base'

// ===== FILTER & SEARCH TYPES =====
export interface TransactionFilters {
  type?: TransactionType
  categoryId?: string
  dateFrom?: Date
  dateTo?: Date
  search?: string
  page?: number
  limit?: number
  sortBy?: 'date' | 'amount' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface CategoryFilters {
  type?: TransactionType
  search?: string
  includeDefault?: boolean
}