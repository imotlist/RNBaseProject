/**
 * {{FEATURE_NAME_PASCAL}}Screen.tsx
 *
 * List-based screen template for {{FEATURE_NAME}} feature.
 * This file contains the screen controller logic with data fetching,
 * state management, and event handlers.
 *
 * @module screens/{{FEATURE_NAME}}
 */

import { useCallback, useMemo } from "react"
import { View, StyleSheet, Pressable } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { InfiniteList } from "@/components/list"
import { SearchBar } from "@/components/ui/SearchBar/SearchBar"
import { FilterChips } from "@/components/filters"
import { BottomSheetContent, BottomSheetSection } from "@/components/ui/BottomSheetContent"
import { useInfiniteList } from "@/hooks/useInfiniteList"
import { useBottomSheet } from "@/hooks/useBottomSheet"
import { scale, scaleFontSize } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import {{FEATURE_NAME_PASCAL}}ListView from "./{{FEATURE_NAME_PASCAL}}ListView"
// ============================================================================
// Types
// ============================================================================

export interface {{FEATURE_NAME_PASCAL}}Item {
  id: string
  name: string
  description?: string
  [key: string]: any
}

// ============================================================================
// API Service
// ============================================================================

/**
 * Fetch {{FEATURE_NAME}} items from API
 * Replace this with your actual API call
 */
const fetch{{FEATURE_NAME_PASCAL}}Items = async (
  options: {
    page: number
    pageSize: number
    searchQuery?: string
    filters?: Record<string, any>
  },
): Promise<{ data: {{FEATURE_NAME_PASCAL}}Item[]; hasMore: boolean; totalCount?: number }> => {
  // TODO: Replace with actual API call
  const { page, pageSize } = options

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data - replace with actual API response
  const mockData: {{FEATURE_NAME_PASCAL}}Item[] = Array.from({ length: pageSize }, (_, i) => ({
    id: `{{FEATURE_NAME_CAMEL}}-${page}-${i}`,
    name: `${{FEATURE_NAME_PASCAL}} ${(page - 1) * pageSize + i + 1}`,
    description: `Description for item ${(page - 1) * pageSize + i + 1}`,
  }))

  return {
    data: mockData,
    hasMore: page < 5, // Example: 5 pages max
    totalCount: pageSize * 5,
  }
}

// ============================================================================
// Filter Options
// ============================================================================

const DEFAULT_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
]

// ============================================================================
// Screen Component
// ============================================================================

export const {{FEATURE_NAME_PASCAL}}Screen = () => {
  const { theme } = useAppTheme()
  const { showBottomSheet, closeBottomSheet } = useBottomSheet()

  // Use the infinite list hook
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    clearFilters,
  } = useInfiniteList<{{FEATURE_NAME_PASCAL}}Item>({
    fetchData: fetch{{FEATURE_NAME_PASCAL}}Items,
    pageSize: 20,
    pullToRefresh: true,
  })

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length
  }, [filters])

  // Open filter bottom sheet
  const handleOpenFilters = useCallback(() => {
    showBottomSheet({
      title: "Filters",
      snapPoints: ["60%"],
      renderContent: () => (
        <{{FEATURE_NAME_PASCAL}}FilterSheet
          filters={filters}
          setFilters={setFilters}
          onClose={closeBottomSheet}
        />
      ),
    })
  }, [showBottomSheet, filters, setFilters, closeBottomSheet])

  // Render individual item
  const renderItem = useCallback(
    (item: {{FEATURE_NAME_PASCAL}}Item) => (
      <{{FEATURE_NAME_PASCAL}}ListItem item={item} />
    ),
    [],
  )

  return (
    <{{FEATURE_NAME_PASCAL}}ListView
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      filters={filters}
      setFilters={setFilters}
      clearFilters={clearFilters}
      activeFilterCount={activeFilterCount}
      onOpenFilters={handleOpenFilters}
      renderItem={renderItem}
      fetchOptions={{ fetchData: fetch{{FEATURE_NAME_PASCAL}}Items, pageSize: 20 }}
    />
  )
}

// ============================================================================
// Filter Sheet Component
// ============================================================================

interface {{FEATURE_NAME_PASCAL}}FilterSheetProps {
  filters: Record<string, any>
  setFilters: (filters: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void
  onClose: () => void
}

const {{FEATURE_NAME_PASCAL}}FilterSheet: React.FC<{{FEATURE_NAME_PASCAL}}FilterSheetProps> = ({
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
      <BottomSheetSection title="Filter Options">
        <FilterChips
          options={DEFAULT_FILTER_OPTIONS}
          selectedValue={filters.option || ""}
          onSelect={(value) =>
            setFilters((prev) => ({
              ...prev,
              option: value || undefined,
            }))
          }
        />
      </BottomSheetSection>

      {/* Add more filter sections here */}
    </BottomSheetContent>
  )
}

// ============================================================================
// List Item Component
// ============================================================================

interface {{FEATURE_NAME_PASCAL}}ListItemProps {
  item: {{FEATURE_NAME_PASCAL}}Item
}

const {{FEATURE_NAME_PASCAL}}ListItem: React.FC<{{FEATURE_NAME_PASCAL}}ListItemProps> = ({ item }) => {
  const { theme } = useAppTheme()

  return (
    <Pressable
      style={[styles.itemCard, { backgroundColor: theme.colors.palette.neutral100 }]}
      onPress={() => {
        // TODO: Handle item press
        console.log("Pressed:", item.id)
      }}
    >
      <View style={styles.itemContent}>
        <Text preset="subheading" style={styles.itemName}>
          {item.name}
        </Text>
        {item.description && (
          <Text style={styles.itemDescription}>{item.description}</Text>
        )}
      </View>
    </Pressable>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "row",
    padding: scale(16),
    marginHorizontal: scale(16),
    marginBottom: scale(8),
    borderRadius: scale(12),
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: scaleFontSize(16),
    fontWeight: "600",
    marginBottom: scale(4),
  },
  itemDescription: {
    fontSize: scaleFontSize(13),
  },
})
