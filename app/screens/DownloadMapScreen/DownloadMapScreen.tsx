/**
 * DownloadMapScreen.tsx
 *
 * Mandatory screen for downloading offline map data.
 * User must select a region (Sumatera Utara, Jawa Timur, etc.)
 * App cannot proceed without at least one region downloaded.
 */

import React, { useState, useCallback, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, BackHandler, ScrollView, Pressable, StatusBar, Linking, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { checkOfflineTilesReady, MAP_REGIONS, downloadRegion, deleteAllMapData, getRegionSize, getTotalEstimatedSize, checkRegionFileExists, verifyTileStructure } from "@/services/offlineMap"
import { writeStyleJson } from "@/services/offlineMap/downloadTiles"
import type { RegionDownloadProgress } from "@/services/offlineMap"
import { useAppTheme } from "@/theme/context"
import { IconPack } from "@/components/ui"
import { scale } from "@/utils/responsive"
import { goBack } from "@/navigators/navigationUtilities"
import { usePermission } from "@/context/PermissionContext"
import * as DocumentPicker from "expo-document-picker"
import * as RNFS from "@dr.pogodin/react-native-fs"
import { unzip } from "react-native-zip-archive"
import { TILE_CONFIG, getRegionFolderPath } from "@/services/offlineMap/tileCheck"
import pako from "pako"

// ============================================================================
// Types
// ============================================================================

type ScreenState = "checking" | "select_region" | "downloading" | "uploading" | "decompressing" | "completed" | "error"
type UploadMode = "download" | "upload"

export type DownloadMapScreenProps = {
  onDownloadComplete?: () => void
}

// ============================================================================
// Component
// ============================================================================

export const DownloadMapScreen: React.FC<DownloadMapScreenProps> = ({ onDownloadComplete }) => {
  const { theme } = useAppTheme()
  const { colors } = theme
  const { requestPermission, openAppSettings, checkAndroidStorageAvailability } = usePermission()

  const [screenState, setScreenState] = useState<ScreenState>("checking")
  const [uploadMode, setUploadMode] = useState<"download" | "upload">("download")
  const [selectedRegionId, setSelectedRegionId] = useState<string>("sumut")
  const [downloadProgress, setDownloadProgress] = useState<RegionDownloadProgress>({
    downloadedBytes: 0,
    totalBytes: 0,
    percentage: 0,
    regionId: "",
  })
  const [decompressProgress, setDecompressProgress] = useState({ current: 0, total: 0, fileName: "" })
  const [downloadedRegions, setDownloadedRegions] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // Upload progress states
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 100,
    fileName: "",
    stage: "idle" as "idle" | "copying" | "extracting" | "verifying" | "complete"
  })

  /**
   * Check if tiles already exist on mount
   */
  useEffect(() => {
    let isMounted = true

    const checkExistingTiles = async () => {
      try {
        const downloaded: string[] = []

        for (const region of MAP_REGIONS) {
          if (!isMounted) return
          try {
            const exists = await checkRegionFileExists(region.id)
            if (exists) {
              downloaded.push(region.id)
            }
          } catch (e) {
            console.error(`Error checking region ${region.id}:`, e)
          }
        }

        if (!isMounted) return
        setDownloadedRegions(downloaded)

        const hasTiles = downloaded.length > 0
        if (hasTiles && onDownloadComplete) {
          onDownloadComplete()
        } else {
          setScreenState("select_region")
        }
      } catch (error) {
        console.error("Error checking tiles:", error)
        if (isMounted) {
          setScreenState("select_region")
        }
      }
    }

    checkExistingTiles()

    return () => {
      isMounted = false
    }
    // Only run once on mount - empty deps array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Handle hardware back button - prevent exit during download
   */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (screenState === "downloading") {
        return true // Prevent back button during download
      }
      return false
    })

    return () => backHandler.remove()
  }, [screenState])

  const handleStartDownload = useCallback(() => {
    Alert.alert(
      "Download Map Data",
      `Selected: ${MAP_REGIONS.find((r) => r.id === selectedRegionId)?.name}\n\nSize: ${getRegionSize(selectedRegionId)}\n\nDownload required to continue.`,
      [
        {
          text: "Download",
          onPress: startDownload,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false },
    )
  }, [selectedRegionId])

  const startDownload = useCallback(async () => {
    setScreenState("downloading")
    setErrorMessage(null)
    setDownloadProgress({
      downloadedBytes: 0,
      totalBytes: 0,
      percentage: 0,
      regionId: selectedRegionId,
    })
    setDecompressProgress({ current: 0, total: 0, fileName: "" })

    try {
      const result = await downloadRegion(selectedRegionId, (progress) => {
        // Update progress based on percentage to detect phase
        if (progress.percentage > 100) {
          // Decompression phase (100-200%)
          const decompPercentage = progress.percentage - 100
          const decompCurrent = Math.floor((progress.totalBytes * decompPercentage) / 100)
          setDecompressProgress({
            current: decompCurrent,
            total: progress.totalBytes,
            fileName: "Processing tile...",
          })
          // Make sure we show decompressing state
          if (screenState !== "decompressing") {
            setScreenState("decompressing")
          }
        } else {
          // Download phase (0-100%)
          setDownloadProgress(progress)
        }
      })

      if (result.success) {
        setDownloadedRegions((prev) => [...prev, selectedRegionId])
        setScreenState("completed")

        // Auto-advance after a short delay, or go back to selection if no callback
        setTimeout(() => {
          if (onDownloadComplete) {
            onDownloadComplete()
          } else {
            // No callback provided - go back to selection screen
            setScreenState("select_region")
          }
        }, 1500)
      } else {
        setScreenState("error")
        setErrorMessage(result.error || "Download failed. Please try again.")
      }
    } catch (error) {
      console.error("Download error:", error)
      setScreenState("error")
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred during download",
      )
    }
  }, [selectedRegionId, onDownloadComplete])

  const handleRetry = useCallback(() => {
    setScreenState("select_region")
    setErrorMessage(null)
  }, [])

  const handleDeleteAndRetry = useCallback(async () => {
    Alert.alert(
      "Delete and Re-download",
      "This will delete all map data and you'll need to download again. Continue?",
      [
        {
          text: "Yes",
          onPress: async () => {
            await deleteAllMapData()
            setDownloadedRegions([])
            startDownload()
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ],
    )
  }, [startDownload])

  const handleClearMapData = useCallback(async () => {
    Alert.alert(
      "Clear Map Data",
      "This will delete all downloaded offline maps. You'll need to download a region again to use the app.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAllMapData()
              setDownloadedRegions([])
              // Show confirmation
              Alert.alert(
                "Data Cleared",
                "All offline map data has been deleted.",
                [
                  {
                    text: "OK",
                  },
                ],
              )
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to clear map data. Please try again.",
                [
                  {
                    text: "OK",
                  },
                ],
              )
            }
          },
        },
      ],
    )
  }, [])

  const handleDebugTiles = useCallback(async () => {
    console.log("[OfflineMap] ===== VERIFYING TILE STRUCTURE =====")

    // Verify the entire tile structure
    const verification = await verifyTileStructure()

    // Log the full tree to console
    console.log(verification.tree)

    // Show summary alert
    Alert.alert(
      verification.success ? "✅ Tile Verification" : "⚠️ Tile Verification",
      verification.summary,
      [
        {
          text: "OK",
        },
      ],
    )
  }, [])

  /**
   * Handle manual file upload from device
   */
  const handlePickAndUploadFile = useCallback(async () => {
    try {
      // Check if storage access is available
      // On Android 13+, this will return true (document picker works without permission)
      const storageAvailable = await checkAndroidStorageAvailability()

      if (Platform.OS === "android" && !storageAvailable) {
        // Storage permission not granted on Android < 13
        // Show alert with option to request or continue anyway
        Alert.alert(
          "Storage Permission",
          "Storage permission is recommended for accessing map files on your device. You can try opening the file picker, or grant permission in settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Try Anyway",
              onPress: () => openFilePicker(),
            },
            {
              text: "Open Settings",
              onPress: () => openAppSettings(),
            },
          ]
        )
        return
      }

      // Open file picker directly
      openFilePicker()
    } catch (error) {
      console.error("Error checking storage permission:", error)
      // Try anyway if check fails
      openFilePicker()
    }
  }, [checkAndroidStorageAvailability, openAppSettings])

  /**
   * Open the document picker to select a ZIP file
   */
  const openFilePicker = useCallback(async () => {
    try {
      // Pick a ZIP file using expo-document-picker
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/zip",
        copyToCacheDirectory: true,
      })

      if (result.canceled) {
        console.log("File picker cancelled")
        return
      }

      if (!result.assets || result.assets.length === 0) {
        return
      }

      const file = result.assets[0]
      const fileName = file.name || "map.zip"
      const fileUri = file.uri

      // Detect region from filename (sumut.zip or jatim.zip)
      const regionId = fileName.toLowerCase().includes("sumut") ? "sumut" :
                      fileName.toLowerCase().includes("jatim") ? "jatim" : null

      if (!regionId) {
        Alert.alert(
          "Invalid File",
          "File name must contain 'sumut' or 'jatim' (e.g., sumut.zip or jatim.zip)",
          [{ text: "OK" }]
        )
        return
      }

      // Confirm upload
      Alert.alert(
        "Upload Map File",
        `File: ${fileName}\nRegion: ${MAP_REGIONS.find(r => r.id === regionId)?.name}\n\nProceed with upload?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Upload",
            onPress: () => processUploadedFile(fileUri, regionId, fileName),
          },
        ]
      )
    } catch (error) {
      console.error("Error picking file:", error)
      Alert.alert(
        "Error",
        "Failed to pick file. Please try again.",
        [{ text: "OK" }]
      )
    }
  }, [])

  /**
   * Process the uploaded ZIP file
   */
  const processUploadedFile = useCallback(async (fileUri: string, regionId: string, fileName: string) => {
    console.log("[UploadMap] Starting upload process:", { fileUri, regionId, fileName })
    setScreenState("uploading")
    setUploadProgress({ current: 0, total: 100, fileName, stage: "copying" })
    setErrorMessage(null)

    try {
      const region = MAP_REGIONS.find((r) => r.id === regionId)
      if (!region) {
        throw new Error("Invalid region")
      }

      console.log("[UploadMap] Region found:", region.name)

      // Create maps directory if it doesn't exist
      console.log("[UploadMap] Checking maps directory:", TILE_CONFIG.mapsDirectory)
      const mapsDirExists = await RNFS.exists(TILE_CONFIG.mapsDirectory)
      if (!mapsDirExists) {
        console.log("[UploadMap] Creating maps directory...")
        await RNFS.mkdir(TILE_CONFIG.mapsDirectory)
      }

      // Copy file to maps directory
      const targetZipPath = `${TILE_CONFIG.mapsDirectory}/${regionId}_upload.zip`
      console.log("[UploadMap] Copying file to:", targetZipPath)
      setUploadProgress({ current: 10, total: 100, fileName, stage: "copying" })

      await RNFS.copyFile(fileUri, targetZipPath)
      console.log("[UploadMap] File copied successfully")

      // Extract ZIP
      console.log("[UploadMap] Extracting ZIP file...")
      setUploadProgress({ current: 30, total: 100, fileName, stage: "extracting" })

      await unzip(targetZipPath, TILE_CONFIG.mapsDirectory)
      console.log("[UploadMap] ZIP extraction completed")

      // Clean up ZIP
      console.log("[UploadMap] Cleaning up temporary ZIP file...")
      await RNFS.unlink(targetZipPath)

      // Verify extraction
      const regionFolderPath = getRegionFolderPath(regionId)
      console.log("[UploadMap] Verifying extraction at:", regionFolderPath)
      const folderExists = await RNFS.exists(regionFolderPath)

      if (!folderExists) {
        throw new Error("Extraction failed - expected folder not found")
      }
      console.log("[UploadMap] Folder verified successfully")

      setUploadProgress({ current: 70, total: 100, fileName, stage: "verifying" })

      // Check if tiles need decompression (using inline check)
      const needsDecompression = await checkTilesNeedDecompressionInline(regionFolderPath)
      console.log("[UploadMap] Tiles need decompression:", needsDecompression)

      if (needsDecompression) {
        console.log("[UploadMap] Starting tile decompression...")
        setScreenState("decompressing")
        setUploadProgress({ current: 80, total: 100, fileName, stage: "complete" })

        // Perform decompression
        await decompressUploadedTiles(regionFolderPath)
        console.log("[UploadMap] Tile decompression completed")

        // Verify tiles are now decompressed by checking again
        const stillCompressed = await checkTilesNeedDecompressionInline(regionFolderPath)
        if (stillCompressed) {
          console.warn("[UploadMap] WARNING: Some tiles are still compressed after decompression attempt!")
          console.warn("[UploadMap] This may indicate decompression is not working properly")
        } else {
          console.log("[UploadMap] Verification passed - all tiles are now decompressed")
        }
      } else {
        console.log("[UploadMap] Tiles are already decompressed, skipping decompression step")
      }

      // Write style.json for MapLibre
      console.log("[UploadMap] Writing style.json for region:", regionId)
      await writeStyleJson(regionId)
      console.log("[UploadMap] Style JSON written successfully")

      setUploadProgress({ current: 100, total: 100, fileName, stage: "complete" })
      console.log("[UploadMap] Upload process completed successfully")

      // Update downloaded regions
      setDownloadedRegions((prev) => {
        const updated = [...new Set([...prev, regionId])]
        return updated
      })

      setScreenState("completed")

      setTimeout(() => {
        if (onDownloadComplete) {
          onDownloadComplete()
        } else {
          setScreenState("select_region")
          setUploadMode("download")
        }
      }, 1500)

    } catch (error) {
      console.error("[UploadMap] Error:", error)
      setScreenState("error")
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to process uploaded file"
      )
    }
  }, [onDownloadComplete])

  /**
   * Decompress uploaded tiles (inline version)
   */
  const decompressUploadedTiles = async (folderPath: string): Promise<void> => {
    console.log("[UploadMap] Starting tile decompression for:", folderPath)
    let decompressed = 0
    let skipped = 0
    let failed = 0

    try {
      const pbfFiles: string[] = []

      // Recursively collect all .pbf files
      async function collectPbfFiles(path: string, depth = 0): Promise<void> {
        if (depth > 8) return // Limit recursion depth
        const items = await RNFS.readDir(path)
        for (const item of items) {
          if (item.isDirectory()) {
            await collectPbfFiles(item.path, depth + 1)
          } else if (item.isFile() && item.name.endsWith(".pbf")) {
            pbfFiles.push(item.path)
          }
        }
      }

      await collectPbfFiles(folderPath)
      console.log(`[UploadMap] Found ${pbfFiles.length} PBF files to check`)

      for (const filePath of pbfFiles) {
        try {
          const base64Data = await RNFS.readFile(filePath, "base64")

          // GZIP compressed files start with "H4sI" in base64
          // (1f 8b in hex = base64 "H4sI" after encoding)
          if (base64Data.substring(0, 4) === "H4sI") {
            // GZIP compressed - decompress it using pako
            const binaryString = atob(base64Data)
            const compressedData = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
              compressedData[i] = binaryString.charCodeAt(i)
            }

            // Decompress using pako
            const decompressedData = pako.ungzip(compressedData)

            // Convert back to base64 using spread operator (same as downloadTiles.ts)
            const decompressedBase64 = btoa(String.fromCharCode(...decompressedData))

            await RNFS.writeFile(filePath, decompressedBase64, "base64")
            decompressed++

            // Log every 100 files to track progress
            if (decompressed % 100 === 0) {
              console.log(`[UploadMap] Decompressed ${decompressed}/${pbfFiles.length} tiles...`)
            }
          } else {
            skipped++
          }
        } catch (e) {
          failed++
          console.warn(`[UploadMap] Failed to decompress ${filePath}:`, e)
        }
      }

      console.log(`[UploadMap] Decompression summary: ${decompressed} decompressed, ${skipped} skipped, ${failed} failed`)
    } catch (error) {
      console.error("[UploadMap] Decompression error:", error)
      throw error
    }
  }

  /**
   * Open download URL in browser
   */
  const handleDownloadMapFile = useCallback(async (regionId: string, regionName: string) => {
    const downloadUrl = `https://tally-green.skwn.dev/maps/${regionId}.zip`

    try {
      // Check if URL can be opened
      const canOpen = await Linking.canOpenURL(downloadUrl)
      if (canOpen) {
        await Linking.openURL(downloadUrl)
      } else {
        Alert.alert(
          "Error",
          "Cannot open download URL. Please check your internet connection.",
          [{ text: "OK" }]
        )
      }
    } catch (error) {
      console.error("Error opening URL:", error)
      Alert.alert(
        "Error",
        "Failed to open download URL.",
        [{ text: "OK" }]
      )
    }
  }, [])

  /**
   * Inline function to check if tiles need decompression
   */
  async function checkTilesNeedDecompressionInline(folderPath: string): Promise<boolean> {
    try {
      const sampleFiles: string[] = []

      async function collectSampleFiles(path: string, depth = 0): Promise<void> {
        if (depth > 5 || sampleFiles.length >= 10) return
        const items = await RNFS.readDir(path)
        for (const item of items) {
          if (sampleFiles.length >= 10) break
          if (item.isDirectory()) {
            await collectSampleFiles(item.path, depth + 1)
          } else if (item.isFile() && item.name.endsWith(".pbf")) {
            sampleFiles.push(item.path)
          }
        }
      }

      await collectSampleFiles(folderPath)

      if (sampleFiles.length === 0) return false

      for (const filePath of sampleFiles) {
        try {
          const base64Data = await RNFS.readFile(filePath, "base64")
          if (base64Data.substring(0, 4) === "H4sI") {
            return true
          }
        } catch (e) {
          // Skip this file
        }
      }
      return false
    } catch (error) {
      return false
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // ============================================================================
  // Render States
  // ============================================================================

  const renderChecking = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.tint} />
      <Text style={[styles.titleText, { color: colors.text }]}>Checking for offline maps...</Text>
      <Text style={[styles.subtitleText, { color: colors.textDim }]}>
        Please wait while we verify your map data
      </Text>
    </View>
  )

  const renderSelectRegion = () => (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.palette.primary700 }]}>
          <View style={styles.headerContent}>
            {/* Back button (only show if onDownloadComplete is not provided) */}
            {!onDownloadComplete && (
              <Pressable onPress={() => goBack()} style={styles.backButton}>
                <IconPack name="arrowLeft" size={scale(24)} color="#fff" />
              </Pressable>
            )}
            <View style={styles.headerTextContainer}>
              <IconPack name="map" size={scale(28)} color="#fff" variant="Bold" />
              <Text style={[styles.headerTitle, { color: "#fff" }]}>Offline Map</Text>
            </View>
          </View>
          <Text style={[styles.headerSubtitle, { color: "#fff" }]}>
            Select your region to continue
          </Text>
        </View>

        {/* Download/Upload Toggle */}
        <View style={[styles.toggleContainer, { paddingHorizontal: scale(24) }]}>
          <View style={[styles.toggleWrapper, { backgroundColor: colors.palette.neutral100 }]}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                uploadMode === "download" && { backgroundColor: colors.tint },
              ]}
              onPress={() => setUploadMode("download")}
            >
              <IconPack
                name="download"
                size={scale(16)}
                color={uploadMode === "download" ? "#fff" : colors.textDim}
              />
              <Text
                style={[
                  styles.toggleButtonText,
                  { color: uploadMode === "download" ? "#fff" : colors.textDim },
                ]}
              >
                Download
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                uploadMode === "upload" && { backgroundColor: colors.tint },
              ]}
              onPress={() => setUploadMode("upload")}
            >
              <IconPack
                name="upload"
                size={scale(16)}
                color={uploadMode === "upload" ? "#fff" : colors.textDim}
              />
              <Text
                style={[
                  styles.toggleButtonText,
                  { color: uploadMode === "upload" ? "#fff" : colors.textDim },
                ]}
              >
                Upload File
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{paddingHorizontal: scale(24)}}>
          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.palette.neutral50 }]}>
            <View style={styles.row}>
              <IconPack name="info" size={scale(20)} color={colors.tint} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                This app requires offline map data to function.
              </Text>
            </View>
          </View>

          {/* Region Options */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Regions</Text>

          {MAP_REGIONS.map((region) => {
            const isDownloaded = downloadedRegions.includes(region.id)
            const isSelected = selectedRegionId === region.id

            return (
              <TouchableOpacity
                key={region.id}
                style={[
                  styles.regionCard,
                  {
                    backgroundColor: isSelected ? colors.tint + "15" : colors.palette.neutral100,
                    borderColor: isSelected ? colors.tint : colors.palette.neutral200,
                  },
                ]}
                onPress={() => setSelectedRegionId(region.id)}
              >
                <View style={styles.regionHeader}>
                  <View style={styles.regionInfo}>
                    <Text style={[styles.regionName, { color: colors.text }]}>{region.name}</Text>
                    <Text style={[styles.regionSize, { color: colors.textDim }]}>
                      {region.fileSize}
                    </Text>
                  </View>
                  {isDownloaded && (
                    <View style={[styles.downloadedBadge, { backgroundColor: colors.palette.success500 }]}>
                      <IconPack name="check" size={scale(14)} color="#fff" />
                      <Text style={styles.downloadedText}>Downloaded</Text>
                    </View>
                  )}
                  {!isDownloaded && (
                    <View style={[
                      styles.radioCircle,
                      { borderColor: colors.textDim, backgroundColor: isSelected ? colors.tint : "transparent" },
                    ]}>
                      {isSelected && <View style={[styles.radioDot, { backgroundColor: "#fff" }]} />}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )
          })}

          {/* Total Size Info */}
          <View style={[styles.footerCard, { backgroundColor: colors.palette.neutral50 }]}>
            <Text style={[styles.footerText, { color: colors.textDim }]}>
              Total storage for all regions: {getTotalEstimatedSize()}
            </Text>
          </View>

          {/* Content based on upload mode */}
          {uploadMode === "download" ? (
            <>
              {/* Download Button */}
              <TouchableOpacity
                style={[styles.downloadButton, { backgroundColor: colors.tint }]}
                onPress={handleStartDownload}
              >
                <IconPack name="download" size={scale(20)} color="#fff" />
                <Text style={styles.downloadButtonText}>
                  Download {MAP_REGIONS.find((r) => r.id === selectedRegionId)?.name}
                </Text>
              </TouchableOpacity>

              <Text style={[styles.footnoteText, { color: colors.textDim }]}>
                You need an internet connection to download the maps.
              </Text>
            </>
          ) : (
            <>
              {/* Upload Instructions */}
              <View style={[styles.uploadInstructionsCard, { backgroundColor: colors.palette.neutral100 }]}>
                <IconPack name="info" size={scale(20)} color={colors.tint} />
                <View style={styles.uploadInstructionsText}>
                  <Text style={[styles.uploadInstructionsTitle, { color: colors.text }]}>
                    How to use manual upload:
                  </Text>
                  <Text style={[styles.uploadInstructionsSteps, { color: colors.textDim }]}>
                    1. Tap the download link below to open in browser{'\n'}
                    2. The ZIP file will be saved to your Downloads folder{'\n'}
                    3. Come back here and tap "Select File" to choose the ZIP
                  </Text>
                </View>
              </View>

              {/* Download Links for Manual Download */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Download Map Files</Text>

              {MAP_REGIONS.map((region) => (
                <TouchableOpacity
                  key={region.id}
                  style={[styles.downloadLinkCard, { backgroundColor: colors.palette.neutral100 }]}
                  onPress={() => handleDownloadMapFile(region.id, region.name)}
                >
                  <IconPack name="download" size={scale(18)} color={colors.tint} />
                  <View style={styles.downloadLinkInfo}>
                    <Text style={[styles.downloadLinkTitle, { color: colors.text }]}>{region.name}</Text>
                    <Text style={[styles.downloadLinkUrl, { color: colors.textDim }]}>
                      {region.id}.zip • {region.fileSize}
                    </Text>
                  </View>
                  <IconPack name="arrowRight2" size={scale(16)} color={colors.textDim} />
                </TouchableOpacity>
              ))}

              {/* Select File Button */}
              <TouchableOpacity
                style={[styles.downloadButton, { backgroundColor: colors.tint }]}
                onPress={handlePickAndUploadFile}
              >
                <IconPack name="folder" size={scale(20)} color="#fff" />
                <Text style={styles.downloadButtonText}>Select File from Device</Text>
              </TouchableOpacity>

              <Text style={[styles.footnoteText, { color: colors.textDim }]}>
                Select the ZIP file you downloaded (sumut.zip or jatim.zip)
              </Text>
            </>
          )}

          {/* Clear Map Data Button */}
          {downloadedRegions.length > 0 && (
            <TouchableOpacity
              style={[styles.clearDataButton, { borderColor: colors.palette.error500 }]}
              onPress={handleClearMapData}
            >
              <IconPack name="trash" size={scale(16)} color={colors.palette.error500} />
              <Text style={[styles.clearDataButtonText, { color: colors.palette.error500 }]}>
                Clear Map Data
              </Text>
            </TouchableOpacity>
          )}

          {/* Debug Button */}
          <TouchableOpacity
            style={[styles.debugButton, { borderColor: colors.palette.neutral400 }]}
            onPress={handleDebugTiles}
          >
            <IconPack name="info" size={scale(16)} color={colors.palette.neutral500} />
            <Text style={[styles.debugButtonText, { color: colors.palette.neutral500 }]}>
              Debug Tiles
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )

  const renderDownloading = () => {
    const region = MAP_REGIONS.find((r) => r.id === downloadProgress.regionId)

    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.tint} />

        <Text style={[styles.titleText, { color: colors.text }]}>Downloading Maps...</Text>
        <Text style={[styles.subtitleText, { color: colors.textDim }]}>
          {region?.name || "Selected Region"}
        </Text>

        <View style={styles.progressContainer}>
          <Text style={[styles.percentageText, { color: colors.tint }]}>{downloadProgress.percentage}%</Text>

          <View style={[styles.progressBarBackground, { backgroundColor: colors.palette.neutral200 }]}>
            <View
              style={[styles.progressBarFill, { width: `${downloadProgress.percentage}%`, backgroundColor: colors.tint }]}
            />
          </View>

          <Text style={[styles.progressDetailText, { color: colors.textDim }]}>
            {formatBytes(downloadProgress.downloadedBytes)} / {formatBytes(downloadProgress.totalBytes)}
          </Text>
        </View>

        <Text style={[styles.subtitleText, { color: colors.textDim }]}>
          Please keep the app open. Do not close or background the app.
        </Text>
      </View>
    )
  }

  const renderUploading = () => {
    const stageMessages = {
      copying: "Copying file to app directory...",
      extracting: "Extracting map tiles...",
      verifying: "Verifying tiles...",
      complete: "Finalizing...",
      idle: "Preparing upload...",
    }

    const currentStage = uploadProgress.stage
    const message = stageMessages[currentStage] || "Processing..."
    const percentage = Math.floor((uploadProgress.current / uploadProgress.total) * 100)

    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.tint} />

        <Text style={[styles.titleText, { color: colors.text }]}>Uploading Map File...</Text>
        <Text style={[styles.subtitleText, { color: colors.textDim }]}>
          {uploadProgress.fileName}
        </Text>

        <View style={styles.progressContainer}>
          <Text style={[styles.percentageText, { color: colors.tint }]}>{percentage}%</Text>

          <View style={[styles.progressBarBackground, { backgroundColor: colors.palette.neutral200 }]}>
            <View
              style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: colors.tint }]}
            />
          </View>

          <Text style={[styles.progressDetailText, { color: colors.textDim }]}>
            {message}
          </Text>
        </View>

        <Text style={[styles.subtitleText, { color: colors.textDim }]}>
          Please keep the app open. Do not close or background the app.
        </Text>
      </View>
    )
  }

  const renderDecompressing = () => {
    const region = MAP_REGIONS.find((r) => r.id === downloadProgress.regionId)
    const percentage = decompressProgress.total > 0 ? Math.floor((decompressProgress.current / decompressProgress.total) * 100) : 0

    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.tint} />

        <Text style={[styles.titleText, { color: colors.text }]}>Processing Tiles...</Text>
        <Text style={[styles.subtitleText, { color: colors.textDim }]}>
          {region?.name || "Selected Region"}
        </Text>

        <View style={styles.progressContainer}>
          <Text style={[styles.percentageText, { color: colors.tint }]}>{percentage}%</Text>

          <View style={[styles.progressBarBackground, { backgroundColor: colors.palette.neutral200 }]}>
            <View
              style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: colors.tint }]}
            />
          </View>

          <Text style={[styles.progressDetailText, { color: colors.textDim }]}>
            {decompressProgress.current > 0 ? `${decompressProgress.current} / ${decompressProgress.total} tiles` : "Preparing..."}
          </Text>
        </View>

        <Text style={[styles.subtitleText, { color: colors.textDim }]}>
          Decompressing tiles for offline use. This may take a few minutes.
        </Text>
      </View>
    )
  }

  const renderCompleted = () => (
    <View style={styles.centerContainer}>
      <View style={[styles.iconContainer, { backgroundColor: colors.palette.success100 }]}>
        <IconPack name="check" size={scale(40)} color={colors.palette.success500} variant="Bold" />
      </View>

      <Text style={[styles.titleText, { color: colors.text }]}>Process Complete!</Text>
      <Text style={[styles.subtitleText, { color: colors.textDim }]}>Offline maps are ready to use</Text>

      <ActivityIndicator size="small" color={colors.tint} style={{ marginTop: scale(20) }} />
      <Text style={[styles.footnoteText, { color: colors.textDim }]}>Opening app...</Text>
    </View>
  )

  const renderError = () => (
    <View style={styles.centerContainer}>
      <View style={[styles.iconContainer, { backgroundColor: colors.palette.error100 }]}>
        <IconPack name="warning" size={scale(40)} color={colors.palette.error500} variant="Bold" />
      </View>

      <Text style={[styles.titleText, { color: colors.text }]}>Process Failed</Text>

      <View style={[styles.errorBox, { backgroundColor: colors.palette.error50 }]}>
        <Text style={[styles.errorText, { color: colors.palette.error700 }]}>{errorMessage}</Text>
      </View>

      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: colors.tint }]}
        onPress={handleRetry}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteButton, { borderColor: colors.tint }]}
        onPress={handleDeleteAndRetry}
      >
        <Text style={[styles.deleteButtonText, { color: colors.tint }]}>Delete & Re-download</Text>
      </TouchableOpacity>

      <Text style={[styles.footnoteText, { color: colors.textDim }]}>
        Make sure you have a stable internet connection and try again.
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <StatusBar backgroundColor={colors.background}/>
      {screenState === "checking" && renderChecking()}
      {screenState === "select_region" && renderSelectRegion()}
      {screenState === "downloading" && renderDownloading()}
      {screenState === "uploading" && renderUploading()}
      {screenState === "decompressing" && renderDecompressing()}
      {screenState === "completed" && renderCompleted()}
      {screenState === "error" && renderError()}
    </SafeAreaView>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(24),
  },
  scrollContent: {
    // paddingHorizontal: scale(20),
    paddingBottom: scale(40),
  },
  header: {
    paddingTop: scale(20),
    paddingHorizontal: scale(20),
    paddingBottom: scale(16),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
    marginBottom: scale(20),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: scale(8),
    marginRight: scale(8),
  },
  headerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  headerTitle: {
    fontSize: scale(24),
    fontWeight: "700",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: scale(14),
    color: "#fff",
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: "600",
    marginBottom: scale(12),
  },
  infoCard: {
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: scale(20),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  infoText: {
    fontSize: scale(14),
    lineHeight: scale(20),
    flex: 1,
  },
  regionCard: {
    flexDirection: "row",
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: scale(12),
    borderWidth: 1,
  },
  regionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  regionInfo: {
    flex: 1,
  },
  regionName: {
    fontSize: scale(16),
    fontWeight: "600",
    marginBottom: scale(4),
  },
  regionSize: {
    fontSize: scale(13),
  },
  downloadedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(16),
  },
  downloadedText: {
    fontSize: scale(12),
    fontWeight: "600",
    color: "#fff",
  },
  radioCircle: {
    width: scale(22),
    height: scale(22),
    borderRadius: scale(11),
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioDot: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
  },
  footerCard: {
    borderRadius: scale(12),
    padding: scale(16),
    marginTop: scale(8),
    marginBottom: scale(20),
  },
  footerText: {
    fontSize: scale(13),
    textAlign: "center",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(12),
    paddingVertical: scale(16),
    borderRadius: scale(12),
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "600",
  },
  progressContainer: {
    width: "100%",
    marginTop: scale(32),
    marginBottom: scale(16),
  },
  percentageText: {
    fontSize: scale(48),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: scale(16),
  },
  progressBarBackground: {
    height: scale(8),
    borderRadius: scale(4),
    overflow: "hidden",
    marginBottom: scale(12),
  },
  progressBarFill: {
    height: "100%",
  },
  progressDetailText: {
    fontSize: scale(14),
    textAlign: "center",
  },
  iconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(24),
  },
  titleText: {
    fontSize: scale(24),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: scale(12),
  },
  subtitleText: {
    fontSize: scale(14),
    textAlign: "center",
    marginTop: scale(8),
  },
  errorBox: {
    borderRadius: scale(12),
    padding: scale(20),
    marginTop: scale(24),
    marginBottom: scale(32),
    width: "100%",
  },
  errorText: {
    fontSize: scale(14),
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: scale(48),
    paddingVertical: scale(16),
    borderRadius: scale(12),
    minWidth: scale(280),
    alignItems: "center",
    marginBottom: scale(12),
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: scale(16),
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "transparent",
    paddingHorizontal: scale(48),
    paddingVertical: scale(16),
    borderRadius: scale(12),
    minWidth: scale(280),
    alignItems: "center",
    borderWidth: 1,
  },
  deleteButtonText: {
    fontSize: scale(14),
    fontWeight: "500",
  },
  footnoteText: {
    fontSize: scale(12),
    textAlign: "center",
    marginTop: scale(24),
  },
  clearDataButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    marginTop: scale(16),
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    borderWidth: 1,
  },
  clearDataButtonText: {
    fontSize: scale(14),
    fontWeight: "500",
  },
  debugButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    marginTop: scale(12),
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    borderWidth: 1,
  },
  debugButtonText: {
    fontSize: scale(14),
    fontWeight: "500",
  },
  // Toggle styles
  toggleContainer: {
    marginTop: scale(-10),
    marginBottom: scale(20),
  },
  toggleWrapper: {
    flexDirection: "row",
    borderRadius: scale(8),
    padding: scale(4),
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(6),
    paddingVertical: scale(10),
    borderRadius: scale(6),
  },
  toggleButtonText: {
    fontSize: scale(14),
    fontWeight: "600",
  },
  // Upload instructions styles
  uploadInstructionsCard: {
    flexDirection: "row",
    gap: scale(12),
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: scale(20),
  },
  uploadInstructionsText: {
    flex: 1,
  },
  uploadInstructionsTitle: {
    fontSize: scale(14),
    fontWeight: "600",
    marginBottom: scale(4),
  },
  uploadInstructionsSteps: {
    fontSize: scale(13),
    lineHeight: scale(18),
  },
  // Download link card styles
  downloadLinkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: scale(12),
  },
  downloadLinkInfo: {
    flex: 1,
  },
  downloadLinkTitle: {
    fontSize: scale(15),
    fontWeight: "600",
  },
  downloadLinkUrl: {
    fontSize: scale(13),
  },
})
