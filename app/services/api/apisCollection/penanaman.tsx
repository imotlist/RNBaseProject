/**
 * penanaman.tsx
 * Plant monitoring API endpoints
 */

import { apiService, getApiErrorMessage } from "../ApiService"

// ============================================================================
// Types
// ============================================================================

export interface MonitoringRequest {
  image: any  // FormData with image file
  status_tanaman: "Sehat" | "Mati"
  jarak_tanam?: string
  ajir?: string
  kebersihan_piringan?: string
  indikasi_gagal?: string
  estimasi_tinggi?: string
  catatan?: string
  latitude: string
  longitude: string
}

export interface MonitoringData {
  id: string | number
  image?: string
  status_tanaman: string
  jarak_tanam?: string
  ajir?: string
  kebersihan_piringan?: string
  indikasi_gagal?: string
  estimasi_tinggi?: string
  catatan?: string
  latitude: string
  longitude: string
  created_at?: string
}

export interface MonitoringResponse {
  success: boolean
  message: string
  data: MonitoringData
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Create new plant monitoring record with image upload
 */
export const createMonitoring = async (formData: FormData): Promise<MonitoringResponse> => {
  const result = await apiService.upload<MonitoringResponse>("/monitorings", formData, {
    isMultipart: true,
  })

  if (result.kind === "ok" && result.data) {
    return result.data
  }

  // Throw error with message
  throw new Error(getApiErrorMessage(result))
}

/**
 * Get all monitoring records
 */
export const getMonitorings = async (params?: {
  page?: number
  per_page?: number
  status?: string
}): Promise<{ data: MonitoringData[]; total?: number }> => {
  const result = await apiService.get<{ data: MonitoringData[]; total?: number }>("/monitorings", params)

  if (result.kind === "ok" && result.data) {
    return result.data
  }

  throw new Error(getApiErrorMessage(result))
}

/**
 * Get single monitoring record by ID
 */
export const getMonitoring = async (id: string | number): Promise<MonitoringData> => {
  const result = await apiService.get<MonitoringData>(`/monitorings/${id}`)

  if (result.kind === "ok" && result.data) {
    return result.data
  }

  throw new Error(getApiErrorMessage(result))
}

/**
 * Update monitoring record
 */
export const updateMonitoring = async (
  id: string | number,
  data: Partial<MonitoringRequest>,
): Promise<MonitoringResponse> => {
  const result = await apiService.post<MonitoringResponse>(`/monitorings/${id}`, data)

  if (result.kind === "ok" && result.data) {
    return result.data
  }

  throw new Error(getApiErrorMessage(result))
}

/**
 * Delete monitoring record
 */
export const deleteMonitoring = async (id: string | number): Promise<void> => {
  const result = await apiService.delete<{ success: boolean }>(`/monitorings/${id}`)

  if (result.kind !== "ok") {
    throw new Error(getApiErrorMessage(result))
  }
}
