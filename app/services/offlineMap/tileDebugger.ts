/**
 * tileDebugger.ts
 *
 * Utilities for debugging tile loading issues.
 * Logs missing tiles and validates tile structure.
 */

import * as RNFS from "@dr.pogodin/react-native-fs"
import { TILE_CONFIG, MAP_REGIONS } from "./tileCheck"

// ============================================================================
// Types
// ============================================================================

export interface TileCoord {
  z: number
  x: number
  y: number
}

export interface TileDebugInfo {
  regionId: string
  folderPath: string
  zoomLevels: {
    z: number
    hasFolder: boolean
    xFolders: number
    sampleTiles: string[]
  }[]
  missingTiles: TileCoord[]
  totalTilesFound: number
}

// ============================================================================
// Tile Coordinate Conversion
// ============================================================================

/**
 * Convert longitude/latitude to tile coordinates at given zoom level
 */
export function lonLatToTile(lon: number, lat: number, zoom: number): TileCoord {
  const n = Math.pow(2, zoom)
  const x = Math.floor((lon + 180) / 360 * n)
  const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n)
  return { z: zoom, x, y }
}

/**
 * Convert tile coordinates to longitude/latitude of the tile's northwest corner
 */
export function tileToLonLat(x: number, y: number, zoom: number): { lon: number; lat: number } {
  const n = Math.pow(2, zoom)
  const lon = x / n * 360 - 180
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)))
  const lat = latRad * 180 / Math.PI
  return { lon, lat }
}

/**
 * Get tile path for checking if tile exists
 */
export function getTilePath(regionId: string, z: number, x: number, y: number): string {
  return `${TILE_CONFIG.mapsDirectory}/${regionId}/${z}/${x}/${y}.pbf`
}

/**
 * Get all tiles in a viewport (center + surrounding tiles)
 */
export function getViewportTiles(
  centerLon: number,
  centerLat: number,
  zoom: number,
  radius: number = 2
): TileCoord[] {
  const center = lonLatToTile(centerLon, centerLat, zoom)
  const tiles: TileCoord[] = []

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      tiles.push({
        z: zoom,
        x: center.x + dx,
        y: center.y + dy,
      })
    }
  }

  return tiles
}

// ============================================================================
// Tile Validation Functions
// ============================================================================

/**
 * Check if a specific tile exists
 */
export async function checkTileExists(regionId: string, z: number, x: number, y: number): Promise<boolean> {
  const tilePath = getTilePath(regionId, z, x, y)
  return await RNFS.exists(tilePath)
}

/**
 * Validate a specific tile and log details
 */
export async function validateTile(regionId: string, z: number, x: number, y: number): Promise<{
  exists: boolean
  path: string
  size?: number
  error?: string
}> {
  const tilePath = getTilePath(regionId, z, x, y)

  try {
    const exists = await RNFS.exists(tilePath)

    if (!exists) {
      return {
        exists: false,
        path: tilePath,
        error: "File not found",
      }
    }

    // Get file size
    const stat = await RNFS.stat(tilePath)
    return {
      exists: true,
      path: tilePath,
      size: stat.size,
    }
  } catch (error) {
    return {
      exists: false,
      path: tilePath,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Check all tiles in a viewport and log missing ones
 */
export async function checkViewportTiles(
  regionId: string,
  centerLon: number,
  centerLat: number,
  zoom: number,
  radius: number = 2
): Promise<{
  checked: number
  exists: number
  missing: TileCoord[]
  details: Array<TileCoord & { exists: boolean; size?: number }>
}> {
  const tiles = getViewportTiles(centerLon, centerLat, zoom, radius)
  const missing: TileCoord[] = []
  const details: Array<TileCoord & { exists: boolean; size?: number }> = []
  let existsCount = 0

  for (const tile of tiles) {
    const result = await validateTile(regionId, tile.z, tile.x, tile.y)

    if (result.exists) {
      existsCount++
      details.push({ ...tile, exists: true, size: result.size })
    } else {
      missing.push(tile)
      details.push({ ...tile, exists: false })
      console.error(`[TileDebugger] MISSING: ${tile.z}/${tile.x}/${tile.y}.pbf - ${result.path}`)
    }
  }

  return {
    checked: tiles.length,
    exists: existsCount,
    missing,
    details,
  }
}

/**
 * Scan a region's tile structure and return detailed info
 */
export async function scanRegionStructure(regionId: string): Promise<TileDebugInfo> {
  const region = MAP_REGIONS.find((r) => r.id === regionId)
  if (!region) {
    throw new Error(`Region ${regionId} not found`)
  }

  const folderPath = `${TILE_CONFIG.mapsDirectory}/${region.folderName}`
  const zoomLevels: TileDebugInfo["zoomLevels"] = []
  let totalTilesFound = 0

  console.log(`[TileDebugger] Scanning region structure: ${folderPath}`)

  for (let z = TILE_CONFIG.minZoom; z <= TILE_CONFIG.maxZoom; z++) {
    const zoomPath = `${folderPath}/${z}`
    const hasFolder = await RNFS.exists(zoomPath)

    if (!hasFolder) {
      console.warn(`[TileDebugger] Zoom ${z}: folder missing`)
      zoomLevels.push({
        z,
        hasFolder: false,
        xFolders: 0,
        sampleTiles: [],
      })
      continue
    }

    // Count x folders
    let xFolders = 0
    let sampleTiles: string[] = []
    try {
      const items = await RNFS.readDir(zoomPath)
      const directories = items.filter(item => item.isDirectory && !isNaN(parseInt(item.name)))
      xFolders = directories.length

      // Sample a few x folders to check for tiles
      for (const dir of directories.slice(0, 3)) {
        const x = parseInt(dir.name)
        const xPath = `${zoomPath}/${x}`
        try {
          const yFiles = await RNFS.readDir(xPath)
          const pbfFiles = yFiles.filter(f => f.isFile && f.name.endsWith('.pbf'))
          sampleTiles.push(`z${z}/x${x}: ${pbfFiles.length} tiles`)
          totalTilesFound += pbfFiles.length
        } catch (e) {
          sampleTiles.push(`z${z}/x${x}: error reading`)
        }
      }
    } catch (e) {
      console.warn(`[TileDebugger] Error reading zoom ${z}:`, e)
    }

    console.log(`[TileDebugger] Zoom ${z}: ${xFolders} x-folders, sample: ${sampleTiles.join(', ')}`)
    zoomLevels.push({
      z,
      hasFolder: true,
      xFolders,
      sampleTiles,
    })
  }

  return {
    regionId,
    folderPath,
    zoomLevels,
    missingTiles: [], // Would need to calculate expected tiles
    totalTilesFound,
  }
}

/**
 * Print a summary of tile issues for a region
 */
export async function printTileSummary(regionId: string, centerLon: number, centerLat: number, zoom: number) {
  console.log("=" .repeat(60))
  console.log(`[TileDebugger] Tile Summary for Region: ${regionId}`)
  console.log("=" .repeat(60))

  // Scan structure
  const structure = await scanRegionStructure(regionId)
  console.log(`[TileDebugger] Total tiles found (sample): ${structure.totalTilesFound}`)
  console.log(`[TileDebugger] Zoom levels:`)
  structure.zoomLevels.forEach(zl => {
    console.log(`  - Zoom ${zl.z}: ${zl.hasFolder ? 'OK' : 'MISSING'} (${zl.xFolders} x-folders)`)
  })

  // Check viewport
  console.log(`\n[TileDebugger] Checking viewport at ${centerLon.toFixed(4)}, ${centerLat.toFixed(4)}, zoom ${zoom}:`)
  const viewport = await checkViewportTiles(regionId, centerLon, centerLat, zoom, 2)

  console.log(`[TileDebugger] Viewport check: ${viewport.exists}/${viewport.checked} tiles found`)

  if (viewport.missing.length > 0) {
    console.error(`[TileDebugger] Missing tiles in viewport:`)
    viewport.missing.forEach(t => {
      console.error(`  - ${t.z}/${t.x}/${t.y}.pbf`)
    })
  }

  console.log("=" .repeat(60))

  return {
    structure,
    viewport,
  }
}

/**
 * Debug helper: log all info for a given location and zoom
 */
export async function debugLocation(
  regionId: string,
  lon: number,
  lat: number,
  zoom: number
) {
  const tile = lonLatToTile(lon, lat, zoom)
  console.log(`[TileDebugger] Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`)
  console.log(`[TileDebugger] Expected tile at zoom ${zoom}: ${tile.x}, ${tile.y}`)

  const result = await validateTile(regionId, tile.z, tile.x, tile.y)

  if (result.exists) {
    console.log(`[TileDebugger] Tile EXISTS: ${result.path}`)
    console.log(`[TileDebugger] File size: ${result.size} bytes`)

    // Check surrounding tiles
    console.log(`[TileDebugger] Checking surrounding tiles...`)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue
        const exists = await checkTileExists(regionId, tile.z, tile.x + dx, tile.y + dy)
        const status = exists ? "✓" : "✗"
        console.log(`  [TileDebugger] ${status} ${tile.z}/${tile.x + dx}/${tile.y + dy}.pbf`)
      }
    }
  } else {
    console.error(`[TileDebugger] Tile MISSING: ${result.path}`)
    console.error(`[TileDebugger] Error: ${result.error}`)

    // List what tiles actually exist at this zoom level
    const region = MAP_REGIONS.find((r) => r.id === regionId)
    if (region) {
      const zoomPath = `${TILE_CONFIG.mapsDirectory}/${region.folderName}/${tile.z}`
      const zoomExists = await RNFS.exists(zoomPath)

      if (zoomExists) {
        console.log(`[TileDebugger] Zoom ${tile.z} folder exists. Listing nearby x folders...`)
        try {
          const items = await RNFS.readDir(zoomPath)
          const xFolders = items
            .filter(item => item.isDirectory && !isNaN(parseInt(item.name)))
            .map(item => parseInt(item.name))
            .sort((a, b) => a - b)

          // Show x folders near the expected x
          const nearbyX = xFolders.filter(x => Math.abs(x - tile.x) <= 5)
          if (nearbyX.length > 0) {
            console.log(`[TileDebugger] Nearby x folders: ${nearbyX.join(', ')}`)
          } else {
            console.log(`[TileDebugger] No x folders found near expected x=${tile.x}`)
            console.log(`[TileDebugger] All x folders at this zoom: ${xFolders.slice(0, 10).join(', ')}${xFolders.length > 10 ? '...' : ''}`)
          }
        } catch (e) {
          console.error(`[TileDebugger] Error listing x folders:`, e)
        }
      } else {
        console.error(`[TileDebugger] Zoom ${tile.z} folder does not exist: ${zoomPath}`)
      }
    }
  }

  return result
}

export default {
  lonLatToTile,
  tileToLonLat,
  getTilePath,
  getViewportTiles,
  checkTileExists,
  validateTile,
  checkViewportTiles,
  scanRegionStructure,
  printTileSummary,
  debugLocation,
}
