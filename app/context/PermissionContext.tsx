/**
 * PermissionContext.tsx
 * Centralized permission handling for the app
 */

import React, { createContext, useContext, ReactNode } from "react"
import { Platform, Linking, Alert, NativeModules } from "react-native"
import {
  PERMISSIONS,
  PermissionStatus as RNPermissionStatus,
  RESULTS,
  check,
  request,
  openSettings,
  Permissions,
} from "react-native-permissions"

export type PermissionType =
  | "camera"
  | "location"
  | "photoLibrary"
  | "storage"
  | "notification"

export type PermissionStatus = "granted" | "denied" | "blocked" | "unavailable"

interface PermissionContextValue {
  checkPermission: (permission: PermissionType) => Promise<PermissionStatus>
  requestPermission: (permission: PermissionType) => Promise<PermissionStatus>
  openAppSettings: () => Promise<void>
  checkAndroidStorageAvailability: () => Promise<boolean>
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined)

interface PermissionProviderProps {
  children: ReactNode
}

const getNotificationPermission = (): Permissions => {
  if (Platform.OS === "android") {
    return "android.permission.POST_NOTIFICATIONS" as Permissions
  }
  return PERMISSIONS.IOS.NOTIFICATION
}

const getStoragePermission = (): Permissions => {
  if (Platform.OS === "android") {
    // For Android 12 and below
    return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
  }
  return PERMISSIONS.IOS.PHOTO_LIBRARY
}

const PERMISSION_MAP: Record<PermissionType, Permissions> = {
  camera: Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  })!,
  location: Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  })!,
  photoLibrary: Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  })!,
  storage: getStoragePermission(),
  notification: getNotificationPermission(),
}

const mapPermissionStatus = (status: RNPermissionStatus): PermissionStatus => {
  switch (status) {
    case RESULTS.GRANTED:
      return "granted"
    case RESULTS.DENIED:
      return "denied"
    case RESULTS.BLOCKED:
      return "blocked"
    case RESULTS.UNAVAILABLE:
      return "unavailable"
    default:
      return "unavailable"
  }
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  /**
   * Check if device is running Android 13 or higher (API 33+)
   * On Android 13+, storage permissions are not needed for document picker
   */
  const isAndroid13OrHigher = (): boolean => {
    if (Platform.OS !== "android") return false
    try {
      const { Constants } = NativeModules
      const PlatformConstants = Constants?.Platform || Constants
      const Release = PlatformConstants?.Release || PlatformConstants?.Version
      const androidVersion = parseInt(Release, 10)
      return androidVersion >= 13
    } catch (e) {
      console.log("Could not detect Android version:", e)
      return false
    }
  }

  /**
   * Check if storage access is available for the app
   * On Android 13+, this always returns true (document picker works without permission)
   */
  const checkAndroidStorageAvailability = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      return isAndroid13OrHigher() || (await checkPermission("storage")) === "granted"
    }
    return true
  }

  const checkPermission = async (permission: PermissionType): Promise<PermissionStatus> => {
    try {
      const nativePermission = PERMISSION_MAP[permission]
      if (!nativePermission) {
        return "unavailable"
      }

      // On Android 13+, storage permission is not applicable
      if (permission === "storage" && Platform.OS === "android" && isAndroid13OrHigher()) {
        return "granted"
      }

      const status = await check(nativePermission)
      return mapPermissionStatus(status)
    } catch (error) {
      console.error(`Error checking ${permission} permission:`, error)
      return "unavailable"
    }
  }

  const requestPermission = async (permission: PermissionType): Promise<PermissionStatus> => {
    try {
      // On Android 13+, storage permission is not needed for document picker
      if (permission === "storage" && Platform.OS === "android" && isAndroid13OrHigher()) {
        return "granted"
      }

      const nativePermission = PERMISSION_MAP[permission]
      if (!nativePermission) {
        return "unavailable"
      }

      // For Android storage permission, also request WRITE_EXTERNAL_STORAGE
      if (permission === "storage" && Platform.OS === "android") {
        // Request multiple storage permissions for broader compatibility
        const permissionsToRequest = [
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ]

        // Try requesting all storage permissions
        let finalStatus: RNPermissionStatus = RESULTS.GRANTED

        for (const perm of permissionsToRequest) {
          try {
            const status = await request(perm)
            if (status === RESULTS.DENIED || status === RESULTS.BLOCKED) {
              finalStatus = status
            }
          } catch (e) {
            // Permission might not be available on this Android version
            console.log(`Permission ${perm} not available, skipping`)
          }
        }

        const mappedStatus = mapPermissionStatus(finalStatus)

        if (mappedStatus === "blocked") {
          Alert.alert(
            "Permission Required",
            "Storage permission is required to access map files. Please enable it in app settings.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => openAppSettings() },
            ],
          )
        }

        return mappedStatus
      }

      const status = await request(nativePermission)
      const mappedStatus = mapPermissionStatus(status)

      if (mappedStatus === "blocked") {
        Alert.alert(
          "Permission Required",
          `Please enable ${permission} permission in app settings to continue.`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => openAppSettings() },
          ],
        )
      }

      return mappedStatus
    } catch (error) {
      console.error(`Error requesting ${permission} permission:`, error)
      return "unavailable"
    }
  }

  const openAppSettings = async () => {
    try {
      await openSettings()
    } catch (error) {
      console.error("Error opening app settings:", error)
      try {
        await Linking.openSettings()
      } catch (e) {
        console.error("Error opening settings with Linking:", e)
      }
    }
  }

  return (
    <PermissionContext.Provider
      value={{ checkPermission, requestPermission, openAppSettings, checkAndroidStorageAvailability }}
    >
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermission = () => {
  const context = useContext(PermissionContext)
  if (!context) {
    throw new Error("usePermission must be used within PermissionProvider")
  }
  return context
}

export default PermissionContext
