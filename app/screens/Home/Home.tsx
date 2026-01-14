/**
 * Home.tsx
 *
 * Container-based screen for Home feature.
 * This file contains the screen controller logic with state management
 * and event handlers.
 *
 * @module screens/Home
 */

import { useState, useEffect, useCallback } from "react"
import { useNavigation } from "@react-navigation/native"
import { useIsFocused } from "@react-navigation/native"
import { useAppTheme } from "@/theme/context"
import { useAuth } from "@/context/AuthContext"
import HomeScreenView from "./HomeScreenView"
import * as homeApi from "@/services/api/apisCollection/home"

// ============================================================================
// Types
// ============================================================================

export interface HomeScreenViewProps {
  statusBarColor: string
  userName: string
  userRole: string
  avatarUri: string | undefined
  avatarText: string
  colors: any
  plantsCared: number
  photosCount: number
  monitoringsCount: number
  unsyncedCount: number
  isLoading: boolean
  onNavigateToScreen: (screenId: string) => void
  onRefresh: () => Promise<void>
}

// ============================================================================
// Screen Component
// ============================================================================

const Home = () => {
  const { theme: { colors } } = useAppTheme()
  const navigation = useNavigation()
  const { user: authUser } = useAuth()
  const isFocused = useIsFocused()

  const statusBarColor = colors.palette.primary700
  const [useColor, setUseColor] = useState(statusBarColor)
  const [dashboardData, setDashboardData] = useState<homeApi.DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch dashboard data from API
  const fetchDashboard = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await homeApi.getDashboard()
      console.log('[DASHBOARD]', data);
      setDashboardData(data)
    } catch (err) {
      console.error("Failed to fetch dashboard:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch dashboard on mount
  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  // Update status bar color when focused
  useEffect(() => {
    if (isFocused) {
      setUseColor(statusBarColor)
    }
  }, [isFocused, statusBarColor])

  // Navigate to screen
  const navigateToScreen = useCallback((screenId: string) => {
    console.log("Navigating to screen:", screenId)
    const screenName = screenId.charAt(0).toUpperCase() + screenId.slice(1) + "Screen"
      ; (navigation as any).navigate(screenName)
  }, [navigation])

  // Get user data from dashboard (fallback to AuthContext)
  const user = dashboardData?.user || authUser
  const stats = dashboardData?.stats

  const userName = user?.name || user?.username || "Guest"
  const userRole = user?.role || "User"
  const avatarUri = user?.avatar
  const avatarText = userName.charAt(0).toUpperCase()

  const viewProps: HomeScreenViewProps = {
    statusBarColor: useColor,
    userName,
    userRole,
    avatarUri,
    avatarText,
    colors,
    plantsCared: stats?.plants_cared ?? 0,
    photosCount: stats?.photos_count ?? 0,
    monitoringsCount: stats?.monitorings_count ?? 0,
    unsyncedCount: stats?.unsynced_count ?? 0,
    isLoading,
    onNavigateToScreen: navigateToScreen,
    onRefresh: fetchDashboard,
  }

  return <HomeScreenView {...viewProps} />
}

export default Home
