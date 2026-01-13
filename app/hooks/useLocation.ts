/**
 * useLocation.ts
 *
 * Custom hooks for location functionality.
 * These are wrappers around the LocationContext for more convenient usage.
 */

import { useCallback, useEffect, useState } from "react"
import { useLocation as useLocationContext } from "@/context/LocationContext"
import type { LocationData, LocationCoords, LocationError, LocationStatus } from "@/context/LocationContext"

// ============================================================================
// Hook: useCurrentLocation
// ============================================================================

/**
 * Hook to get current location with loading state
 * @param autoFetch - Whether to automatically fetch location on mount
 */
export function useCurrentLocation(autoFetch = false) {
  const { getCurrentLocation, location, status, error } = useLocationContext()
  const [isLoading, setIsLoading] = useState(false)

  const fetchLocation = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getCurrentLocation()
      return result
    } finally {
      setIsLoading(false)
    }
  }, [getCurrentLocation])

  useEffect(() => {
    if (autoFetch) {
      fetchLocation()
    }
  }, [autoFetch, fetchLocation])

  return {
    location,
    isLoading,
    status,
    error,
    fetchLocation,
  }
}

// ============================================================================
// Hook: useWatchLocation
// ============================================================================

/**
 * Hook to watch/track location changes
 * @param options - Watch options (accuracy, distance, interval)
 * @param autoStart - Whether to automatically start watching on mount
 */
export function useWatchLocation(
  options?: {
    accuracy?: import("expo-location").LocationAccuracy
    distance?: number
    interval?: number
  },
  autoStart = false,
) {
  const { startWatching, stopWatching, location, isWatching } = useLocationContext()

  const start = useCallback(async () => {
    await startWatching(options)
  }, [startWatching, options])

  const stop = useCallback(() => {
    stopWatching()
  }, [stopWatching])

  useEffect(() => {
    if (autoStart) {
      start()
    }

    return () => {
      stop()
    }
  }, [autoStart, start, stop])

  return {
    location,
    isWatching,
    start,
    stop,
  }
}

// ============================================================================
// Hook: useCachedLocation
// ============================================================================

/**
 * Hook to get last known cached location (works offline)
 */
export function useCachedLocation() {
  const { getLastKnownLocation, clearCachedLocation } = useLocationContext()

  return {
    cachedLocation: getLastKnownLocation(),
    clearCache: clearCachedLocation,
  }
}

// ============================================================================
// Hook: useLocationPermission
// ============================================================================

/**
 * Hook to handle location permission
 */
export function useLocationPermission() {
  const { requestPermission, checkServicesEnabled } = useLocationContext()
  const [permissionStatus, setPermissionStatus] = useState<"pending" | "granted" | "denied">("pending")
  const [servicesEnabled, setServicesEnabled] = useState<boolean | null>(null)

  const checkPermission = useCallback(async () => {
    try {
      const status = await requestPermission()
      if (status === "granted") {
        setPermissionStatus("granted")
        const enabled = await checkServicesEnabled()
        setServicesEnabled(enabled)
        return true
      } else {
        setPermissionStatus("denied")
        return false
      }
    } catch {
      setPermissionStatus("denied")
      return false
    }
  }, [requestPermission, checkServicesEnabled])

  return {
    permissionStatus,
    servicesEnabled,
    checkPermission,
  }
}

// ============================================================================
// Hook: useGeofencing (placeholder for future)
// ============================================================================

/**
 * Hook for geofencing functionality (placeholder)
 * Can be extended with expo-location's geofencing features
 */
export function useGeofencing() {
  // TODO: Implement geofencing logic using expo-location
  return {
    // Future geofencing methods
    addRegion: () => console.log("Geofencing not yet implemented"),
    removeRegion: () => console.log("Geofencing not yet implemented"),
    checkIfInRegion: () => console.log("Geofencing not yet implemented"),
  }
}

// ============================================================================
// Export all hooks
// ============================================================================

export {
  useLocationContext as useLocation,
  type LocationData,
  type LocationCoords,
  type LocationError,
  type LocationStatus,
}

export default useCurrentLocation
