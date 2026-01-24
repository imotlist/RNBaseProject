/**
 * HomeScreenView.tsx
 *
 * Presentational component for Home screen.
 * Displays user profile header and navigation grid.
 *
 * @module screens/Home
 */

import React, { useEffect, useState } from "react"
import { View, ScrollView } from "react-native"
import { Text } from "@/components/Text"
import { Screen } from "@/components/Screen"
import { Avatar, Frame, HeaderApp, IconPack, Tabs } from "@/components/ui"
import { InfiniteList } from "@/components/list"
import type { HomeScreenViewProps } from "./Home"
import styles from "./Home.styles"
import { scale } from "@/utils/responsive"
import { PlantCard } from "./PlantCard"
import { OfflineMapView } from "./OfflineMapView"
import { useAppTheme } from "@/theme/context"
import { useIsFocused } from "@react-navigation/native"

const TAB_OPTIONS = [
  { key: "maps", label: "Maps" },
  { key: "data", label: "Data" },
]

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
  plantsFetchOptions,
  plantsTotalCount,
}) => {
  console.log("DATA TOTAL PLANTS:", plantsFetchOptions);
  const [selectedTab, setSelectedTab] = useState("maps")
  const { theme } = useAppTheme()
  const isFocused = useIsFocused()
  const [useColor, setUseColor] = useState(statusBarColor);

  useEffect(() => {
    if (isFocused) {
      setUseColor(statusBarColor)
    }
  }, [isFocused, statusBarColor])

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} statusBarBackgroundColor={useColor}>
      <HeaderApp
        avatarUri={avatarUri}
        avatarText={avatarText}
        title={userName}
        subtitle={userRole}
        notificationCount={10}
        backgroundColor={useColor}
      />

      {/* Scrollable top content */}
      <ScrollView style={styles.topScroll} contentContainerStyle={styles.topScrollContent}>
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

        {/* Tabs */}
        <Tabs
          options={TAB_OPTIONS}
          selectedKey={selectedTab}
          onSelect={setSelectedTab}
        />
      </ScrollView>

      {/* Tab Content - takes remaining space and handles its own scroll */}
      <View style={styles.tabContentContainer}>
        {selectedTab === "maps" ? (
          <OfflineMapView plantsCount={plantsTotalCount} />
        ) : (
          <InfiniteList
            hookOptions={plantsFetchOptions}
            renderItem={(item) => <PlantCard plant={item as any} />}
            keyExtractor={(item) => item.id}
            emptyState={{
              icon: "plant",
              title: "Tidak ditemukan tanaman disekitar anda",
              message: "Mulai dengan menambahkan tanaman baru",
            }}
            contentContainerStyle={{ padding: scale(20) }}
          />
        )}
      </View>
    </Screen>
  )
}

export default HomeScreenView
