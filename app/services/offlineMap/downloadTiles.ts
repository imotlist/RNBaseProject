/**
 * downloadTiles.ts
 *
 * Utilities for downloading offline map vector tiles from remote server.
 * Supports downloading tile folders via ZIP archive (recommended).
 *
 * Server structure:
 * https://tally-green.skwn.dev/maps/sumut.zip
 * https://tally-green.skwn.dev/maps/jatim.zip
 *
 * Each ZIP should extract to a folder structure like:
 * sumut_tiles/{z}/{x}/{y}.pbf
 * jatim_tiles/{z}/{x}/{y}.pbf
 */

import * as RNFS from "@dr.pogodin/react-native-fs"
import { unzip } from "react-native-zip-archive"
import pako from "pako"
import {
  TILE_CONFIG,
  MAP_REGIONS,
  getRegionFolderPath,
  getTileUrlTemplate,
  type RegionDownloadProgress,
  type RegionDownloadResult,
} from "./tileCheck"

/**
 * Download configuration
 */
const DOWNLOAD_CONFIG = {
  retryAttempts: 3,
  retryDelayMs: 2000,
  // Use ZIP archive - much faster than individual tiles
  useZipArchive: true,
}

/**
 * Download a single region's tiles
 *
 * For production use, the server should provide ZIP archives of tile folders.
 * Downloading individual tiles would require thousands of HTTP requests.
 */
export async function downloadRegion(
  regionId: string,
  onProgress?: (progress: RegionDownloadProgress) => void,
  signal?: AbortSignal,
): Promise<RegionDownloadResult> {
  const region = MAP_REGIONS.find((r) => r.id === regionId)

  if (!region) {
    console.error(`[OfflineMap] Region not found: ${regionId}`)
    return {
      success: false,
      regionId,
      error: "Region not found",
    }
  }

  console.log(`[OfflineMap] Starting download for region: ${region.name} (${regionId})`)

  try {
    if (signal?.aborted) {
      console.log(`[OfflineMap] Download cancelled for region: ${regionId}`)
      return {
        success: false,
        regionId,
        error: "Download was cancelled",
      }
    }

    // Create maps directory if it doesn't exist
    const mapsDirExists = await RNFS.exists(TILE_CONFIG.mapsDirectory)
    if (!mapsDirExists) {
      console.log(`[OfflineMap] Creating maps directory: ${TILE_CONFIG.mapsDirectory}`)
      await RNFS.mkdir(TILE_CONFIG.mapsDirectory)
    }

    const regionFolderPath = getRegionFolderPath(regionId)
    console.log(`[OfflineMap] Region folder path: ${regionFolderPath}`)

    // Check if folder already exists
    const folderExists = await RNFS.exists(regionFolderPath)
    if (folderExists) {
      console.log(`[OfflineMap] Folder exists, checking for tiles...`)
      // Check if it has tiles
      for (let z = TILE_CONFIG.minZoom; z <= TILE_CONFIG.maxZoom; z++) {
        const zoomPath = `${regionFolderPath}/${z}`
        if (await RNFS.exists(zoomPath)) {
          console.log(`[OfflineMap] Tiles already exist for region ${regionId}, generating style...`)
          // Already has tiles, generate style and return
          await writeStyleJson(regionId)
          return {
            success: true,
            regionId,
          }
        }
      }
    }

    // Try ZIP download first (recommended approach)
    if (DOWNLOAD_CONFIG.useZipArchive) {
      console.log(`[OfflineMap] Attempting ZIP download from: ${TILE_CONFIG.baseUrl}/${regionId}.zip`)
      const zipResult = await downloadRegionZip(regionId, onProgress, signal)
      if (zipResult.success) {
        console.log(`[OfflineMap] ZIP download successful, generating style...`)
        await writeStyleJson(regionId)
        return zipResult
      }
      console.log(`[OfflineMap] ZIP download failed`)
      // Return the error instead of falling back to individual tiles
      return zipResult
    }

    // Fallback: Download individual tiles (not recommended - kept for debugging)
    console.log(`[OfflineMap] Starting individual tile download...`)
    return await downloadIndividualTiles(regionId, onProgress, signal)

  } catch (error) {
    console.error(`[OfflineMap] Error downloading region ${regionId}:`, error)
    return {
      success: false,
      regionId,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Download region tiles from a ZIP archive
 * This is the recommended approach for production
 */
async function downloadRegionZip(
  regionId: string,
  onProgress?: (progress: RegionDownloadProgress) => void,
  signal?: AbortSignal,
): Promise<RegionDownloadResult> {
  const region = MAP_REGIONS.find((r) => r.id === regionId)
  if (!region) {
    return { success: false, regionId, error: "Region not found" }
  }

  const zipUrl = `${TILE_CONFIG.baseUrl}/${regionId}.zip`
  const zipPath = `${TILE_CONFIG.mapsDirectory}/${regionId}.zip`

  console.log(`[OfflineMap] ZIP URL: ${zipUrl}`)
  console.log(`[OfflineMap] ZIP save path: ${zipPath}`)

  try {
    // Download the ZIP file
    console.log(`[OfflineMap] Starting ZIP file download...`)
    const result = await RNFS.downloadFile({
      fromUrl: zipUrl,
      toFile: zipPath,
      progress: (res) => {
        const mbDownloaded = (res.bytesWritten / (1024 * 1024)).toFixed(2)
        if (onProgress && res.contentLength) {
          const mbTotal = (res.contentLength / (1024 * 1024)).toFixed(2)
          const percentage = Math.floor((res.bytesWritten / res.contentLength) * 100)
          console.log(`[OfflineMap] Download progress: ${mbDownloaded} MB / ${mbTotal} MB (${percentage}%)`)
          onProgress({
            downloadedBytes: res.bytesWritten,
            totalBytes: res.contentLength,
            percentage,
            regionId,
          })
        } else {
          console.log(`[OfflineMap] Downloaded: ${mbDownloaded} MB`)
        }
      },
      progressDivider: 1,
    }).promise

    console.log(`[OfflineMap] Download completed. HTTP status: ${result.statusCode}`)

    if (result.statusCode !== 200) {
      console.error(`[OfflineMap] Failed to download ZIP. Status: ${result.statusCode}`)
      return {
        success: false,
        regionId,
        error: `Failed to download ZIP file: HTTP ${result.statusCode}`,
      }
    }

    if (signal?.aborted) {
      await RNFS.unlink(zipPath) // Clean up ZIP file
      return {
        success: false,
        regionId,
        error: "Download was cancelled",
      }
    }

    // Extract the ZIP archive
    console.log(`[OfflineMap] Extracting ZIP archive...`)
    const targetPath = TILE_CONFIG.mapsDirectory

    try {
      await unzip(zipPath, targetPath)
      console.log(`[OfflineMap] ZIP extracted successfully to: ${targetPath}`)
    } catch (unzipError) {
      console.error(`[OfflineMap] Failed to extract ZIP:`, unzipError)
      await RNFS.unlink(zipPath) // Clean up ZIP file
      return {
        success: false,
        regionId,
        error: `Failed to extract ZIP: ${unzipError instanceof Error ? unzipError.message : 'Unknown error'}`,
      }
    }

    // Decompress GZIP-compressed PBF tiles
    console.log(`[OfflineMap] Decompressing GZIP tiles...`)
    const regionFolderPath = getRegionFolderPath(regionId)
    try {
      const result = await decompressGzipTiles(regionFolderPath, (current, total, fileName) => {
        console.log(`[OfflineMap] Decompressing ${current}/${total}: ${fileName}`)
        // Report decompression progress with percentage offset (100-200)
        // This allows the UI to distinguish between download and decompression phases
        if (onProgress) {
          onProgress({
            downloadedBytes: 0,
            totalBytes: 0,
            percentage: 100 + Math.floor((current / total) * 100), // 100-200 range for decompression
            regionId,
          })
        }
      })
      console.log(`[OfflineMap] Tiles decompressed: ${result.decompressed} files, ${result.skipped} already uncompressed, ${result.failed} failed`)
    } catch (decompressError) {
      console.warn(`[OfflineMap] Warning: Failed to decompress tiles:`, decompressError)
      // Continue anyway - tiles might already be uncompressed
    }

    // Clean up ZIP file after extraction
    try {
      await RNFS.unlink(zipPath)
      console.log(`[OfflineMap] Cleaned up ZIP file`)
    } catch (cleanupError) {
      console.warn(`[OfflineMap] Warning: Failed to delete ZIP file:`, cleanupError)
    }

    // Verify extraction - check if tiles exist
    const folderExists = await RNFS.exists(regionFolderPath)

    if (!folderExists) {
      console.error(`[OfflineMap] Expected folder not found after extraction: ${regionFolderPath}`)
      return {
        success: false,
        regionId,
        error: "ZIP extraction did not create expected folder structure",
      }
    }

    console.log(`[OfflineMap] Verified tiles folder exists: ${regionFolderPath}`)

    return {
      success: true,
      regionId,
    }
  } catch (error) {
    // Clean up partial download
    const zipExists = await RNFS.exists(zipPath)
    if (zipExists) {
      try {
        await RNFS.unlink(zipPath)
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }

    throw error
  }
}

/**
 * Download individual tiles (fallback method)
 * WARNING: This is extremely slow for full zoom ranges (thousands of HTTP requests)
 * Only use this for testing or limited tile sets
 */
async function downloadIndividualTiles(
  regionId: string,
  onProgress?: (progress: RegionDownloadProgress) => void,
  signal?: AbortSignal,
): Promise<RegionDownloadResult> {
  const region = MAP_REGIONS.find((r) => r.id === regionId)
  if (!region) {
    return { success: false, regionId, error: "Region not found" }
  }

  console.log(`[OfflineMap] Starting individual tile download for region: ${regionId}`)
  const regionFolderPath = getRegionFolderPath(regionId)

  // Create the region folder
  await RNFS.mkdir(regionFolderPath)
  console.log(`[OfflineMap] Created region folder: ${regionFolderPath}`)

  let downloadedCount = 0
  let failedCount = 0
  const startTime = Date.now()

  /**
   * Convert longitude/latitude to tile X/Y at given zoom
   */
  const lonToTileX = (lon: number, zoom: number): number => {
    return Math.floor((lon + 180) / 360 * Math.pow(2, zoom))
  }

  const latToTileY = (lat: number, zoom: number): number => {
    return Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))
  }

  // For each zoom level
  for (let z = TILE_CONFIG.minZoom; z <= TILE_CONFIG.maxZoom; z++) {
    if (signal?.aborted) {
      console.log(`[OfflineMap] Tile download cancelled at zoom ${z}`)
      return {
        success: false,
        regionId,
        error: "Download was cancelled",
      }
    }

    console.log(`[OfflineMap] Processing zoom level ${z}...`)
    const zoomPath = `${regionFolderPath}/${z}`
    const zoomExists = await RNFS.exists(zoomPath)

    if (!zoomExists) {
      await RNFS.mkdir(zoomPath)
    }

    // Calculate tile bounds for this region based on center and approximate area
    // Using a generous bounding box around the region center
    const centerTileX = lonToTileX(region.center.longitude, z)
    const centerTileY = latToTileY(region.center.latitude, z)

    // Define a reasonable tile range around the center
    // At zoom 5-14, we download tiles in a radius around the center
    // Increase radius for better coverage
    const tileRadius = Math.max(5, Math.pow(2, (14 - z) / 2)) // More tiles at higher zoom
    const minX = Math.max(0, centerTileX - tileRadius)
    const maxX = Math.min(Math.pow(2, z) - 1, centerTileX + tileRadius)
    const minY = Math.max(0, centerTileY - tileRadius)
    const maxY = Math.min(Math.pow(2, z) - 1, centerTileY + tileRadius)

    const totalTiles = (maxX - minX + 1) * (maxY - minY + 1)
    let currentTile = 0

    console.log(`[OfflineMap] Region: ${region.name}, Zoom ${z}: center tile[${centerTileX}, ${centerTileY}]`)
    console.log(`[OfflineMap] Downloading tiles x:[${minX}-${maxX}], y:[${minY}-${maxY}], total:${totalTiles}`)

    // Download tiles within the calculated bounds
    for (let x = minX; x <= maxX; x++) {
      const tilePath = `${zoomPath}/${x}`
      const xFolderExists = await RNFS.exists(tilePath)
      if (!xFolderExists) {
        await RNFS.mkdir(tilePath)
      }

      for (let y = minY; y <= maxY; y++) {
        if (signal?.aborted) {
          return {
            success: false,
            regionId,
            error: "Download was cancelled",
          }
        }

        const tileUrl = `${TILE_CONFIG.baseUrl}/${regionId}/${z}/${x}/${y}.pbf`
        const tileFilePath = `${tilePath}/${y}.pbf`

        try {
          const result = await RNFS.downloadFile({
            fromUrl: tileUrl,
            toFile: tileFilePath,
          }).promise

          if (result.statusCode === 200) {
            downloadedCount++
            if (downloadedCount % 10 === 0) {
              console.log(`[OfflineMap] Downloaded ${downloadedCount} tiles so far...`)
            }
          } else if (result.statusCode === 404) {
            // Tile doesn't exist, skip it silently
            failedCount++
          } else {
            console.warn(`[OfflineMap] Failed to download tile ${z}/${x}/${y}: HTTP ${result.statusCode}`)
            failedCount++
          }
        } catch (err) {
          console.warn(`[OfflineMap] Error downloading tile ${z}/${x}/${y}:`, err)
          failedCount++
        }

        // Report progress
        currentTile++
        if (onProgress && currentTile % 5 === 0) {
          const percentage = Math.floor((currentTile / totalTiles) * 100)
          onProgress({
            downloadedBytes: currentTile * 1024, // Approximate
            totalBytes: totalTiles * 1024,
            percentage,
            regionId,
          })
        }
      }
    }
  }

  const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`[OfflineMap] Tile download completed: ${downloadedCount} tiles, ${failedCount} failed, took ${elapsedSeconds}s`)

  if (downloadedCount > 0) {
    // Write style JSON after tiles are downloaded
    console.log(`[OfflineMap] Writing style JSON...`)
    await writeStyleJson(regionId)
    return {
      success: true,
      regionId,
    }
  }

  return {
    success: false,
    regionId,
    error: "Failed to download any tiles. Please ensure tiles are available on the server.",
  }
}

/**
 * Download multiple regions
 */
export async function downloadMultipleRegions(
  regionIds: string[],
  onProgress?: (progress: RegionDownloadProgress) => void,
  signal?: AbortSignal,
): Promise<RegionDownloadResult[]> {
  const results: RegionDownloadResult[] = []

  for (const regionId of regionIds) {
    if (signal?.aborted) {
      results.push({
        success: false,
        regionId,
        error: "Download was cancelled",
      })
      break
    }

    const result = await downloadRegion(regionId, onProgress, signal)
    results.push(result)
  }

  return results
}

/**
 * Write a style.json file for MapLibre for a specific region
 * This references the local vector tiles in {z}/{x}/{y}.pbf format
 *
 * Uses the Indonesia Offline Light style with OpenMapTiles-compatible layer names
 */
async function writeStyleJson(regionId: string): Promise<void> {
  const region = MAP_REGIONS.find((r) => r.id === regionId)
  if (!region) return

  const tileUrlTemplate = getTileUrlTemplate(regionId)

  // Indonesia Offline Light style
  // Uses "openmaptiles" as the source name (standard OpenMapTiles format)
  const styleContent = {
    version: 8,
    name: `Indonesia Offline Light - ${region.name}`,
    center: [region.center.longitude, region.center.latitude],
    zoom: region.zoom,
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
      // Water layer - simplified without filter
      {
        id: "water",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "water",
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
        paint: {
          "line-color": "#aadaff",
          "line-width": 1,
        },
      },
      // All roads
      {
        id: "road",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        paint: {
          "line-color": "#ffffff",
          "line-width": 0.5,
        },
      },
      // Boundary layer
      {
        id: "boundary",
        type: "line",
        source: "openmaptiles",
        "source-layer": "boundary",
        paint: {
          "line-color": "#888888",
          "line-width": 1,
        },
      },
      // Place labels
      {
        id: "place",
        type: "symbol",
        source: "openmaptiles",
        "source-layer": "place",
        layout: {
          "text-field": "{name}",
          "text-size": 12,
        },
        paint: {
          "text-color": "#333333",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
        },
      },
    ],
  }

  const stylePath = `${TILE_CONFIG.mapsDirectory}/style-${regionId}.json`
  await RNFS.writeFile(stylePath, JSON.stringify(styleContent, null, 2), "utf8")
}

/**
 * Delete a specific region's map tiles
 */
export async function deleteRegion(regionId: string): Promise<boolean> {
  try {
    const region = MAP_REGIONS.find((r) => r.id === regionId)
    if (!region) return false

    const folderPath = getRegionFolderPath(regionId)
    const exists = await RNFS.exists(folderPath)

    if (exists) {
      await RNFS.unlink(folderPath)
    }

    // Also delete the style JSON
    const stylePath = `${TILE_CONFIG.mapsDirectory}/style-${regionId}.json`
    const styleExists = await RNFS.exists(stylePath)
    if (styleExists) {
      await RNFS.unlink(stylePath)
    }

    return true
  } catch (error) {
    console.error("Error deleting region:", error)
    return false
  }
}

/**
 * Delete all offline map data
 */
export async function deleteAllMapData(): Promise<boolean> {
  try {
    const mapsDirExists = await RNFS.exists(TILE_CONFIG.mapsDirectory)
    if (mapsDirExists) {
      await RNFS.unlink(TILE_CONFIG.mapsDirectory)
    }
    return true
  } catch (error) {
    console.error("Error deleting all map data:", error)
    return false
  }
}

/**
 * Get storage size of downloaded region tiles
 */
export async function getRegionStorageSize(regionId?: string): Promise<number> {
  try {
    const mapsDirExists = await RNFS.exists(TILE_CONFIG.mapsDirectory)
    if (!mapsDirExists) {
      return 0
    }

    let totalSize = 0

    if (regionId) {
      const folderPath = getRegionFolderPath(regionId)
      const exists = await RNFS.exists(folderPath)
      if (exists) {
        // Recursively calculate folder size
        totalSize = await getFolderSize(folderPath)
      }
    } else {
      // Get size of all region folders
      for (const region of MAP_REGIONS) {
        const folderPath = getRegionFolderPath(region.id)
        const exists = await RNFS.exists(folderPath)
        if (exists) {
          totalSize += await getFolderSize(folderPath)
        }
      }
    }

    return totalSize
  } catch (error) {
    console.error("Error calculating storage size:", error)
    return 0
  }
}

/**
 * Recursively calculate folder size
 */
async function getFolderSize(folderPath: string): Promise<number> {
  let totalSize = 0

  try {
    const items = await RNFS.readDir(folderPath)

    for (const item of items) {
      if (item.isFile() && item.name.endsWith(".pbf")) {
        totalSize += item.size
      } else if (item.isDirectory()) {
        totalSize += await getFolderSize(item.path)
      }
    }
  } catch (error) {
    console.error(`Error getting size for ${folderPath}:`, error)
  }

  return totalSize
}

/**
 * Decompress GZIP-compressed PBF tiles recursively
 * MapLibre requires uncompressed vector tiles
 *
 * @param folderPath - Path to the region folder containing tiles
 * @param onProgress - Optional progress callback
 * @returns Promise that resolves when decompression is complete
 */
async function decompressGzipTiles(
  folderPath: string,
  onProgress?: (current: number, total: number, fileName: string) => void,
): Promise<{
  decompressed: number
  skipped: number
  failed: number
  totalBytesSaved: number
}> {
  let decompressed = 0
  let skipped = 0
  let failed = 0
  let totalBytesSaved = 0

  // First, count all .pbf files to track progress
  const allPbfFiles: string[] = []

  async function collectPbfFiles(path: string): Promise<void> {
    const items = await RNFS.readDir(path)
    for (const item of items) {
      if (item.isDirectory()) {
        await collectPbfFiles(item.path)
      } else if (item.isFile() && item.name.endsWith(".pbf")) {
        allPbfFiles.push(item.path)
      }
    }
  }

  await collectPbfFiles(folderPath)
  const totalFiles = allPbfFiles.length

  console.log(`[OfflineMap] Decompressing ${totalFiles} GZIP tiles...`)

  // Process each file
  for (let i = 0; i < allPbfFiles.length; i++) {
    const filePath = allPbfFiles[i]
    const fileName = filePath.split("/").pop() || filePath

    try {
      // Read file as base64
      const base64Data = await RNFS.readFile(filePath, "base64")

      // Check if it's GZIP compressed (magic number: 1f 8b)
      // In base64, GZIP starts with "H4sI"
      if (base64Data.substring(0, 4) === "H4sI") {
        // Convert base64 to Uint8Array
        const binaryString = atob(base64Data)
        const compressedData = new Uint8Array(binaryString.length)
        for (let j = 0; j < binaryString.length; j++) {
          compressedData[j] = binaryString.charCodeAt(j)
        }

        // Decompress using pako
        const decompressedData = pako.ungzip(compressedData)

        // Convert back to base64 and write
        const decompressedBase64 = btoa(String.fromCharCode(...decompressedData))
        await RNFS.writeFile(filePath, decompressedBase64, "base64")

        decompressed++
        totalBytesSaved += compressedData.length - decompressedData.length

        // Log progress every 100 files
        if (decompressed % 100 === 0) {
          console.log(`[OfflineMap] Decompressed ${depressed}/${totalFiles} tiles...`)
        }
      } else {
        skipped++
      }

      // Report progress
      if (onProgress) {
        onProgress(i + 1, totalFiles, fileName)
      }
    } catch (error) {
      console.warn(`[OfflineMap] Failed to decompress ${fileName}:`, error)
      failed++
    }
  }

  console.log(`[OfflineMap] Decompression complete: ${decompressed} decompressed, ${skipped} skipped, ${failed} failed`)
  console.log(`[OfflineMap] Space saved: ${(totalBytesSaved / 1024 / 1024).toFixed(2)} MB`)

  return { decompressed, skipped, failed, totalBytesSaved }
}
