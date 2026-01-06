/**
 * PermissionContext.tsx
 * Centralized permission handling for the app
 */

import React, { createContext, useContext, ReactNode } from "react"
import { Platform, Linking, Alert } from "react-native"
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
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined)

interface PermissionProviderProps {
  children: ReactNode
}

const getNotificationPermission = (): Permissions => {
  if (Platform.OS === "android") {
    return "android.permission.POST_NOTIFICATIONS" as Permissions
  }
  return PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY
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
  storage: Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  })!,
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
  const checkPermission = async (permission: PermissionType): Promise<PermissionStatus> => {
    try {
      const nativePermission = PERMISSION_MAP[permission]
      if (!nativePermission) {
        return "unavailable"
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
      const nativePermission = PERMISSION_MAP[permission]
      if (!nativePermission) {
        return "unavailable"
      }
      const status = await request(nativePermission)
      const mappedStatus = mapPermissionStatus(status)

      if (mappedStatus === "blocked") {
        Alert.alert(
          "Permission Required",
          `Please enable ${permission} permission in app settings to continue.`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => openSettings() },
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
      value={{ checkPermission, requestPermission, openAppSettings }}
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
