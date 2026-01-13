/**
 * HomeView.tsx
 *
 * Home screen with navigation grid to all component showcase screens.
 *
 * @module screens/Home
 */

import React, { useState, useEffect, useCallback } from "react"
import { View, StyleSheet, Pressable, ScrollView } from "react-native"
import { Text } from "@/components/Text"
import { Screen } from "@/components/Screen"
import { Avatar, Frame, HeaderApp, IconPack } from "@/components/ui"
import { useAppTheme } from "@/theme/context"
import { useIsFocused } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "@/context/AuthContext"
import type { UserData } from "@/context/AuthContext"
import * as authApi from "@/services/api/apisCollection/auth"
import styles from "./Home.styles"
import { scale } from "@/utils/responsive"
// Component showcase screen data
const showcaseScreens = [
  { id: "buttons", name: "Buttons", icon: "", description: "Button variations and styles" },
  { id: "inputs", name: "Inputs", icon: "", description: "Text fields and inputs" },
  { id: "toggles", name: "Toggles", icon: "", description: "Switches and checkboxes" },
  { id: "cards", name: "Cards", icon: "", description: "Card components" },
  { id: "lists", name: "Lists", icon: "", description: "List items and rows" },
  { id: "avatars", name: "Avatars", icon: "", description: "User avatars" },
  { id: "filters", name: "Filters", icon: "", description: "Filter chips and bars" },
  { id: "dataitems", name: "Data Items", icon: "", description: "Data list example" },
  { id: "profile", name: "Profile", icon: "", description: "Profile screen" },
]

const HomeView = () => {
  const { theme: { colors } } = useAppTheme()
  const navigation = useNavigation()
  const { user: authUser } = useAuth()
  const statusBarColor = colors.palette.primary700
  const [useColor, setUseColor] = useState(statusBarColor)
  const isFocused = useIsFocused()
  const [profileData, setProfileData] = useState<UserData | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  // Fetch profile data from API
  const fetchProfile = useCallback(async () => {
    setIsLoadingProfile(true)
    try {
      const data = await authApi.getProfile()
      setProfileData(data)
    } catch (err) {
      console.error("Failed to fetch profile:", err)
    } finally {
      setIsLoadingProfile(false)
    }
  }, [])

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    if (isFocused) {
      setUseColor(statusBarColor)
    }
  }, [isFocused, statusBarColor])

  const navigateToScreen = (screenId: string) => {
    console.log("Navigating to screen:", screenId)
    // Navigate to the appropriate screen based on ID
    const screenName = screenId.charAt(0).toUpperCase() + screenId.slice(1) + "Screen"
      ; (navigation as any).navigate(screenName)
  }

  // Get user data for header (prefer API data, fallback to AuthContext)
  const user = profileData || authUser
  const userName = user?.name || user?.username || "Guest"
  const userRole = user?.role || "User"
  const avatarUri = user?.avatar
  const avatarText = userName.charAt(0).toUpperCase()

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} statusBarBackgroundColor={useColor} style={$outerStyle}>
      <HeaderApp
        avatarUri={avatarUri}
        avatarText={avatarText}
        title={userName}
        subtitle={userRole}
        notificationCount={10}
        backgroundColor={useColor}
      />

      <ScrollView
        style={$flex1}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Welcome Section */}
        <View style={[styles.rowEvenPad, { height: scale(60), marginBottom: scale(50), backgroundColor: useColor }]}>
          <Frame style={{ height: scale(105), gap: scale(10) }}>
            <View style={[styles.rowStart, { alignItems: 'center' }]}>
              <Avatar imageAsIcon={true} asset={require("@assets/images/IconPlant.png")} size="medium" backgroundColor={colors.palette.success500} />
              <Text size="xl" weight="medium">30</Text>
            </View>
            <Text size="xs">Tanaman Telah Dirawat</Text>
          </Frame>
          <Frame style={{ height: scale(105), gap: scale(10) }}>
            <View style={[styles.rowStart, { alignItems: 'center' }]}>
              <Avatar icon="image" size="medium" backgroundColor={colors.palette.neutral400} />
              <Text size="xl" weight="medium">24</Text>
            </View>
            <Text size="xs">Foto Tanaman Diambil</Text>
          </Frame>
        </View>

        {/* Components Grid */}
        <View style={styles.contentContainer}>

          <View style={[styles.sectionContainer]}>
            <Frame rounded="full" color="warning" style={[styles.rowEven, { borderWidth: 0 }]}>
              <IconPack name="warning" size={scale(20)} color={colors.warning} />
              <Text size="xs">8 data perawatan belum tersinkron. Cek koneksi Anda!</Text>
            </Frame>
          </View>

          <View style={[styles.sectionContainer]}>
            <Text size="lg">Tanaman disekitar</Text>
            
          </View>

          {/* Info Section */}
          <View style={[styles.infoSection, { backgroundColor: colors.palette.neutral100 }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              About This App
            </Text>
            <Text style={[styles.infoText, { color: colors.textDim }]}>
              This showcase demonstrates all the reusable UI components available in the TallyGreen
              design system. Each screen displays various states and variations of a component.
            </Text>
            <Text style={[styles.infoText, { color: colors.textDim }]}>
              Tap on any component card to view its showcase screen with examples and usage patterns.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  )
}

function getScreenIcon(screenId: string): string {
  const icons: Record<string, string> = {
    buttons: "",
    inputs: "",
    toggles: "",
    cards: "",
    lists: "",
    avatars: "",
    filters: "",
    dataitems: "",
    profile: "",
  }
  return icons[screenId] || ""
}

export default HomeView

const $outerStyle = {
  flex: 1,
}

const $flex1 = {
  flex: 1,
}
