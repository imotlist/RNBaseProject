import { spacing } from "./spacing"
import type { ViewStyle } from "react-native"

/**
 * Predefined layout styles that can be used throughout the app.
 * These are common flexbox patterns for consistent UI layouts.
 */

const base: ViewStyle = {}

export const layoutPresets = {
  // Base empty style
  base,

  // Row - Horizontal layout (left to right)
  row: {
    flexDirection: "row",
  } as ViewStyle,

  // Row Even - Horizontal with evenly distributed children
  rowEven: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  } as ViewStyle,

  // Row Even Pad - Horizontal with even distribution and padding
  rowEvenPad: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  } as ViewStyle,

  // Row Between - Horizontal with space between children
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  } as ViewStyle,

  // Row Between Pad - Horizontal with space between and padding
  rowBetweenPad: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  } as ViewStyle,

  // Row Center - Horizontal with centered children
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
  } as ViewStyle,

  // Row Center Pad - Horizontal centered with padding
  rowCenterPad: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  } as ViewStyle,

  // Row Start - Horizontal with left-aligned children
  rowStart: {
    flexDirection: "row",
    justifyContent: "flex-start",
  } as ViewStyle,

  // Row Start Pad - Horizontal left-aligned with padding
  rowStartPad: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  } as ViewStyle,

  // Row End - Horizontal with right-aligned children
  rowEnd: {
    flexDirection: "row",
    justifyContent: "flex-end",
  } as ViewStyle,

  // Row End Pad - Horizontal right-aligned with padding
  rowEndPad: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  } as ViewStyle,

  // Column - Vertical layout (top to bottom)
  column: {
    flexDirection: "column",
  } as ViewStyle,

  // Column Even - Vertical with evenly distributed children
  columnEven: {
    flexDirection: "column",
    justifyContent: "space-evenly",
  } as ViewStyle,

  // Column Even Pad - Vertical with even distribution and padding
  columnEvenPad: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  } as ViewStyle,

  // Column Between - Vertical with space between children
  columnBetween: {
    flexDirection: "column",
    justifyContent: "space-between",
  } as ViewStyle,

  // Column Between Pad - Vertical with space between and padding
  columnBetweenPad: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  } as ViewStyle,

  // Column Center - Vertical with centered children
  columnCenter: {
    flexDirection: "column",
    justifyContent: "center",
  } as ViewStyle,

  // Column Center Pad - Vertical centered with padding
  columnCenterPad: {
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  } as ViewStyle,

  // Center - Center both horizontally and vertically
  center: {
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  // Center Pad - Centered with padding
  centerPad: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  } as ViewStyle,

  // Fill - Fill available space
  fill: {
    flex: 1,
  } as ViewStyle,

  // Centered - Centered in parent with flex: 1
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  // Centered Horizontal - Center horizontally with flex: 1
  centeredX: {
    flex: 1,
    justifyContent: "center",
  } as ViewStyle,

  // Centered Vertical - Center vertically with flex: 1
  centeredY: {
    flex: 1,
    alignItems: "center",
  } as ViewStyle,

  // Absolute Fill - Absolute positioned to fill parent
  absoluteFill: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  } as ViewStyle,

  // Absolute Center - Absolute positioned and centered
  absoluteCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  // Padding variants
  pad: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  } as ViewStyle,

  padX: {
    paddingHorizontal: spacing.md,
  } as ViewStyle,

  padY: {
    paddingVertical: spacing.sm,
  } as ViewStyle,

  padSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  } as ViewStyle,

  padLg: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  } as ViewStyle,

  // Margin variants
  gap: {
    gap: spacing.sm,
  } as ViewStyle,

  gapSm: {
    gap: spacing.xs,
  } as ViewStyle,

  gapMd: {
    gap: spacing.md,
  } as ViewStyle,

  gapLg: {
    gap: spacing.lg,
  } as ViewStyle,
} as const

export type LayoutPresets = typeof layoutPresets
