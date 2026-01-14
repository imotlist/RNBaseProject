/**
 * home.tsx
 *
 * API service for dashboard/home feature.
 * Handles dashboard data fetching.
 *
 * @module services/api/apisCollection/home
 */

import { apiService, getApiErrorMessage } from "@/services/api/ApiService"

// ============================================================================
// Types
// ============================================================================

export interface DashboardUser {
  id: string
  name: string
  username?: string
  email: string
  role: string
  avatar?: string
}

export interface DashboardStats {
  plants_cared: number
  photos_count: number
  monitorings_count: number
  unsynced_count: number
}

export interface DashboardData {
  user: DashboardUser
  stats: DashboardStats
}

export interface DashboardResponse {
  success: boolean
  data: DashboardData
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Fetch dashboard data including user info and statistics
 */
export const getDashboard = async (): Promise<DashboardData> => {
  const result = await apiService.get<DashboardResponse>("/dashboard")

  if (result.kind === "ok" && result.data?.data) {
    return result.data.data
  }

  throw new Error(getApiErrorMessage(result))
}
