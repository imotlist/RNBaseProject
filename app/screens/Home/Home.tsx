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
import { usePlantsList } from "./usePlantsList"
import * as homeApi from "@/services/api/apisCollection/home"
import * as authApi from "@/services/api/apisCollection/auth"
import type { UserData } from "@/context/AuthContext"

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
  plantsFetchOptions: any
  plantsTotalCount: number
}

// ============================================================================
// Screen Component
// ============================================================================

const Home = () => {
  const { theme: { colors } } = useAppTheme()
  const navigation = useNavigation()
  const { user: authUser } = useAuth()
  const isFocused = useIsFocused()

  // ============================================================================
  // State
  // ============================================================================

  const statusBarColor = colors.palette.primary700
  const [useColor, setUseColor] = useState(statusBarColor)
  const [profileData, setProfileData] = useState<UserData | null>(null)
  const [dashboardData, setDashboardData] = useState<homeApi.DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // ============================================================================
  // Plants List (using custom hook for cleaner code)
  // ============================================================================

  const { listOptions: plantsFetchOptions, totalCount: plantsTotalCount } = usePlantsList({
    pageSize: 10,
    pullToRefresh: false,
  })

  // ============================================================================
  // Data Fetching Functions
  // ============================================================================

  const fetchProfile = useCallback(async () => {
    try {
      const data = await authApi.getProfile()
      setProfileData(data)
    } catch (err) {
      console.error("Failed to fetch profile:", err)
    }
  }, [])

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await homeApi.getDashboard()
      setDashboardData(data)
    } catch (err) {
      console.error("Failed to fetch dashboard:", err)
    }
  }, [])

  const fetchAllData = useCallback(async () => {
    setIsLoading(true)
    try {
      await Promise.all([fetchProfile(), fetchDashboard()])
    } catch (err) {
      console.error("Failed to fetch data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [fetchProfile, fetchDashboard])

  // ============================================================================
  // Effects
  // ============================================================================

  // Initial data fetch
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Update status bar color when screen is focused
  useEffect(() => {
    if (isFocused) {
      setUseColor(statusBarColor)
    }
  }, [isFocused, statusBarColor])

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const navigateToScreen = useCallback((screenId: string) => {
    const screenName = screenId.charAt(0).toUpperCase() + screenId.slice(1) + "Screen"
    ;(navigation as any).navigate(screenName)
  }, [navigation])

  // ============================================================================
  // Derived Values
  // ============================================================================

  const user = profileData || authUser
  const stats = dashboardData?.stats

  const userName = user?.name || user?.username || "Guest"
  const userRole = user?.role || "User"
  const avatarUri = user?.avatar
  const avatarText = userName.charAt(0).toUpperCase()

  // ============================================================================
  // View Props
  // ============================================================================

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
    onRefresh: fetchAllData,
    plantsFetchOptions,
    plantsTotalCount,
  }

  return <HomeScreenView {...viewProps} />
}

export default Home
