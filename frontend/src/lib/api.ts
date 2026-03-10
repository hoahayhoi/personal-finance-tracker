/**
 * Django API Client
 * Handles all API calls to Django backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'An error occurred',
      }))
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  // Auth endpoints
  async register(data: { email: string; password: string; name?: string }) {
    return this.request('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ access: string; refresh: string }>('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async refreshToken(refreshToken: string) {
    return this.request<{ access: string }>('/api/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    })
  }

  async getProfile() {
    return this.request('/api/auth/profile/')
  }

  async updateProfile(data: { name?: string }) {
    return this.request('/api/auth/profile/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // Transaction endpoints
  async getTransactions(params?: {
    month?: number
    year?: number
    type?: 'INCOME' | 'EXPENSE'
    category?: string
    page?: number
  }) {
    const query = new URLSearchParams()
    if (params?.month) query.append('month', params.month.toString())
    if (params?.year) query.append('year', params.year.toString())
    if (params?.type) query.append('type', params.type)
    if (params?.category) query.append('category', params.category)
    if (params?.page) query.append('page', params.page.toString())

    const queryString = query.toString()
    return this.request(`/api/transactions/${queryString ? `?${queryString}` : ''}`)
  }

  async createTransaction(data: {
    amount: number
    type: 'INCOME' | 'EXPENSE'
    category_id: string
    date: string
    note?: string
  }) {
    return this.request('/api/transactions/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTransaction(id: string, data: Partial<{
    amount: number
    type: 'INCOME' | 'EXPENSE'
    category_id: string
    date: string
    note: string
  }>) {
    return this.request(`/api/transactions/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteTransaction(id: string) {
    return this.request(`/api/transactions/${id}/`, {
      method: 'DELETE',
    })
  }

  // Category endpoints
  async getCategories(type?: 'INCOME' | 'EXPENSE') {
    const query = type ? `?type=${type}` : ''
    return this.request(`/api/categories/${query}`)
  }

  async createCategory(data: {
    name: string
    type: 'INCOME' | 'EXPENSE'
    icon?: string
    color?: string
  }) {
    return this.request('/api/categories/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCategory(id: string, data: Partial<{
    name: string
    icon: string
    color: string
  }>) {
    return this.request(`/api/categories/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteCategory(id: string) {
    return this.request(`/api/categories/${id}/`, {
      method: 'DELETE',
    })
  }

  // Dashboard endpoint
  async getDashboardSummary(params?: { month?: number; year?: number }) {
    const query = new URLSearchParams()
    if (params?.month) query.append('month', params.month.toString())
    if (params?.year) query.append('year', params.year.toString())

    const queryString = query.toString()
    return this.request(`/api/dashboard/summary/${queryString ? `?${queryString}` : ''}`)
  }
}

export const apiClient = new ApiClient(API_URL)
