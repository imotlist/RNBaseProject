/**
 * fcm.ts
 * Firebase Cloud Messaging (FCM) token utility
 * Uses Firebase v2+ modular SDK
 */

import { getMessaging, hasPermission, requestPermission, getToken, AuthorizationStatus } from "@react-native-firebase/messaging"
import { getApp } from "@react-native-firebase/app"
import { loadString, saveString, remove } from "./storage"

const FCM_TOKEN_KEY = "@fcm_token"

/**
 * Check if app has notification permissions
 */
async function checkPermission(): Promise<boolean> {
  const authStatus = await hasPermission(getMessaging(getApp()))
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  return enabled
}

/**
 * Request notification permissions
 */
async function requestFCMPermission(): Promise<boolean> {
  try {
    const authStatus = await requestPermission(getMessaging(getApp()))
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL

    if (!enabled) {
      console.log("[FCM] Push notification permissions not granted")
    }

    return enabled
  } catch (error) {
    console.error("[FCM] Error requesting permission:", error)
    return false
  }
}

/**
 * Get FCM token from Firebase
 * Returns cached token if available, otherwise requests new token
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    // Check if we have a cached token
    const cachedToken = loadString(FCM_TOKEN_KEY)
    if (cachedToken) {
      console.log("[FCM] Using cached token")
      return cachedToken
    }

    // Check and request permission
    let hasPerm = await checkPermission()
    if (!hasPerm) {
      hasPerm = await requestFCMPermission()
    }

    if (!hasPerm) {
      console.log("[FCM] No notification permissions")
      return null
    }

    // Get FCM token
    const token = await getToken(getMessaging(getApp()))
    if (!token) {
      console.log("[FCM] Failed to get FCM token")
      return null
    }

    console.log("[FCM] Got new FCM token")

    // Cache the token
    saveString(FCM_TOKEN_KEY, token)

    return token
  } catch (error) {
    console.error("[FCM] Error getting FCM token:", error)
    return null
  }
}

/**
 * Clear cached FCM token
 */
export async function clearFCMToken(): Promise<void> {
  try {
    remove(FCM_TOKEN_KEY)
    console.log("[FCM] Cleared cached token")
  } catch (error) {
    console.error("[FCM] Error clearing FCM token:", error)
  }
}

/**
 * Listen for token refresh events
 * Call this on app startup to keep token up to date
 */
export function setupFCMTokenRefreshListener(): void {
  const messagingInstance = getMessaging(getApp())

  // Listen for token refresh events - using the instance
  messagingInstance.onTokenRefresh(async (token: string) => {
    console.log("[FCM] Token refreshed:", token)
    saveString(FCM_TOKEN_KEY, token)
    // Optionally send new token to API
  })
}

/**
 * Request push notification permissions
 */
export async function requestNotificationPermission(): Promise<boolean> {
  return requestFCMPermission()
}

/**
 * Get the current FCM token (force refresh if needed)
 */
export async function getFCMTokenForceRefresh(): Promise<string | null> {
  try {
    // Check and request permission
    let hasPerm = await checkPermission()
    if (!hasPerm) {
      hasPerm = await requestFCMPermission()
    }

    if (!hasPerm) {
      return null
    }

    // Clear cached token and get new one
    remove(FCM_TOKEN_KEY)
    const token = await getToken(getMessaging(getApp()))
    if (token) {
      saveString(FCM_TOKEN_KEY, token)
      return token
    }
    return null
  } catch (error) {
    console.error("[FCM] Error force refreshing token:", error)
    return null
  }
}

/**
 * Setup foreground message handler
 * Call this to handle messages when app is in foreground
 */
export function setupForegroundMessageHandler(): void {
  const messagingInstance = getMessaging(getApp())

  messagingInstance.onMessage(async (remoteMessage: any) => {
    console.log("[FCM] Foreground message received:", remoteMessage)
    // Handle foreground message here
    // You can show a local notification or update UI
  })
}
