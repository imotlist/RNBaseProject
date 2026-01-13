/**
 * ProfileScreen.tsx
 *
 * Container-based screen template for Profile feature.
 * This file contains the screen controller logic with state management
 * and event handlers for container-style screens.
 *
 * @module screens/Profile
 */

import { useCallback, useEffect, useState } from "react"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AppStackParamList } from "@/navigators/navigationTypes"
import ProfileContainerView from "./ProfileContainerView"
import { useAuth } from "@/context/AuthContext"
import type { UserData, City } from "@/context/AuthContext"
import * as authApi from "@/services/api/apisCollection/auth"

// ============================================================================
// Types
// ============================================================================

export interface ProfileContainerViewProps {
  user?: UserData | null
  isLoading?: boolean
  city?: City | null
  onLogout: () => void
  onRefresh: () => Promise<void>
  onEditProfile?: () => void
  onChangeDistrict?: () => void
}

// ============================================================================
// Screen Component
// ============================================================================

export const ProfileScreen = () => {
  const { user, logout } = useAuth()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<UserData | null>(null)

  // Fetch profile data from API
  const fetchProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await authApi.getProfile()
      setProfileData(data)
    } catch (err) {
      console.error("Failed to fetch profile:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Logout",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya",
          style: "destructive",
          onPress: async () => {
            await authApi.logout()
            logout()
          },
        },
      ],
    )
  }, [logout])

  const handleEditProfile = useCallback(() => {
    const currentUser = profileData || user
    if (!currentUser) return

    // Navigate to ProfileEdit screen
    navigation.navigate("ProfileEdit", { user: currentUser })
  }, [profileData, user, navigation])

  const handleChangeDistrict = useCallback(() => {
    // TODO: Navigate to change district screen
    console.log("Change district")
  }, [])

  return (
    <ProfileContainerView
      user={profileData || user}
      isLoading={isLoading}
      city={profileData?.city || null}
      onLogout={handleLogout}
      onRefresh={fetchProfile}
      onEditProfile={handleEditProfile}
      onChangeDistrict={handleChangeDistrict}
    />
  )
}
