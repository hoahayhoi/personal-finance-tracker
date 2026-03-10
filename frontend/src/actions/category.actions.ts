// Server Actions cho Category với type safety
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { 
  createCategorySchema, 
  updateCategorySchema,
  categoryFiltersSchema 
} from '@/lib/validations'
import type { 
  ActionResult, 
  CategoryWithTransactions,
  CategoryFilters 
} from '@/types'
import type { Category, TransactionType } from '@prisma/client'

// ===== CREATE CATEGORY =====
export async function createCategory(
  data: unknown
): Promise<ActionResult<Category>> {
  try {
    // 1. Check authentication
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, error: 'Bạn cần đăng nhập để thực hiện thao tác này' }
    }

    // 2. Validate input
    const parsed = createCategorySchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: parsed.error.errors[0]?.message || 'Dữ liệu không hợp lệ' 
      }
    }

    // 3. Check for duplicate name within user and type
    const existingCategory = await db.category.findFirst({
      where: {
        name: parsed.data.name,
        type: parsed.data.type,
        userId: session.user.id
      }
    })

    if (existingCategory) {
      return { 
        success: false, 
        error: `Danh mục "${parsed.data.name}" đã tồn tại trong loại ${parsed.data.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'}` 
      }
    }

    // 4. Create category
    const category = await db.category.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
        isDefault: false // User-created categories are never default
      }
    })

    // 5. Revalidate relevant paths
    revalidatePath('/categories')
    revalidatePath('/transactions')

    return { success: true, data: category }

  } catch (error) {
    console.error('Create category error:', error)
    return { success: false, error: 'Lỗi hệ thống, vui lòng thử lại sau' }
  }
}

// ===== UPDATE CATEGORY =====
export async function updateCategory(
  data: unknown
): Promise<ActionResult<Category>> {
  try {
    // 1. Check authentication
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, error: 'Bạn cần đăng nhập để thực hiện thao tác này' }
    }

    // 2. Validate input
    const parsed = updateCategorySchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: parsed.error.errors[0]?.message || 'Dữ liệu không hợp lệ' 
      }
    }

    const { id, ...updateData } = parsed.data

    // 3. Verify category exists and belongs to user
    const existingCategory = await db.category.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingCategory) {
      return { success: false, error: 'Danh mục không tồn tại hoặc không thuộc về bạn' }
    }

    // 4. Check if it's a default category (cannot be modified)
    if (existingCategory.isDefault) {
      return { success: false, error: 'Không thể chỉnh sửa danh mục mặc định của hệ thống' }
    }

    // 5. Check for duplicate name if name is being updated
    if (updateData.name && updateData.name !== existingCategory.name) {
      const duplicateCategory = await db.category.findFirst({
        where: {
          name: updateData.name,
          type: updateData.type || existingCategory.type,
          userId: session.user.id,
          id: { not: id } // Exclude current category
        }
      })

      if (duplicateCategory) {
        return { 
          success: false, 
          error: `Danh mục "${updateData.name}" đã tồn tại trong loại ${(updateData.type || existingCategory.type) === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'}` 
        }
      }
    }

    // 6. If type is being changed, check if there are transactions
    if (updateData.type && updateData.type !== existingCategory.type) {
      const transactionCount = await db.transaction.count({
        where: { categoryId: id }
      })

      if (transactionCount > 0) {
        return { 
          success: false, 
          error: 'Không thể thay đổi loại danh mục khi đã có giao dịch sử dụng' 
        }
      }
    }

    // 7. Update category
    const category = await db.category.update({
      where: { id },
      data: updateData
    })

    // 8. Revalidate relevant paths
    revalidatePath('/categories')
    revalidatePath('/transactions')

    return { success: true, data: category }

  } catch (error) {
    console.error('Update category error:', error)
    return { success: false, error: 'Lỗi hệ thống, vui lòng thử lại sau' }
  }
}

// ===== DELETE CATEGORY =====
export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    // 1. Check authentication
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, error: 'Bạn cần đăng nhập để thực hiện thao tác này' }
    }

    // 2. Verify category exists and belongs to user
    const category = await db.category.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!category) {
      return { success: false, error: 'Danh mục không tồn tại hoặc không thuộc về bạn' }
    }

    // 3. Check if it's a default category (cannot be deleted)
    if (category.isDefault) {
      return { success: false, error: 'Không thể xóa danh mục mặc định của hệ thống' }
    }

    // 4. Check if there are transactions using this category
    const transactionCount = await db.transaction.count({
      where: { categoryId: id }
    })

    if (transactionCount > 0) {
      return { 
        success: false, 
        error: `Không thể xóa danh mục "${category.name}" vì đang có ${transactionCount} giao dịch sử dụng` 
      }
    }

    // 5. Delete category
    await db.category.delete({
      where: { id }
    })

    // 6. Revalidate relevant paths
    revalidatePath('/categories')
    revalidatePath('/transactions')

    return { success: true }

  } catch (error) {
    console.error('Delete category error:', error)
    return { success: false, error: 'Lỗi hệ thống, vui lòng thử lại sau' }
  }
}

// ===== GET CATEGORIES =====
export async function getCategories(
  filters?: CategoryFilters
): Promise<ActionResult<Category[]>> {
  try {
    // 1. Check authentication
    const session = await getSession()
    if (!session?.user?.id) {
      return { 
        success: false, 
        error: 'Bạn cần đăng nhập để xem danh mục',
        data: []
      }
    }

    // 2. Validate filters
    const validatedFilters = categoryFiltersSchema.parse(filters || {})

    // 3. Build where clause
    const where: any = {
      userId: session.user.id,
    }

    if (validatedFilters.type) {
      where.type = validatedFilters.type
    }

    if (validatedFilters.search) {
      where.name = {
        contains: validatedFilters.search,
        mode: 'insensitive'
      }
    }

    if (!validatedFilters.includeDefault) {
      where.isDefault = false
    }

    // 4. Get categories
    const categories = await db.category.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' }, // Default categories first
        { type: 'asc' },       // Then by type
        { name: 'asc' }        // Then by name
      ]
    })

    return { success: true, data: categories }

  } catch (error) {
    console.error('Get categories error:', error)
    return { 
      success: false, 
      error: 'Lỗi hệ thống, vui lòng thử lại sau',
      data: []
    }
  }
}

// ===== GET CATEGORIES BY TYPE =====
export async function getCategoriesByType(
  type: TransactionType
): Promise<ActionResult<Category[]>> {
  try {
    // 1. Check authentication
    const session = await getSession()
    if (!session?.user?.id) {
      return { 
        success: false, 
        error: 'Bạn cần đăng nhập để xem danh mục',
        data: []
      }
    }

    // 2. Get categories by type
    const categories = await db.category.findMany({
      where: {
        userId: session.user.id,
        type
      },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' }
      ]
    })

    return { success: true, data: categories }

  } catch (error) {
    console.error('Get categories by type error:', error)
    return { 
      success: false, 
      error: 'Lỗi hệ thống, vui lòng thử lại sau',
      data: []
    }
  }
}

// ===== GET CATEGORY WITH TRANSACTIONS =====
export async function getCategoryWithTransactions(
  id: string
): Promise<ActionResult<CategoryWithTransactions>> {
  try {
    // 1. Check authentication
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, error: 'Bạn cần đăng nhập để xem danh mục' }
    }

    // 2. Get category with transactions
    const category = await db.category.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 10 // Limit to recent 10 transactions
        }
      }
    })

    if (!category) {
      return { success: false, error: 'Danh mục không tồn tại hoặc không thuộc về bạn' }
    }

    return { success: true, data: category }

  } catch (error) {
    console.error('Get category with transactions error:', error)
    return { success: false, error: 'Lỗi hệ thống, vui lòng thử lại sau' }
  }
}

// ===== SEED DEFAULT CATEGORIES =====
export async function seedDefaultCategories(): Promise<ActionResult> {
  try {
    // 1. Check authentication
    const session = await getSession()
    if (!session?.user?.id) {
      return { success: false, error: 'Bạn cần đăng nhập để thực hiện thao tác này' }
    }

    // 2. Check if user already has default categories
    const existingDefaults = await db.category.count({
      where: {
        userId: session.user.id,
        isDefault: true
      }
    })

    if (existingDefaults > 0) {
      return { success: false, error: 'Danh mục mặc định đã được tạo cho tài khoản này' }
    }

    // 3. Default categories data
    const defaultCategories = [
      // EXPENSE
      { name: "Ăn uống",          type: "EXPENSE" as TransactionType, icon: "🍜", color: "#FF6B6B" },
      { name: "Đi lại",           type: "EXPENSE" as TransactionType, icon: "🚗", color: "#4ECDC4" },
      { name: "Mua sắm",          type: "EXPENSE" as TransactionType, icon: "🛍️", color: "#45B7D1" },
      { name: "Nhà ở & Tiện ích", type: "EXPENSE" as TransactionType, icon: "🏠", color: "#96CEB4" },
      { name: "Giải trí",         type: "EXPENSE" as TransactionType, icon: "🎬", color: "#FFEAA7" },
      { name: "Sức khỏe",         type: "EXPENSE" as TransactionType, icon: "💊", color: "#DDA0DD" },
      { name: "Giáo dục",         type: "EXPENSE" as TransactionType, icon: "📚", color: "#98D8C8" },
      { name: "Khác (Chi)",       type: "EXPENSE" as TransactionType, icon: "💸", color: "#B8B8B8" },
      // INCOME
      { name: "Lương",            type: "INCOME" as TransactionType,  icon: "💰", color: "#2ECC71" },
      { name: "Thưởng",           type: "INCOME" as TransactionType,  icon: "🎁", color: "#3498DB" },
      { name: "Đầu tư",           type: "INCOME" as TransactionType,  icon: "📈", color: "#9B59B6" },
      { name: "Thu nhập phụ",     type: "INCOME" as TransactionType,  icon: "💼", color: "#E67E22" },
      { name: "Khác (Thu)",       type: "INCOME" as TransactionType,  icon: "💵", color: "#95A5A6" },
    ]

    // 4. Create default categories
    await db.category.createMany({
      data: defaultCategories.map(cat => ({
        ...cat,
        userId: session.user.id,
        isDefault: true
      }))
    })

    // 5. Revalidate relevant paths
    revalidatePath('/categories')
    revalidatePath('/transactions')

    return { success: true }

  } catch (error) {
    console.error('Seed default categories error:', error)
    return { success: false, error: 'Lỗi hệ thống, vui lòng thử lại sau' }
  }
}