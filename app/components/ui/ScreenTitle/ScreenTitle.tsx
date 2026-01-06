/**
 * ScreenTitle component
 * A reusable title component for screens
 */

import React from "react"
import { View, StyleSheet } from "react-native"
import { useAppTheme } from "@/theme/context"
import { Text, TextProps } from "@/components/Text"
import { Icon } from "@/components/Icon"

export interface ScreenTitleProps {
  /**
   * Title text or translation key
   */
  title?: TextProps["text"]
  /**
   * Title translation key
   */
  titleTx?: TextProps["tx"]
  /**
   * Subtitle text or translation key
   */
  subtitle?: TextProps["text"]
  /**
   * Subtitle translation key
   */
  subtitleTx?: TextProps["tx"]
  /**
   * Icon to display
   */
  icon?: string
  /**
   * Icon color
   */
  iconColor?: string
  /**
   * Alignment of the title
   */
  align?: "flex-start" | "center" | "flex-end"
}

export const ScreenTitle: React.FC<ScreenTitleProps> = ({
  title,
  titleTx,
  subtitle,
  subtitleTx,
  icon,
  iconColor,
  align = "flex-start",
}) => {
  const { theme } = useAppTheme()

  return (
    <View style={[styles.container, { alignItems: align }]}>
      {icon && (
        <Icon
          icon={icon as any}
          size={32}
          color={iconColor || theme.colors.tint}
          style={styles.icon}
        />
      )}
      <Text
        text={title}
        tx={titleTx}
        preset="heading"
        style={[styles.title, { color: theme.colors.text, textAlign: align === "flex-start" ? "left" : align === "flex-end" ? "right" : "center" }]}
      />
      {(subtitle || subtitleTx) && (
        <Text
          text={subtitle}
          tx={subtitleTx}
          style={[styles.subtitle, { color: theme.colors.textDim, textAlign: align === "flex-start" ? "left" : align === "flex-end" ? "right" : "center" }]}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 12,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
})
