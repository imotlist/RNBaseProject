/**
 * riwayatTanaman.tsx
 * Plant monitoring history API endpoints for a specific plant
 */

import { apiService, getApiErrorMessage } from "../ApiService"

// ============================================================================
// Types
// ============================================================================

export interface PlantRegion {
  id: number
  name: string
  area_formatted?: string | null
  centroid?: {
    lat: number
    lng: number
  } | null
}

export interface PlantInfo {
  id: string
  name: string
  plant_code: string
  latitude: string
  longitude: string
  image?: string | null
  region?: PlantRegion
}

export interface AIAnalysisMetadata {
  status: string
  model_name: string
  ai_response: any
  error_message?: string
}

export interface AIAnalysisRequestPayload {
  model: string
  prompt: string
  mime_type: string
  image_size: number
  generation_config: {
    topK: number
    topP: number
    temperature: number
    maxOutputTokens: number
  }
}

export interface AIAnalysisParsedResult {
  name: string
  scientific_name: string
  variety: string | null
  age_days: number | null
  height_cm: number | null
  condition: string
  condition_details: string
  description: string
  care_tips: string
  confidence: string
}

export interface AIAnalysisJson {
  name: string | null
  variety: string | null
  age_days: string | null
  metadata: AIAnalysisMetadata
  parsed_result: AIAnalysisParsedResult | null
  request_payload: AIAnalysisRequestPayload
  response_time_ms: number
  care_tips: string | null
  condition: string | null
  height_cm: string | null
  confidence: string | null
  description: string | null
  raw_response: string | null
  scientific_name: string | null
  condition_details: string | null
}

export interface PlantMonitoringItem {
  id: number
  image_path: string
  height_cm: number | null
  leaf_condition: string | null
  growth_status: "Sehat" | "Mati" | null
  ai_analysis_json: AIAnalysisJson | null
  created_at: string
  updated_at: string
  user_id: string
  status_tanaman: "Sehat" | "Mati"
  jarak_tanam: string
  ajir: string
  kebersihan_piringan: string
  indikasi_gagal: string | null
  estimasi_tinggi: string
  catatan: string
  plant_id: string
  image_url: string
  plant_code: string
  sync_status: "Draft" | "Synced"
  plant_name: string
  region_info: string | null
  latitude: string
  longitude: string
  tinggi_tanaman: string
  user: {
    id: string
    name: string
  }
  plant: {
    id: string
    name: string
    plant_code: string | null
    latitude: string
    longitude: string
    tinggi_tanaman: string | null
    image_url: string | null
    region: any | null
  }
}

export interface PlantMonitoringsPage {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

export interface PlantMonitoringsResponse {
  success: boolean
  data: {
    plant: PlantInfo
    monitorings: PlantMonitoringItem[]
  }
  page: PlantMonitoringsPage
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
    const responseData = result.data.data
    const { plant, monitorings } = responseData
    const meta = result.data.page
    const hasMore = meta ? meta.currentPage < meta.lastPage : false

    return {
      plant,
      data: monitorings,
      hasMore,
      totalCount: meta?.total,
    }
  }

  throw new Error(getApiErrorMessage(result))
}
