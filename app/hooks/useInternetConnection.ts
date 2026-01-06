/**
 * useInternetConnection.ts
 * Hook for checking and monitoring internet connection
 */

import { useEffect, useCallback } from "react"
import NetInfo, { NetInfoState } from "@react-native-community/netinfo"
import { useConnection } from "@/context/ConnectionContext"

export interface ConnectionStatus {
  /**
   * Whether device is connected to a network
   */
  isConnected: boolean
  /**
   * Whether internet is reachable
   */
  isInternetReachable: boolean
  /**
   * Connection type (wifi, cellular, etc.)
   */
  type: string | null
  /**
   * Function to manually check connection
   */
  check: () => Promise<NetInfoState>
}

/**
 * Hook for internet connection status
 */
export const useInternetConnection = (): ConnectionStatus => {
  const { isConnected, isInternetReachable, connectionType } = useConnection()

  const check = useCallback(async () => {
    return await NetInfo.fetch()
  }, [])

  return {
    isConnected,
    isInternetReachable,
    type: connectionType,
    check,
  }
}

/**
 * Hook that calls a callback when connection status changes
 */
export interface UseConnectionChangeOptions {
  /**
   * Callback when connection is restored
   */
  onConnected?: () => void
  /**
   * Callback when connection is lost
   */
  onDisconnected?: () => void
  /**
   * Whether to call initial callback
   */
  callInitial?: boolean
}

export const useConnectionChange = (options: UseConnectionChangeOptions) => {
  const { onConnected, onDisconnected, callInitial = false } = options
  const { isConnected } = useConnection()

  useEffect(() => {
    if (callInitial) {
      if (isConnected) {
        onConnected?.()
      } else {
        onDisconnected?.()
      }
    }
  }, []) // Only run on mount

  useEffect(() => {
    // Handle connection changes
    if (isConnected) {
      onConnected?.()
    } else {
      onDisconnected?.()
    }
  }, [isConnected, onConnected, onDisconnected])
}

export default useInternetConnection
