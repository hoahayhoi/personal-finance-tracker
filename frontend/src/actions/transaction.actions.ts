// Server Actions cho Transaction với type safety
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { 
  createTransactionSchema, 
  updateTransactionSchema,
  transactionFiltersSchema 
} from '@/lib/validations'
import type { 
  ActionResult, 
  TransactionWithCategory, 
  PaginatedResponse,
  TransactionFilters 
} from '@/types'

// ===== CREATE TRANSACTION =====
export async function createTransaction(
  data: unknown
): Promise<ActionResult<TransactionWithCategory>> {
  try {
    // 1. Check authentication
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, error: 'Bạn cần đăng nhập để thực hiện thao tác này' }
    }

    // 2. Validate input
    const parsed = createTransactionSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: parsed.error.errors[0]?.message || 'Dữ liệu không hợp lệ' 
      }
    }

    // 3. Verify category belongs to user
    const category = await db.category.findFirst({
      where: {
        id: parsed.data.categoryId,
        userId: session.user.id
      }
    })

    if (!category) {
      return { success: false, error: 'Danh mục không tồn tại hoặc không thuộc về bạn' }
    }

    // 4. Verify category type matches transaction type
    if (category.type !== parsed.data.type) {
      return { 
        success: false, 
        error: `Danh mục "${category.name}" không phù hợp với loại giao dịch` 
      }
    }

    // 5. Create transaction
    const transaction = await db.transaction.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
      },
      include: {
        category: true
      }
    })

    // 6. Revalidate relevant paths
    revalidatePath('/dashboard')
    revalidatePath('/transactions')

    return { success: true, data: transaction }

  } catch (error) {
    console.error('Create transaction error:', error)
    return { success: false, error: 'Lỗi hệ thống, vui lòng thử lại sau' }
  }
}

// ===== UPDATE TRANSACTION =====
export async function updateTransaction(
  data: unknown
): Promise<ActionResult<TransactionWithCategory>> {
  try {
    // 1. Check authentication
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, error: 'Bạn cần đăng nhập để thực hiện thao tác này' }
    }

    // 2. Validate input
    const parsed = updateTransactionSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: parsed.error.errors[0]?.message || 'Dữ liệu không hợp lệ' 
      }
    }

    const { id, ...updateData } = parsed.data

    // 3. Verify transaction exists and belongs to user
    const existingTransaction = await db.transaction.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingTransaction) {
      return { success: false, error: 'Giao dịch không tồn tại hoặc không thuộc về bạn' }
    }

    // 4. If categoryId is being updated, verify it
    if (updateData.categoryId) {
      const category = await db.category.findFirst({
        where: {
          id: updateData.categoryId,
          userId: session.user.id
        }
      })

      if (!category) {
        return { success: false, error: 'Danh mục không tồn tại hoặc không thuộc về bạn' }
      }

      // Verify category type matches transaction type
      const transactionType = updateData.type || existingTransaction.type
      if (category.type !== transactionType) {
        return { 
          success: false, 
          error: `Danh mục "${category.name}" không phù hợp với loại giao dịch` 
        }
      }
    }

    // 5. Update transaction
    const transaction = await db.transaction.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    })

    // 6. Revalidate relevant paths
    revalidatePath('/dashboard')
    revalidatePath('/transactions')

    return { success: true, data: transaction }

  } catch (error) {
    console.error('Update transaction error:', error)
    return { success: false, error: 'Lỗi hệ thống, vui lòng thử lại sau' }
  }
}

// ===== DELETE TRANSACTION =====
export async function deleteTransaction(id: string): Promise<ActionResult> {
  try {
    // 1. Check authentication
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, error: 'Bạn cần đăng nhập để thực hiện thao tác này' }
    }

    // 2. Verify transaction exists and belongs to user
    const transaction = await db.transaction.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!transaction) {
      return { success: false, error: 'Giao dịch không tồn tại hoặc không thuộc về bạn' }
    }

    // 3. Delete transaction
    await db.transaction.delete({
      where: { id }
    })

    // 4. Revalidate relevant paths
    revalidatePath('/dashboard')
    revalidatePath('/transactions')

    return { success: true }

  } catch (error) {
    console.error('Delete transaction error:', error)
    return { success: false, error: 'Lỗi hệ thống, vui lòng thử lại sau' }
  }
}

// ===== GET TRANSACTIONS =====
export async function getTransactions(
  filters?: TransactionFilters
): Promise<PaginatedResponse<TransactionWithCategory>> {
  try {
    // 1. Check authentication
    const session = await getSession()
    if (!session?.user?.id) {
      return { 
        success: false, 
        error: 'Bạn cần đăng nhập để xem giao dịch',
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
      }
    }

    // 2. Validate and set default filters
    const validatedFilters = transactionFiltersSchema.parse(filters || {})
    const { page, limit, sortBy, sortOrder, ...searchFilters } = validatedFilters

    // 3. Build where clause
    const where: any = {
      userId: session.user.id,
    }

    if (searchFilters.type) {
      where.type = searchFilters.type
    }

    if (searchFilters.categoryId) {
      where.categoryId = searchFilters.categoryId
    }

    if (searchFilters.dateFrom || searchFilters.dateTo) {
      where.date = {}
      if (searchFilters.dateFrom) {
        where.date.gte = searchFilters.dateFrom
      }
      if (searchFilters.dateTo) {
        where.date.lte = searchFilters.dateTo
      }
    }

    if (searchFilters.search) {
      where.note = {
        contains: searchFilters.search,
        mode: 'insensitive'
      }
    }

    // 4. Get total count
    const total = await db.transaction.count({ where })

    // 5. Get transactions
    const transactions = await db.transaction.findMany({
      where,
      include: {
        category: true
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    // 6. Calculate pagination
    const totalPages = Math.ceil(total / limit)

    return {
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }

  } catch (error) {
    console.error('Get transactions error:', error)
    return { 
      success: false, 
      error: 'Lỗi hệ thống, vui lòng thử lại sau',
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
    }
  }
}

// ===== GET TRANSACTION BY ID =====
export async function getTransactionById(
  id: string
): Promise<ActionResult<TransactionWithCategory>> {
  try {
    // 1. Check authentication
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, error: 'Bạn cần đăng nhập để xem giao dịch' }
    }

    // 2. Get transaction
    const transaction = await db.transaction.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        category: true
      }
    })

    if (!transaction) {
      return { success: false, error: 'Giao dịch không tồn tại hoặc không thuộc về bạn' }
    }

    return { success: true, data: transaction }

  } catch (error) {
    console.error('Get transaction by ID error:', error)
    return { success: false, error: 'Lỗi hệ thống, vui lòng thử lại sau' }
  }
}

// ===== BULK DELETE TRANSACTIONS =====
export async function bulkDeleteTransactions(
  ids: string[]
): Promise<ActionResult<{ deletedCount: number }>> {
  try {
    // 1. Check authentication
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, error: 'Bạn cần đăng nhập để thực hiện thao tác này' }
    }

    // 2. Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return { success: false, error: 'Danh sách ID không hợp lệ' }
    }

    // 3. Delete transactions (only user's own transactions)
    const result = await db.transaction.deleteMany({
      where: {
        id: { in: ids },
        userId: session.user.id
      }
    })

    // 4. Revalidate relevant paths
    revalidatePath('/dashboard')
    revalidatePath('/transactions')

    return { 
      success: true, 
      data: { deletedCount: result.count }
    }

  } catch (error) {
    console.error('Bulk delete transactions error:', error)
    return { success: false, error: 'Lỗi hệ thống, vui lòng thử lại sau' }
  }
}