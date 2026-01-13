/**
 * riwayat.tsx
 * Plant monitoring history API endpoints
 */

import { apiService, getApiErrorMessage } from "../ApiService"

// ============================================================================
// Types
// ============================================================================

export interface MonitoringHistoryItem {
  id: string | number
  image?: string
  image_url?: string
  status_tanaman: "Sehat" | "Mati"
  jarak_tanam?: string
  ajir?: string
  kebersihan_piringan?: string
  indikasi_gagal?: string
  estimasi_tinggi?: string
  catatan?: string
  latitude: string
  longitude: string
  created_at: string
  updated_at?: string
  // Plant related fields
  plant_id?: string
  plant_name?: string
  plant_code?: string
  nama_tanaman?: string
  region_info :string
  // AI analysis
  ai_analysis?: {
    name: string
    condition: string
    description: string
    care_tips: string
  }
  // User info
  user?: {
    id: string
    name: string
  }
}

export interface MonitoringHistoryResponse {
  success: boolean
  message: string
  data: MonitoringHistoryItem[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface GetMonitoringsParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  sort?: "latest" | "oldest"
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get plant monitoring history with pagination
 */
export const getMonitorings = async (
  params: GetMonitoringsParams = {},
): Promise<{
  data: MonitoringHistoryItem[]
  hasMore: boolean
  totalCount?: number
}> => {
  const { page = 1, per_page = 10, search, status, sort = "latest" } = params

  const queryParams: Record<string, any> = {
    page,
    per_page: per_page,
    sort,
  }

  if (search) queryParams.search = search
  if (status) queryParams.status_tanaman = status

  const result = await apiService.get<MonitoringHistoryResponse>(
    "/plants/monitorings",
    queryParams,
  )

  if (result.kind === "ok" && result.data) {
    const { data, meta } = result.data
    const hasMore = meta ? meta.current_page < meta.last_page : false

    return {
      data,
      hasMore,
      totalCount: meta?.total,
    }
  }

  throw new Error(getApiErrorMessage(result))
}

/**
 * Get single monitoring record by ID
 */
export const getMonitoring = async (id: string | number): Promise<MonitoringHistoryItem> => {
  const result = await apiService.get<{ data: MonitoringHistoryItem }>(
    `/monitorings/${id}`,
  )

  if (result.kind === "ok" && result.data?.data) {
    return result.data.data
  }

  throw new Error(getApiErrorMessage(result))
}

/**
 * Delete monitoring record
 */
export const deleteMonitoring = async (id: string | number): Promise<void> => {
  const result = await apiService.delete<{ success: boolean }>(
    `/plants/monitorings/${id}`,
  )

  if (result.kind !== "ok") {
    throw new Error(getApiErrorMessage(result))
  }
}
