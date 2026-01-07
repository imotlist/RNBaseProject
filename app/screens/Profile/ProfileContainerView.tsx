/**
 * ProfileContainerView.tsx
 *
 * Presentational component for Profile container screen.
 * Displays user profile information and settings.
 *
 * @module screens/Profile
 */

import React, { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Avatar } from "@/components/ui"
import { ListItem } from "@/components/ListItem"
import { Button } from "@/components/Button"
import { TitleBar } from "@/components/ui"
import { useAppTheme } from "@/theme/context"
import { goBack } from "@/navigators/navigationUtilities"
import { scale } from "@/utils/responsive"
import { useIsFocused, useNavigation } from "@react-navigation/native"

// ============================================================================
// Types
// ============================================================================

export interface ProfileData {
  id: string
  title: string
  value: string | number
  [key: string]: any
}

export interface ProfileContainerViewProps {
  selectedData: ProfileData | null
  onSelectData: (data: ProfileData) => void
  onActionPress: () => void
  onRefresh: () => Promise<void>
  isLoading?: boolean
}

// ============================================================================
// View Component
// ============================================================================

const ProfileContainerView: React.FC<ProfileContainerViewProps> = ({
  onActionPress,
}) => {
  const { theme } = useAppTheme()
  const navigation = useNavigation()
  const statusBarColor = 'white'
  const [useColor, setUseColor] = useState(statusBarColor)
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      setUseColor(statusBarColor)
    }
  }, [isFocused, statusBarColor])
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]}>
      <TitleBar title="Profile" showBack={true} onBackPress={goBack} backgroundColor={useColor} />


      <ScrollView style={$flex1} keyboardShouldPersistTaps="handled">
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: theme.colors.palette.neutral100 }]}>
          <Avatar
            size="xlarge"
            source="https://i.pravatar.cc/300?img=12"
            borderColor={theme.colors.tint}
            borderWidth={3}
          />
          <Text preset="heading" style={styles.profileName}>
            John Doe
          </Text>
          <Text style={[styles.profileEmail, { color: theme.colors.textDim }]}>
            john.doe@example.com
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: theme.colors.tint }]}>
            <Text style={styles.roleText}>Administrator</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text preset="heading" style={[styles.statValue, { color: theme.colors.tint }]}>
              24
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textDim }]}>Projects</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.separator }]} />
          <View style={styles.statItem}>
            <Text preset="heading" style={[styles.statValue, { color: theme.colors.tint }]}>
              128
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textDim }]}>Tasks</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.separator }]} />
          <View style={styles.statItem}>
            <Text preset="heading" style={[styles.statValue, { color: theme.colors.tint }]}>
              12
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textDim }]}>Teams</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textDim }]}>
            Account
          </Text>
          <ListItem
            leftIcon="community"
            text="Edit Profile"
            rightIcon="caretRight"
            bottomSeparator
            onPress={() => console.log("Edit Profile")}
          />
          <ListItem
            leftIcon="lock"
            text="Change Password"
            rightIcon="caretRight"
            bottomSeparator
            onPress={() => console.log("Change Password")}
          />
          <ListItem
            leftIcon="bell"
            text="Notifications"
            rightIcon="caretRight"
            onPress={() => console.log("Notifications")}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textDim }]}>
            Preferences
          </Text>
          <ListItem
            leftIcon="view"
            text="Appearance"
            rightIcon="caretRight"
            bottomSeparator
            onPress={() => console.log("Appearance")}
          />
          <ListItem
            leftIcon="github"
            text="Language"
            rightIcon="caretRight"
            bottomSeparator
            onPress={() => console.log("Language")}
          />
          <ListItem
            leftIcon="hidden"
            text="Privacy"
            rightIcon="caretRight"
            onPress={() => console.log("Privacy")}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textDim }]}>
            Support
          </Text>
          <ListItem
            leftIcon="ladybug"
            text="Help Center"
            rightIcon="caretRight"
            bottomSeparator
            onPress={() => console.log("Help Center")}
          />
          <ListItem
            leftIcon="components"
            text="Terms of Service"
            rightIcon="caretRight"
            bottomSeparator
            onPress={() => console.log("Terms")}
          />
          <ListItem
            leftIcon="components"
            text="About"
            rightIcon="caretRight"
            onPress={() => console.log("About")}
          />
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            text="Log Out"
            preset="default"
            color="danger"
            style={styles.logoutButton}
            onPress={onActionPress}
          />
        </View>

        {/* Version Info */}
        <Text style={[styles.versionText, { color: theme.colors.textDim }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </Screen>
  )
}

export default ProfileContainerView

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    padding: 24,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    textTransform: "uppercase",
  },
  statsSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  section: {
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logoutSection: {
    padding: 16,
  },
  logoutButton: {
    width: "100%",
  },
  versionText: {
    fontSize: 12,
    textAlign: "center",
    paddingBottom: 24,
  },
})

const $outerStyle = {
  flex: 1,
}

const $flex1 = {
  flex: 1,
  paddingHorizontal: scale(20),
}
