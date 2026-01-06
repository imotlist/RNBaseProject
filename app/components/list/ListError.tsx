/**
 * ListError.tsx
 *
 * A reusable error state component for lists.
 * Displays an error message with retry functionality.
 *
 * @module components/list/ListError
 */

import React from "react"
import { View, StyleSheet, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import { scale, moderateScale, scaleFontSize } from "@/utils/responsive"
import { Text } from "@/components/Text"
import { Icon, IconTypes } from "@/components/Icon"
import { Button } from "@/components/Button"

export interface ListErrorProps {
  /**
   * Icon to display
   */
  icon?: IconTypes
  /**
   * Error message
   */
  message?: string
  /**
   * Callback when retry button is pressed
   */
  onRetry: () => void
  /**
   * Optional custom style
   */
  style?: ViewStyle
  /**
   * Custom retry button text
   */
  retryLabel?: string
}

/**
 * A reusable error state component for lists.
 *
 * @example
 * ```tsx
 * <ListError
 *   message="Failed to load items"
 *   onRetry={() => retry()}
 *   retryLabel="Try Again"
 * />
 * ```
 */
export const ListError: React.FC<ListErrorProps> = ({
  icon = "debug",
  message = "Something went wrong",
  onRetry,
  style,
  retryLabel = "Try Again",
}) => {
  const { theme } = useAppTheme()

  return (
    <View style={[styles.container, style]}>
      <Icon
        icon={icon}
        size={scale(48)}
        color={theme.colors.error}
        style={styles.icon}
      />
      <Text preset="subheading" style={styles.title}>
        {message}
      </Text>
      <Button
        text={retryLabel}
        onPress={onRetry}
        size="small"
        style={styles.retryButton}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: scale(48),
    paddingHorizontal: scale(24),
    minHeight: scale(300),
  },
  icon: {
    marginBottom: scale(16),
  },
  title: {
    textAlign: "center",
    marginBottom: scale(24),
  },
  retryButton: {
    minWidth: scale(120),
  },
})
