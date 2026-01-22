/**
 * RiwayatTanaman.tsx
 *
 * Screen controller for plant monitoring history.
 * Handles data fetching, state management, and navigation.
 *
 * @module screens/RiwayatTanaman
 */

import { useCallback, useState } from "react"
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native"
import { Alert } from "react-native"
import { RiwayatTanamanScreenView } from "./RiwayatTanamanScreenView"
import { PlantMonitoringListItem, type PlantMonitoring } from "./PlantMonitoringListItem"
import * as riwayatTanamanApi from "@/services/api/apisCollection/riwayatTanaman"
import type { PlantInfo } from "@/services/api/apisCollection/riwayatTanaman"

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

// ============================================================================
// Screen Component (Controller)
// ============================================================================

export const RiwayatTanamanScreen = () => {
  const route = useRoute<RiwayatTanamanRoute>()
  const navigation = useNavigation()
  const { plantId, plantName } = route.params

  // State
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null)
  const [isLoadingInfo, setIsLoadingInfo] = useState(true)
  const [infoError, setInfoError] = useState<string | null>(null)

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

    // Set plant info from first page response
    if (page === 1 && result.plant) {
      setPlantInfo(result.plant)
      setIsLoadingInfo(false)
      setInfoError(null)
    }

    return {
      data: result.data as PlantMonitoring[],
      hasMore: result.hasMore,
      totalCount: result.totalCount,
    }
  }, [plantId])

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return (
    <RiwayatTanamanScreenView
      plantInfo={plantInfo}
      isLoadingInfo={isLoadingInfo}
      infoError={infoError}
      plantId={plantId}
      plantName={plantName}
      renderItem={renderItem}
      fetchData={fetchData}
      onBack={handleBack}
    />
  )
}

export default RiwayatTanamanScreen
