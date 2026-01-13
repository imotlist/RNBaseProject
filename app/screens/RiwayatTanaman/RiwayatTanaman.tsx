/**
 * RiwayatTanaman.tsx
 *
 * List-based screen for plant monitoring history.
 * This file contains the screen controller logic with data fetching,
 * state management, and event handlers.
 *
 * @module screens/RiwayatTanaman
 */

import { useCallback, useEffect, useState } from "react"
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native"
import { View, StyleSheet, Pressable, Alert, Image } from "react-native"
import { useAppTheme } from "@/theme/context"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { InfiniteList } from "@/components/list"
import { IconPack } from "@/components/ui/IconPack"
import { scale, scaleFontSize } from "@/utils/responsive"
import * as riwayatTanamanApi from "@/services/api/apisCollection/riwayatTanaman"
import type { PlantMonitoringItem, PlantInfo } from "@/services/api/apisCollection/riwayatTanaman"

// ============================================================================
// Types
// ============================================================================

export type RiwayatTanamanRouteParams = {
  plantId: string
  plantName?: string
}

export type RiwayatTanamanRoute = RouteProp<
  { RiwayatTanaman: RiwayatTanamanRouteParams },
  "RiwayatTanaman"
>

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
  user: {
    name: string
  }
  ai_analysis?: {
    name: string
    condition: string
    description: string
    care_tips: string
  }
}

// ============================================================================
// Filter Options
// ============================================================================

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "Sehat", label: "Sehat" },
  { value: "Mati", label: "Mati" },
]

const SORT_OPTIONS = [
  { value: "latest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
]

// ============================================================================
// Screen Component
// ============================================================================

export const RiwayatTanamanScreen = () => {
  const route = useRoute<RiwayatTanamanRoute>()
  const navigation = useNavigation()
  const { plantId, plantName } = route.params

  const { theme } = useAppTheme()
  const { colors } = theme

  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null)
  const [isLoadingInfo, setIsLoadingInfo] = useState(true)
  const [infoError, setInfoError] = useState<string | null>(null)

  // Fetch plant info
  const fetchPlantInfo = useCallback(async () => {
    setIsLoadingInfo(true)
    setInfoError(null)
    try {
      const info = await riwayatTanamanApi.getPlantInfo(plantId)
      setPlantInfo(info)
    } catch (err) {
      setInfoError(err instanceof Error ? err.message : "Gagal memuat info tanaman")
    } finally {
      setIsLoadingInfo(false)
    }
  }, [plantId])

  // Handle delete item
  const handleDeleteItem = useCallback(
    (id: number, title: string) => {
      Alert.alert(
        "Hapus Riwayat",
        `Apakah Anda yakin ingin menghapus riwayat "${title}"?`,
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Hapus",
            style: "destructive",
            onPress: () => {
              console.log("Delete monitoring:", id)
              // TODO: Implement delete API
            },
          },
        ],
      )
    },
    [],
  )

  // Render individual item
  const renderItem = useCallback(
    (item: PlantMonitoring) => (
      <PlantMonitoringListItem item={item} onDelete={handleDeleteItem} />
    ),
    [handleDeleteItem],
  )

  // Fetch data function for InfiniteList
  const fetchData = useCallback(async (options: {
    page: number
    pageSize: number
    searchQuery?: string
    filters?: Record<string, any>
  }) => {
    const { page, pageSize, searchQuery, filters } = options

    const result = await riwayatTanamanApi.getPlantMonitorings(plantId, {
      page,
      per_page: pageSize,
      search: searchQuery,
      status: filters?.status as string,
      sort: (filters?.sort as "latest" | "oldest") || "latest",
    })

    return {
      data: result.data as PlantMonitoring[],
      hasMore: result.hasMore,
      totalCount: result.totalCount,
    }
  }, [plantId])

  // Fetch plant info on mount
  useEffect(() => {
    fetchPlantInfo()
  }, [fetchPlantInfo])

  return (
    <RiwayatTanamanView
      plantInfo={plantInfo}
      isLoadingInfo={isLoadingInfo}
      infoError={infoError}
      plantId={plantId}
      plantName={plantName}
      renderItem={renderItem}
      fetchData={fetchData}
      onBack={() => navigation.goBack()}
    />
  )
}

// ============================================================================
// List Item Component
// ============================================================================

interface PlantMonitoringListItemProps {
  item: PlantMonitoring
  onDelete?: (id: number, title: string) => void
}

const PlantMonitoringListItem: React.FC<PlantMonitoringListItemProps> = ({ item, onDelete }) => {
  const { theme } = useAppTheme()
  const { colors } = theme
  const navigation = useNavigation()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const isHealthy = item.status_tanaman === "Sehat"
  const statusColor = isHealthy ? "#4CAF50" : "#EF4444"

  const handlePress = useCallback(() => {
    navigation.navigate("RiwayatDetail" as never, { id: item.id })
  }, [navigation, item.id])

  return (
    <Pressable style={[styles.itemCard, { backgroundColor: colors.palette.neutral100 }]} onPress={handlePress}>
      {/* Status indicator bar */}
      <View style={[styles.statusBar, { backgroundColor: statusColor }]} />

      {/* Image */}
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      )}

      <View style={styles.itemContent}>
        {/* Header with date and status */}
        <View style={styles.itemHeader}>
          <Text style={styles.itemDate}>{formatDate(item.created_at)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: isHealthy ? "#E8F5E9" : "#FFEBEE" }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status_tanaman}
            </Text>
          </View>
        </View>

        {/* AI Analysis */}
        {item.ai_analysis && (
          <View style={styles.aiSection}>
            <View style={[styles.aiBadge, { backgroundColor: "#F0F9FF" }]}>
              <IconPack name="magic" size={scale(12)} color={colors.palette.primary500} />
              <Text style={[styles.aiBadgeText, { color: colors.palette.primary500 }]}>
                {item.ai_analysis.name}
              </Text>
            </View>
            <Text style={styles.aiDescription} numberOfLines={2}>
              {item.ai_analysis.description}
            </Text>
          </View>
        )}

        {/* Details */}
        <View style={styles.itemDetails}>
          {item.jarak_tanam && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Jarak:</Text>
              <Text style={styles.detailValue}>{item.jarak_tanam}</Text>
            </View>
          )}
          {item.estimasi_tinggi && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tinggi:</Text>
              <Text style={styles.detailValue}>{item.estimasi_tinggi}m</Text>
            </View>
          )}
          {item.indikasi_gagal && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Indikasi:</Text>
              <Text style={[styles.detailValue, { color: "#EF4444" }]}>
                {item.indikasi_gagal}
              </Text>
            </View>
          )}
        </View>

        {/* User */}
        {item.user && (
          <Text style={styles.userText}>Oleh {item.user.name}</Text>
        )}
      </View>
    </Pressable>
  )
}

// ============================================================================
// View Component
// ============================================================================

interface RiwayatTanamanViewProps {
  plantInfo: PlantInfo | null
  isLoadingInfo: boolean
  infoError: string | null
  plantId: string
  plantName?: string
  renderItem: (item: PlantMonitoring) => React.ReactElement
  fetchData: (options: any) => Promise<any>
  onBack: () => void
}

const RiwayatTanamanView: React.FC<RiwayatTanamanViewProps> = ({
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

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.palette.primary200 }]}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <IconPack name="arrowLeft" size={scale(24)} color="#fff" />
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
              <IconPack name="map" size={scale(14)} color={colors.textDim} />
              <Text style={styles.plantMetaText}>
                {plantInfo.latitude}, {plantInfo.longitude}
              </Text>
            </View>
            {plantInfo.region && (
              <View style={styles.plantMeta}>
                <IconPack name="global" size={scale(14)} color={colors.textDim} />
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

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
    paddingBottom: scale(16),
  },
  backButton: {
    padding: scale(4),
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
  },
  headerTitleText: {
    fontSize: scaleFontSize(18),
    fontWeight: "600",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: scaleFontSize(12),
    color: "rgba(255,255,255,0.8)",
    marginTop: scale(2),
  },
  headerRight: {
    width: scale(32),
  },
  infoCard: {
    flexDirection: "row",
    marginHorizontal: scale(16),
    marginBottom: scale(12),
    borderRadius: scale(12),
    padding: scale(16),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  plantImage: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
  },
  plantInfoContent: {
    flex: 1,
    marginLeft: scale(12),
  },
  plantName: {
    fontSize: scaleFontSize(16),
    fontWeight: "600",
  },
  plantCode: {
    fontSize: scaleFontSize(13),
    color: "#666",
    marginTop: scale(2),
  },
  plantMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: scale(4),
    gap: scale(4),
  },
  plantMetaText: {
    fontSize: scaleFontSize(11),
    color: "#999",
  },
  loadingText: {
    fontSize: scaleFontSize(14),
    color: "#666",
  },
  errorText: {
    fontSize: scaleFontSize(14),
    color: "#EF4444",
  },
  listContent: {
    paddingTop: scale(8),
    paddingBottom: scale(24),
  },
  itemCard: {
    flexDirection: "row",
    marginHorizontal: scale(16),
    marginBottom: scale(12),
    borderRadius: scale(12),
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusBar: {
    width: scale(4),
  },
  itemImage: {
    width: scale(80),
    height: scale(100),
  },
  itemContent: {
    flex: 1,
    padding: scale(12),
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(8),
  },
  itemDate: {
    fontSize: scaleFontSize(12),
    color: "#666",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
  },
  statusDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    marginRight: scale(4),
  },
  statusText: {
    fontSize: scaleFontSize(11),
    fontWeight: "600",
  },
  aiSection: {
    marginBottom: scale(8),
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    marginBottom: scale(4),
  },
  aiBadgeText: {
    fontSize: scaleFontSize(10),
    fontWeight: "600",
    marginLeft: scale(4),
  },
  aiDescription: {
    fontSize: scaleFontSize(12),
    color: "#666",
    lineHeight: scale(16),
  },
  itemDetails: {
    marginBottom: scale(6),
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: scale(2),
  },
  detailLabel: {
    fontSize: scaleFontSize(11),
    color: "#666",
    width: scale(50),
  },
  detailValue: {
    fontSize: scaleFontSize(11),
    fontWeight: "500",
    flex: 1,
  },
  userText: {
    fontSize: scaleFontSize(10),
    color: "#999",
  },
})

export default RiwayatTanamanScreen
