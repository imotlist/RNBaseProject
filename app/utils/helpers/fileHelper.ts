/**
 * fileHelper.ts
 * Helper functions for file operations
 */

import { Platform } from "react-native"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"

export interface DownloadOptions {
  /**
   * Download URL
   */
  url: string
  /**
   * Local file path
   */
  localPath: string
  /**
   * Progress callback
   */
  onProgress?: (progress: number) => void
}

/**
 * Download a file to local storage
 */
export const downloadFile = async (options: DownloadOptions): Promise<string> => {
  const { url, localPath, onProgress } = options

  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    localPath,
    {},
    (downloadProgress) => {
      const progress =
        downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
      onProgress?.(progress)
    },
  )

  try {
    const result = await downloadResumable.downloadAsync()
    return result?.uri ?? localPath
  } catch (error) {
    console.error("Download error:", error)
    throw new Error("Failed to download file")
  }
}

/**
 * Get file info (size, extension, etc.)
 */
export const getFileInfo = async (fileUri: string): Promise<FileSystem.FileInfo | null> => {
  try {
    return await FileSystem.getInfoAsync(fileUri)
  } catch (error) {
    console.error("Error getting file info:", error)
    return null
  }
}

/**
 * Delete a file
 */
export const deleteFile = async (fileUri: string): Promise<boolean> => {
  try {
    await FileSystem.deleteAsync(fileUri)
    return true
  } catch (error) {
    console.error("Error deleting file:", error)
    return false
  }
}

/**
 * Share a file
 */
export const shareFile = async (fileUri: string): Promise<void> => {
  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri)
    } else {
      throw new Error("Sharing is not available on this device")
    }
  } catch (error) {
    console.error("Error sharing file:", error)
    throw error
  }
}

/**
 * Open a file with default app
 */
export const openFile = async (fileUri: string): Promise<void> => {
  try {
    await Sharing.shareAsync(fileUri, {
      mimeType: "application/octet-stream",
      dialogTitle: "Open file",
    })
  } catch (error) {
    console.error("Error opening file:", error)
    throw error
  }
}

/**
 * Get base64 data from file
 */
export const getBase64FromFile = async (fileUri: string): Promise<string> => {
  try {
    return await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    })
  } catch (error) {
    console.error("Error reading file as base64:", error)
    throw error
  }
}

/**
 * Save base64 data to file
 */
export const saveBase64ToFile = async (
  base64: string,
  localPath: string,
): Promise<string> => {
  try {
    await FileSystem.writeAsStringAsync(localPath, base64, {
      encoding: FileSystem.EncodingType.Base64,
    })
    return localPath
  } catch (error) {
    console.error("Error saving base64 to file:", error)
    throw error
  }
}

/**
 * Get file directory for storing app files
 */
export const getAppDirectory = (): string => {
  return FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? ""
}

/**
 * Get cache directory
 */
export const getCacheDirectory = (): string => {
  return FileSystem.cacheDirectory ?? ""
}

/**
 * Clear cache
 */
export const clearCache = async (): Promise<boolean> => {
  try {
    await FileSystem.deleteAsync(FileSystem.cacheDirectory ?? "", { idempotent: true })
    return true
  } catch (error) {
    console.error("Error clearing cache:", error)
    return false
  }
}

/**
 * Get file size in human-readable format
 */
export const getFileSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  if (bytes === 0) return "0 Bytes"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
}

/**
 * Get file extension from file name
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
}

/**
 * Check if file is an image
 */
export const isImageFile = (filename: string): boolean => {
  const ext = getFileExtension(filename).toLowerCase()
  return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext)
}

/**
 * Check if file is a PDF
 */
export const isPdfFile = (filename: string): boolean => {
  return getFileExtension(filename).toLowerCase() === "pdf"
}

/**
 * Check if file is a document
 */
export const isDocumentFile = (filename: string): boolean => {
  const ext = getFileExtension(filename).toLowerCase()
  return ["doc", "docx", "pdf", "txt", "rtf", "odt"].includes(ext)
}

export default {
  downloadFile,
  getFileInfo,
  deleteFile,
  shareFile,
  openFile,
  getBase64FromFile,
  saveBase64ToFile,
  getAppDirectory,
  getCacheDirectory,
  clearCache,
  getFileSize,
  getFileExtension,
  isImageFile,
  isPdfFile,
  isDocumentFile,
}
