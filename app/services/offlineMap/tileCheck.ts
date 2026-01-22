/**
 * tileCheck.ts
 *
 * Utilities for checking offline map availability.
 * Supports region-based .osm.pbf files (Sumatera Utara, Jawa Timur, etc.)
 */

import * as RNFS from "@dr.pogodin/react-native-fs"

// ============================================================================
// Types
// ============================================================================

export type MapRegion = {
  id: string
  name: string
  folderName: string // e.g., "sumut_tiles"
  fileSize: string // Human readable size
  center: {
    latitude: number
    longitude: number
  }
  zoom: number
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Available map regions
 */
export const MAP_REGIONS: MapRegion[] = [
  {
    id: "sumut",
    name: "Sumatera Utara",
    folderName: "sumut",
    fileSize: "~122 MB",
    center: { latitude: 2.115, longitude: 99.545 },
    zoom: 8,
  },
  {
    id: "jatim",
    name: "Jawa Timur",
    folderName: "jatim",
    fileSize: "~192 MB",
    center: { latitude: -7.2575, longitude: 112.7521 },
    zoom: 9,
  },
]

/**
 * Map tile configuration
 */
export const TILE_CONFIG = {
  // Base directory for storing offline map tiles
  mapsDirectory: `${RNFS.DocumentDirectoryPath}/maps`,
  // Tile server URL
  baseUrl: "https://tally-green.skwn.dev/maps",
  // Zoom levels (from documentation)
  minZoom: 5,
  maxZoom: 14,
  // Default region ID
  defaultRegionId: "sumut" as const,
} as const

// ============================================================================
// Tile Checking Functions
// ============================================================================

/**
 * Check if the maps directory exists
 */
export async function checkMapsDirectoryExists(): Promise<boolean> {
  try {
    return await RNFS.exists(TILE_CONFIG.mapsDirectory)
  } catch (error) {
    console.error("Error checking maps directory:", error)
    return false
  }
}

/**
 * Check if a specific region's tile folder exists and contains tiles
 */
export async function checkRegionFileExists(regionId: string): Promise<boolean> {
  try {
    const region = MAP_REGIONS.find((r) => r.id === regionId)
    if (!region) return false

    const folderPath = getRegionFolderPath(regionId)
    const folderExists = await RNFS.exists(folderPath)

    if (!folderExists) return false

    // Check if folder has at least some tile files
    // Check for zoom level folders (5-14)
    for (let z = TILE_CONFIG.minZoom; z <= TILE_CONFIG.maxZoom; z++) {
      const zoomPath = `${folderPath}/${z}`
      const zoomExists = await RNFS.exists(zoomPath)
      if (zoomExists) {
        return true
      }
    }

    return false
  } catch (error) {
    console.error("Error checking region file:", error)
    return false
  }
}

/**
 * Check if any region file exists
 */
export async function checkAnyRegionFileExists(): Promise<boolean> {
  try {
    const dirExists = await checkMapsDirectoryExists()
    if (!dirExists) return false

    for (const region of MAP_REGIONS) {
      const filePath = getRegionFilePath(region.id)
      const exists = await RNFS.exists(filePath)
      if (exists) return true
    }

    return false
  } catch (error) {
    console.error("Error checking region files:", error)
    return false
  }
}

/**
 * Check if offline map data is ready (at least one region downloaded)
 */
export async function checkOfflineTilesReady(): Promise<boolean> {
  try {
    return await checkAnyRegionFileExists()
  } catch (error) {
    console.error("Error checking offline tiles readiness:", error)
    return false
  }
}

/**
 * Get downloaded regions
 */
export async function getDownloadedRegions(): Promise<string[]> {
  const downloaded: string[] = []

  for (const region of MAP_REGIONS) {
    const exists = await checkRegionFileExists(region.id)
    if (exists) {
      downloaded.push(region.id)
    }
  }

  return downloaded
}

// ============================================================================
// File Path Functions
// ============================================================================

/**
 * Get the local folder path for a region's tiles
 */
export function getRegionFolderPath(regionId: string): string {
  const region = MAP_REGIONS.find((r) => r.id === regionId)
  if (!region) return ""

  return `${TILE_CONFIG.mapsDirectory}/${region.folderName}`
}

/**
 * Get the local file path for a region (deprecated, use getRegionFolderPath)
 */
export function getRegionFilePath(regionId: string): string {
  return getRegionFolderPath(regionId)
}

/**
 * Get the tile URL template for MapLibre
 * On Android: uses absolute path without file:// prefix
 * On iOS: uses file:// prefix
 * Format: /data/user/0/app.id/files/maps/region/{z}/{x}/{y}.pbf
 */
export function getTileUrlTemplate(regionId: string): string {
  const folderPath = getRegionFolderPath(regionId)
  // Android MapLibre doesn't work with file:// prefix for local tiles
  // It needs the absolute path directly
  return `${folderPath}/{z}/{x}/{y}.pbf`
}

/**
 * Get the file URL for a region to be used with MapLibre (deprecated)
 */
export function getRegionFileUrl(regionId: string): string {
  return getTileUrlTemplate(regionId)
}

/**
 * Get the local style JSON URL for MapLibre
 */
export function getLocalStyleUrl(regionId: string): string {
  return `file://${TILE_CONFIG.mapsDirectory}/style-${regionId}.json`
}

/**
 * Get estimated storage size for a region
 */
export function getRegionSize(regionId: string): string {
  const region = MAP_REGIONS.find((r) => r.id === regionId)
  return region?.fileSize || "~20 MB"
}

/**
 * Get total estimated size for all regions
 */
export function getTotalEstimatedSize(): string {
  const totalMB = MAP_REGIONS.reduce((sum, region) => {
    const sizeNum = parseInt(region.fileSize.replace(/[^\d]/g, "")) || 20
    return sum + sizeNum
  }, 0)

  return `~${totalMB} MB`
}

// ============================================================================
// Progress & Result Types
// ============================================================================

/**
 * Region download progress callback type
 */
export type RegionDownloadProgress = {
  downloadedBytes: number
  totalBytes: number
  percentage: number
  regionId: string
}

/**
 * Region download result type
 */
export type RegionDownloadResult = {
  success: boolean
  regionId: string
  error?: string
}
