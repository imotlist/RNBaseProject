/**
 * PlantCard.tsx
 *
 * Card component for displaying a plant in the list.
 *
 * @module screens/Home
 */

import React from "react"
import { View, Pressable, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Text } from "@/components/Text"
import { Avatar } from "@/components/ui"
import { scale } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import type { MyPlantItem } from "@/services/api/apisCollection/myPlants"

// ============================================================================
// Types
// ============================================================================

export interface PlantCardProps {
  plant: MyPlantItem
}

// ============================================================================
// Component
// ============================================================================

export const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  const { theme } = useAppTheme()
  const { colors } = theme
  const navigation = useNavigation()

  // Determine plant condition color
  const getConditionColor = () => {
    if (plant.latest_monitoring?.status_tanaman === "Sehat") {
      return colors.palette.success500
    }
    if (plant.latest_monitoring?.status_tanaman === "Mati") {
      return colors.palette.danger500
    }
    return colors.palette.neutral400
  }

  const getConditionBg = () => {
    if (plant.latest_monitoring?.status_tanaman === "Sehat") {
      return "#E8F5E9"
    }
    if (plant.latest_monitoring?.status_tanaman === "Mati") {
      return "#FFEBEE"
    }
    return colors.palette.neutral100
  }

  const conditionColor = getConditionColor()
  const conditionBg = getConditionBg()

  const handlePress = () => {
    navigation.navigate("RiwayatTanaman" as never, {
      plantId: plant.id,
      plantName: plant.name,
    })
  }

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.palette.neutral50 }]}
      onPress={handlePress}
    >
      <View style={styles.cardContent}>
        {/* Plant Image */}
        <Avatar
          size="medium"
          uri={plant.image_url ?? undefined}
          asset={require("@assets/images/IconPlant.png")}
          imageAsIcon
          backgroundColor={colors.palette.neutral300}
        />

        <View style={styles.cardInfo}>
          {/* Plant Name and Code */}
          <Text size="md" weight="medium" style={{ color: colors.text }}>
            {plant.name}
          </Text>
          {plant.plant_code && (
            <Text size="xs" style={{ color: colors.textDim }}>
              {plant.plant_code}
            </Text>
          )}

          {/* Region */}
          {plant.region?.name && (
            <Text size="xs" style={{ color: colors.textDim, marginTop: scale(4) }}>
              📍 {plant.region.name}
            </Text>
          )}

          {/* Latest Monitoring Info */}
          {plant.latest_monitoring ? (
            <View style={[styles.row, { marginTop: scale(8) }]}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: conditionBg },
                ]}
              >
                <Text size="xxs" style={{ color: conditionColor }}>
                  {plant.latest_monitoring.status_tanaman}
                </Text>
              </View>
              <Text size="xxs" style={{ color: colors.textDim }}>
                Tinggi: {plant.latest_monitoring.tinggi_tanaman || "-"}
              </Text>
            </View>
          ) : (
            <View style={[styles.row, { marginTop: scale(8) }]}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: colors.palette.neutral200 },
                ]}
              >
                <Text size="xxs" style={{ color: colors.textDim }}>
                  Belum dipantau
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  card: {
    padding: scale(12),
    borderRadius: scale(12),
    marginBottom: scale(12),
  },
  cardContent: {
    flexDirection: "row",
    gap: scale(12),
  },
  cardInfo: {
    flex: 1,
    gap: scale(4),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  statusBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(4),
  },
})
