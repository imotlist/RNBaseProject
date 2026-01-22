/**
 * OfflineMapView.tsx
 *
 * Real offline map view using MapLibre with locally stored vector tiles.
 * Replaces the mock PlantsMapView.
 *
 * @module screens/Home
 */

import React, { useState, useRef } from "react"
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Text } from "@/components/Text"
import { IconPack } from "@/components/ui"
import { scale, verticalScale } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import { OfflineMap, PointAnnotation } from "@/components/OfflineMap"
import MapLibreGL from "@maplibre/maplibre-react-native"

// ============================================================================
// Types
// ============================================================================

export interface OfflineMapViewProps {
  plantsCount?: number
  // Plant markers data (can be passed in the future)
  plants?: Array<{
    id: string
    name: string
    latitude: number
    longitude: number
    status: "healthy" | "attention" | "critical"
  }>
}

// ============================================================================
// Component
// ============================================================================

export const OfflineMapView: React.FC<OfflineMapViewProps> = ({
  plantsCount = 0,
  plants = [],
}) => {
  const { theme } = useAppTheme()
  const { colors } = theme
  const navigation = useNavigation()

  const mapRef = useRef<any>(null)
  const [zoomLevel, setZoomLevel] = useState(10)
  const [isMapReady, setIsMapReady] = useState(false)

  // Default location: Jakarta (can be made configurable)
  const initialCenter = {
    latitude: -6.2088,
    longitude: 106.8456,
  }

  // Mock plant markers (in real app, these would come from props/API)
  const mockMarkers = [
    { id: "1", latitude: -6.19, longitude: 106.83, status: "healthy" as const },
    { id: "2", latitude: -6.22, longitude: 106.86, status: "healthy" as const },
    { id: "3", latitude: -6.18, longitude: 106.80, status: "attention" as const },
    { id: "4", latitude: -6.25, longitude: 106.88, status: "healthy" as const },
    { id: "5", latitude: -6.15, longitude: 106.82, status: "critical" as const },
  ]

  const markers = plants.length > 0 ? plants : mockMarkers

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return colors.palette.success500
      case "attention":
        return colors.palette.warning500
      case "critical":
        return colors.palette.danger500
      default:
        return colors.palette.neutral400
    }
  }

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 1, 14)
    setZoomLevel(newZoom)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 1, 5)
    setZoomLevel(newZoom)
  }

  const handleRecenter = () => {
    // Center back to initial location
    if (mapRef.current) {
      mapRef.current.setCamera({
        centerCoordinate: [initialCenter.longitude, initialCenter.latitude],
        zoomLevel: 10,
      })
    }
  }

  const showMapInfo = () => {
    Alert.alert(
      "Peta Offline",
      "Peta vector offline berjalan tanpa koneksi internet.\n\nData peta telah diunduh sebelumnya dan tersedia secara lokal.",
      [{ text: "OK" }],
    )
  }

  const openFullScreenMap = () => {
    ;(navigation as any).navigate("OfflineMap")
  }

  return (
    <View style={styles.container}>
      {/* Map Container */}
      <View style={styles.mapContainer}>
        <OfflineMap
          ref={mapRef}
          style={styles.map}
          initialCenterCoordinate={initialCenter}
          initialZoomLevel={10}
          onMapReady={() => setIsMapReady(true)}
          showUserLocation={true}
        >
          {/* Plant Markers */}
          {isMapReady &&
            markers.map((marker) => (
              <PointAnnotation
                key={marker.id}
                id={marker.id}
                coordinate={[marker.longitude, marker.latitude]}
              >
                <View style={[styles.markerPin, { backgroundColor: getStatusColor(marker.status) }]}>
                  <View style={[styles.markerDot, { backgroundColor: getStatusColor(marker.status) }]} />
                </View>
              </PointAnnotation>
            ))}
        </OfflineMap>

        {/* Map controls overlay */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={[styles.mapControl, { backgroundColor: "white" }]} onPress={handleZoomIn}>
            <IconPack name="add" size={scale(20)} />
          </TouchableOpacity>
          <View style={styles.mapControlSeparator} />
          <TouchableOpacity style={[styles.mapControl, { backgroundColor: "white" }]} onPress={handleZoomOut}>
            <IconPack name="minus" size={scale(20)} />
          </TouchableOpacity>
        </View>

        {/* Info & Recenter buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: "white" }]} onPress={showMapInfo}>
            <IconPack name="info" size={scale(18)} color={colors.palette.primary700} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: "white" }]} onPress={handleRecenter}>
            <IconPack name="location" size={scale(18)} color={colors.palette.primary700} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, styles.fullscreenButton, { backgroundColor: colors.palette.primary700 }]}
            onPress={openFullScreenMap}
          >
            <IconPack name="qr-code" size={scale(18)} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Plants info */}
      <View style={[styles.infoCard, { backgroundColor: colors.palette.neutral50 }]}>
        <View style={styles.row}>
          <IconPack name="map" size={scale(20)} color={colors.palette.primary700} />
          <Text size="sm" weight="normal" style={{ color: colors.text }}>
            {markers.length} Lokasi Tanaman
          </Text>
        </View>
        <Text size="xs" style={{ color: colors.textDim }}>
          Peta offline menampilkan lokasi tanaman Anda
        </Text>
      </View>

      {/* Legend */}
      <View style={[styles.legendContainer, { backgroundColor: colors.palette.neutral50 }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.palette.success500 }]} />
          <Text size="xs">Sehat</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.palette.warning500 }]} />
          <Text size="xs">Perhatian</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.palette.danger500 }]} />
          <Text size="xs">Kritis</Text>
        </View>
      </View>
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
  map: {
    flex: 1,
  },
  markers: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    gap: scale(4),
    borderRadius: scale(8),
    overflow: "hidden",
  },
  mapControl: {
    width: scale(36),
    height: scale(36),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapControlSeparator: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  bottomButtons: {
    position: "absolute",
    right: scale(12),
    bottom: scale(12),
    gap: scale(8),
  },
  iconButton: {
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
  fullscreenButton: {
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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
    flexDirection: "row",
    marginHorizontal: scale(20),
    marginBottom: scale(20),
    padding: scale(12),
    borderRadius: scale(12),
    justifyContent: "space-around",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  legendDot: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
  },
})
