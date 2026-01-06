/**
 * usePermissions.ts
 * Hook for handling app permissions
 */

import { useCallback, useState } from "react"
import { usePermission as usePermissionContext, PermissionType, PermissionStatus } from "@/context/PermissionContext"

export interface PermissionResult {
  /**
   * Current permission status
   */
  status: PermissionStatus
  /**
   * Request permission
   */
  request: () => Promise<PermissionStatus>
  /**
   * Check permission status
   */
  check: () => Promise<PermissionStatus>
  /**
   * Open app settings
   */
  openSettings: () => Promise<void>
}

/**
 * Hook for managing a specific permission
 */
export const useAppPermission = (permissionType: PermissionType): PermissionResult => {
  const permissionContext = usePermissionContext()
  const [status, setStatus] = useState<PermissionStatus>("unavailable")

  const check = useCallback(async () => {
    const result = await permissionContext.checkPermission(permissionType)
    setStatus(result)
    return result
  }, [permissionContext, permissionType])

  const request = useCallback(async () => {
    const result = await permissionContext.requestPermission(permissionType)
    setStatus(result)
    return result
  }, [permissionContext, permissionType])

  const openSettings = useCallback(async () => {
    await permissionContext.openAppSettings()
  }, [permissionContext])

  return {
    status,
    request,
    check,
    openSettings,
  }
}

/**
 * Hook for camera permission
 */
export const useCameraPermission = () => {
  return useAppPermission("camera")
}

/**
 * Hook for location permission
 */
export const useLocationPermission = () => {
  return useAppPermission("location")
}

/**
 * Hook for photo library permission
 */
export const usePhotoLibraryPermission = () => {
  return useAppPermission("photoLibrary")
}

/**
 * Hook for storage permission
 */
export const useStoragePermission = () => {
  return useAppPermission("storage")
}

/**
 * Hook for notification permission
 */
export const useNotificationPermission = () => {
  return useAppPermission("notification")
}

export default useAppPermission
