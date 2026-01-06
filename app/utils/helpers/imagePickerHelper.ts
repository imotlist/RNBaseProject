/**
 * imagePickerHelper.ts
 * Helper functions for image picking and camera
 */

import { Alert, Linking, Platform } from "react-native"
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType, Asset } from "react-native-image-picker"
import { usePermission } from "@/context/PermissionContext"
import { useFlashMessage } from "@/hooks"

export interface ImagePickerOptions {
  /**
   * Selection limit (0 for unlimited)
   */
  selectionLimit?: number
  /**
   * Media type
   */
  mediaType?: MediaType
  /**
   * Include base64 data
   */
  includeBase64?: boolean
  /**
   * Image quality (0-1)
   */
  quality?: number
  /**
   * Maximum width
   */
  maxWidth?: number
  /**
   * Maximum height
   */
  maxHeight?: number
  /**
   * Whether to allow cropping
   */
  allowCropping?: boolean
}

export interface PickedImage {
  uri: string
  type?: string
  fileName?: string
  fileSize?: number
  width?: number
  height?: number
  base64?: string
}

/**
 * Process selected assets into PickedImage array
 */
const processAssets = (assets: Asset[]): PickedImage[] => {
  return assets
    .filter((asset) => asset.uri !== undefined)
    .map((asset) => ({
      uri: asset.uri!,
      type: asset.type,
      fileName: asset.fileName,
      fileSize: asset.fileSize,
      width: asset.width,
      height: asset.height,
      base64: asset.base64,
    }))
}

/**
 * Pick images from gallery
 */
export const pickImages = async (options: ImagePickerOptions = {}): Promise<PickedImage[]> => {
  const {
    selectionLimit = 1,
    mediaType = "photo",
    includeBase64 = false,
    quality = 0.9,
    maxWidth = 1024,
    maxHeight = 1024,
  } = options

  const result: ImagePickerResponse = await launchImageLibrary({
    mediaType,
    selectionLimit,
    includeBase64,
    quality,
    maxWidth,
    maxHeight,
  })

  if (result.didCancel) {
    return []
  }

  if (result.errorCode) {
    const errorMessage = result.errorMessage ?? "Unknown error"
    throw new Error(errorMessage)
  }

  if (!result.assets) {
    return []
  }

  return processAssets(result.assets)
}

/**
 * Take photo with camera
 */
export const takePhoto = async (options: ImagePickerOptions = {}): Promise<PickedImage | null> => {
  const {
    mediaType = "photo",
    includeBase64 = false,
    quality = 0.9,
    maxWidth = 1024,
    maxHeight = 1024,
  } = options

  const result: ImagePickerResponse = await launchCamera({
    mediaType,
    includeBase64,
    quality,
    maxWidth,
    maxHeight,
    saveToPhotos: true,
  })

  if (result.didCancel) {
    return null
  }

  if (result.errorCode) {
    const errorMessage = result.errorMessage ?? "Unknown error"
    throw new Error(errorMessage)
  }

  if (!result.assets || result.assets.length === 0) {
    return null
  }

  const images = processAssets(result.assets)
  return images[0] ?? null
}

/**
 * Pick single image
 */
export const pickSingleImage = async (
  options?: Omit<ImagePickerOptions, "selectionLimit">,
): Promise<PickedImage | null> => {
  const images = await pickImages({ ...options, selectionLimit: 1 })
  return images[0] ?? null
}

/**
 * Hook for image picking with permission handling
 */
export const useImagePicker = () => {
  const { requestPermission, openAppSettings } = usePermission()
  const { showError } = useFlashMessage()

  /**
   * Pick images from gallery with permission handling
   */
  const pickFromGallery = async (options: ImagePickerOptions = {}): Promise<PickedImage[]> => {
    // Request photo library permission
    const status = await requestPermission("photoLibrary")

    if (status === "blocked") {
      Alert.alert(
        "Permission Required",
        "Please enable photo library access in app settings to select photos.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: openAppSettings },
        ],
      )
      return []
    }

    if (status === "denied") {
      return []
    }

    if (status !== "granted") {
      showError("Photo library access is required to select photos")
      return []
    }

    try {
      return await pickImages(options)
    } catch (error: any) {
      showError(error?.message ?? "Failed to pick images")
      return []
    }
  }

  /**
   * Take photo with camera with permission handling
   */
  const openCamera = async (options: ImagePickerOptions = {}): Promise<PickedImage | null> => {
    // Request camera permission
    const status = await requestPermission("camera")

    if (status === "blocked") {
      Alert.alert(
        "Permission Required",
        "Please enable camera access in app settings to take photos.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: openAppSettings },
        ],
      )
      return null
    }

    if (status === "denied") {
      return null
    }

    if (status !== "granted") {
      showError("Camera access is required to take photos")
      return null
    }

    try {
      return await takePhoto(options)
    } catch (error: any) {
      showError(error?.message ?? "Failed to take photo")
      return null
    }
  }

  return {
    pickFromGallery,
    openCamera,
  }
}

export default {
  pickImages,
  takePhoto,
  pickSingleImage,
}
