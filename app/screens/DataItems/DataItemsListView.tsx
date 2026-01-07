/**
 * DataItemsListView.tsx
 *
 * Presentational component for DataItems list screen.
 * Contains only UI rendering logic - no business logic.
 *
 * @module screens/DataItems
 */

import React, { useEffect, useState } from "react"
import { View, StyleSheet, Pressable, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { InfiniteList } from "@/components/list"
import { SearchBar } from "@/components/ui/SearchBar/SearchBar"
import { FilterChips } from "@/components/filters"
import { scale, scaleFontSize } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import styles from "./DataItemsList.styles"
import { useIsFocused } from "@react-navigation/native"

// ============================================================================
// Types
// ============================================================================

export interface DataItemsItem {
  id: string
  name: string
  description?: string
  [key: string]: any
}

export interface DataItemsListViewProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: Record<string, any>
  setFilters: (filters: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void
  clearFilters: () => void
  activeFilterCount: number
  onOpenFilters: () => void
  renderItem: (item: DataItemsItem) => React.ReactElement | null
  fetchOptions: {
    fetchData: (options: any) => Promise<{ data: DataItemsItem[]; hasMore: boolean; totalCount?: number }>
    pageSize: number
  }
  filterOptions?: Array<{ value: string; label: string }>
}

// ============================================================================
// Filter Options (can be overridden via props)
// ============================================================================

const DEFAULT_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
]

// ============================================================================
// View Component
// ============================================================================

const DataItemsListView: React.FC<DataItemsListViewProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  setFilters,
  clearFilters,
  activeFilterCount,
  onOpenFilters,
  renderItem,
  fetchOptions,
  filterOptions = DEFAULT_FILTER_OPTIONS,
}) => {
    const { theme } = useAppTheme()
    const  { colors, layout }  = theme;
    const statusBarColor = 'white';
    const [useColor, setUseColor] = useState(statusBarColor);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            // console.log("Home screen focused");
            setUseColor(statusBarColor);
        }

    }, [isFocused, useColor]);

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} statusBarBackgroundColor={useColor} style={$outerStyle}>
      {/* Fixed Header */}
      <View style={[styles.header, { backgroundColor: useColor, borderBottomColor: theme.colors.separator }]}>
        <Text preset="heading" style={styles.title}>
          DataItems
        </Text>
      </View>

      <ScrollView style={$flex1} keyboardShouldPersistTaps="handled">
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.background }]}>
          <SearchBar
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search..."
            showFilter
            onFilterPress={onOpenFilters}
            showClear={!!searchQuery}
            size="medium"
            rounded="full"
          />
        </View>

        {/* Filter Chips */}
        <View style={[styles.chipsContainer, { backgroundColor: theme.colors.background }]}>
          <FilterChips
            options={filterOptions}
            selectedValue={filters.option || ""}
            onSelect={(value) =>
              setFilters((prev) => ({
                ...prev,
                option: value || undefined,
              }))
            }
          />
        </View>

        {/* Active Filters Bar */}
        {activeFilterCount > 0 && (
          <View style={[styles.activeFiltersContainer, { backgroundColor: theme.colors.background }]}>
            <View style={styles.activeFiltersRow}>
              <Text style={styles.activeFiltersText}>
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} applied
              </Text>
              <Pressable onPress={clearFilters} style={styles.clearButton}>
                <Text style={[styles.clearButtonText, { color: theme.colors.tint }]}>
                  Clear all
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Infinite List */}
        <InfiniteList
          hookOptions={fetchOptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          flatListProps={{
            contentContainerStyle: styles.listContent,
            scrollEnabled: false,
          }}
        />
      </ScrollView>
    </Screen>
  )
}

export default DataItemsListView

const $outerStyle = {
  flex: 1,
}

const $flex1 = {
  flex: 1,
}
