/**
 * TitleBar component
 * A reusable title bar with back button, title, and optional action icons
 */

import React from "react"
import { View, StyleSheet, Pressable, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import { Text } from "@/components/Text"
import { IconPack, IconSaxName } from "@/components/ui/IconPack"
import { scale, moderateScale, scaleFontSize } from "@/utils/responsive"

/**
 * Check if a color is light (white/light background)
 * Returns true if the color is light, false if dark
 */
function isLightColor(color: string): boolean {
  if (!color) return false

  // Handle hex colors
  if (color.startsWith("#")) {
    const hex = color.replace("#", "")
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128
  }

  // Handle named colors
  const lightColors = [
    "white", "#fff", "#ffffff", "#fff0",
    "neutral100", "#FFFFFF",
    "transparent", "clear",
  ]
  return lightColors.some((c) => color.toLowerCase().includes(c.toLowerCase()))
}

/**
 * Get appropriate text/icon color based on background
 */
function getContrastColor(
  backgroundColor: string | undefined,
  theme: any,
  defaultTextColor: string,
): string {
  // If textColor is explicitly set and not default white, use it
  if (defaultTextColor && defaultTextColor !== "#FFFFFF") {
    return defaultTextColor
  }

  // Auto-detect contrast color based on background
  const bgColor = backgroundColor || theme.colors.tint
  return isLightColor(bgColor) ? "#000000" : "#FFFFFF"
}

export interface TitleBarAction {
  /**
   * Icon name for the action button
   */
  icon: IconSaxName
  /**
   * Callback when action is pressed
   */
  onPress: () => void
  /**
   * Optional badge count for the action
   */
  badge?: number
}

export interface TitleBarProps {
  /**
   * Title text to display
   */
  title: string
  /**
   * Callback when back button is pressed
   */
  onBackPress?: () => void
  /**
   * Action buttons to display on the right
   */
  actions?: TitleBarAction[]
  /**
   * Container background color
   */
  backgroundColor?: string
  /**
   * Title text color
   */
  textColor?: string
  /**
   * Icon color
   */
  iconColor?: string
  /**
   * Container style override
   */
  containerStyle?: ViewStyle
  /**
   * Whether to show the back button
   */
  showBack?: boolean
  /**
   * Whether the title bar is disabled
   */
  disabled?: boolean
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  onBackPress,
  actions = [],
  backgroundColor,
  textColor = "#FFFFFF",
  iconColor,
  containerStyle,
  showBack = true,
  disabled = false,
}) => {
  const { theme } = useAppTheme()

  const opacity = disabled ? 0.5 : 1

  // Auto-detect appropriate contrast color for text and icons
  const autoTextColor = getContrastColor(backgroundColor, theme, textColor)
  const autoIconColor = iconColor || autoTextColor

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: backgroundColor || theme.colors.tint, opacity },
        containerStyle,
      ]}
    >
      {/* Left - Back Button */}
      {showBack && (
        <Pressable onPress={onBackPress} disabled={disabled || !onBackPress} style={styles.backButton}>
          <IconPack
            name="arrow-left2"
            size={scale(24)}
            color={autoIconColor}
          />
        </Pressable>
      )}

      {/* Center - Title */}
      <View style={styles.titleContainer}>
        <Text size="md" textStyle="bold" style={{ color: autoTextColor }}>
          {title}
        </Text>
      </View>

      {/* Right - Action Buttons */}
      {actions.length > 0 ? (
        <View style={styles.actionsContainer}>
          {actions.map((action, index) => (
            <View key={index} style={styles.actionButton}>
              <Pressable onPress={action.onPress} disabled={disabled || !action.onPress}>
                <IconPack
                  name={action.icon}
                  size={scale(24)}
                  color={autoIconColor}
                />
                {action.badge !== undefined && action.badge > 0 && (
                  <View style={styles.badge}>
                    <Text size="smallest" style={styles.badgeText}>
                      {action.badge > 99 ? "99+" : action.badge.toString()}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          ))}
        </View>
      ) : (<View style={[styles.actionsContainer, {width: scale(40)}]}>
      </View>)
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    minHeight: scale(56),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  actionButton: {
    position: "relative",
    width: scale(40),
    height: scale(40),
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#EF4444",
    minWidth: scale(18),
    height: scale(18),
    borderRadius: moderateScale(9),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(4),
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: scaleFontSize(10),
    lineHeight: scaleFontSize(10),
  },
})
