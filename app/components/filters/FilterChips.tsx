/**
 * FilterChips.tsx
 *
 * A single-select or multi-select filter chips component.
 * Displays selectable filter options as chips.
 *
 * @module components/filters/FilterChips
 */

import React from "react"
import { View, ScrollView, StyleSheet, Pressable, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import { scale, moderateScale, scaleFontSize } from "@/utils/responsive"
import { Text } from "@/components/Text"

export interface FilterChipOption {
  /**
   * Unique identifier for the option
   */
  value: string
  /**
   * Display label
   */
  label: string
  /**
   * Optional icon name
   */
  icon?: string
  /**
   * Optional count badge
   */
  count?: number
}

export interface FilterChipsProps {
  /**
   * Available filter options
   */
  options: FilterChipOption[]
  /**
   * Currently selected value(s)
   */
  selectedValue: string | string[] | null
  /**
   * Callback when selection changes
   */
  onSelect: (value: string) => void
  /**
   * Enable multiple selections
   */
  multiple?: boolean
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
 * A reusable filter chips component for single or multi-select.
 *
 * @example Single select
 * ```tsx
 * <FilterChips
 *   options={[
 *     { value: 'all', label: 'All' },
 *     { value: 'active', label: 'Active' },
 *     { value: 'completed', label: 'Completed' },
 *   ]}
 *   selectedValue={status}
 *   onSelect={(value) => setStatus(value)}
 * />
 * ```
 *
 * @example Multi select
 * ```tsx
 * <FilterChips
 *   multiple
 *   options={categories}
 *   selectedValue={selectedCategories}
 *   onSelect={(value) => toggleCategory(value)}
 * />
 * ```
 */
export const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  selectedValue,
  onSelect,
  multiple = false,
  style,
  showsHorizontalScrollIndicator = false,
}) => {
  const { theme } = useAppTheme()

  const isSelected = (value: string): boolean => {
    if (selectedValue === null || selectedValue === undefined) return false
    if (Array.isArray(selectedValue)) {
      return selectedValue.includes(value)
    }
    return selectedValue === value
  }

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option) => {
          const selected = isSelected(option.value)

          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[
                styles.chip,
                selected
                  ? { backgroundColor: theme.colors.tint }
                  : { backgroundColor: theme.colors.palette.neutral200 },
              ]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  selected ? { color: theme.colors.palette.neutral100 } : { color: theme.colors.text },
                ]}
              >
                {option.label}
              </Text>
              {option.count !== undefined && (
                <Text
                  style={[
                    styles.chipCount,
                    selected
                      ? { backgroundColor: theme.colors.palette.neutral100 + "40", color: theme.colors.palette.neutral100 }
                      : { backgroundColor: theme.colors.palette.neutral300, color: theme.colors.textDim },
                  ]}
                >
                  {option.count}
                </Text>
              )}
            </Pressable>
          )
        })}
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
    paddingVertical: scale(12),
    gap: scale(8),
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: moderateScale(20),
  },
  chipLabel: {
    fontSize: scaleFontSize(14),
    fontWeight: "500",
  },
  chipCount: {
    fontSize: scaleFontSize(12),
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    borderRadius: moderateScale(10),
    marginLeft: scale(6),
    minWidth: scale(20),
    textAlign: "center",
  },
})
