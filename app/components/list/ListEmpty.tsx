/**
 * ListEmpty.tsx
 *
 * A reusable empty state component for lists.
 * Displays a message when no items are found.
 *
 * @module components/list/ListEmpty
 */

import React from "react"
import { View, StyleSheet, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import { scale, moderateScale, scaleFontSize } from "@/utils/responsive"
import { Text } from "@/components/Text"
import { Icon, IconTypes } from "@/components/Icon"

export interface ListEmptyProps {
  /**
   * Icon to display
   */
  icon?: IconTypes
  /**
   * Main message/title
   */
  title?: string
  /**
   * Optional description/subtitle
   */
  message?: string
  /**
   * Optional action button text
   */
  actionLabel?: string
  /**
   * Callback when action button is pressed
   */
  onAction?: () => void
  /**
   * Optional custom style
   */
  style?: ViewStyle
  /**
   * Whether this is due to a search returning no results
   */
  isSearchResult?: boolean
}

/**
 * A reusable empty state component for lists.
 *
 * @example
 * ```tsx
 * <ListEmpty
 *   icon="inbox"
 *   title="No items found"
 *   message="Try adjusting your search or filters"
 *   actionLabel="Clear filters"
 *   onAction={() => clearFilters()}
 * />
 * ```
 */
export const ListEmpty: React.FC<ListEmptyProps> = ({
  icon = "hidden",
  title = "No items found",
  message,
  actionLabel,
  onAction,
  style,
  isSearchResult = false,
}) => {
  const { theme } = useAppTheme()

  const displayTitle = isSearchResult ? "No results found" : title
  const displayMessage = isSearchResult
    ? "Try different keywords or clear your search"
    : message

  return (
    <View style={[styles.container, style]}>
      <Icon
        icon={icon}
        size={scale(64)}
        color={theme.colors.textDim}
        style={styles.icon}
      />
      <Text preset="subheading" style={styles.title}>
        {displayTitle}
      </Text>
      {displayMessage && (
        <Text style={styles.message}>{displayMessage}</Text>
      )}
      {actionLabel && onAction && (
        <Text
          text={actionLabel}
          style={[styles.actionButton, { borderColor: theme.colors.tint, color: theme.colors.tint }]}
          onPress={onAction}
        />
      )}
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
    opacity: 0.5,
  },
  title: {
    textAlign: "center",
    marginBottom: scale(8),
  },
  message: {
    textAlign: "center",
    fontSize: scaleFontSize(14),
    lineHeight: scaleFontSize(20),
  },
  actionButton: {
    marginTop: scale(24),
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    fontSize: scaleFontSize(14),
    fontWeight: "600",
  },
})
