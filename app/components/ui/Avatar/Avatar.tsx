/**
 * Avatar component
 * A reusable avatar component supporting images, URIs, icons, and text fallbacks
 */

import React from "react"
import { View, StyleSheet, Image, ImageStyle, ViewStyle, TextStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import { Text } from "@/components/Text"
import { IconPack } from "../IconPack"
import { scale, moderateScale } from "@/utils/responsive"

type AvatarSize = "small" | "medium" | "large" | "xlarge"
type AvatarShape = "circle" | "square"

export interface AvatarProps {
  /**
   * Source URI for the avatar image
   */
  source?: string
  /**
   * Local image asset require
   */
  asset?: number
  /**
   * Text to show as fallback (usually first letter of name)
   */
  text?: string
  /**
   * Icon name from IconPack to display
   */
  icon?: string
  /**
   * Icon size (defaults to 60% of avatar size)
   */
  iconSize?: number
  /**
   * Icon color (defaults to text color)
   */
  iconColor?: string
  /**
   * Size variation
   */
  size?: AvatarSize
  /**
   * Shape variation
   */
  shape?: AvatarShape
  /**
   * Custom background color for text fallback
   */
  backgroundColor?: string
  /**
   * Custom text color for text fallback
   */
  textColor?: string
  /**
   * Border color
   */
  borderColor?: string
  /**
   * Border width
   */
  borderWidth?: number
  /**
   * Container style override
   */
  containerStyle?: ViewStyle
  /**
   * Whether the avatar is disabled (grays out)
   */
  disabled?: boolean
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  asset,
  text,
  icon,
  iconSize,
  iconColor,
  size = "medium",
  shape = "circle",
  backgroundColor,
  textColor,
  borderColor,
  borderWidth,
  containerStyle,
  disabled = false,
}) => {
  const { theme } = useAppTheme()

  const sizeStyles = sizeStylesMap[size] as any;
  const borderRadius = shape === "circle" ? sizeStyles.width / 2 : borderRadiusMap[shape]

  const hasImage = !!(source || asset)
  const hasIcon = !!icon
  const opacity = disabled ? 0.5 : 1

  // Get display text (first character, uppercase)
  const displayText = text ? text.charAt(0).toUpperCase() : ""

  // Default background colors for text fallback (if not provided)
  const defaultBgColor = backgroundColor || theme.colors.tint
  const defaultTextColor = textColor || theme.colors.palette.neutral100
  const defaultIconColor = iconColor || theme.colors.palette.neutral100

  // Calculate icon size (60% of avatar size by default)
  const calculatedIconSize = iconSize || sizeStyles.width * 0.6

  return (
    <View
      style={[
        styles.container,
        sizeStyles,
        {
          borderRadius,
          opacity,
          backgroundColor: backgroundColor ? backgroundColor : defaultBgColor,
          borderColor: borderColor || theme.colors.border,
          borderWidth: borderWidth ?? 0,
        },
        containerStyle,
      ]}
    >
      {hasImage ? (
        <Image
          source={source ? { uri: source } : asset}
          style={[styles.image, { borderRadius }]}
        />
      ) : hasIcon ? (
        <IconPack
          name={icon as any}
          size={calculatedIconSize}
          color={defaultIconColor}
        />
      ) : displayText ? (
        <Text
          style={[
            styles.text,
            {
              fontSize: sizeStyles.width * 0.4,
              color: defaultTextColor,
            },
          ]}
        >
          {displayText}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "60%",
    height: "60%",
    resizeMode: "cover",
  },
  text: {
    fontWeight: "600",
    textTransform: "uppercase",
  },
})

// Size variations
const sizeStylesMap: Record<AvatarSize, ViewStyle> = {
  small: {
    width: scale(32),
    height: scale(32),
  },
  medium: {
    width: scale(48),
    height: scale(48),
  },
  large: {
    width: scale(64),
    height: scale(64),
  },
  xlarge: {
    width: scale(96),
    height: scale(96),
  },
}

// Border radius for shapes
const borderRadiusMap: Record<AvatarShape, number> = {
  circle: 0, // Calculated dynamically
  square: moderateScale(8),
}
