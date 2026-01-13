/**
 * LocationContext.tsx
 *
 * Provides GPS location services that work offline and online.
 * Uses expo-location for device GPS with fallback to cached last known location.
 */

import { createContext, useContext, ReactNode, useCallback, useState, useEffect, useRef } from "react"
import Location, {
  LocationAccuracy,
  LocationObject,
  LocationSubscription,
  PermissionStatus,
} from "expo-location"
import { Platform, AppState, AppStateStatus } from "react-native"
import { usePermission } from "./PermissionContext"
import { loadString, saveString, remove } from "@/utils/storage"

// ============================================================================
// Types
// ============================================================================

export interface LocationCoords {
  latitude: number
  longitude: number
  altitude?: number | null
  accuracy?: number | null
  speed?: number | null
  heading?: number | null
}

export interface LocationData extends LocationCoords {
  timestamp: number
}

export interface LocationError {
  code: string
  message: string
}

export type LocationStatus = "idle" | "loading" | "success" | "error"

interface LocationContextValue {
  // Current location state
  location: LocationData | null
  status: LocationStatus
  error: LocationError | null

  // Get current location (one-time)
  getCurrentLocation: (options?: GetLocationOptions) => Promise<LocationData | null>

  // Start/stop watching location
  startWatching: (options?: WatchLocationOptions) => Promise<void>
  stopWatching: () => void

  // Check if location services are enabled
  checkServicesEnabled: () => Promise<boolean>

  // Request location permission
  requestPermission: () => Promise<PermissionStatus>

  // Get last known location (cached, works offline)
  getLastKnownLocation: () => LocationData | null

  // Clear cached location
  clearCachedLocation: () => Promise<void>

  // Is currently watching
  isWatching: boolean
}

interface GetLocationOptions {
  accuracy?: LocationAccuracy
  timeout?: number
  mayShowUserSettingsDialog?: boolean
}

interface WatchLocationOptions {
  accuracy?: LocationAccuracy
  distance?: number
  interval?: number
}

interface LocationProviderProps {
  children: ReactNode
  /**
   * Whether to automatically get location on mount
   */
  autoGetLocation?: boolean
  /**
   * Cache key for storing last known location
   */
  cacheKey?: string
}

// ============================================================================
// Storage Keys
// ============================================================================

const DEFAULT_CACHE_KEY = "@cached_location"
const LOCATION_TIMESTAMP_KEY = "@cached_location_timestamp"

// ============================================================================
// Context
// ============================================================================

const LocationContext = createContext<LocationContextValue | undefined>(undefined)

// ============================================================================
// Provider
// ============================================================================

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
  autoGetLocation = false,
  cacheKey = DEFAULT_CACHE_KEY,
}) => {
  const { requestPermission: reqPermission, checkPermission } = usePermission()

  const [location, setLocation] = useState<LocationData | null>(null)
  const [status, setStatus] = useState<LocationStatus>("idle")
  const [error, setError] = useState<LocationError | null>(null)
  const [isWatching, setIsWatching] = useState(false)

  const subscriptionRef = useRef<LocationSubscription | null>(null)
  const appStateRef = useRef<AppStateStatus>(AppState.currentState)

  // ============================================================================
  // Helpers
  // ============================================================================

  const saveLocationToCache = useCallback(
    (loc: LocationData) => {
      try {
        const data = JSON.stringify(loc)
        saveString(cacheKey, data)
        saveString(LOCATION_TIMESTAMP_KEY, loc.timestamp.toString())
      } catch (err) {
        console.error("[Location] Error saving to cache:", err)
      }
    },
    [cacheKey],
  )

  const loadLocationFromCache = useCallback((): LocationData | null => {
    try {
      const data = loadString(cacheKey)
      if (data) {
        const parsed = JSON.parse(data) as LocationData
        // Check if cache is not too old (24 hours)
        const maxAge = 24 * 60 * 60 * 1000
        if (Date.now() - parsed.timestamp < maxAge) {
          return parsed
        }
      }
    } catch (err) {
      console.error("[Location] Error loading from cache:", err)
    }
    return null
  }, [cacheKey])

  // ============================================================================
  // Get Current Location
  // ============================================================================

  const getCurrentLocation = useCallback(
    async (options: GetLocationOptions = {}): Promise<LocationData | null> => {
      const {
        accuracy = LocationAccuracy.Balanced,
        timeout = 15000,
        mayShowUserSettingsDialog = true,
      } = options

      setStatus("loading")
      setError(null)

      try {
        // Check permission first
        const permissionStatus = await checkPermission("location")

        if (permissionStatus === "denied" || permissionStatus === "blocked") {
          // Try requesting permission
          const newStatus = await reqPermission("location")
          if (newStatus !== "granted") {
            setError({
              code: "PERMISSION_DENIED",
              message: "Location permission denied",
            })
            setStatus("error")
            return null
          }
        }

        // Check if services are enabled
        const enabled = await Location.hasServicesEnabledAsync()
        if (!enabled) {
          if (mayShowUserSettingsDialog) {
            await Location.enableNetworkProviderAsync()
          }

          // Check again after trying to enable
          const stillEnabled = await Location.hasServicesEnabledAsync()
          if (!stillEnabled) {
            setError({
              code: "SERVICES_DISABLED",
              message: "Location services are disabled",
            })
            setStatus("error")

            // Try to return cached location as fallback
            const cached = loadLocationFromCache()
            if (cached) {
              setLocation(cached)
              return cached
            }

            return null
          }
        }

        // Get current position with timeout
        const result = await Promise.race([
          Location.getCurrentPositionAsync(
            {
              accuracy,
            },
            options,
          ),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error("Location timeout")),
              timeout,
            ),
          ),
        ])

        const locationData: LocationData = {
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
          altitude: result.coords.altitude,
          accuracy: result.coords.accuracy,
          speed: result.coords.speed,
          heading: result.coords.heading,
          timestamp: result.timestamp || Date.now(),
        }

        setLocation(locationData)
        setStatus("success")
        saveLocationToCache(locationData)

        return locationData
      } catch (err: any) {
        console.error("[Location] Error getting location:", err)

        // Try to return cached location as fallback
        const cached = loadLocationFromCache()
        if (cached) {
          setLocation(cached)
          setStatus("success")
          return cached
        }

        setError({
          code: err.code || "UNKNOWN_ERROR",
          message: err.message || "Failed to get location",
        })
        setStatus("error")
        return null
      }
    },
    [checkPermission, reqPermission, loadLocationFromCache, saveLocationToCache],
  )

  // ============================================================================
  // Watch Location
  // ============================================================================

  const startWatching = useCallback(
    async (options: WatchLocationOptions = {}): Promise<void> => {
      const { accuracy = LocationAccuracy.Balanced, distance = 10, interval = 10000 } = options

      if (isWatching) {
        console.log("[Location] Already watching location")
        return
      }

      try {
        // Check permission
        const permissionStatus = await checkPermission("location")
        if (permissionStatus !== "granted") {
          const newStatus = await reqPermission("location")
          if (newStatus !== "granted") {
            throw new Error("Location permission not granted")
          }
        }

        // Check services
        const enabled = await Location.hasServicesEnabledAsync()
        if (!enabled) {
          await Location.enableNetworkProviderAsync()
        }

        // Start watching
        subscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy,
            distanceInterval: distance,
            timeInterval: interval,
          },
          (result) => {
            const locationData: LocationData = {
              latitude: result.coords.latitude,
              longitude: result.coords.longitude,
              altitude: result.coords.altitude,
              accuracy: result.coords.accuracy,
              speed: result.coords.speed,
              heading: result.coords.heading,
              timestamp: result.timestamp || Date.now(),
            }

            setLocation(locationData)
            setStatus("success")
            saveLocationToCache(locationData)
          },
        )

        setIsWatching(true)
      } catch (err: any) {
        console.error("[Location] Error starting watch:", err)
        setError({
          code: err.code || "WATCH_ERROR",
          message: err.message || "Failed to start watching location",
        })
        setStatus("error")
      }
    },
    [isWatching, checkPermission, reqPermission, saveLocationToCache],
  )

  const stopWatching = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove()
      subscriptionRef.current = null
      setIsWatching(false)
    }
  }, [])

  // ============================================================================
  // Check Services
  // ============================================================================

  const checkServicesEnabled = useCallback(async (): Promise<boolean> => {
    try {
      return await Location.hasServicesEnabledAsync()
    } catch {
      return false
    }
  }, [])

  // ============================================================================
  // Request Permission
  // ============================================================================

  const requestPermission = useCallback(async (): Promise<PermissionStatus> => {
    try {
      const status = await Location.requestForegroundPermissionsAsync()
      return status
    } catch (err) {
      console.error("[Location] Error requesting permission:", err)
      return PermissionStatus.UNDETERMINED
    }
  }, [])

  // ============================================================================
  // Get Last Known Location
  // ============================================================================

  const getLastKnownLocation = useCallback((): LocationData | null => {
    return loadLocationFromCache()
  }, [loadLocationFromCache])

  // ============================================================================
  // Clear Cache
  // ============================================================================

  const clearCachedLocation = useCallback(async () => {
    try {
      remove(cacheKey)
      remove(LOCATION_TIMESTAMP_KEY)
    } catch (err) {
      console.error("[Location] Error clearing cache:", err)
    }
  }, [cacheKey])

  // ============================================================================
  // Effects
  // ============================================================================

  // Auto get location on mount
  useEffect(() => {
    if (autoGetLocation) {
      getCurrentLocation()
    }
  }, [autoGetLocation])

  // Stop watching when unmounting
  useEffect(() => {
    return () => {
      stopWatching()
    }
  }, [stopWatching])

  // Handle app state changes to restart watching if needed
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App came to foreground, refresh location if watching
        if (isWatching) {
          getCurrentLocation()
        }
      }
      appStateRef.current = nextAppState
    })

    return () => subscription.remove()
  }, [isWatching, getCurrentLocation])

  // ============================================================================
  // Context Value
  // ============================================================================

  const value: LocationContextValue = {
    location,
    status,
    error,
    getCurrentLocation,
    startWatching,
    stopWatching,
    checkServicesEnabled,
    requestPermission,
    getLastKnownLocation,
    clearCachedLocation,
    isWatching,
  }

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

// ============================================================================
// Hook
// ============================================================================

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider")
  }
  return context
}

export default LocationContext
