/**
 * Riwayat.tsx
 *
 * List-based screen for plant monitoring history.
 * This file contains the screen controller logic with data fetching,
 * state management, and event handlers.
 *
 * @module screens/Riwayat
 */

import { useCallback, useMemo } from "react"
import { View, StyleSheet, Pressable, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { InfiniteList } from "@/components/list"
import { SearchBar } from "@/components/ui/SearchBar/SearchBar"
import { FilterChips } from "@/components/filters"
import { BottomSheetContent, BottomSheetSection } from "@/components/ui/BottomSheetContent"
import { useInfiniteList } from "@/hooks/useInfiniteList"
import { useBottomSheet } from "@/hooks/useBottomSheet"
import { scale, scaleFontSize } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import RiwayatListView from "./RiwayatListView"
import * as riwayatApi from "@/services/api/apisCollection/riwayat"
import type { MonitoringHistoryItem } from "@/services/api/apisCollection/riwayat"
import styles from './Riwayat.styles'
import { Avatar, Frame, IconPack } from "@/components/ui"

// ============================================================================
// Types
// ============================================================================

export interface RiwayatItem {
  id: string | number
  image?: string
  status_tanaman: "Sehat" | "Mati"
  jarak_tanam?: string
  ajir?: string
  kebersihan_piringan?: string
  indikasi_gagal?: string
  estimasi_tinggi?: string
  catatan?: string
  latitude: string
  longitude: string
  created_at: string
  updated_at?: string
  plant_code: string
  plant_name: string
  sync_status: string
  region_info: string
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

const RiwayatScreen = () => {
  const { theme } = useAppTheme()
  const { showBottomSheet, closeBottomSheet } = useBottomSheet()
  const navigation = useNavigation<AppStackScreenProps<"RiwayatDetail">["navigation"]>()

  // Use the infinite list hook
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    clearFilters,
  } = useInfiniteList<RiwayatItem>({
    fetchData: async (options) => {
      const { page, pageSize, searchQuery, filters } = options

      const result = await riwayatApi.getMonitorings({
        page,
        per_page: pageSize,
        search: searchQuery,
        status: filters?.status as string,
        sort: (filters?.sort as "latest" | "oldest") || "latest",
      })

      return {
        data: result.data,
        hasMore: result.hasMore,
        totalCount: result.totalCount,
      }
    },
    pageSize: 10,
    pullToRefresh: true,
  })

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters?.status) count++
    if (filters?.sort && filters.sort !== "latest") count++
    return count
  }, [filters])

  // Open filter bottom sheet
  const handleOpenFilters = useCallback(() => {
    showBottomSheet({
      title: "Filter Riwayat",
      snapPoints: ["50%"],
      renderContent: () => (
        <RiwayatFilterSheet
          filters={filters}
          setFilters={setFilters}
          onClose={closeBottomSheet}
        />
      ),
    })
  }, [showBottomSheet, filters, setFilters, closeBottomSheet])

  // Handle delete item
  const handleDeleteItem = useCallback(
    (id: string | number, title: string) => {
      Alert.alert(
        "Hapus Riwayat",
        `Apakah Anda yakin ingin menghapus riwayat "${title}"?`,
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Hapus",
            style: "destructive",
            onPress: async () => {
              try {
                await riwayatApi.deleteMonitoring(id)
                // Trigger refresh by updating search query
                setSearchQuery(searchQuery)
              } catch (error) {
                Alert.alert("Error", "Gagal menghapus riwayat")
              }
            },
          },
        ],
      )
    },
    [searchQuery, setSearchQuery],
  )

  // Render individual item
  const renderItem = useCallback(
    (item: RiwayatItem) => (
      <RiwayatListItem item={item} onDelete={handleDeleteItem} navigation={navigation} />
    ),
    [handleDeleteItem, navigation],
  )

  return (
    <RiwayatListView
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      filters={filters}
      setFilters={setFilters}
      clearFilters={clearFilters}
      activeFilterCount={activeFilterCount}
      onOpenFilters={handleOpenFilters}
      renderItem={renderItem}
      fetchOptions={{
        fetchData: async (options) => {
          const { page, pageSize, searchQuery, filters } = options

          const result = await riwayatApi.getMonitorings({
            page,
            per_page: pageSize,
            search: searchQuery,
            status: filters?.status as string,
            sort: (filters?.sort as "latest" | "oldest") || "latest",
          })

          return {
            data: result.data,
            hasMore: result.hasMore,
            totalCount: result.totalCount,
          }
        },
        pageSize: 10,
      }}
    />
  )
}

// ============================================================================
// Filter Sheet Component
// ============================================================================

interface RiwayatFilterSheetProps {
  filters: Record<string, any>
  setFilters: (filters: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void
  onClose: () => void
}

const RiwayatFilterSheet: React.FC<RiwayatFilterSheetProps> = ({
  filters,
  setFilters,
  onClose,
}) => {
  const handleReset = useCallback(() => {
    setFilters({ sort: "latest" })
  }, [setFilters])

  return (
    <BottomSheetContent
      title="Filter Riwayat"
      primaryButtonLabel="Terapkan"
      onPrimaryPress={onClose}
      secondaryButtonLabel="Reset"
      onSecondaryPress={handleReset}
      onClose={onClose}
    >
      <BottomSheetSection title="Status Tanaman">
        <FilterChips
          options={STATUS_FILTER_OPTIONS}
          selectedValue={filters?.status || ""}
          onSelect={(value) =>
            setFilters((prev: any) => ({
              ...prev,
              status: value || undefined,
            }))
          }
        />
      </BottomSheetSection>

      <BottomSheetSection title="Urutkan">
        <FilterChips
          options={SORT_OPTIONS}
          selectedValue={filters?.sort || "latest"}
          onSelect={(value) =>
            setFilters((prev: any) => ({
              ...prev,
              sort: value,
            }))
          }
        />
      </BottomSheetSection>
    </BottomSheetContent>
  )
}

// ============================================================================
// List Item Component
// ============================================================================

interface RiwayatListItemProps {
  item: RiwayatItem
  onDelete?: (id: string | number, title: string) => void
  navigation: any
}

const RiwayatListItem: React.FC<RiwayatListItemProps> = ({ item, onDelete, navigation }) => {
  const { theme } = useAppTheme()
  const { colors } = theme

  const handlePress = useCallback(() => {
    navigation.navigate("RiwayatDetail", { id: item.id })
  }, [navigation, item.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isHealthy = item.status_tanaman === "Sehat"
  const statusColor = isHealthy ? colors.palette.success500 : colors.palette.danger500
  const statusBg = isHealthy ? "#E8F5E9" : "#FFEBEE"
  const syncBg = item.sync_status == 'Synced' ? colors.palette.malibu400 : colors.palette.warning400

  return (
    <Pressable
      style={[styles.itemCard, { backgroundColor: colors.palette.neutral50 }]}
      onPress={handlePress}
    >
      {/* Status indicator bar */}
      <View style={[styles.statusBar, { backgroundColor: statusColor }]} />

      <View style={styles.itemContent}>
        {/* Header with date and status */}
        <View style={[styles.rowBetween, { alignItems: 'center' }]}>
          <Avatar size="small" asset={require("@assets/images/IconLeaf.png")} imageAsIcon  backgroundColor={statusColor} text="T" />
          <View>
            <Text size="md" >{`${item.plant_code} | ${item.plant_name}`}</Text>
            <View style={[styles.row, { gap: scale(8), alignItems: 'center' }]}>
              <Text size="xs" >{`${item.region_info}`}</Text>
              <Text size="xxs" customColor={syncBg}>{item.sync_status}</Text>
            </View>
          </View>
          <View style={{ gap: scale(8) }}>
            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
              <Text size="xxs" customColor={statusColor}>{item.status_tanaman}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {item.catatan && (
          <View style={[styles.row, {alignItems:'center', gap:scale(6), marginLeft: scale(6)}]}>
            <IconPack name="calendar" variant="Bold" size={scale(20)}/>
            <Text size="xxs" numberOfLines={2}>
              Telah dilakukan perawatan pada, {formatDate(item.created_at)}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}

export default RiwayatScreen
