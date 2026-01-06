/**
 * {{FEATURE_NAME_PASCAL}}FilterSheet.tsx
 *
 * Filter bottom sheet component for {{FEATURE_NAME}} list screen.
 * This component is rendered inside a bottom sheet modal.
 *
 * @module screens/{{FEATURE_NAME}}
 */

import React, { useCallback } from "react"
import { View, StyleSheet } from "react-native"
import { Text } from "@/components/Text"
import { FilterChips } from "@/components/filters"
import { BottomSheetContent, BottomSheetSection } from "@/components/ui/BottomSheetContent"
import { scale, scaleFontSize } from "@/utils/responsive"

// ============================================================================
// Types
// ============================================================================

export interface {{FEATURE_NAME_PASCAL}}FilterSheetProps {
  filters: Record<string, any>
  setFilters: (filters: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void
  onClose: () => void
}

// ============================================================================
// Filter Options
// ============================================================================

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
]

const SECONDARY_FILTER_OPTIONS = [
  { value: "", label: "Any" },
  { value: "value1", label: "Value 1" },
  { value: "value2", label: "Value 2" },
]

// ============================================================================
// Component
// ============================================================================

export const {{FEATURE_NAME_PASCAL}}FilterSheet: React.FC<{{FEATURE_NAME_PASCAL}}FilterSheetProps> = ({
  filters,
  setFilters,
  onClose,
}) => {
  const handleReset = useCallback(() => {
    setFilters({})
  }, [setFilters])

  return (
    <BottomSheetContent
      title="Filters"
      primaryButtonLabel="Done"
      onPrimaryPress={onClose}
      secondaryButtonLabel="Reset"
      onSecondaryPress={handleReset}
      onClose={onClose}
    >
      {/* Primary Filter */}
      <BottomSheetSection title="Options">
        <FilterChips
          options={FILTER_OPTIONS}
          selectedValue={filters.option || ""}
          onSelect={(value) =>
            setFilters((prev) => ({
              ...prev,
              option: value || undefined,
            }))
          }
        />
      </BottomSheetSection>

      {/* Secondary Filter */}
      <BottomSheetSection title="Additional Options" showDivider>
        <FilterChips
          options={SECONDARY_FILTER_OPTIONS}
          selectedValue={filters.secondaryOption || ""}
          onSelect={(value) =>
            setFilters((prev) => ({
              ...prev,
              secondaryOption: value || undefined,
            }))
          }
        />
      </BottomSheetSection>

      {/* Active Filters Summary */}
      {(Object.keys(filters).length > 0) && (
        <BottomSheetSection showDivider>
          <View style={styles.filterSummary}>
            <Text style={styles.filterSummaryText}>
              {Object.keys(filters).length} filter{Object.keys(filters).length > 1 ? "s" : ""} applied
            </Text>
          </View>
        </BottomSheetSection>
      )}
    </BottomSheetContent>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  filterSummary: {
    padding: scale(14),
    borderRadius: scale(10),
    backgroundColor: "#F4F2F1",
  },
  filterSummaryText: {
    fontSize: scaleFontSize(14),
    fontWeight: "500",
  },
})
