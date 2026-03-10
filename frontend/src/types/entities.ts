// Extended entity types với relations
import type { User, Transaction, Category } from './base'

// ===== EXTENDED TYPES với relations =====
export type TransactionWithCategory = Transaction & {
  category: Category
}

export type CategoryWithTransactions = Category & {
  transactions: Transaction[]
}

export type UserWithRelations = User & {
  transactions: TransactionWithCategory[]
  categories: Category[]
}