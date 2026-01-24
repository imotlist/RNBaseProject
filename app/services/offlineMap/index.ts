/**
 * Offline Map Module
 *
 * Provides mandatory offline vector map download and usage for MapLibre.
 * Supports region-based vector tiles in {z}/{x}/{y}.pbf format (Sumatera Utara, Jawa Timur, etc.)
 */

// Types
export type { MapRegion } from "./tileCheck"
export type { RegionDownloadProgress, RegionDownloadResult } from "./tileCheck"
export type { TileCoord, TileDebugInfo } from "./tileDebugger"

// Constants
export { MAP_REGIONS, TILE_CONFIG } from "./tileCheck"

// Region utilities
export {
  checkOfflineTilesReady,
  checkMapsDirectoryExists,
  checkRegionFileExists,
  checkAnyRegionFileExists,
  getDownloadedRegions,
  getRegionFilePath,
  getRegionFolderPath,
  getRegionFileUrl,
  getTileUrlTemplate,
  getLocalStyleUrl,
  getRegionSize,
  getTotalEstimatedSize,
} from "./tileCheck"

// Download functions
export {
  downloadRegion,
  downloadMultipleRegions,
  deleteRegion,
  deleteAllMapData,
  getRegionStorageSize,
  writeStyleJson,
} from "./downloadTiles"

// Debug utilities
export {
  inspectPbfFile,
  listRegionFiles,
  diagnoseTile,
  getMapsDeviceInfo,
  verifyTileStructure,
} from "./debugTiles"

// Tile debugger utilities
export {
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
} from "./tileDebugger"
