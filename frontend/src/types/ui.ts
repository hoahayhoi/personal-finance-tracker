// UI state types
import type { Transaction, Category } from './base'

// ===== UI STATE TYPES =====
export interface UIState {
  // Sidebar
  sidebarOpen: boolean
  
  // Modals
  transactionModalOpen: boolean
  categoryModalOpen: boolean
  deleteConfirmOpen: boolean
  
  // Loading states
  isLoading: boolean
  
  // Selected items
  selectedTransaction?: Transaction
  selectedCategory?: Category
  
  // Theme
  theme: 'light' | 'dark' | 'system'
}