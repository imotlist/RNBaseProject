/**
 * PlantMonitoringListItem.tsx
 *
 * Reusable list item component for plant monitoring history.
 * Displays monitoring record with status, date, and AI analysis.
 *
 * @module screens/RiwayatTanaman
 */

import React from "react"
import { View, Pressable } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Text } from "@/components/Text"
import { Avatar, IconPack } from "@/components/ui"
import { useAppTheme } from "@/theme/context"
import { scale } from "@/utils/responsive"
import styles from "./RiwayatTanaman.styles"

// ============================================================================
// Types
// ============================================================================

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
  ai_analysis_json?: {
    name: string | null
    variety: string | null
    age_days: string | null
    metadata: {
      status: string
      model_name: string
      ai_response: any
      error_message?: string
    }
    parsed_result: {
      name: string
      scientific_name: string
      variety: string | null
      age_days: number | null
      height_cm: number | null
      condition: string
      condition_details: string
      description: string
      care_tips: string
      confidence: string
    } | null
    request_payload: any
    response_time_ms: number
    care_tips: string | null
    condition: string | null
    height_cm: string | null
    confidence: string | null
    description: string | null
    raw_response: string | null
    scientific_name: string | null
    condition_details: string | null
  }
}

export interface PlantMonitoringListItemProps {
  item: PlantMonitoring
  onDelete?: (id: number, title: string) => void
}

// ============================================================================
// Component
// ============================================================================

export const PlantMonitoringListItem: React.FC<PlantMonitoringListItemProps> = ({ item, onDelete }) => {
  const { theme } = useAppTheme()
  const { colors } = theme
  const navigation = useNavigation()

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
  const syncBg = item.sync_status === "Synced" ? colors.palette.malibu400 : colors.palette.warning400

  const handlePress = () => {
    navigation.navigate("RiwayatDetail" as never, { id: item.id })
  }

  return (
    <Pressable
      style={[styles.itemCard, { backgroundColor: colors.palette.neutral50 }]}
      onPress={handlePress}
    >
      {/* Status indicator bar */}
      <View style={[styles.statusBar, { backgroundColor: statusColor }]} />

      <View style={styles.itemContent}>
        {/* Header with avatar, plant info, and status */}
        <View style={[styles.rowBetween, { alignItems: "center" }]}>
          <Avatar size="small" asset={require("@assets/images/IconLeaf.png")} imageAsIcon backgroundColor={statusColor} text="T" />
          <View style={styles.plantInfo}>
            <Text size="md">{item.plant_code} | {item.plant_name}</Text>
            <View style={[styles.row, { gap: scale(8), alignItems: "center" }]}>
              <Text size="xs">{item.region_info || `${item.latitude}, ${item.longitude}`}</Text>
              <Text size="xxs" customColor={syncBg}>{item.sync_status}</Text>
            </View>
          </View>
          <View style={{ gap: scale(8) }}>
            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
              <Text size="xxs" customColor={statusColor}>{item.status_tanaman}</Text>
            </View>
          </View>
        </View>

        {/* Date with icon */}
        <View style={[styles.row, { alignItems: "center", gap: scale(6), marginLeft: scale(6) }]}>
          <IconPack name="calendar" variant="Bold" size={scale(20)} />
          <Text size="xxs">
            Telah dilakukan perawatan pada, {formatDate(item.created_at)}
          </Text>
        </View>

        {/* AI Analysis */}
        {item.ai_analysis_json?.parsed_result && (
          <View style={[styles.row, { alignItems: "center", gap: scale(6), marginLeft: scale(6) }]}>
            <IconPack name="magic" size={scale(16)} color={colors.palette.primary500} />
            <Text size="xxs" style={{ flex: 1 }} numberOfLines={1}>
              {item.ai_analysis_json.parsed_result.name}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  )
}
