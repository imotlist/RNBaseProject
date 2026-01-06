/**
 * Responsive scaling utilities for cross-device compatibility.
 *
 * These utilities help create responsive layouts that adapt to different
 * screen sizes across Android phones, Android tablets, iOS, and iPad.
 *
 * @module responsive
 */

import { Dimensions, Platform, PixelRatio } from "react-native"

// Device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

// Standard dimensions (based on iPhone 14 design baseline)
const STANDARD_WIDTH = 390
const STANDARD_HEIGHT = 844

// Tablet breakpoint (anything wider is considered a tablet)
const TABLET_BREAKPOINT = 768

// Detect if device is a tablet
export const isTablet = SCREEN_WIDTH >= TABLET_BREAKPOINT

// Detect platform
export const isIOS = Platform.OS === "ios"
export const isAndroid = Platform.OS === "android"

/**
 * Horizontal scale factor based on screen width.
 * Use for widths, horizontal margins/paddings, font sizes.
 */
const horizontalScaleFactor = SCREEN_WIDTH / STANDARD_WIDTH

/**
 * Vertical scale factor based on screen height.
 * Use for heights, vertical margins/paddings.
 */
const verticalScaleFactor = SCREEN_HEIGHT / STANDARD_HEIGHT

/**
 * Scales a value horizontally based on screen width.
 *
 * @param size - The size to scale (in pixels)
 * @returns The scaled size
 *
 * @example
 * const buttonStyle = {
 *   padding: scale(16),        // Scales based on screen width
 *   width: scale(200),
 * }
 */
export function scale(size: number): number {
  return PixelRatio.roundToNearestPixel(size * horizontalScaleFactor)
}

/**
 * Scales a value vertically based on screen height.
 *
 * @param size - The size to scale (in pixels)
 * @returns The scaled size
 *
 * @example
 * const containerStyle = {
 *   height: verticalScale(100),  // Scales based on screen height
 *   marginVertical: verticalScale(24),
 * }
 */
export function verticalScale(size: number): number {
  return PixelRatio.roundToNearestPixel(size * verticalScaleFactor)
}

/**
 * Moderately scales a value - uses an average of horizontal and vertical scaling.
 * This provides a more balanced scaling for most UI elements.
 *
 * @param size - The size to scale (in pixels)
 * @returns The scaled size
 *
 * @example
 * const cardStyle = {
 *   borderRadius: moderateScale(8),  // Balanced scaling
 *   padding: moderateScale(16),
 * }
 */
export function moderateScale(size: number, factor: number = 0.5): number {
  return PixelRatio.roundToNearestPixel(
    size + (horizontalScaleFactor - 1) * size * factor,
  )
}

/**
 * Scales font size with optional custom factor.
 *
 * @param size - The font size to scale
 * @param factor - Custom scaling factor (default: 0.5 for moderate scaling)
 * @returns The scaled font size
 *
 * @example
 * const textStyle = {
 *   fontSize: scaleFontSize(16),  // Scales text appropriately
 * }
 */
export function scaleFontSize(size: number, factor: number = 0.5): number {
  // On tablets, use slightly more aggressive scaling for better readability
  const adjustedFactor = isTablet ? factor * 1.2 : factor
  return moderateScale(size, adjustedFactor)
}

/**
 * Returns responsive dimensions for a container.
 * Useful for creating responsive grids or layouts.
 *
 * @param widthPercent - Width as percentage (0-100)
 * @param aspectRatio - Optional aspect ratio (width/height)
 * @returns Object with width and height
 *
 * @example
 * const { width, height } = responsiveWidth(50, 16/9)
 * // Returns { width: 195, height: 109 } on standard screen
 */
export function responsiveWidth(
  widthPercent: number,
  aspectRatio?: number,
): { width: number; height?: number } {
  const width = PixelRatio.roundToNearestPixel((SCREEN_WIDTH * widthPercent) / 100)

  if (aspectRatio) {
    return {
      width,
      height: PixelRatio.roundToNearestPixel(width / aspectRatio),
    }
  }

  return { width }
}

/**
 * Returns responsive number of columns for a grid based on screen width.
 *
 * @param minColumnWidth - Minimum width for each column
 * @returns Number of columns that fit
 *
 * @example
 * const columns = responsiveColumns(150)  // Returns 2 on phone, 4+ on tablet
 */
export function responsiveColumns(minColumnWidth: number): number {
  const availableWidth = SCREEN_WIDTH - 32 // Subtract padding
  return Math.max(1, Math.floor(availableWidth / scale(minColumnWidth)))
}

/**
 * Hook that returns current device info for responsive layouts.
 *
 * @example
 * const { isTablet, isPortrait, screenInfo } = useResponsive()
 */
export interface ResponsiveInfo {
  isTablet: boolean
  isPhone: boolean
  isPortrait: boolean
  isLandscape: boolean
  screenInfo: {
    width: number
    height: number
    scale: number
    fontScale: number
  }
}

let currentDimensions: { width: number; height: number } = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
}

/**
 * Update cached dimensions (call this from Dimensions.addEventListener)
 */
export function updateDimensions() {
  const { width, height } = Dimensions.get("window")
  currentDimensions = { width, height }
}

/**
 * Get current responsive info object.
 */
export function getResponsiveInfo(): ResponsiveInfo {
  const { width, height } = currentDimensions
  const isPortrait = height > width

  return {
    isTablet: width >= TABLET_BREAKPOINT,
    isPhone: width < TABLET_BREAKPOINT,
    isPortrait,
    isLandscape: !isPortrait,
    screenInfo: {
      width,
      height,
      scale: PixelRatio.get(),
      fontScale: PixelRatio.getFontScale(),
    },
  }
}

/**
 * Platform-specific value selector.
 * Returns different values based on the current platform.
 *
 * @example
 * const padding = Platform.select({
 *   ios: 16,
 *   android: 12,
 * })
 */
export { Platform }

/**
 * Returns appropriate spacing value based on device type.
 * Tablets get slightly more spacing for better visual balance.
 *
 * @param baseSpacing - Base spacing value
 * @returns Spacing value adjusted for device type
 *
 * @example
 * const containerPadding = getResponsiveSpacing(16)  // Returns 20 on tablet
 */
export function getResponsiveSpacing(baseSpacing: number): number {
  if (isTablet) {
    return PixelRatio.roundToNearestPixel(baseSpacing * 1.25)
  }
  return baseSpacing
}

/**
 * Type definitions for responsive utilities
 */
export type ResponsiveValue<T> = T | { phone: T; tablet: T }

/**
 * Selects appropriate value based on device type.
 *
 * @example
 * const fontSize = selectResponsiveValue({
 *   phone: 16,
 *   tablet: 20,
 * })  // Returns 16 on phone, 20 on tablet
 */
export function selectResponsiveValue<T>(value: ResponsiveValue<T>): T {
  if (typeof value === "object" && "phone" in value && "tablet" in value) {
    return isTablet ? value.tablet : value.phone
  }
  return value
}

/**
 * Pre-scaled common spacing values for convenience.
 * These are automatically scaled based on the current device.
 */
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
}

/**
 * Pre-scaled font sizes for convenience.
 */
export const fontSizes = {
  xs: scaleFontSize(10),
  sm: scaleFontSize(12),
  md: scaleFontSize(14),
  lg: scaleFontSize(16),
  xl: scaleFontSize(18),
  xxl: scaleFontSize(24),
  xxxl: scaleFontSize(32),
  jumbo: scaleFontSize(48),
}
