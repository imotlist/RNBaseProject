/**
 * cities.tsx
 * Cities API endpoints for public city data
 * Note: Uses ../public prefix to go up from /api/mobile to /api/public
 */

import { apiService, getApiErrorMessage } from "../ApiService"

// ============================================================================
// Types
// ============================================================================

/**
 * Province data structure
 */
export interface Province {
  id: number
  code: string
  name: string
  latitude: string
  longitude: string
  created_at: string
  updated_at: string
}

/**
 * City data structure
 */
export interface City {
  code: string
  name: string
  province_id: number
  latitude: string
  longitude: string
  created_at: string
  updated_at: string
  id: string
  province: Province
}

/**
 * Paginated cities response
 */
export interface CitiesResponse {
  current_page: number
  data: City[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    page: number | null
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

/**
 * City option for dropdown (simplified version)
 */
export interface CityOption {
  id: string
  name: string
  provinceName?: string
  latitude?: string
  longitude?: string
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all cities (paginated)
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 100)
 *
 * Note: Uses ../public/cities to navigate from /api/mobile to /api/public/cities
 */
export const getCities = async (
  page: number = 1,
  perPage: number = 100,
): Promise<CitiesResponse> => {
  const result = await apiService.get<CitiesResponse>(
    "../public/cities",
    { page, per_page: perPage },
    { requireAuth: false },
  )

  if (result.kind === "ok" && result.data) {
    return result.data
  }

  throw new Error(getApiErrorMessage(result))
}

/**
 * Get all cities as simplified options for dropdown
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 100)
 */
export const getCitiesOptions = async (
  page: number = 1,
  perPage: number = 100,
): Promise<CityOption[]> => {
  const response = await getCities(page, perPage)

  return response.data.map((city) => ({
    id: city.id,
    name: `${city.name}, ${city.province.name}`,
    provinceName: city.province.name,
    latitude: city.latitude,
    longitude: city.longitude,
  }))
}

/**
 * Search cities by name
 * @param query - Search query
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 100)
 */
export const searchCities = async (
  query: string,
  page: number = 1,
  perPage: number = 100,
): Promise<CitiesResponse> => {
  const result = await apiService.get<CitiesResponse>(
    "../public/cities",
    { search: query, page, per_page: perPage },
    { requireAuth: false },
  )

  if (result.kind === "ok" && result.data) {
    return result.data
  }

  throw new Error(getApiErrorMessage(result))
}

/**
 * Get city by ID
 * @param id - City ID
 */
export const getCityById = async (id: string): Promise<City> => {
  const result = await apiService.get<{ data: City }>(
    `../public/cities/${id}`,
    {},
    { requireAuth: false },
  )

  if (result.kind === "ok" && result.data?.data) {
    return result.data.data
  }

  throw new Error(getApiErrorMessage(result))
}

/**
 * Get cities by province ID
 * @param provinceId - Province ID
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 100)
 */
export const getCitiesByProvince = async (
  provinceId: number,
  page: number = 1,
  perPage: number = 100,
): Promise<CitiesResponse> => {
  const result = await apiService.get<CitiesResponse>(
    "../public/cities",
    { province_id: provinceId, page, per_page: perPage },
    { requireAuth: false },
  )

  if (result.kind === "ok" && result.data) {
    return result.data
  }

  throw new Error(getApiErrorMessage(result))
}

export default {
  getCities,
  getCitiesOptions,
  searchCities,
  getCityById,
  getCitiesByProvince,
}
