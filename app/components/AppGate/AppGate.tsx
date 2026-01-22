/**
 * AppGate.tsx
 *
 * Entry gate component that blocks app usage until offline tiles are available.
 * This ensures the app cannot be used without mandatory offline map tiles.
 */

import React, { useState, useEffect, useCallback } from "react"
import { View, StyleSheet, StatusBar } from "react-native"
import { checkOfflineTilesReady } from "@/services/offlineMap"
import { DownloadMapScreen } from "@/screens/DownloadMapScreen"

// ============================================================================
// Types
// ============================================================================

type GateState = "checking" | "blocked" | "ready"

export type AppGateProps = {
  children: React.ReactNode
}

// ============================================================================
// Component
// ============================================================================

export const AppGate: React.FC<AppGateProps> = ({ children }) => {
  const [gateState, setGateState] = useState<GateState>("checking")

  /**
   * Check if offline tiles are available
   */
  const checkTiles = useCallback(async () => {
    try {
      const hasTiles = await checkOfflineTilesReady()

      if (hasTiles) {
        setGateState("ready")
      } else {
        setGateState("blocked")
      }
    } catch (error) {
      console.error("Error checking tiles in AppGate:", error)
      // If we can't determine, assume blocked to be safe
      setGateState("blocked")
    }
  }, [])

  /**
   * Initial check on mount
   */
  useEffect(() => {
    checkTiles()
  }, [checkTiles])

  /**
   * Handle download complete - transition to ready state
   */
  const handleDownloadComplete = useCallback(() => {
    setGateState("ready")
  }, [])

  /**
   * Handle retry - re-check for tiles
   */
  const handleRetry = useCallback(() => {
    setGateState("checking")
    // Small delay to allow state to update
    setTimeout(() => {
      checkTiles()
    }, 100)
  }, [checkTiles])

  /**
   * Render checking state
   */
  const renderChecking = () => (
    <View style={styles.fullScreen}>
      <StatusBar barStyle="default" />
      <DownloadMapScreen key="checking" onDownloadComplete={handleDownloadComplete} onRetry={handleRetry} />
    </View>
  )

  /**
   * Render blocked state - show download screen
   */
  const renderBlocked = () => (
    <View style={styles.fullScreen}>
      <StatusBar barStyle="default" />
      <DownloadMapScreen key="blocked" onDownloadComplete={handleDownloadComplete} onRetry={handleRetry} />
    </View>
  )

  /**
   * Render ready state - show main app
   */
  const renderReady = () => {
    return <>{children}</>
  }

  // Render based on gate state
  switch (gateState) {
    case "checking":
      return renderChecking()
    case "blocked":
      return renderBlocked()
    case "ready":
      return renderReady()
    default:
      return renderChecking()
  }
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
})

export default AppGate

/**
 * Hook to access AppGate functionality from anywhere in the app
 */
export const useAppGate = () => {
  const checkTiles = async () => {
    return await checkOfflineTilesReady()
  }

  return {
    checkTiles,
    isTilesReady: checkTiles,
  }
}
