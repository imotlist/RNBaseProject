/**
 * OfflineMapScreen.tsx
 *
 * Full-screen offline map viewer that displays both Sumut and Jatim regions.
 * Shows map controls, region selector, and plant markers.
 *
 * @module screens/OfflineMapScreen
 */

import React, { useState, useRef } from "react"
import { View, StyleSheet, TouchableOpacity, Alert, Pressable } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text } from "@/components/Text"
import { IconPack } from "@/components/ui"
import { scale, verticalScale } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import { OfflineMap, PointAnnotation } from "@/components/OfflineMap"
import { MAP_REGIONS } from "@/services/offlineMap"
import * as RNFS from "@dr.pogodin/react-native-fs"
import { TILE_CONFIG } from "@/services/offlineMap/tileCheck"

// ============================================================================
// Types
// ============================================================================

type RegionId = "sumut" | "jatim" | null

interface RegionInfo {
  id: string
  name: string
  center: { latitude: number; longitude: number }
  zoom: number
  downloaded: boolean
}

// ============================================================================
// Component
// ============================================================================

export const OfflineMapScreen: React.FC = () => {
  const { theme } = useAppTheme()
  const { colors } = theme
  const insets = useSafeAreaInsets()

  const mapRef = useRef<any>(null)
  const [zoomLevel, setZoomLevel] = useState(10)
  const [isMapReady, setIsMapReady] = useState(false)
  const [activeRegionId, setActiveRegionId] = useState<RegionId>(null)
  const [availableRegions, setAvailableRegions] = useState<RegionInfo[]>([])

  // Check which regions are downloaded
  const checkDownloadedRegions = async () => {
    const regions: RegionInfo[] = []

    for (const region of MAP_REGIONS) {
      const folderPath = `${TILE_CONFIG.mapsDirectory}/${region.folderName}`
      const exists = await RNFS.exists(folderPath)

      regions.push({
        id: region.id,
        name: region.name,
        center: region.center,
        zoom: region.zoom,
        downloaded: exists,
      })
    }

    setAvailableRegions(regions)

    // Auto-select first downloaded region
    const downloaded = regions.find((r) => r.downloaded)
    if (downloaded) {
      setActiveRegionId(downloaded.id as RegionId)
    }
  }

  // Handle map ready - check available regions
  const handleMapReady = async () => {
    setIsMapReady(true)
    await checkDownloadedRegions()
  }

  // Get current region info
  const currentRegion = activeRegionId
    ? availableRegions.find((r) => r.id === activeRegionId)
    : null

  // Switch to a different region
  const switchRegion = (regionId: RegionId) => {
    if (!regionId) return

    const region = availableRegions.find((r) => r.id === regionId)
    if (!region) return

    setActiveRegionId(regionId)

    // Move camera to region
    if (mapRef.current) {
      mapRef.current.setCamera({
        centerCoordinate: [region.center.longitude, region.center.latitude],
        zoomLevel: region.zoom,
      })
    }
  }

  // Zoom controls
  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 1, 14)
    setZoomLevel(newZoom)
    if (mapRef.current) {
      mapRef.current.setCamera({ zoomLevel: newZoom })
    }
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 1, 5)
    setZoomLevel(newZoom)
    if (mapRef.current) {
      mapRef.current.setCamera({ zoomLevel: newZoom })
    }
  }

  const handleRecenter = () => {
    if (currentRegion && mapRef.current) {
      mapRef.current.setCamera({
        centerCoordinate: [currentRegion.center.longitude, currentRegion.center.latitude],
        zoomLevel: currentRegion.zoom,
      })
      setZoomLevel(currentRegion.zoom)
    }
  }

  // Show region info
  const showRegionInfo = () => {
    const downloadedCount = availableRegions.filter((r) => r.downloaded).length
    const regionNames = availableRegions
      .filter((r) => r.downloaded)
      .map((r) => r.name)
      .join(", ")

    Alert.alert(
      "Peta Offline",
      `Wilayah yang tersedia: ${regionNames || "Tidak ada"}\n\nTotal: ${downloadedCount} wilayah`,
      [{ text: "OK" }],
    )
  }

  // Mock plant markers (in real app, these would come from props/API)
  const markers = [
    { id: "1", latitude: 2.115, longitude: 99.545, status: "healthy" as const }, // Sumut
    { id: "2", latitude: 1.65, longitude: 100.2, status: "healthy" as const }, // Sumut
    { id: "3", latitude: -7.2575, longitude: 112.7521, status: "attention" as const }, // Jatim
    { id: "4", latitude: -7.5, longitude: 112.0, status: "healthy" as const }, // Jatim
    { id: "5", latitude: -8.0, longitude: 113.5, status: "critical" as const }, // Jatim
  ]

  // Filter markers based on active region
  const visibleMarkers =
    activeRegionId === "sumut"
      ? markers.filter((m) => m.latitude > 0)
      : activeRegionId === "jatim"
        ? markers.filter((m) => m.latitude < 0)
        : markers

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

  return (
    <View style={styles.container}>
      {/* Map */}
      <OfflineMap
        ref={mapRef}
        style={styles.map}
        initialCenterCoordinate={
          currentRegion
            ? currentRegion.center
            : { latitude: -6.2, longitude: 106.8 }
        }
        initialZoomLevel={currentRegion ? currentRegion.zoom : 8}
        onMapReady={handleMapReady}
        showUserLocation={true}
      >
        {/* Plant Markers */}
        {isMapReady &&
          visibleMarkers.map((marker) => (
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

      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <View style={[styles.topBarContent, { backgroundColor: "rgba(255,255,255,0.95)" }]}>
          <View style={styles.topBarLeft}>
            <IconPack name="map" size={scale(20)} color={colors.palette.primary700} />
            <Text size="md" weight="600">
              {currentRegion ? currentRegion.name : "Memuat..."}
            </Text>
          </View>
          <Pressable onPress={showRegionInfo}>
            <IconPack name="info" size={scale(20)} color={colors.palette.primary700} />
          </Pressable>
        </View>
      </View>

      {/* Region Selector */}
      <View style={[styles.regionSelector, { top: insets.top + verticalScale(60) }]}>
        {availableRegions.map((region) => (
          <TouchableOpacity
            key={region.id}
            style={[
              styles.regionButton,
              {
                backgroundColor: region.downloaded
                  ? activeRegionId === region.id
                    ? colors.palette.primary700
                    : "white"
                  : "rgba(0,0,0,0.3)",
              },
            ]}
            onPress={() => region.downloaded && switchRegion(region.id as RegionId)}
            disabled={!region.downloaded}
          >
            <Text
              size="xs"
              weight="600"
              style={{
                color: region.downloaded
                  ? activeRegionId === region.id
                    ? "white"
                    : colors.palette.primary700
                  : "rgba(255,255,255,0.5)",
              }}
            >
              {region.name}
            </Text>
            {!region.downloaded && (
              <Text size="xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                (Unduh dulu)
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Zoom Controls */}
      <View style={[styles.zoomControls, { bottom: insets.bottom + verticalScale(20) }]}>
        <View style={styles.zoomButtonGroup}>
          <TouchableOpacity
            style={[styles.zoomButton, { backgroundColor: "white" }]}
            onPress={handleZoomIn}
          >
            <IconPack name="plus" size={scale(20)} />
          </TouchableOpacity>
          <View style={styles.zoomSeparator} />
          <TouchableOpacity
            style={[styles.zoomButton, { backgroundColor: "white" }]}
            onPress={handleZoomOut}
          >
            <IconPack name="minus" size={scale(20)} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.recenterButton, { backgroundColor: "white" }]}
          onPress={handleRecenter}
        >
          <IconPack name="location" size={scale(20)} color={colors.palette.primary700} />
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={[styles.legend, { bottom: insets.bottom + verticalScale(100) }]}>
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
  map: {
    flex: 1,
  },
  topBar: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: scale(16),
  },
  topBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  regionSelector: {
    position: "absolute",
    left: scale(16),
    gap: scale(8),
  },
  regionButton: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  zoomControls: {
    position: "absolute",
    right: scale(16),
    alignItems: "flex-end",
    gap: scale(12),
  },
  zoomButtonGroup: {
    borderRadius: scale(8),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoomButton: {
    width: scale(44),
    height: scale(44),
    alignItems: "center",
    justifyContent: "center",
  },
  zoomSeparator: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  recenterButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  legend: {
    position: "absolute",
    left: scale(16),
    flexDirection: "row",
    gap: scale(16),
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: scale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  legendDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
  },
})

export default OfflineMapScreen
