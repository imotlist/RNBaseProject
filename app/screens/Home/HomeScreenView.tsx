/**
 * HomeScreenView.tsx
 *
 * Presentational component for Home screen.
 * Displays user profile header and navigation grid.
 *
 * @module screens/Home
 */

import React from "react"
import { View, ScrollView, RefreshControl } from "react-native"
import { Text } from "@/components/Text"
import { Screen } from "@/components/Screen"
import { Avatar, Frame, HeaderApp, IconPack } from "@/components/ui"
import type { HomeScreenViewProps } from "./Home"
import styles from "./Home.styles"
import { scale } from "@/utils/responsive"

const HomeScreenView: React.FC<HomeScreenViewProps> = ({
  statusBarColor,
  userName,
  userRole,
  avatarUri,
  avatarText,
  colors,
  plantsCared,
  photosCount,
  monitoringsCount,
  unsyncedCount,
  isLoading,
  onNavigateToScreen,
  onRefresh,
}) => {
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} statusBarBackgroundColor={statusBarColor} style={$outerStyle}>
      <HeaderApp
        avatarUri={avatarUri}
        avatarText={avatarText}
        title={userName}
        subtitle={userRole}
        notificationCount={10}
        backgroundColor={statusBarColor}
      />

      <ScrollView
        style={$flex1}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
      >
        {/* Welcome Section */}
        <View style={[styles.rowEvenPad, { height: scale(60), marginBottom: scale(50), backgroundColor: statusBarColor }]}>
          <Frame style={{ height: scale(105), gap: scale(10) }}>
            <View style={[styles.rowStart, { alignItems: 'center' }]}>
              <Avatar imageAsIcon={true} asset={require("@assets/images/IconPlant.png")} size="medium" backgroundColor={colors.palette.success500} />
              <Text size="xl" weight="medium">{plantsCared}</Text>
            </View>
            <Text size="xs">Tanaman Telah Dirawat</Text>
          </Frame>
          <Frame style={{ height: scale(105), gap: scale(10) }}>
            <View style={[styles.rowStart, { alignItems: 'center' }]}>
              <Avatar icon="image" size="medium" backgroundColor={colors.palette.neutral400} />
              <Text size="xl" weight="medium">{photosCount}</Text>
            </View>
            <Text size="xs">Foto Tanaman Diambil</Text>
          </Frame>
        </View>

        {/* Components Grid */}
        <View style={styles.contentContainer}>
          {/* Unsynced warning */}
          {unsyncedCount > 0 && (
            <View style={[styles.sectionContainer]}>
              <Frame rounded="full" color="warning" style={[styles.rowEven, { borderWidth: 0 }]}>
                <IconPack name="warning" size={scale(20)} color={colors.warning} />
                <Text size="xs">{unsyncedCount} data perawatan belum tersinkron. Cek koneksi Anda!</Text>
              </Frame>
            </View>
          )}

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

export default HomeScreenView

const $outerStyle = {
  flex: 1,
}

const $flex1 = {
  flex: 1,
}
