/**
 * Profile.tsx
 *
 * Container-based screen for Profile feature.
 * This file contains the screen controller logic with state management
 * and event handlers.
 *
 * @module screens/Profile
 */

import { useCallback, useEffect, useState } from "react"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AppStackParamList } from "@/navigators/navigationTypes"
import { useLoadingModal } from "@/components/ui"
import ProfileScreenView from "./ProfileScreenView"
import { useAuth } from "@/context/AuthContext"
import type { UserData, City } from "@/context/AuthContext"
import * as authApi from "@/services/api/apisCollection/auth"

// ============================================================================
// Types
// ============================================================================

export interface ProfileScreenViewProps {
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

const Profile = () => {
  const { user, logout } = useAuth()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<UserData | null>(null)
  const { LoadingModalComponent, showLoading, hideLoading } = useLoadingModal()

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
            showLoading({
              title: "Keluar",
              message: "Sedang keluar...",
            })
            try {
              await authApi.logout()
              logout()
            } finally {
              hideLoading()
            }
          },
        },
      ],
    )
  }, [logout, showLoading, hideLoading])

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

  const viewProps: ProfileScreenViewProps = {
    user: profileData || user,
    isLoading,
    city: profileData?.city || null,
    onLogout: handleLogout,
    onRefresh: fetchProfile,
    onEditProfile: handleEditProfile,
    onChangeDistrict: handleChangeDistrict,
  }

  return (
    <>
      <ProfileScreenView {...viewProps} />
      <LoadingModalComponent />
    </>
  )
}

export default Profile
