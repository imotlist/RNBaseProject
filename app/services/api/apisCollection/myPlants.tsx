/**
 * myPlants.tsx
 *
 * API service for user's plants (my-plants endpoint).
 * Handles fetching plants owned by the current user.
 *
 * @module services/api/apisCollection/myPlants
 */

import { apiService, getApiErrorMessage } from "@/services/api/ApiService"

// ============================================================================
// Types
// ============================================================================

export interface PlantRegion {
  id: number
  name: string
  area_formatted?: string
  centroid?: {
    lat: number
    lng: number
  }
}

export interface LatestMonitoring {
  id: number
  plant_id: string
  status_tanaman: "Sehat" | "Mati"
  estimasi_tinggi: string
  height_cm?: number
  created_at: string
  image_url?: string
  plant_code: string
  sync_status: "Draft" | "Synced"
  plant_name: string
  region_info: string
  latitude: string
  longitude: string
  tinggi_tanaman: string
  plant?: any // Nested plant object from latest_monitoring.plant
}

export interface MyPlantItem {
  id: string
  name: string
  plant_code: string | null
  location: string | null
  planted_at: string | null
  image: string | null
  image_url: string | null
  latitude: string
  longitude: string
  region_id: number
  region: PlantRegion
  uploaded_by: string
  ai_name: string | null
  ai_scientific_name: string | null
  ai_variety: string | null
  ai_age_days: string | null
  ai_height_cm: string | null
  ai_condition: "healthy" | "needs_attention" | "critical" | null
  ai_condition_details: string | null
  ai_description: string | null
  ai_care_tips: string | null
  ai_confidence: string | null
  created_at: string
  updated_at: string
  plant_type_id: string | null
  current_height_cm: number | null
  current_height_updated_at: string | null
  tinggi_tanaman: string | null
  latest_monitoring: LatestMonitoring | null
}

export interface MyPlantsMeta {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

export interface MyPlantsResponse {
  success: boolean
  data: MyPlantItem[]
  page: MyPlantsMeta
}

export interface GetMyPlantsParams {
  page?: number
  per_page?: number
  search?: string
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get user's plants with pagination
 */
export const getMyPlants = async (
  params: GetMyPlantsParams = {},
): Promise<{
  data: MyPlantItem[]
  hasMore: boolean
  totalCount?: number
}> => {
  const { page = 1, per_page = 10, search } = params

  const queryParams: Record<string, any> = {
    page,
    per_page: per_page,
  }

  if (search) queryParams.search = search

  const result = await apiService.get<MyPlantsResponse>("/my-plants", queryParams)

  if (result.kind === "ok" && result.data) {
    const { data, page: meta } = result.data
    const hasMore = meta ? meta.currentPage < meta.lastPage : false

    return {
      data,
      hasMore,
      totalCount: meta?.total,
    }
  }

  throw new Error(getApiErrorMessage(result))
}
