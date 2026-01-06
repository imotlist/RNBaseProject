/**
 * Frame component
 * A bordered container with color variants, thin border, and overflow hidden
 */

import React from "react"
import { View, StyleSheet, ViewStyle, } from "react-native"
import { useAppTheme } from "@/theme/context"
import { scale, moderateScale } from "@/utils/responsive"

type FrameColor = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral"
type FrameRounded = "none" | "sm" | "md" | "lg" | "full"

export interface FrameProps {
  /**
   * Frame color variant (determines border and background color)
   */
  color?: FrameColor
  /**
   * Border radius variant
   */
  rounded?: FrameRounded
  /**
   * Override background color
   */
  backgroundColor?: string
  /**
   * Override border color
   */
  borderColor?: string
  /**
   * Content padding
   */
  padding?: number
  /**
   * Container style override
   */
  style?: ViewStyle
  /**
   * Children components
   */
  children?: React.ReactNode
  /**
   * Whether the frame is disabled
   */
  disabled?: boolean
}

const FRAME_COLORS: Record<FrameColor, { border: string; bg: string }> = {
  primary: { border: "#4A90E2", bg: "#EBF5FF" },
  secondary: { border: "#8E8E93", bg: "#F2F2F7" },
  success: { border: "#4CAF50", bg: "#E8F5E9" },
  warning: { border: "#FF9800", bg: "#FFF3E0" },
  danger: { border: "#EF4444", bg: "#FEE2E2" },
  info: { border: "#2196F3", bg: "#E3F2FD" },
  neutral: { border: "#E5E7EB", bg: "#FFFFFF" },
}

const ROUNDED_STYLES: Record<FrameRounded, number> = {
  none: 0,
  sm: moderateScale(4),
  md: moderateScale(8),
  lg: moderateScale(12),
  full: 9999,
}

export const Frame: React.FC<FrameProps> = ({
  color = "neutral",
  rounded = "md",
  backgroundColor,
  borderColor,
  padding = scale(16),
  style,
  children,
  disabled = false,
}) => {
  const { theme } = useAppTheme()

  const colors = FRAME_COLORS[color]
  const opacity = disabled ? 0.5 : 1

  const frameStyle: ViewStyle = {
    backgroundColor: backgroundColor || colors.bg,
    borderWidth: 1,
    borderColor: borderColor || colors.border,
    borderRadius: ROUNDED_STYLES[rounded],
    padding,
    overflow: "hidden" as const,
    opacity,
  }

  return (
    <View style={[styles.frame, frameStyle, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  frame: {
    // width: "100%",
    flex:1
  },
})
