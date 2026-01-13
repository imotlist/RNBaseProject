/**
 * auth.tsx
 * Authentication API endpoints
 */

import { apiService, getApiErrorMessage } from "../ApiService"
import type { UserData } from "@/context/AuthContext"

// ============================================================================
// Types
// ============================================================================

export interface LoginRequest {
  email: string
  password: string
  fcm_token?: string
}

export interface RegisterRequest {
  username: string
  email: string
  city_id: string | number
  password: string
  password_confirmation: string
  fcm_token?: string
}

export interface UpdateProfileRequest {
  name: string
  email: string
  current_password?: string
  new_password?: string
  new_password_confirmation?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  access_token: string
  refresh_token?: string
  user: UserData
}

// Re-export UserData from AuthContext
export type { UserData }

// Alias for UserData to use in screens
export type { UserData as ProfileEditData }

// ============================================================================
// API Functions
// ============================================================================

/**
 * Login with email and password
 */
export const login = async (payload: LoginRequest): Promise<AuthResponse> => {
  const result = await apiService.post<AuthResponse>("/login", payload, {
    requireAuth: false,
  })
  console.log('[Auth Res]', result);
  if (result.kind === "ok" && result.data) {
    // Store token if successful
    if (result.data.access_token) {
      await apiService.setAuthToken(result.data.access_token)
    }
    return result.data
  }

  // Throw error with message
  throw new Error(getApiErrorMessage(result))
}

/**
 * Register a new user
 */
export const register = async (payload: RegisterRequest): Promise<AuthResponse> => {
  const result = await apiService.post<AuthResponse>("/register", payload, {
    requireAuth: false,
  })

  if (result.kind === "ok" && result.data) {
    // Store token if successful
    if (result.data.access_token) {
      await apiService.setAuthToken(result.data.access_token)
    }
    return result.data
  }

  // Throw error with message
  throw new Error(getApiErrorMessage(result))
}

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  await apiService.clearAuthToken()
}

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<UserData> => {
  const result = await apiService.get<{ success: boolean; user: UserData }>("/me", {}, {
    requireAuth: true,
  })

  if (result.kind === "ok" && result.data?.user) {
    return result.data.user
  }

  throw new Error("Failed to get profile")
}

/**
 * Update user profile
 */
export const updateProfile = async (payload: UpdateProfileRequest): Promise<UserData> => {
  const result = await apiService.put<{ success: boolean; user: UserData; message: string }>(
    "/profile",
    payload,
    { requireAuth: true }
  )

  if (result.kind === "ok" && result.data?.user) {
    return result.data.user
  }

  throw new Error(getApiErrorMessage(result))
}
