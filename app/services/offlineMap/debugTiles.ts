/**
 * debugTiles.ts
 *
 * Utilities for debugging and inspecting vector tile files
 */

import * as RNFS from "@dr.pogodin/react-native-fs"
import { TILE_CONFIG, MAP_REGIONS } from "./tileCheck"

/**
 * Show the exact device storage path for maps
 */
export function getMapsDeviceInfo(): {
  mapsDirectory: string
  documentDirectory: string
  cacheDirectory: string
  expectedPath: string
} {
  return {
    mapsDirectory: TILE_CONFIG.mapsDirectory,
    documentDirectory: RNFS.DocumentDirectoryPath,
    cacheDirectory: RNFS.CachesDirectoryPath,
    expectedPath: `${RNFS.DocumentDirectoryPath}/maps/sumut/5/26/16.pbf`,
  }
}

/**
 * Verify and display the entire tile storage structure as a tree
 * This checks if tiles were downloaded and extracted successfully
 */
export async function verifyTileStructure(): Promise<{
  success: boolean
  summary: string
  tree: string
  details: {
    mapsDirectoryExists: boolean
    regions: Array<{
      id: string
      name: string
      exists: boolean
      zoomLevels: Array<{
        level: number
        exists: boolean
        tileFolders: number
        sampleTilePath?: string
        sampleTileSize?: number
      }>
    }>
  }
}> {
  const lines: string[] = []
  const details = {
    mapsDirectoryExists: false,
    regions: [] as Array<{
      id: string
      name: string
      exists: boolean
      zoomLevels: Array<{
        level: number
        exists: boolean
        tileFolders: number
        sampleTilePath?: string
        sampleTileSize?: number
      }>
    }>,
  }

  lines.push("╔═══════════════════════════════════════════════════════════════╗")
  lines.push("║           OFFLINE MAP TILE STRUCTURE VERIFICATION            ║")
  lines.push("╚═══════════════════════════════════════════════════════════════╝")
  lines.push("")

  // Check maps directory
  const mapsDirExists = await RNFS.exists(TILE_CONFIG.mapsDirectory)
  details.mapsDirectoryExists = mapsDirExists

  lines.push(`📁 Device Storage: ${RNFS.DocumentDirectoryPath}`)
  lines.push(`📁 Maps Directory: ${TILE_CONFIG.mapsDirectory}`)
  lines.push(`   Status: ${mapsDirExists ? "✅ EXISTS" : "❌ NOT FOUND"}`)
  lines.push("")

  if (!mapsDirExists) {
    lines.push("⚠️  Maps directory does not exist. No tiles have been downloaded.")
    return {
      success: false,
      summary: "Maps directory not found",
      tree: lines.join("\n"),
      details,
    }
  }

  // List contents of maps directory
  let mapsDirContents: string[] = []
  try {
    const items = await RNFS.readDir(TILE_CONFIG.mapsDirectory)
    mapsDirContents = items.map((i) => `${i.isDirectory() ? "📁" : "📄"} ${i.name}`)
  } catch (e) {
    lines.push("⚠️  Could not read maps directory contents")
  }

  if (mapsDirContents.length > 0) {
    lines.push("Contents:")
    mapsDirContents.forEach((item) => lines.push(`   ${item}`))
  } else {
    lines.push("   (empty)")
  }
  lines.push("")

  // Check each region
  let allRegionsExist = false
  let totalTiles = 0

  for (const region of MAP_REGIONS) {
    const regionPath = `${TILE_CONFIG.mapsDirectory}/${region.folderName}`
    const regionExists = await RNFS.exists(regionPath)

    const regionData = {
      id: region.id,
      name: region.name,
      exists: regionExists,
      zoomLevels: [] as Array<{
        level: number
        exists: boolean
        tileFolders: number
        sampleTilePath?: string
        sampleTileSize?: number
      }>,
    }
    details.regions.push(regionData)

    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    lines.push(`📍 Region: ${region.name} (${region.id})`)
    lines.push(`   Path: ${regionPath}`)
    lines.push(`   Status: ${regionExists ? "✅ EXISTS" : "❌ NOT FOUND"}`)

    if (regionExists) {
      // List zoom levels
      const zoomItems = await RNFS.readDir(regionPath)
      const zoomDirs = zoomItems.filter((i) => i.isDirectory()).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))

      lines.push(`   Zoom Levels: ${zoomDirs.length} found`)

      for (const zoomDir of zoomDirs) {
        const zoomLevel = parseInt(zoomDir.name)
        if (isNaN(zoomLevel)) continue

        const zoomPath = `${regionPath}/${zoomDir.name}`
        const xItems = await RNFS.readDir(zoomPath)
        const xFolders = xItems.filter((i) => i.isDirectory())

        // Find a sample tile
        let sampleTilePath: string | undefined
        let sampleTileSize: number | undefined

        for (const xFolder of xFolders) {
          const xPath = `${zoomPath}/${xFolder.name}`
          try {
            const tiles = await RNFS.readDir(xPath)
            const pbfTiles = tiles.filter((t) => t.isFile() && t.name.endsWith(".pbf"))
            if (pbfTiles.length > 0 && !sampleTilePath) {
              sampleTilePath = `${zoomDir.name}/${xFolder.name}/${pbfTiles[0].name}`
              sampleTileSize = pbfTiles[0].size
              totalTiles++
            }
            totalTiles += pbfTiles.length
          } catch (e) {
            // Skip inaccessible folders
          }
        }

        regionData.zoomLevels.push({
          level: zoomLevel,
          exists: true,
          tileFolders: xFolders.length,
          sampleTilePath,
          sampleTileSize,
        })
      }

      // Show zoom level tree
      lines.push("")
      lines.push(`   ${region.folderName}/`)
      for (const zoomData of regionData.zoomLevels) {
        const z = zoomData.level
        lines.push(`   ├── ${z}/ (${zoomData.tileFolders} tile folders)`)

        // Show sample tiles for this zoom (limit to 3)
        let sampleCount = 0
        for (const zoomDir of zoomDirs) {
          if (parseInt(zoomDir.name) !== z) continue

          const xItems = await RNFS.readDir(`${regionPath}/${zoomDir.name}`)
          const xFolders = xItems.filter((i) => i.isDirectory()).slice(0, 3)

          for (const xFolder of xFolders) {
            const indent = sampleCount === xFolders.length - 1 && sampleCount < 2 ? "│   " : "    "
            lines.push(`   ${indent}└── ${xFolder.name}/`)

            try {
              const tiles = await RNFS.readDir(`${regionPath}/${zoomDir.name}/${xFolder.name}`)
              const pbfTiles = tiles.filter((t) => t.isFile() && t.name.endsWith(".pbf")).slice(0, 3)

              for (let i = 0; i < pbfTiles.length; i++) {
                const isLast = i === pbfTiles.length - 1
                const prefix = isLast ? "        " : "        │"
                lines.push(`   ${prefix} ${isLast ? "└──" : "├──"} ${pbfTiles[i].name} (${pbfTiles[i].size} bytes)`)
              }

              if (tiles.filter((t) => t.isFile() && t.name.endsWith(".pbf")).length > 3) {
                lines.push(`            ... and ${tiles.filter((t) => t.isFile() && t.name.endsWith(".pbf")).length - 3} more`)
              }
            } catch (e) {
              // Skip
            }

            sampleCount++
            if (sampleCount >= 2) break
          }
          if (sampleCount >= 2) break
        }
      }

      if (regionData.zoomLevels.length > 0) {
        allRegionsExist = true
      }
    }

    lines.push("")
  }

  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  lines.push("📊 SUMMARY")
  lines.push(`   Maps Directory: ${details.mapsDirectoryExists ? "✅" : "❌"}`)
  lines.push(`   Regions Found: ${details.regions.filter((r) => r.exists).length}/${MAP_REGIONS.length}`)
  lines.push(`   Total Tiles: ${totalTiles}`)
  lines.push(`   Overall Status: ${allRegionsExist ? "✅ TILES DOWNLOADED" : "⚠️  INCOMPLETE"}`)

  return {
    success: allRegionsExist,
    summary: allRegionsExist
      ? `Tiles verified: ${totalTiles} tiles found across ${details.regions.filter((r) => r.exists).length} regions`
      : "Tiles not fully downloaded",
    tree: lines.join("\n"),
    details,
  }
}

/**
 * Read a PBF file as base64 to check if it's valid
 */
export async function inspectPbfFile(regionId: string, z: number, x: number, y: number): Promise<{
  exists: boolean
  size: number
  headerInfo: string
}> {
  const region = MAP_REGIONS.find((r) => r.id === regionId)
  if (!region) {
    return { exists: false, size: 0, headerInfo: "Region not found" }
  }

  const tilePath = `${TILE_CONFIG.mapsDirectory}/${region.folderName}/${z}/${x}/${y}.pbf`

  try {
    const exists = await RNFS.exists(tilePath)
    if (!exists) {
      return { exists: false, size: 0, headerInfo: "File does not exist" }
    }

    const stat = await RNFS.stat(tilePath)
    const size = stat.size

    // Read first 100 bytes as hex for inspection
    const data = await RNFS.read(tilePath, 100, 0, "base64")

    // PBF files start with magic bytes
    // Valid vector tiles should have specific protobuf structure
    let headerInfo = `Size: ${size} bytes\n`
    headerInfo += `First 20 bytes (base64): ${data.substring(0, 20)}\n`

    // Check if it looks like a protobuf file
    // PBF files typically start with small field numbers (1-15)
    const firstByte = data.charCodeAt(0)
    headerInfo += `First byte value: ${firstByte}\n`

    if (size < 10) {
      headerInfo += "WARNING: File too small to be a valid PBF tile"
    } else if (size > 1000000) {
      headerInfo += "WARNING: File very large (>1MB), might not be a vector tile"
    } else {
      headerInfo += "File size looks reasonable for a vector tile"
    }

    console.log(`[OfflineMap] Tile inspection:\n${headerInfo}`)

    return { exists: true, size, headerInfo }
  } catch (error) {
    console.error(`[OfflineMap] Error inspecting tile:`, error)
    return {
      exists: false,
      size: 0,
      headerInfo: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

/**
 * List all files in a region's folder structure
 */
export async function listRegionFiles(regionId: string): Promise<{
  folders: string[]
  totalFiles: number
  totalSize: number
  sampleFiles: string[]
}> {
  const region = MAP_REGIONS.find((r) => r.id === regionId)
  if (!region) {
    return { folders: [], totalFiles: 0, totalSize: 0, sampleFiles: [] }
  }

  const regionPath = `${TILE_CONFIG.mapsDirectory}/${region.folderName}`
  const result = {
    folders: [] as string[],
    totalFiles: 0,
    totalSize: 0,
    sampleFiles: [] as string[],
  }

  try {
    const exists = await RNFS.exists(regionPath)
    if (!exists) {
      console.log(`[OfflineMap] Region folder does not exist: ${regionPath}`)
      return result
    }

    // List zoom level folders
    const items = await RNFS.readDir(regionPath)

    for (const item of items) {
      if (item.isDirectory()) {
        result.folders.push(item.name)

        // Sample some files from this zoom level
        const zoomPath = `${regionPath}/${item.name}`
        try {
          const xFolders = await RNFS.readDir(zoomPath)
          for (const xFolder of xFolders) {
            if (xFolder.isDirectory()) {
              const xPath = `${zoomPath}/${xFolder.name}`
              try {
                const tiles = await RNFS.readDir(xPath)
                for (const tile of tiles) {
                  if (tile.isFile() && tile.name.endsWith(".pbf")) {
                    result.totalFiles++
                    result.totalSize += tile.size
                    if (result.sampleFiles.length < 5) {
                      result.sampleFiles.push(`${item.name}/${xFolder.name}/${tile.name} (${tile.size} bytes)`)
                    }
                  }
                }
              } catch (e) {
                // Ignore errors reading individual x folders
              }
            }
          }
        } catch (e) {
          // Ignore errors reading individual zoom folders
        }
      }
    }

    console.log(`[OfflineMap] Region ${regionId} structure:`)
    console.log(`  Zoom folders: ${result.folders.join(", ")}`)
    console.log(`  Total PBF files: ${result.totalFiles}`)
    console.log(`  Total size: ${(result.totalSize / 1024 / 1024).toFixed(2)} MB`)
    if (result.sampleFiles.length > 0) {
      console.log(`  Sample files: ${result.sampleFiles.slice(0, 3).join(", ")}`)
    }

  } catch (error) {
    console.error(`[OfflineMap] Error listing region files:`, error)
  }

  return result
}

/**
 * Test a specific tile and return diagnostic info
 */
export async function diagnoseTile(regionId: string): Promise<{
  success: boolean
  message: string
  details: Record<string, unknown>
}> {
  const region = MAP_REGIONS.find((r) => r.id === regionId)
  if (!region) {
    return { success: false, message: "Region not found", details: {} }
  }

  const details: Record<string, unknown> = {}

  try {
    // Check region folder exists
    const regionPath = `${TILE_CONFIG.mapsDirectory}/${region.folderName}`
    const regionExists = await RNFS.exists(regionPath)
    details.regionPath = regionPath
    details.regionExists = regionExists

    if (!regionExists) {
      return { success: false, message: "Region folder does not exist", details }
    }

    // Find a sample tile (try different zoom levels)
    for (const z of [5, 6, 7, 8, 9, 10]) {
      const zoomPath = `${regionPath}/${z}`
      const zoomExists = await RNFS.exists(zoomPath)

      if (zoomExists) {
        details.foundZoom = z

        // Get first x folder
        const xItems = await RNFS.readDir(zoomPath)
        const xFolder = xItems.find((i) => i.isDirectory())
        if (xFolder) {
          details.foundX = xFolder.name
          const xPath = `${zoomPath}/${xFolder.name}`

          // Get first tile
          const tiles = await RNFS.readDir(xPath)
          const tile = tiles.find((t) => t.isFile() && t.name.endsWith(".pbf"))
          if (tile) {
            details.foundTile = `${z}/${xFolder.name}/${tile.name}`
            details.tileSize = tile.size

            // Read and inspect the tile
            const inspection = await inspectPbfFile(regionId, z, parseInt(xFolder.name), parseInt(tile.name.replace(".pbf", "")))
            details.inspection = inspection

            return {
              success: true,
              message: `Found tile: ${details.foundTile}, size: ${tile.size} bytes`,
              details,
            }
          }
        }
      }
    }

    // List all files if we couldn't find a tile
    const fileListing = await listRegionFiles(regionId)
    details.fileListing = fileListing

    return {
      success: false,
      message: fileListing.totalFiles > 0
        ? `Found ${fileListing.totalFiles} tiles but couldn't read sample`
        : "No PBF tiles found in region folder",
      details,
    }

  } catch (error) {
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      details,
    }
  }
}
