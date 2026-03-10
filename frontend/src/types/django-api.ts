// Django API response types
export interface DjangoApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// ===== AUTH API RESPONSES =====
export interface LoginResponse {
  access: string
  refresh: string
}

export interface RefreshTokenResponse {
  access: string
  // Refresh token API chỉ trả về access token mới
}

export interface UserProfileResponse {
  id: number
  email: string
  full_name?: string
  first_name?: string
  last_name?: string
}

// ===== TYPED API RESPONSES =====
export type DjangoLoginApiResponse = DjangoApiResponse<LoginResponse>
export type DjangoRefreshApiResponse = DjangoApiResponse<RefreshTokenResponse>
export type DjangoProfileApiResponse = DjangoApiResponse<UserProfileResponse>