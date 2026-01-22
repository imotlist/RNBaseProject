/**
 * OfflineMap.tsx
 *
 * MapLibre map component using locally stored vector tiles.
 * Works completely offline after tiles are downloaded.
 *
 * Tiles are stored in {z}/{x}/{y}.pbf format within region folders.
 */

import React, { useRef, useEffect, useState } from "react"
import { View, StyleSheet, ActivityIndicator, Text } from "react-native"
import MapLibreGL from "@maplibre/maplibre-react-native"
import { TILE_CONFIG, MAP_REGIONS, getTileUrlTemplate } from "@/services/offlineMap"
import * as RNFS from "@dr.pogodin/react-native-fs"
import { usePermission } from "@/context/PermissionContext"

// Setup MapLibre
const MLRN = MapLibreGL

// ============================================================================
// Types
// ============================================================================

export interface OfflineMapProps {
  /**
   * Initial camera position
   */
  initialCenterCoordinate?: {
    latitude: number
    longitude: number
  }
  initialZoomLevel?: number

  /**
   * Style for the map container
   */
  style?: any

  /**
   * Callback when map is ready
   */
  onMapReady?: () => void

  /**
   * Show user location
   */
  showUserLocation?: boolean

  /**
   * Children to render on the map (markers, shapes, etc.)
   */
  children?: React.ReactNode
}

// ============================================================================
// Component
// ============================================================================

export const OfflineMap: React.FC<OfflineMapProps> = ({
  initialCenterCoordinate = { latitude: -6.2, longitude: 106.8 }, // Default: Jakarta
  initialZoomLevel = 10,
  style,
  onMapReady,
  showUserLocation = false,
  children,
}) => {
  const mapRef = useRef<any>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [mapStyle, setMapStyle] = useState<any>(null)
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)

  const { requestPermission } = usePermission()

  /**
   * Request location permission if showUserLocation is enabled
   */
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (showUserLocation && !locationPermissionGranted) {
        try {
          const status = await requestPermission("location")
          if (status === "granted") {
            setLocationPermissionGranted(true)
            console.log("[OfflineMap] Location permission granted")
          } else {
            console.warn("[OfflineMap] Location permission denied. User location will not be shown.")
          }
        } catch (error) {
          console.error("[OfflineMap] Error requesting location permission:", error)
        }
      }
    }

    requestLocationPermission()
  }, [showUserLocation, requestPermission])

  /**
   * Setup map: find downloaded region and create style
   */
  useEffect(() => {
    const setupMap = async () => {
      try {
        // Find which region is downloaded
        let downloadedRegionId: string | null = null

        for (const region of MAP_REGIONS) {
          const folderPath = `${TILE_CONFIG.mapsDirectory}/${region.folderName}`
          const exists = await RNFS.exists(folderPath)

          if (exists) {
            // Check if it has tiles
            let hasTiles = false
            for (let z = TILE_CONFIG.minZoom; z <= TILE_CONFIG.maxZoom; z++) {
              const zoomPath = `${folderPath}/${z}`
              if (await RNFS.exists(zoomPath)) {
                hasTiles = true
                break
              }
            }

            if (hasTiles) {
              downloadedRegionId = region.id
              break
            }
          }
        }

        if (!downloadedRegionId) {
          setLoadingError("No map region downloaded. Please download a region first.")
          return
        }

        setActiveRegionId(downloadedRegionId)

        // Check if style file exists
        const stylePath = `${TILE_CONFIG.mapsDirectory}/style-${downloadedRegionId}.json`
        const styleExists = await RNFS.exists(stylePath)

        let styleConfig: any

        if (styleExists) {
          // Load existing style
          const styleContent = await RNFS.readFile(stylePath, "utf8")
          styleConfig = JSON.parse(styleContent)
          console.log("[OfflineMap] Loaded style from file:", stylePath)
        } else {
          // Create inline style using the tile URL template
          // Uses "openmaptiles" as source name (standard OpenMapTiles format)
          const tileUrlTemplate = getTileUrlTemplate(downloadedRegionId)
          const region = MAP_REGIONS.find((r) => r.id === downloadedRegionId)

          // Debug: log the tile URL template
          console.log("[OfflineMap] Tile URL template:", tileUrlTemplate)

          styleConfig = {
            version: 8,
            name: `Indonesia Offline Light - ${region?.name || downloadedRegionId}`,
            center: region ? [region.center.longitude, region.center.latitude] : [113.5, -2.5],
            zoom: region?.zoom || 7,
            sources: {
              openmaptiles: {
                type: "vector",
                tiles: [tileUrlTemplate],
                minzoom: TILE_CONFIG.minZoom,
                maxzoom: TILE_CONFIG.maxZoom,
              },
            },
            layers: [
              // Background layer
              {
                id: "background",
                type: "background",
                paint: {
                  "background-color": "#f5f5f5",
                },
              },
              // Water layer
              {
                id: "water",
                type: "fill",
                source: "openmaptiles",
                "source-layer": "water",
                filter: ["==", "$type", "Polygon"],
                paint: {
                  "fill-color": "#aadaff",
                },
              },
              // Landuse layer
              {
                id: "landuse",
                type: "fill",
                source: "openmaptiles",
                "source-layer": "landuse",
                filter: [
                  "any",
                  ["==", "class", "residential"],
                  ["==", "class", "commercial"],
                  ["==", "class", "industrial"],
                ],
                paint: {
                  "fill-color": "#e8e8e8",
                  "fill-opacity": 0.5,
                },
              },
              // Park layer
              {
                id: "park",
                type: "fill",
                source: "openmaptiles",
                "source-layer": "park",
                paint: {
                  "fill-color": "#c8e6c9",
                  "fill-opacity": 0.6,
                },
              },
              // Waterway layer
              {
                id: "waterway",
                type: "line",
                source: "openmaptiles",
                "source-layer": "waterway",
                filter: ["==", "$type", "LineString"],
                paint: {
                  "line-color": "#aadaff",
                  "line-width": 1,
                },
              },
              // Minor roads
              {
                id: "road_minor",
                type: "line",
                source: "openmaptiles",
                "source-layer": "transportation",
                filter: [
                  "all",
                  ["!=", "class", "trunk"],
                  ["!=", "class", "motorway"],
                  ["!=", "class", "primary"],
                ],
                paint: {
                  "line-color": "#ffffff",
                  "line-width": 0.5,
                  "line-opacity": 0.8,
                },
              },
              // Major roads
              {
                id: "road_major",
                type: "line",
                source: "openmaptiles",
                "source-layer": "transportation",
                filter: [
                  "any",
                  ["==", "class", "primary"],
                  ["==", "class", "trunk"],
                  ["==", "class", "motorway"],
                ],
                paint: {
                  "line-color": "#ffcc00",
                  "line-width": {
                    stops: [
                      [5, 1],
                      [10, 2],
                      [14, 4],
                    ],
                  },
                  "line-opacity": 0.9,
                },
              },
              // Boundary layer
              {
                id: "boundary",
                type: "line",
                source: "openmaptiles",
                "source-layer": "boundary",
                filter: ["==", "admin_level", 4],
                paint: {
                  "line-color": "#888888",
                  "line-width": 1,
                  "line-dasharray": [2, 2],
                },
              },
              // City and town labels
              {
                id: "place_city",
                type: "symbol",
                source: "openmaptiles",
                "source-layer": "place",
                filter: ["any", ["==", "class", "city"], ["==", "class", "town"]],
                layout: {
                  "text-field": "{name}",
                  "text-font": ["Open Sans Regular"],
                  "text-size": {
                    stops: [
                      [5, 10],
                      [10, 12],
                      [14, 14],
                    ],
                  },
                  "text-anchor": "center",
                },
                paint: {
                  "text-color": "#333333",
                  "text-halo-color": "#ffffff",
                  "text-halo-width": 1,
                },
              },
              // Village labels
              {
                id: "place_village",
                type: "symbol",
                source: "openmaptiles",
                "source-layer": "place",
                filter: ["==", "class", "village"],
                minzoom: 10,
                layout: {
                  "text-field": "{name}",
                  "text-font": ["Open Sans Regular"],
                  "text-size": 10,
                  "text-anchor": "center",
                },
                paint: {
                  "text-color": "#666666",
                  "text-halo-color": "#ffffff",
                  "text-halo-width": 1,
                },
              },
            ],
          }
        }

        setMapStyle(styleConfig)
      } catch (error) {
        console.error("Error setting up offline map:", error)
        setLoadingError(error instanceof Error ? error.message : "Failed to load offline map")
      }
    }

    setupMap()
  }, [])

  const handleMapReady = () => {
    setIsMapReady(true)
    if (onMapReady) {
      onMapReady()
    }
  }

  // Loading state
  if (!mapStyle) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          {loadingError ? (
            <>
              <ActivityIndicator size="small" color="#FF6B6B" />
              <Text style={styles.errorText}>{loadingError}</Text>
            </>
          ) : (
            <>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>Loading offline map...</Text>
            </>
          )}
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, style]}>
      <MLRN.MapView
        ref={mapRef}
        style={styles.map}
        mapStyle={mapStyle}
        onDidFinishLoadingMap={handleMapReady}
      >
        <MLRN.Camera
          zoomLevel={initialZoomLevel}
          centerCoordinate={[initialCenterCoordinate.longitude, initialCenterCoordinate.latitude]}
        />

        {showUserLocation && locationPermissionGranted && <MLRN.UserLocation visible={true} />}

        {isMapReady && children}
      </MLRN.MapView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#FF6B6B",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
})

export default OfflineMap

/**
 * Re-export MapLibre components for convenience
 */
export const MapLibreGLComponent = MLRN
export const MapView = MLRN.MapView
export const Camera = MLRN.Camera
export const UserLocation = MLRN.UserLocation
export const PointAnnotation = MLRN.PointAnnotation
export const Marker = MLRN.PointAnnotation
export const ShapeSource = MLRN.ShapeSource
export const FillLayer = MLRN.FillLayer
export const LineLayer = MLRN.LineLayer
export const CircleLayer = MLRN.CircleLayer
export const SymbolLayer = MLRN.SymbolLayer
export const RasterLayer = MLRN.RasterLayer
export const Light = MLRN.Light
