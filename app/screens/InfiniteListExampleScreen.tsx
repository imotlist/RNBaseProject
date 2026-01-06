/**
 * InfiniteListExampleScreen.tsx
 *
 * Example screen demonstrating the useInfiniteList hook with search and filters.
 *
 * @module screens/InfiniteListExampleScreen
 */

import React, { useCallback, useMemo } from "react"
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

// ============================================================================
// Types
// ============================================================================

interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
}

// ============================================================================
// Mock API
// ============================================================================

/**
 * Mock API function - replace with actual API call
 */
const fetchProducts = async (
  options: {
    page: number
    pageSize: number
    searchQuery?: string
    filters?: Record<string, any>
  },
): Promise<{ data: Product[]; hasMore: boolean; totalCount?: number }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const { page, pageSize, searchQuery, filters } = options

  // Mock data generation
  const allProducts: Product[] = Array.from({ length: 100 }, (_, i) => ({
    id: `product-${i + 1}`,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 10,
    category: ["Electronics", "Clothing", "Home", "Sports"][i % 4],
    image: "",
  }))

  // Apply search filter
  let filtered = allProducts
  if (searchQuery) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // Apply category filter
  if (filters?.category) {
    filtered = filtered.filter((p) => p.category === filters.category)
  }

  // Apply price filter
  if (filters?.maxPrice) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice)
  }

  // Pagination
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginated = filtered.slice(start, end)

  return {
    data: paginated,
    hasMore: end < filtered.length,
    totalCount: filtered.length,
  }
}

// ============================================================================
// Filter Options
// ============================================================================

const categoryOptions = [
  { value: "", label: "All" },
  { value: "Electronics", label: "Electronics" },
  { value: "Clothing", label: "Clothing" },
  { value: "Home", label: "Home" },
  { value: "Sports", label: "Sports" },
]

const priceOptions = [
  { value: "", label: "Any Price" },
  { value: "25", label: "Under $25" },
  { value: "50", label: "Under $50" },
  { value: "100", label: "Under $100" },
]

// ============================================================================
// Screen Component
// ============================================================================

/**
 * Example screen showing infinite list with search and filters
 */
export const InfiniteListExampleScreen = () => {
  const { theme } = useAppTheme()
  const { showBottomSheet, closeBottomSheet } = useBottomSheet()

  // Use the infinite list hook
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    clearFilters,
  } = useInfiniteList<Product>({
    fetchData: fetchProducts,
    pageSize: 20,
    pullToRefresh: true,
  })

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.category) count++
    if (filters.maxPrice) count++
    return count
  }, [filters])

  // Open filter bottom sheet
  const handleOpenFilters = useCallback(() => {
    showBottomSheet({
      title: "Filters",
      snapPoints: ["40%"],
      renderContent: () => (
        <FilterSheetContent
          filters={filters}
          setFilters={setFilters}
          onClose={closeBottomSheet}
        />
      ),
    })
  }, [showBottomSheet, filters, setFilters, closeBottomSheet])

  // Render individual product
  const renderProduct = useCallback(
    (product: Product) => (
      <View style={[styles.productCard, { backgroundColor: theme.colors.palette.neutral100 }]}>
        <View style={styles.productInfo}>
          <Text preset="subheading" style={styles.productName}>
            {product.name}
          </Text>
          <Text style={styles.productCategory}>{product.category}</Text>
        </View>
        <Text style={[styles.productPrice, { color: theme.colors.tint }]}>
          ${product.price}
        </Text>
      </View>
    ),
    [theme],
  )

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]}>
      {/* Fixed Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.separator }]}>
        <Text preset="heading" style={styles.title}>
          Products
        </Text>
      </View>

      {/* Search and Filter Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.background }]}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
          showFilter
          onFilterPress={handleOpenFilters}
          showClear
          size="medium"
          rounded="full"
        />
      </View>

      {/* Category Chips - Single Row */}
      <View style={[styles.chipsContainer, { backgroundColor: theme.colors.background }]}>
        <FilterChips
          options={categoryOptions}
          selectedValue={filters.category || ""}
          onSelect={(value) =>
            setFilters((prev) => ({
              ...prev,
              category: value || undefined,
            }))
          }
        />
      </View>

      {/* Active Filters Bar */}
      {activeFilterCount > 0 && (
        <View style={[styles.activeFiltersContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.activeFiltersRow}>
            <Text style={styles.activeFiltersText}>{activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} applied</Text>
            <Pressable onPress={clearFilters} style={styles.clearButton}>
              <Text style={[styles.clearButtonText, { color: theme.colors.tint }]}>Clear all</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Infinite List */}
      <InfiniteList
        hookOptions={{
          fetchData: fetchProducts,
          pageSize: 20,
        }}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        flatListProps={{
          contentContainerStyle: styles.listContent,
        }}
      />
    </Screen>
  )
}

// ============================================================================
// Filter Bottom Sheet Content
// ============================================================================

interface FilterSheetContentProps {
  filters: Record<string, any>
  setFilters: (filters: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void
  onClose: () => void
}

const FilterSheetContent: React.FC<FilterSheetContentProps> = ({ filters, setFilters, onClose }) => {
  const handleReset = useCallback(() => {
    setFilters({ category: undefined, maxPrice: undefined })
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
      <BottomSheetSection title="Price Range">
        <FilterChips
          options={priceOptions}
          selectedValue={filters.maxPrice || ""}
          onSelect={(value) =>
            setFilters((prev) => ({
              ...prev,
              maxPrice: value ? Number.parseInt(value) : undefined,
            }))
          }
        />
      </BottomSheetSection>

      {/* Selected Filters Summary */}
      {(filters.category || filters.maxPrice) && (
        <BottomSheetSection showDivider>
          <View style={styles.filterSummary}>
            <Text style={styles.filterSummaryText}>
              {filters.category && `${filters.category}`}
              {filters.category && filters.maxPrice && " • "}
              {filters.maxPrice && `Under $${filters.maxPrice}`}
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
  header: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
  },
  title: {
    fontSize: scaleFontSize(24),
    fontWeight: "700",
  },
  searchContainer: {
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: scale(8),
  },
  chipsContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
  },
  activeFiltersContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
  },
  activeFiltersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeFiltersText: {
    fontSize: scaleFontSize(13),
    color: "#666",
  },
  clearButton: {
    paddingVertical: scale(4),
    paddingHorizontal: scale(8),
  },
  clearButtonText: {
    fontSize: scaleFontSize(14),
    fontWeight: "600",
  },
  listContent: {
    paddingVertical: scale(8),
  },
  productCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(16),
    marginHorizontal: scale(16),
    marginBottom: scale(8),
    borderRadius: scale(12),
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: scaleFontSize(16),
    fontWeight: "600",
    marginBottom: scale(4),
  },
  productCategory: {
    fontSize: scaleFontSize(13),
  },
  productPrice: {
    fontSize: scaleFontSize(18),
    fontWeight: "700",
  },
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

export default InfiniteListExampleScreen
