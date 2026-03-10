// API response và pagination types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ===== SERVER ACTION RESULT TYPES =====
export type ActionResult<T = any> = 
  | { success: true; data?: T }
  | { success: false; error: string }

// ===== TYPE GUARDS =====
export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return typeof obj === 'object' && 'success' in obj
}

export function isPaginatedResponse<T>(obj: any): obj is PaginatedResponse<T> {
  return isApiResponse(obj) && 'pagination' in obj
}