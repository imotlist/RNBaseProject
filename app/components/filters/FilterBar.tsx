/**
 * FilterBar.tsx
 *
 * A reusable filter bar component for lists.
 * Displays active filters and provides a way to clear them.
 *
 * @module components/filters/FilterBar
 */

import React from "react"
import { View, ScrollView, StyleSheet, Pressable, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import { scale, moderateScale, scaleFontSize } from "@/utils/responsive"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"

export interface FilterOption {
  /**
   * Unique identifier for the filter
   */
  key: string
  /**
   * Display label
   */
  label: string
  /**
   * Icon name (optional)
   */
  icon?: string
}

export interface FilterBarProps {
  /**
   * Currently active filters
   */
  activeFilters: FilterOption[]
  /**
   * Callback when a filter is removed
   */
  onRemoveFilter: (key: string) => void
  /**
   * Callback to clear all filters
   */
  onClearAll?: () => void
  /**
   * Optional custom style
   */
  style?: ViewStyle
  /**
   * Whether to show scroll indicators
   */
  showsHorizontalScrollIndicator?: boolean
}

/**
 * A reusable filter bar displaying active filter chips.
 *
 * @example
 * ```tsx
 * const [activeFilters, setActiveFilters] = useState([
 *   { key: 'category', label: 'Electronics' },
 *   { key: 'price', label: 'Under $50' },
 * ])
 *
 * <FilterBar
 *   activeFilters={activeFilters}
 *   onRemoveFilter={(key) => setActiveFilters(prev => prev.filter(f => f.key !== key))}
 *   onClearAll={() => setActiveFilters([])}
 * />
 * ```
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilters,
  onRemoveFilter,
  onClearAll,
  style,
  showsHorizontalScrollIndicator = false,
}) => {
  const { theme } = useAppTheme()

  if (activeFilters.length === 0) return null

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        contentContainerStyle={styles.scrollContent}
      >
        {activeFilters.map((filter) => (
          <View
            key={filter.key}
            style={[styles.filterChip, { backgroundColor: theme.colors.palette.neutral200 }]}
          >
            <Text style={[styles.filterLabel, { color: theme.colors.text }]}>
              {filter.label}
            </Text>
            <Pressable
              onPress={() => onRemoveFilter(filter.key)}
              style={styles.removeButton}
              hitSlop={scale(8)}
            >
              <Icon
                icon="x"
                size={scale(14)}
                color={theme.colors.textDim}
                style={styles.removeIcon}
              />
            </Pressable>
          </View>
        ))}
        {onClearAll && activeFilters.length > 1 && (
          <Pressable onPress={onClearAll} style={styles.clearAllButton}>
            <Text style={[styles.clearAllText, { color: theme.colors.tint }]}>
              Clear all
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    gap: scale(8),
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: moderateScale(16),
  },
  filterLabel: {
    fontSize: scaleFontSize(14),
    marginRight: scale(4),
  },
  removeButton: {
    marginLeft: scale(4),
    padding: scale(2),
  },
  removeIcon: {},
  clearAllButton: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    justifyContent: "center",
  },
  clearAllText: {
    fontSize: scaleFontSize(14),
    fontWeight: "600",
  },
})
