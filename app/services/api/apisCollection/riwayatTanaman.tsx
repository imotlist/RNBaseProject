/**
 * riwayatTanaman.tsx
 * Plant monitoring history API endpoints for a specific plant
 */

import { apiService, getApiErrorMessage } from "../ApiService"

// ============================================================================
// Types
// ============================================================================

export interface PlantInfo {
  id: string
  name: string
  plant_code: string
  latitude: string
  longitude: string
  image?: string
  region?: {
    id: number
    name: string
  }
}

export interface PlantMonitoringItem {
  id: number
  image_path: string
  image_url: string
  height_cm: number | null
  leaf_condition: string
  growth_status: "Sehat" | "Mati"
  ai_analysis_json: {
    name: string
    scientific_name: string
    variety: string | null
    age_days: number | null
    care_tips: string
    condition: string
    condition_details: string
    description: string
    confidence: string
  }
  created_at: string
  updated_at: string
  status_tanaman: "Sehat" | "Mati"
  jarak_tanam: string
  ajir: string
  kebersihan_piringan: string
  indikasi_gagal: string | null
  estimasi_tinggi: string
  catatan: string
  plant_id: string
  plant_code: string
  plant_name: string
  latitude: string
  longitude: string
  tinggi_tanaman: string
  user: {
    id: string
    name: string
  }
}

export interface PlantMonitoringsResponse {
  success: boolean
  data: {
    plant: PlantInfo
    monitorings: PlantMonitoringItem[]
  }
}

export interface GetPlantMonitoringsParams {
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
 * Get plant monitoring history by plant ID
 */
export const getPlantMonitorings = async (
  plantId: string,
  params: GetPlantMonitoringsParams = {},
): Promise<{
  plant: PlantInfo
  data: PlantMonitoringItem[]
  hasMore: boolean
  totalCount?: number
}> => {
  const { page = 1, per_page = 10, sort = "latest" } = params

  const queryParams: Record<string, any> = {
    page,
    per_page: per_page,
    sort,
  }

  if (params.search) queryParams.search = params.search
  if (params.status) queryParams.status_tanaman = params.status

  const result = await apiService.get<PlantMonitoringsResponse>(
    `/plants/${plantId}/monitorings`,
    queryParams,
  )

  if (result.kind === "ok" && result.data) {
    const { plant, monitorings } = result.data.data
    const hasMore = monitorings.length >= per_page

    return {
      plant,
      data: monitorings,
      hasMore,
      totalCount: monitorings.length,
    }
  }

  throw new Error(getApiErrorMessage(result))
}

/**
 * Get plant information by ID
 */
export const getPlantInfo = async (plantId: string): Promise<PlantInfo> => {
  const result = await apiService.get<{ data: PlantInfo }>(
    `/plants/${plantId}`,
  )

  if (result.kind === "ok" && result.data?.data) {
    return result.data.data
  }

  throw new Error(getApiErrorMessage(result))
}
