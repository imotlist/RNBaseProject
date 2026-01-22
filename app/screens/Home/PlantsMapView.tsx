/**
 * PlantsMapView.tsx
 *
 * Mock map view for displaying plants on a map.
 *
 * @module screens/Home
 */

import React from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Text } from "@/components/Text"
import { IconPack } from "@/components/ui"
import { scale, verticalScale } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"

// ============================================================================
// Types
// ============================================================================

export interface PlantsMapViewProps {
  plantsCount?: number
}

// ============================================================================
// Component
// ============================================================================

export const PlantsMapView: React.FC<PlantsMapViewProps> = ({ plantsCount = 0 }) => {
  const { theme } = useAppTheme()
  const { colors } = theme

  return (
    <View style={styles.container}>
      {/* Mock Map Container */}
      <View style={[styles.mapContainer, { backgroundColor: colors.palette.neutral200 }]}>
        {/* Map grid lines */}
        <View style={styles.gridLines}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLine, styles.gridLineHorizontal]} />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLine, styles.gridLineVertical]} />
          ))}
        </View>

        {/* Mock map markers */}
        <View style={styles.markers}>
          {/* Marker 1 */}
          <View style={[styles.marker, { top: "30%", left: "25%" }]}>
            <View style={[styles.markerPin, { backgroundColor: colors.palette.success500 }]} />
            <View style={[styles.markerDot, { backgroundColor: colors.palette.success500 }]} />
          </View>

          {/* Marker 2 */}
          <View style={[styles.marker, { top: "45%", left: "55%" }]}>
            <View style={[styles.markerPin, { backgroundColor: colors.palette.success500 }]} />
            <View style={[styles.markerDot, { backgroundColor: colors.palette.success500 }]} />
          </View>

          {/* Marker 3 */}
          <View style={[styles.marker, { top: "60%", left: "35%" }]}>
            <View style={[styles.markerPin, { backgroundColor: colors.palette.warning500 }]} />
            <View style={[styles.markerDot, { backgroundColor: colors.palette.warning500 }]} />
          </View>

          {/* Marker 4 */}
          <View style={[styles.marker, { top: "25%", left: "70%" }]}>
            <View style={[styles.markerPin, { backgroundColor: colors.palette.success500 }]} />
            <View style={[styles.markerDot, { backgroundColor: colors.palette.success500 }]} />
          </View>

          {/* Marker 5 */}
          <View style={[styles.marker, { top: "70%", left: "60%" }]}>
            <View style={[styles.markerPin, { backgroundColor: colors.palette.danger500 }]} />
            <View style={[styles.markerDot, { backgroundColor: colors.palette.danger500 }]} />
          </View>
        </View>

        {/* Map controls overlay */}
        <View style={styles.mapControls}>
          <View style={[styles.mapControl, { backgroundColor: "white" }]}>
            <IconPack name="plus" size={scale(20)} />
          </View>
          <View style={[styles.mapControl, { backgroundColor: "white" }]}>
            <IconPack name="minus" size={scale(20)} />
          </View>
        </View>

        {/* Current location button */}
        <View style={[styles.locateButton, { backgroundColor: "white" }]}>
          <IconPack name="location" size={scale(20)} color={colors.palette.primary700} />
        </View>
      </View>

      {/* Plants info */}
      <View style={[styles.infoCard, { backgroundColor: colors.palette.neutral50 }]}>
        <View style={styles.row}>
          <IconPack name="marker" size={scale(20)} color={colors.palette.primary700} />
          <Text size="sm" weight="600" style={{ color: colors.text }}>
            {plantsCount} Tanaman
          </Text>
        </View>
        <Text size="xs" style={{ color: colors.textDim }}>
          Peta menampilkan lokasi tanaman Anda
        </Text>
      </View>

      {/* Legend */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.legendContainer}
      >
        <View style={[styles.legendItem, { backgroundColor: colors.palette.neutral50 }]}>
          <View style={[styles.legendDot, { backgroundColor: colors.palette.success500 }]} />
          <Text size="xs">Sehat</Text>
        </View>
        <View style={[styles.legendItem, { backgroundColor: colors.palette.neutral50 }]}>
          <View style={[styles.legendDot, { backgroundColor: colors.palette.warning500 }]} />
          <Text size="xs">Butuh Perhatian</Text>
        </View>
        <View style={[styles.legendItem, { backgroundColor: colors.palette.neutral50 }]}>
          <View style={[styles.legendDot, { backgroundColor: colors.palette.danger500 }]} />
          <Text size="xs">Kritis</Text>
        </View>
      </ScrollView>
    </View>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: verticalScale(300),
    margin: scale(20),
    borderRadius: scale(16),
    overflow: "hidden",
    position: "relative",
  },
  gridLines: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  gridLineHorizontal: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineVertical: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  markers: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  marker: {
    position: "absolute",
    alignItems: "center",
  },
  markerPin: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    opacity: 0.3,
  },
  markerDot: {
    position: "absolute",
    top: scale(10),
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
  },
  mapControls: {
    position: "absolute",
    right: scale(12),
    top: scale(12),
    gap: scale(8),
  },
  mapControl: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locateButton: {
    position: "absolute",
    right: scale(12),
    bottom: scale(12),
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCard: {
    marginHorizontal: scale(20),
    marginBottom: scale(12),
    padding: scale(12),
    borderRadius: scale(12),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  legendContainer: {
    paddingHorizontal: scale(20),
    paddingBottom: scale(20),
    gap: scale(12),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(8),
  },
  legendDot: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
  },
})
