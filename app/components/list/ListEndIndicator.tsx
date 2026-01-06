/**
 * ListEndIndicator.tsx
 *
 * A component to indicate the end of a list.
 * Shows when there are no more items to load.
 *
 * @module components/list/ListEndIndicator
 */

import React from "react"
import { View, StyleSheet, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import { scale, scaleFontSize } from "@/utils/responsive"
import { Text } from "@/components/Text"

export interface ListEndIndicatorProps {
  /**
   * Optional custom style
   */
  style?: ViewStyle
  /**
   * Custom end message
   */
  text?: string
  /**
   * Whether to show the indicator
   */
  visible?: boolean
  /**
   * Whether to show a line divider
   */
  showDivider?: boolean
}

/**
 * A component indicating the end of a list has been reached.
 *
 * @example
 * ```tsx
 * <FlatList
 *   ListFooterComponent={() => (
 *     hasMore ? <ListFooterLoading /> : <ListEndIndicator />
 *   )}
 * />
 * ```
 */
export const ListEndIndicator: React.FC<ListEndIndicatorProps> = ({
  style,
  text = "You've reached the end",
  visible = true,
  showDivider = true,
}) => {
  const { theme } = useAppTheme()

  if (!visible) return null

  return (
    <View style={[styles.container, style]}>
      {showDivider && <View style={[styles.divider, { backgroundColor: theme.colors.separator }]} />}
      <Text style={[styles.text, { color: theme.colors.textDim }]}>
        {text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: scale(24),
    paddingHorizontal: scale(16),
  },
  divider: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    marginBottom: scale(16),
  },
  text: {
    fontSize: scaleFontSize(12),
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
})
