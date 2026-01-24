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
import { lonLatToTile, getTilePath, debugLocation } from "@/services/offlineMap/tileDebugger"
import * as RNFS from "@dr.pogodin/react-native-fs"
import { usePermission } from "@/context/PermissionContext"
import * as Location from "expo-location"

// Setup MapLibre
const MLRN = MapLibreGL

// ============================================================================
// Types
// ============================================================================

export interface OfflineMapProps {
  /**
   * Initial camera position (will be overridden by current location if centerOnUserLocation is true)
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
   * Center map on user's current location on load
   */
  centerOnUserLocation?: boolean

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
  centerOnUserLocation = true,
  children,
}) => {
  const mapRef = useRef<any>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [mapStyle, setMapStyle] = useState<any>(null)
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const { requestPermission } = usePermission()

  /**
   * Request location permission if showUserLocation or centerOnUserLocation is enabled
   */
  useEffect(() => {
    const requestLocationPermission = async () => {
      if ((showUserLocation || centerOnUserLocation) && !locationPermissionGranted) {
        try {
          // Request foreground location permissions
          const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync()

          if (foregroundStatus === "granted") {
            setLocationPermissionGranted(true)
            console.log("[OfflineMap] Location permission granted")

            // Get current location if centering on user
            if (centerOnUserLocation) {
              getCurrentLocation()
            }
          } else {
            console.warn("[OfflineMap] Location permission denied. User location will not be shown.")
          }
        } catch (error) {
          console.error("[OfflineMap] Error requesting location permission:", error)
        }
      }
    }

    requestLocationPermission()
  }, [showUserLocation, centerOnUserLocation])

  /**
   * Get current user location
   */
  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        maxAge: 60000, // Accept location cached within last minute
      })

      const { latitude, longitude } = location.coords
      console.log(`[OfflineMap] Current location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
      setUserLocation({ latitude, longitude })

      // Move camera to user location if map is ready
      if (mapRef.current && isMapReady) {
        mapRef.current.setCamera({
          centerCoordinate: [longitude, latitude],
          zoomLevel: initialZoomLevel,
          animationDuration: 1000,
        })
      }
    } catch (error) {
      console.warn("[OfflineMap] Error getting current location:", error)
      console.log("[OfflineMap] Using default center instead")
    }
  }

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

          // Indonesia Plant Map - Complete Land Coverage style (inline fallback)
          styleConfig = {
            version: 8,
            name: `Indonesia Plant Map - ${region?.name || downloadedRegionId}`,
            center: region ? [region.center.longitude, region.center.latitude] : [106.8, -2.5],
            zoom: region?.zoom || 7,
            bearing: 0,
            pitch: 0,
            sources: {
              tiles: {
                type: "vector",
                tiles: [tileUrlTemplate],
                minzoom: TILE_CONFIG.minZoom,
                maxzoom: TILE_CONFIG.maxZoom,
              },
            },
            layers: [
              // Background layer (water-like color)
              {
                id: "background",
                type: "background",
                paint: {
                  "background-color": "#aadaff",
                },
              },
              // Water layer
              {
                id: "water-all",
                type: "fill",
                source: "tiles",
                "source-layer": "water",
                paint: {
                  "fill-color": "#4fc3f7",
                  "fill-opacity": 0.9,
                },
              },
              // Landuse layer with detailed colors
              {
                id: "landuse",
                type: "fill",
                source: "tiles",
                "source-layer": "landuse",
                paint: {
                  "fill-color": [
                    "match",
                    ["get", "class"],
                    "residential",
                    "#f0f0eb",
                    "commercial",
                    "#f0f0eb",
                    "industrial",
                    "#e8e8e8",
                    "retail",
                    "#f0f0eb",
                    "construction",
                    "#e8e8e8",
                    "farmland",
                    "#d6dbc8",
                    "farmyard",
                    "#d6dbc8",
                    "orchard",
                    "#c8e6c0",
                    "plantation",
                    "#a8c8a0",
                    "agricultural",
                    "#d6dbc8",
                    "greenfield",
                    "#c8e6c0",
                    "meadow",
                    "#c8e6c0",
                    "grass",
                    "#c8e6c0",
                    "farm",
                    "#d6dbc8",
                    "park",
                    "#c8e6c0",
                    "forest",
                    "#a8c8a0",
                    "village_green",
                    "#c8e6c0",
                    "#c5d6a8",
                  ],
                  "fill-opacity": 0.95,
                },
              },
              // Landcover layer
              {
                id: "landcover",
                type: "fill",
                source: "tiles",
                "source-layer": "landcover",
                paint: {
                  "fill-color": [
                    "match",
                    ["get", "class"],
                    "forest",
                    "#a8c8a0",
                    "wood",
                    "#b8d8c0",
                    "tree",
                    "#a8c8a0",
                    "grass",
                    "#c8e6c0",
                    "grassland",
                    "#c8e6c0",
                    "meadow",
                    "#c8e6c0",
                    "scrub",
                    "#a8c8a0",
                    "heath",
                    "#b8d8c0",
                    "bush",
                    "#a8c8a0",
                    "wetland",
                    "#a8c8a0",
                    "swamp",
                    "#909090",
                    "marsh",
                    "#a0c0a0",
                    "mangrove",
                    "#8a8a8a",
                    "sand",
                    "#e6d3b0",
                    "beach",
                    "#f0e8c0",
                    "bare_rock",
                    "#a0a0a0",
                    "rock",
                    "#b0b0b0",
                    "#c8e6c0",
                  ],
                  "fill-opacity": 0.9,
                },
              },
              // Water layer with class matching
              {
                id: "water",
                type: "fill",
                source: "tiles",
                "source-layer": "water",
                paint: {
                  "fill-color": [
                    "match",
                    ["get", "class"],
                    "lake",
                    "#4fc3f7",
                    "river",
                    "#4fc3f7",
                    "canal",
                    "#4fc3f7",
                    "pond",
                    "#4fc3f7",
                    "reservoir",
                    "#4fc3f7",
                    "ocean",
                    "#4fc3f7",
                    "sea",
                    "#4fc3f7",
                    "bay",
                    "#4fc3f7",
                    "#4fc3f7",
                  ],
                  "fill-opacity": 0.9,
                },
              },
              // Waterway layer
              {
                id: "waterway",
                type: "line",
                source: "tiles",
                "source-layer": "waterway",
                paint: {
                  "line-color": [
                    "match",
                    ["get", "class"],
                    "river",
                    "#1E90FF",
                    "canal",
                    "#4169E1",
                    "stream",
                    "#87CEEB",
                    "#1E90FF",
                  ],
                  "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    5,
                    0.5,
                    9,
                    1,
                    12,
                    2,
                    15,
                    4,
                  ],
                  "line-opacity": 0.85,
                },
              },
              // Motorway roads
              {
                id: "motorway",
                type: "line",
                source: "tiles",
                "source-layer": "transportation",
                filter: ["==", ["get", "class"], "motorway"],
                layout: {
                  "line-cap": "round",
                  "line-join": "round",
                },
                paint: {
                  "line-color": "#ff4500",
                  "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    7,
                    2,
                    10,
                    4,
                    15,
                    10,
                  ],
                  "line-opacity": 1,
                },
              },
              // Trunk roads
              {
                id: "trunk",
                type: "line",
                source: "tiles",
                "source-layer": "transportation",
                filter: ["==", ["get", "class"], "trunk"],
                layout: {
                  "line-cap": "round",
                  "line-join": "round",
                },
                paint: {
                  "line-color": "#ffd700",
                  "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    7,
                    2,
                    10,
                    3.5,
                    15,
                    8,
                  ],
                  "line-opacity": 1,
                },
              },
              // Primary roads
              {
                id: "primary",
                type: "line",
                source: "tiles",
                "source-layer": "transportation",
                filter: ["==", ["get", "class"], "primary"],
                layout: {
                  "line-cap": "round",
                  "line-join": "round",
                },
                paint: {
                  "line-color": "#ffa500",
                  "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8,
                    1.5,
                    10,
                    2.5,
                    15,
                    6,
                  ],
                  "line-opacity": 1,
                },
              },
              // Secondary roads
              {
                id: "secondary",
                type: "line",
                source: "tiles",
                "source-layer": "transportation",
                filter: ["==", ["get", "class"], "secondary"],
                layout: {
                  "line-cap": "round",
                  "line-join": "round",
                },
                paint: {
                  "line-color": "#ffffff",
                  "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    9,
                    1.5,
                    12,
                    2.5,
                    15,
                    5,
                  ],
                  "line-opacity": 1,
                },
              },
              // Tertiary roads
              {
                id: "tertiary",
                type: "line",
                source: "tiles",
                "source-layer": "transportation",
                filter: ["==", ["get", "class"], "tertiary"],
                layout: {
                  "line-cap": "round",
                  "line-join": "round",
                },
                paint: {
                  "line-color": "#fafafa",
                  "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10,
                    1,
                    13,
                    2,
                    15,
                    4,
                  ],
                  "line-opacity": 0.95,
                },
              },
              // Unclassified roads
              {
                id: "unclassified",
                type: "line",
                source: "tiles",
                "source-layer": "transportation",
                filter: ["==", ["get", "class"], "unclassified"],
                layout: {
                  "line-cap": "round",
                  "line-join": "round",
                },
                paint: {
                  "line-color": "#e0e0e0",
                  "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    12,
                    0.5,
                    14,
                    1.5,
                    15,
                    3,
                  ],
                  "line-opacity": 0.9,
                },
              },
              // Residential roads
              {
                id: "residential",
                type: "line",
                source: "tiles",
                "source-layer": "transportation",
                filter: ["==", ["get", "class"], "residential"],
                layout: {
                  "line-cap": "round",
                  "line-join": "round",
                },
                paint: {
                  "line-color": "#d0d0d0",
                  "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    13,
                    0.5,
                    15,
                    2,
                  ],
                  "line-opacity": 0.8,
                },
              },
              // City labels
              {
                id: "city",
                type: "symbol",
                source: "tiles",
                "source-layer": "place",
                filter: ["==", ["get", "class"], "city"],
                layout: {
                  "text-field": ["get", "name"],
                  "text-size": 14,
                  "text-anchor": "center",
                },
                paint: {
                  "text-color": "#000",
                  "text-halo-color": "#fff",
                  "text-halo-width": 2,
                },
              },
              // Town labels
              {
                id: "town",
                type: "symbol",
                source: "tiles",
                "source-layer": "place",
                filter: ["==", ["get", "class"], "town"],
                layout: {
                  "text-field": ["get", "name"],
                  "text-size": 12,
                  "text-anchor": "center",
                },
                paint: {
                  "text-color": "#000",
                  "text-halo-color": "#fff",
                  "text-halo-width": 1.5,
                },
              },
              // Village labels
              {
                id: "village",
                type: "symbol",
                source: "tiles",
                "source-layer": "place",
                filter: ["==", ["get", "class"], "village"],
                layout: {
                  "text-field": ["get", "name"],
                  "text-size": 10,
                  "text-anchor": "center",
                },
                paint: {
                  "text-color": "#333",
                  "text-halo-color": "#fff",
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

  const handleMapReady = async () => {
    setIsMapReady(true)
    console.log("[OfflineMap] Map is ready")

    // If centering on user location and we have it, move the camera
    if (centerOnUserLocation && userLocation && mapRef.current) {
      console.log(`[OfflineMap] Centering on user location: ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}`)
      mapRef.current.setCamera({
        centerCoordinate: [userLocation.longitude, userLocation.latitude],
        zoomLevel: initialZoomLevel,
        animationDuration: 1000,
      })

      // Debug location - use user location for tile check
      if (activeRegionId) {
        await debugLocation(
          activeRegionId,
          userLocation.longitude,
          userLocation.latitude,
          initialZoomLevel
        )
      }
    } else {
      // Debug location - logs expected tile and checks if it exists
      if (activeRegionId) {
        await debugLocation(
          activeRegionId,
          initialCenterCoordinate.longitude,
          initialCenterCoordinate.latitude,
          initialZoomLevel
        )
      }
    }

    if (onMapReady) {
      onMapReady()
    }
  }

  /**
   * Handle tile loading errors - log missing tiles
   */
  const handleTileLoadingError = (event: any) => {
    const { tile } = event
    if (tile) {
      console.error(`[OfflineMap] TILE ERROR: z=${tile.z}, x=${tile.x}, y=${tile.y}, source=${tile.sourceId || 'unknown'}`)
    } else {
      console.error("[OfflineMap] Tile loading error:", event)
    }
  }

  /**
   * Log when tiles fail to load
   */
  const handleDidFailLoadingMap = () => {
    console.error("[OfflineMap] Map failed to load")
  }

  /**
   * Log style loading errors
   */
  const handleStyleLoaded = () => {
    console.log("[OfflineMap] Style loaded successfully")
  }

  /**
   * Validate tile structure and log missing tiles
   */
  const validateTileStructure = async (regionId: string) => {
    console.log(`[OfflineMap] Validating tile structure for region: ${regionId}`)
    const folderPath = `${TILE_CONFIG.mapsDirectory}/${regionId}`
    const missingTiles: { z: number; x: number; y: number }[] = []
    const existingTiles: { z: number; count: number }[] = []

    // Check a sample of tiles at each zoom level
    for (let z = TILE_CONFIG.minZoom; z <= TILE_CONFIG.maxZoom; z++) {
      const zoomPath = `${folderPath}/${z}`
      const zoomExists = await RNFS.exists(zoomPath)

      if (!zoomExists) {
        console.warn(`[OfflineMap] Zoom level ${z} folder missing: ${zoomPath}`)
        continue
      }

      // List contents of zoom folder
      let xFolders: string[] = []
      try {
        xFolders = await RNFS.readDir(zoomPath)
        xFolders = xFolders.filter(item => item.isDirectory && !isNaN(parseInt(item.name)))
      } catch (e) {
        console.warn(`[OfflineMap] Cannot read zoom folder ${z}:`, e)
        continue
      }

      existingTiles.push({ z, count: xFolders.length })

      // Sample a few x folders and check for tiles
      for (const xFolder of xFolders.slice(0, 5)) {
        const x = parseInt(xFolder.name)
        const xPath = `${zoomPath}/${x}`

        try {
          const yFiles = await RNFS.readDir(xPath)
          const pbfFiles = yFiles.filter(f => f.isFile && f.name.endsWith('.pbf'))

          if (pbfFiles.length === 0) {
            console.warn(`[OfflineMap] No PBF files found in ${xPath}`)
          }

          // Log first few tiles as sample
          pbfFiles.slice(0, 3).forEach(f => {
            const y = parseInt(f.name.replace('.pbf', ''))
            console.log(`[OfflineMap] Sample tile exists: ${z}/${x}/${y}.pbf`)
          })
        } catch (e) {
          console.warn(`[OfflineMap] Cannot read x folder ${xPath}:`, e)
        }
      }
    }

    console.log(`[OfflineMap] Tile validation complete. Zoom levels with tiles:`, existingTiles.map(t => `${t.z}(${t.count})`).join(', '))
    return { existingTiles, missingTiles }
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
        onDidFailLoadingMap={handleDidFailLoadingMap}
        onStyleLoaded={handleStyleLoaded}
        onDidFailLoadingTile={handleTileLoadingError}
      >
        <MLRN.Camera
          zoomLevel={initialZoomLevel}
          centerCoordinate={
            userLocation && centerOnUserLocation
              ? [userLocation.longitude, userLocation.latitude]
              : [initialCenterCoordinate.longitude, initialCenterCoordinate.latitude]
          }
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
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
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
