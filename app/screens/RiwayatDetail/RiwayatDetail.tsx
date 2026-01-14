/**
 * RiwayatDetail.tsx
 *
 * Container-based screen for monitoring detail.
 * Contains the screen controller logic with state management and API calls.
 *
 * @module screens/RiwayatDetail
 */

import { useCallback, useEffect, useState } from "react"
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native"
import { Alert } from "react-native"
import RiwayatDetailScreenView from "./RiwayatDetailScreenView"
import * as riwayatApi from "@/services/api/apisCollection/riwayat"
import type { MonitoringHistoryItem } from "@/services/api/apisCollection/riwayat"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"

// ============================================================================
// Types
// ============================================================================

export type RiwayatDetailRouteParams = {
  id: string | number
}

export type RiwayatDetailRoute = RouteProp<
  { RiwayatDetail: RiwayatDetailRouteParams },
  "RiwayatDetail"
>

export interface MonitoringDetail extends MonitoringHistoryItem {
  zona?: string
  blok?: string
  tinggi_tanaman ?: string
  petugas?: {
    id: string | number
    name: string
    avatar?: string
  }
  verified_by_ai?: boolean
}

export interface RiwayatDetailScreenViewProps {
  isLoading: boolean
  isDeleting: boolean
  detail: MonitoringDetail | null
  error: string | null
  onBack: () => void
  onDelete: () => void
  onRetry: () => void
  onViewPlantHistory: () => void
}

// ============================================================================
// Screen Component
// ============================================================================

const RiwayatDetail = () => {
  const route = useRoute<RiwayatDetailRoute>()
  const navigation = useNavigation<AppStackScreenProps<"RiwayatDetail">["navigation"]>()
  const { id } = route.params

  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [detail, setDetail] = useState<MonitoringDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch detail data
  const fetchDetail = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await riwayatApi.getMonitoring(id)
      setDetail(data as MonitoringDetail)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal memuat detail"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  // Handle delete
  const handleDelete = useCallback(() => {
    Alert.alert(
      "Hapus Riwayat",
      "Apakah Anda yakin ingin menghapus riwayat ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true)
            try {
              await riwayatApi.deleteMonitoring(id)
              navigation.goBack()
            } catch (err) {
              Alert.alert("Error", "Gagal menghapus riwayat")
              setIsDeleting(false)
            }
          },
        },
      ],
    )
  }, [id, navigation])

  // Handle back
  const handleBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  // Handle view plant history
  const handleViewPlantHistory = useCallback(() => {
    if (!detail?.plant_id) {
      Alert.alert("Info", "Data tanaman tidak tersedia")
      return
    }
    navigation.navigate("RiwayatTanaman" as any, {
      plantId: detail.plant_id,
      plantName: detail.nama_tanaman,
    })
  }, [navigation, detail])

  // Fetch on mount
  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  const viewProps: RiwayatDetailScreenViewProps = {
    isLoading,
    isDeleting,
    detail,
    error,
    onBack: handleBack,
    onDelete: handleDelete,
    onRetry: fetchDetail,
    onViewPlantHistory: handleViewPlantHistory,
  }

  return <RiwayatDetailScreenView {...viewProps} />
}

export default RiwayatDetail
