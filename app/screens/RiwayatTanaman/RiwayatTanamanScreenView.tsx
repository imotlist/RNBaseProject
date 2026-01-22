/**
 * RiwayatTanamanScreenView.tsx
 *
 * Presentational component for RiwayatTanaman screen.
 * Displays plant info and monitoring history list.
 *
 * @module screens/RiwayatTanaman
 */

import React, { useState, useEffect } from "react"
import { View, Pressable, Image } from "react-native"
import { useIsFocused } from "@react-navigation/native"
import { Text } from "@/components/Text"
import { Screen } from "@/components/Screen"
import { InfiniteList } from "@/components/list"
import { IconPack } from "@/components/ui/IconPack"
import { useAppTheme } from "@/theme/context"
import styles from "./RiwayatTanaman.styles"

// ============================================================================
// Types
// ============================================================================

export interface PlantInfo {
  id: string
  name: string
  plant_code: string
  latitude: string
  longitude: string
  image?: string | null
  region?: {
    id: number
    name: string
    area_formatted?: string | null
    centroid?: {
      lat: number
      lng: number
    } | null
  }
}

export interface PlantMonitoring {
  id: number
  image_url: string
  status_tanaman: "Sehat" | "Mati"
  jarak_tanam: string
  ajir: string
  kebersihan_piringan: string
  indikasi_gagal: string | null
  estimasi_tinggi: string
  catatan: string
  latitude: string
  longitude: string
  created_at: string
  plant_name: string
  plant_code: string
  sync_status: "Draft" | "Synced"
  region_info: string | null
  user: {
    name: string
  }
  ai_analysis_json?: any
}

export interface RiwayatTanamanScreenViewProps {
  plantInfo: PlantInfo | null
  isLoadingInfo: boolean
  infoError: string | null
  plantId: string
  plantName?: string
  renderItem: (item: PlantMonitoring) => React.ReactElement
  fetchData: (options: any) => Promise<any>
  onBack: () => void
}

// ============================================================================
// View Component
// ============================================================================

export const RiwayatTanamanScreenView: React.FC<RiwayatTanamanScreenViewProps> = ({
  plantInfo,
  isLoadingInfo,
  infoError,
  plantId,
  plantName,
  renderItem,
  fetchData,
  onBack,
}) => {
  const { theme } = useAppTheme()
  const { colors } = theme
  const isFocused = useIsFocused()
  const statusbarColor = colors.palette.primary600
  const [useColor, setUseColor] = useState(statusbarColor)

  useEffect(() => {
    if (isFocused) {
      setUseColor(statusbarColor)
    }
  }, [isFocused, statusbarColor])

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} statusBarBackgroundColor={useColor}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: useColor }]}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <IconPack name="arrowLeft" size={24} color="#fff" />
        </Pressable>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>Riwayat Tanaman</Text>
          {plantInfo && (
            <Text style={styles.headerSubtitle}>{plantInfo.name} ({plantInfo.plant_code})</Text>
          )}
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Plant Info Card */}
      {isLoadingInfo ? (
        <View style={[styles.infoCard, { backgroundColor: "#fff" }]}>
          <Text style={styles.loadingText}>Memuat info tanaman...</Text>
        </View>
      ) : infoError ? (
        <View style={[styles.infoCard, { backgroundColor: "#fff" }]}>
          <Text style={styles.errorText}>{infoError}</Text>
        </View>
      ) : plantInfo ? (
        <View style={[styles.infoCard, { backgroundColor: "#fff" }]}>
          {plantInfo.image && (
            <Image source={{ uri: plantInfo.image }} style={styles.plantImage} />
          )}
          <View style={styles.plantInfoContent}>
            <Text style={styles.plantName}>{plantInfo.name}</Text>
            <Text style={styles.plantCode}>{plantInfo.plant_code}</Text>
            <View style={styles.plantMeta}>
              <IconPack name="map" size={14} color={colors.textDim} />
              <Text style={styles.plantMetaText}>
                {plantInfo.latitude}, {plantInfo.longitude}
              </Text>
            </View>
            {plantInfo.region && (
              <View style={styles.plantMeta}>
                <IconPack name="global" size={14} color={colors.textDim} />
                <Text style={styles.plantMetaText}>{plantInfo.region.name}</Text>
              </View>
            )}
          </View>
        </View>
      ) : null}

      {/* List */}
      <InfiniteList
        hookOptions={{
          fetchData,
          pageSize: 10,
        }}
        renderItem={renderItem}
        keyExtractor={(item: any) => String(item.id)}
        flatListProps={{
          contentContainerStyle: styles.listContent,
          showsVerticalScrollIndicator: false,
        }}
        emptyState={{
          icon: "clock" as const,
          title: "Belum Ada Riwayat",
          message: "Belum ada data monitoring untuk tanaman ini",
        }}
        errorState={{
          title: "Gagal Memuat",
          message: "Terjadi kesalahan saat memuat riwayat",
        }}
      />
    </Screen>
  )
}
