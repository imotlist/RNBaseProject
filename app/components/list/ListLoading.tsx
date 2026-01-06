/**
 * ListLoading.tsx
 *
 * A reusable loading component for infinite lists.
 * Shows different loading states based on context (initial vs pagination).
 *
 * @module components/list/ListLoading
 */

import React from "react"
import { View, StyleSheet, ViewStyle, ActivityIndicator } from "react-native"
import { useAppTheme } from "@/theme/context"
import { scale } from "@/utils/responsive"
import { Text } from "@/components/Text"

export interface ListLoadingProps {
  /**
   * Whether this is the initial loading state (shows centered spinner)
   * or pagination loading (shows spinner at bottom)
   */
  type?: "initial" | "pagination"
  /**
   * Optional custom style
   */
  style?: ViewStyle
  /**
   * Optional size for the ActivityIndicator
   */
  size?: number | "small" | "large"
  /**
   * Optional text to display below the spinner
   */
  text?: string
}

/**
 * A reusable loading component for lists.
 *
 * @example
 * ```tsx
 * // Initial loading (centered)
 * <ListLoading type="initial" />
 *
 * // Pagination loading (at bottom)
 * <ListLoading type="pagination" />
 * ```
 */
export const ListLoading: React.FC<ListLoadingProps> = ({
  type = "initial",
  style,
  size = "large",
  text,
}) => {
  const { theme } = useAppTheme()
  const isInitial = type === "initial"

  return (
    <View style={[styles.container, isInitial && styles.centered, style]}>
      <ActivityIndicator
        size={size}
        color={theme.colors.tint}
        style={styles.spinner}
      />
      {text && (
        <Text style={styles.loadingText}>{text}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: scale(24),
    width: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: scale(200),
  },
  spinner: {
    marginBottom: scale(8),
  },
  loadingText: {
    marginTop: scale(8),
  },
})
