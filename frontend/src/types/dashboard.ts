// Dashboard và analytics types
import type { TransactionType } from './base'

// ===== DASHBOARD TYPES =====
export interface DashboardSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  transactionCount: number
  categoryBreakdown: CategoryBreakdown[]
  monthlyTrend: MonthlyTrend[]
}

export interface CategoryBreakdown {
  categoryId: string
  categoryName: string
  categoryIcon?: string
  categoryColor?: string
  type: TransactionType
  amount: number
  percentage: number
  transactionCount: number
}

export interface MonthlyTrend {
  month: string // YYYY-MM
  income: number
  expense: number
  balance: number
}