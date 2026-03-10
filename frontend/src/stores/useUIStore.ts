// Zustand store cho UI state với type safety
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction, Category } from '@prisma/client'

// ===== UI STATE INTERFACE =====
interface UIState {
  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  
  // Modals
  transactionModalOpen: boolean
  categoryModalOpen: boolean
  deleteConfirmOpen: boolean
  setTransactionModalOpen: (open: boolean) => void
  setCategoryModalOpen: (open: boolean) => void
  setDeleteConfirmOpen: (open: boolean) => void
  
  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  // Selected items
  selectedTransaction: Transaction | null
  selectedCategory: Category | null
  setSelectedTransaction: (transaction: Transaction | null) => void
  setSelectedCategory: (category: Category | null) => void
  
  // Theme
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // Mobile responsive
  isMobile: boolean
  setIsMobile: (mobile: boolean) => void
  
  // Actions
  openTransactionModal: (transaction?: Transaction) => void
  openCategoryModal: (category?: Category) => void
  openDeleteConfirm: (item: Transaction | Category) => void
  closeAllModals: () => void
  reset: () => void
}

// ===== INITIAL STATE =====
const initialState = {
  sidebarOpen: true,
  transactionModalOpen: false,
  categoryModalOpen: false,
  deleteConfirmOpen: false,
  isLoading: false,
  selectedTransaction: null,
  selectedCategory: null,
  theme: 'system' as const,
  isMobile: false,
}

// ===== ZUSTAND STORE =====
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Sidebar actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      // Modal actions
      setTransactionModalOpen: (open) => set({ transactionModalOpen: open }),
      setCategoryModalOpen: (open) => set({ categoryModalOpen: open }),
      setDeleteConfirmOpen: (open) => set({ deleteConfirmOpen: open }),
      
      // Loading actions
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      // Selection actions
      setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      
      // Theme actions
      setTheme: (theme) => set({ theme }),
      
      // Mobile actions
      setIsMobile: (mobile) => set({ isMobile: mobile }),
      
      // Combined actions
      openTransactionModal: (transaction) => set({
        transactionModalOpen: true,
        selectedTransaction: transaction || null
      }),
      
      openCategoryModal: (category) => set({
        categoryModalOpen: true,
        selectedCategory: category || null
      }),
      
      openDeleteConfirm: (item) => {
        if ('amount' in item) {
          // It's a Transaction
          set({
            deleteConfirmOpen: true,
            selectedTransaction: item,
            selectedCategory: null
          })
        } else {
          // It's a Category
          set({
            deleteConfirmOpen: true,
            selectedCategory: item,
            selectedTransaction: null
          })
        }
      },
      
      closeAllModals: () => set({
        transactionModalOpen: false,
        categoryModalOpen: false,
        deleteConfirmOpen: false,
        selectedTransaction: null,
        selectedCategory: null
      }),
      
      reset: () => set(initialState)
    }),
    {
      name: 'ui-store',
      // Chỉ persist một số state cần thiết
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      }),
    }
  )
)

// ===== SELECTORS (optional, for performance) =====
export const useUISelectors = {
  // Sidebar
  sidebarOpen: () => useUIStore((state) => state.sidebarOpen),
  
  // Modals
  modalsState: () => useUIStore((state) => ({
    transactionModalOpen: state.transactionModalOpen,
    categoryModalOpen: state.categoryModalOpen,
    deleteConfirmOpen: state.deleteConfirmOpen,
  })),
  
  // Selected items
  selectedItems: () => useUIStore((state) => ({
    selectedTransaction: state.selectedTransaction,
    selectedCategory: state.selectedCategory,
  })),
  
  // Theme
  theme: () => useUIStore((state) => state.theme),
  
  // Loading
  isLoading: () => useUIStore((state) => state.isLoading),
  
  // Mobile
  isMobile: () => useUIStore((state) => state.isMobile),
}

// ===== HOOKS for common patterns =====
export function useModal(type: 'transaction' | 'category' | 'delete') {
  const store = useUIStore()
  
  switch (type) {
    case 'transaction':
      return {
        isOpen: store.transactionModalOpen,
        open: store.openTransactionModal,
        close: () => store.setTransactionModalOpen(false),
        selected: store.selectedTransaction,
      }
    
    case 'category':
      return {
        isOpen: store.categoryModalOpen,
        open: store.openCategoryModal,
        close: () => store.setCategoryModalOpen(false),
        selected: store.selectedCategory,
      }
    
    case 'delete':
      return {
        isOpen: store.deleteConfirmOpen,
        open: store.openDeleteConfirm,
        close: () => store.setDeleteConfirmOpen(false),
        selectedTransaction: store.selectedTransaction,
        selectedCategory: store.selectedCategory,
      }
    
    default:
      throw new Error(`Unknown modal type: ${type}`)
  }
}

export function useSidebar() {
  return {
    isOpen: useUIStore((state) => state.sidebarOpen),
    toggle: useUIStore((state) => state.toggleSidebar),
    open: () => useUIStore.getState().setSidebarOpen(true),
    close: () => useUIStore.getState().setSidebarOpen(false),
  }
}

export function useTheme() {
  return {
    theme: useUIStore((state) => state.theme),
    setTheme: useUIStore((state) => state.setTheme),
    isDark: useUIStore((state) => 
      state.theme === 'dark' || 
      (state.theme === 'system' && 
       typeof window !== 'undefined' && 
       window.matchMedia('(prefers-color-scheme: dark)').matches)
    ),
  }
}