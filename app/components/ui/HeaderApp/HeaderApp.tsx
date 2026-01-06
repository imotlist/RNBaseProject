/**
 * HeaderApp component
 * A reusable app header with avatar, title/subtitle, and notification icon
 */

import React from "react"
import { View, StyleSheet, Pressable, ViewStyle, TextStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import { Text } from "@/components/Text"
import { Avatar } from "@/components/ui/Avatar"
import { IconPack, IconSaxName } from "@/components/ui/IconPack"
import { scale, moderateScale, scaleFontSize } from "@/utils/responsive"

export interface HeaderAppProps {
  /**
   * Avatar source URI
   */
  avatarUri?: string
  /**
   * Avatar text fallback (first letter of name)
   */
  avatarText?: string
  /**
   * Header title text
   */
  title?: string
  /**
   * Header subtitle text
   */
  subtitle?: string
  /**
   * Notification icon name
   */
  notificationIcon?: IconSaxName
  /**
   * Notification count badge
   */
  notificationCount?: number
  /**
   * Callback when avatar is pressed
   */
  onAvatarPress?: () => void
  /**
   * Callback when notification is pressed
   */
  onNotificationPress?: () => void
  /**
   * Container background color
   */
  backgroundColor?: string
  /**
   * Text color (default: white for header)
   */
  textColor?: string
  /**
   * Container style override
   */
  containerStyle?: ViewStyle
  /**
   * Whether the header is disabled
   */
  disabled?: boolean
}

export const HeaderApp: React.FC<HeaderAppProps> = ({
  avatarUri,
  avatarText = "U",
  title,
  subtitle,
  notificationIcon = "notification",
  notificationCount = 0,
  onAvatarPress,
  onNotificationPress,
  backgroundColor,
  textColor = "#FFFFFF",
  containerStyle,
  disabled = false,
}) => {
  const { theme } = useAppTheme()

  const opacity = disabled ? 0.5 : 1
  const bgColor = backgroundColor || theme.colors.tint

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor, opacity },
        containerStyle,
      ]}
    >
      {/* Left - Avatar */}
      <Pressable onPress={onAvatarPress} disabled={disabled || !onAvatarPress}>
        <Avatar
          source={avatarUri}
          text={avatarText}
          size="medium"
          shape="circle"
        />
      </Pressable>

      {/* Center - Title & Subtitle */}
      <View style={styles.textContainer}>
        {title && (
          <Text size="lg" textStyle="bold" color="white" style={{ color: textColor }}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text size="sm" color="white" style={{ color: textColor }}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right - Notification Icon */}
      <Pressable onPress={onNotificationPress} disabled={disabled || !onNotificationPress}>
        <View style={styles.notificationContainer}>
          <IconPack
            name={notificationIcon}
            size={scale(24)}
            color={textColor}
          />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text size="smallest" style={styles.badgeText}>
                {notificationCount > 99 ? "99+" : notificationCount.toString()}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
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
  textContainer: {
    flex: 1,
    marginLeft: scale(12),
    marginRight: scale(12),
  },
  notificationContainer: {
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
