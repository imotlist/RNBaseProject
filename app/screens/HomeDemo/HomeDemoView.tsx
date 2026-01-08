/**
 * HomeDemoView.tsx
 *
 * Presentational component for HomeDemo container screen.
 * Contains only UI rendering logic - no business logic.
 * Displays a grid of component showcase screens for navigation.
 *
 * @module screens/HomeDemo
 */

import React, { useState, useEffect } from "react"
import { View, StyleSheet, Pressable, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Avatar, HeaderApp } from "@/components/ui"
import { useAppTheme } from "@/theme/context"
import { useIsFocused } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"
import type { HomeDemoViewProps } from "./HomeDemo"

// ============================================================================
// Component Showcase Screen Data
// ============================================================================

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

// ============================================================================
// View Component
// ============================================================================

const HomeDemoView: React.FC<HomeDemoViewProps> = ({ onNavigateToScreen }) => {
  const { theme } = useAppTheme()
  const navigation = useNavigation()
  const statusBarColor = theme.colors.palette.primary700
  const [useColor, setUseColor] = useState(statusBarColor)
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      setUseColor(statusBarColor)
    }
  }, [isFocused, statusBarColor])

  const navigateToScreen = (screenId: string) => {
    onNavigateToScreen(screenId)
    // Navigate to the appropriate screen based on ID
    const screenName = screenId.charAt(0).toUpperCase() + screenId.slice(1) + "Screen"
    ;(navigation as any).navigate(screenName)
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} statusBarBackgroundColor={useColor} style={$outerStyle}>
      <HeaderApp
        avatarText="Gu"
        title="Guest User"
        subtitle="Administrator"
        notificationCount={10}
        backgroundColor={useColor}
      />

      <ScrollView
        style={$flex1}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Welcome Section */}
        <View style={[styles.welcomeSection, { backgroundColor: theme.colors.palette.primary100 }]}>
          <Text style={[styles.welcomeTitle, { color: theme.colors.palette.primary500 }]}>
            Component Showcase
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.colors.palette.primary400 }]}>
            Explore all reusable UI components
          </Text>
        </View>

        {/* Components Grid */}
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textDim }]}>
            Components ({showcaseScreens.length})
          </Text>

          <View style={styles.grid}>
            {showcaseScreens.map((screen) => (
              <Pressable
                key={screen.id}
                style={({ pressed }) => [
                  styles.gridItem,
                  { backgroundColor: theme.colors.palette.neutral100 },
                  pressed && { backgroundColor: theme.colors.palette.neutral200 },
                ]}
                onPress={() => navigateToScreen(screen.id)}
                android_ripple={{ color: theme.colors.palette.neutral200, borderless: false }}
              >
                <Avatar text={screen.name} size="medium" backgroundColor={theme.colors.palette.neutral400} />
                <Text style={[styles.gridItemTitle, { color: theme.colors.text }]}>{screen.name}</Text>
                <Text style={[styles.gridItemDescription, { color: theme.colors.textDim }]}>
                  {screen.description}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Info Section */}
          <View style={[styles.infoSection, { backgroundColor: theme.colors.palette.neutral100 }]}>
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>About This App</Text>
            <Text style={[styles.infoText, { color: theme.colors.textDim }]}>
              This showcase demonstrates all the reusable UI components available in the TallyGreen
              design system. Each screen displays various states and variations of a component.
            </Text>
            <Text style={[styles.infoText, { color: theme.colors.textDim }]}>
              Tap on any component card to view its showcase screen with examples and usage patterns.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  )
}

export default HomeDemoView

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  welcomeSection: {
    padding: 24,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  gridItem: {
    width: "50%",
    padding: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  gridItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  gridItemDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  infoSection: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
})

const $outerStyle = {
  flex: 1,
}

const $flex1 = {
  flex: 1,
}
