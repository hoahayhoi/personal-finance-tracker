// Utility functions với type safety
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TransactionType, Transaction, Category } from '@prisma/client'
import type { DashboardSummary, CategoryBreakdown, MonthlyTrend } from '@/types'

// ===== TAILWIND UTILITIES =====
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===== CURRENCY FORMATTING =====
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B`
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`
  }
  return formatCurrency(amount)
}

// ===== DATE FORMATTING =====
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Vừa xong'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`
  
  return formatDate(d)
}

export function getMonthYear(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('vi-VN', {
    month: 'long',
    year: 'numeric',
  }).format(d)
}

// ===== TRANSACTION TYPE UTILITIES =====
export function getTransactionTypeLabel(type: TransactionType): string {
  return type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'
}

export function getTransactionTypeColor(type: TransactionType): string {
  return type === 'INCOME' ? 'text-green-600' : 'text-red-600'
}

export function getTransactionTypeBgColor(type: TransactionType): string {
  return type === 'INCOME' ? 'bg-green-50' : 'bg-red-50'
}

export function getTransactionTypeIcon(type: TransactionType): string {
  return type === 'INCOME' ? '↗️' : '↘️'
}

// ===== CATEGORY UTILITIES =====
export function getCategoryDisplay(category: Category): string {
  return `${category.icon || '📁'} ${category.name}`
}

export function getDefaultCategoryColor(type: TransactionType): string {
  return type === 'INCOME' ? '#10B981' : '#EF4444'
}

// ===== CALCULATION UTILITIES =====
export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((balance, transaction) => {
    return transaction.type === 'INCOME' 
      ? balance + Number(transaction.amount)
      : balance - Number(transaction.amount)
  }, 0)
}

export function calculateTotalByType(
  transactions: Transaction[], 
  type: TransactionType
): number {
  return transactions
    .filter(t => t.type === type)
    .reduce((total, t) => total + Number(t.amount), 0)
}

export function groupTransactionsByCategory(
  transactions: Transaction[],
  categories: Category[]
): CategoryBreakdown[] {
  const categoryMap = new Map(categories.map(c => [c.id, c]))
  const breakdown = new Map<string, CategoryBreakdown>()
  
  transactions.forEach(transaction => {
    const category = categoryMap.get(transaction.categoryId)
    if (!category) return
    
    const existing = breakdown.get(category.id)
    const amount = Number(transaction.amount)
    
    if (existing) {
      existing.amount += amount
      existing.transactionCount += 1
    } else {
      breakdown.set(category.id, {
        categoryId: category.id,
        categoryName: category.name,
        categoryIcon: category.icon || undefined,
        categoryColor: category.color || undefined,
        type: category.type,
        amount,
        percentage: 0, // Sẽ tính sau
        transactionCount: 1
      })
    }
  })
  
  const result = Array.from(breakdown.values())
  const totalByType = new Map<TransactionType, number>()
  
  // Tính tổng theo loại
  result.forEach(item => {
    const current = totalByType.get(item.type) || 0
    totalByType.set(item.type, current + item.amount)
  })
  
  // Tính phần trăm
  result.forEach(item => {
    const total = totalByType.get(item.type) || 1
    item.percentage = Math.round((item.amount / total) * 100)
  })
  
  return result.sort((a, b) => b.amount - a.amount)
}

// ===== VALIDATION UTILITIES =====
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidCUID(id: string): boolean {
  const cuidRegex = /^c[a-z0-9]{24}$/
  return cuidRegex.test(id)
}

export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#[0-9A-F]{6}$/i
  return hexRegex.test(color)
}

// ===== ARRAY UTILITIES =====
export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<K, T[]>)
}

export function sortBy<T>(
  array: T[],
  keyFn: (item: T) => string | number | Date,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = keyFn(a)
    const bVal = keyFn(b)
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

// ===== ERROR HANDLING =====
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Đã xảy ra lỗi không xác định'
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && 
    (error.message.includes('fetch') || 
     error.message.includes('network') ||
     error.message.includes('NetworkError'))
}

// ===== LOCAL STORAGE UTILITIES =====
export function safeLocalStorage() {
  const isClient = typeof window !== 'undefined'
  
  return {
    getItem: (key: string): string | null => {
      if (!isClient) return null
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    
    setItem: (key: string, value: string): void => {
      if (!isClient) return
      try {
        localStorage.setItem(key, value)
      } catch {
        // Ignore errors
      }
    },
    
    removeItem: (key: string): void => {
      if (!isClient) return
      try {
        localStorage.removeItem(key)
      } catch {
        // Ignore errors
      }
    }
  }
}

// ===== DEBOUNCE UTILITY =====
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// ===== URL UTILITIES =====
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  return searchParams.toString()
}