/**
 * usePlantsList.ts
 *
 * Custom hook for managing plants list with InfiniteList.
 * Provides a simple, readable API for loading and displaying plants.
 *
 * @module screens/Home
 */

import { useState, useCallback, useMemo } from "react"
import type { UseInfiniteListOptions } from "@/hooks/useInfiniteList"
import type { MyPlantItem } from "@/services/api/apisCollection/myPlants"
import * as myPlantsApi from "@/services/api/apisCollection/myPlants"
import * as Location from "expo-location"
// ============================================================================
// Return Type
// ============================================================================

export interface UsePlantsListReturn {
  // Configuration for InfiniteList component
  listOptions: UseInfiniteListOptions<MyPlantItem>
  // Total count of plants
  totalCount: number
}

// ============================================================================
// Configuration Type
// ============================================================================

export interface UsePlantsListConfig {
  // Number of items per page (default: 10)
  latitude?: string
  longitude?: string
  pageSize?: number
  // Enable pull-to-refresh (default: false)
  pullToRefresh?: boolean
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook for managing plants list with InfiniteList.
 *
 * @example
 * ```tsx
 * const { listOptions, totalCount } = usePlantsList({ pageSize: 10 })
 *
 * return (
 *   <InfiniteList
 *     hookOptions={listOptions}
 *     renderItem={(item) => <PlantCard plant={item} />}
 *   />
 * )
 * ```
 */
export function usePlantsList(
  config: UsePlantsListConfig = {},
): UsePlantsListReturn {
  const { pageSize = 10, pullToRefresh = false } = config
  const [totalCount, setTotalCount] = useState(0)

  /**
   * Fetch plants from API
   * Called automatically by InfiniteList based on pagination needs
   */
  const fetchPlants = useCallback(async (options: { page: number; pageSize: number, }) => {
    const { page, pageSize: size } = options

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })

    const { latitude, longitude } = location.coords

    // Call the API
    const response = await myPlantsApi.getMyPlants({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      page,
      per_page: size,
    })

    console.log('[PLANT]', response);

    // Update total count for display
    if (response.totalCount !== undefined) {
      setTotalCount(response.totalCount)
    }

    // Return data in the format InfiniteList expects
    return {
      data: response.data,
      hasMore: response.hasMore,
      totalCount: response.totalCount,
    }
  }, [])

  /**
   * Configuration object for InfiniteList component
   * Memoized to prevent unnecessary re-renders
   */
  const listOptions = useMemo<UseInfiniteListOptions<MyPlantItem>>(
    () => ({
      fetchData: fetchPlants,
      pageSize,
      pullToRefresh,
    }),
    [fetchPlants, pageSize, pullToRefresh],
  )

  return {
    listOptions,
    totalCount,
  }
}

export default usePlantsList
