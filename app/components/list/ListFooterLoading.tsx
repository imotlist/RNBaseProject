/**
 * ListFooterLoading.tsx
 *
 * A footer loading indicator for pagination in FlatList.
 * Displays at the bottom of the list when loading more items.
 *
 * @module components/list/ListFooterLoading
 */

import React from "react"
import { View, StyleSheet, ActivityIndicator, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import { scale } from "@/utils/responsive"
import { Text } from "@/components/Text"

export interface ListFooterLoadingProps {
  /**
   * Optional custom style
   */
  style?: ViewStyle
  /**
   * Whether to show "Loading more..." text
   */
  showText?: boolean
  /**
   * Custom loading text
   */
  loadingText?: string
  /**
   * Whether to hide the indicator (useful when hasMore is false)
   */
  visible?: boolean
}

/**
 * A footer loading component for FlatList pagination.
 *
 * @example
 * ```tsx
 * <FlatList
 *   ListFooterComponent={() => <ListFooterLoading isLoadingMore={isLoadingMore} />}
 * />
 * ```
 */
export const ListFooterLoading: React.FC<ListFooterLoadingProps> = ({
  style,
  showText = true,
  loadingText = "Loading more...",
  visible = true,
}) => {
  const { theme } = useAppTheme()

  if (!visible) return null

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="small" color={theme.colors.tint} />
      {showText && (
        <Text style={[styles.loadingText, { color: theme.colors.textDim }]}>
          {loadingText}
        </Text>
      )}
    </View>
  )
}

/**
 * Props version for direct use with FlatList
 */
export interface ListFooterLoadingIndicatorProps {
  /**
   * Whether currently loading more items
   */
  isLoadingMore?: boolean
  /**
   * Whether there are more items to load
   */
  hasMore?: boolean
}

/**
 * HOC to create a FlatList-compatible footer component
 */
export function createListFooterComponent(
  props?: ListFooterLoadingProps,
): React.FC<ListFooterLoadingIndicatorProps> {
  return ({ isLoadingMore = true, hasMore = true }) => {
    if (!isLoadingMore || !hasMore) return null
    return <ListFooterLoading {...props} />
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: scale(16),
    minHeight: scale(48),
  },
  loadingText: {
    marginLeft: scale(8),
    fontSize: scale(14),
  },
})
