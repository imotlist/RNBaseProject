/**
 * DataItemsScreen.tsx
 *
 * List-based screen template for DataItems feature.
 * This file contains the screen controller logic with data fetching,
 * state management, and event handlers.
 *
 * @module screens/DataItems
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
import { Avatar } from "@/components/ui"
import { Icon } from "@/components/Icon"
import DataItemsListView from "./DataItemsListView"
// ============================================================================
// Types
// ============================================================================

export interface DataItemsItem {
  id: string
  name: string
  description?: string
  category?: string
  status?: "active" | "pending" | "completed"
  [key: string]: any
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_ITEMS: Omit<DataItemsItem, "id">[] = [
  { name: "Project Alpha", description: "Mobile app development project", category: "Development", status: "active" },
  { name: "Website Redesign", description: "Complete UI/UX overhaul", category: "Design", status: "active" },
  { name: "API Integration", description: "Third-party service integration", category: "Development", status: "pending" },
  { name: "User Testing", description: "Conduct user research sessions", category: "Research", status: "completed" },
  { name: "Database Migration", description: "Upgrade to new database system", category: "Infrastructure", status: "pending" },
  { name: "Security Audit", description: "Annual security review", category: "Security", status: "active" },
  { name: "Performance Optimization", description: "Improve app load times", category: "Development", status: "pending" },
  { name: "Documentation Update", description: "Update technical documentation", category: "Documentation", status: "completed" },
]

// ============================================================================
// API Service
// ============================================================================

/**
 * Fetch DataItems items from mock data
 */
const fetchDataItemsItems = async (
  options: {
    page: number
    pageSize: number
    searchQuery?: string
    filters?: Record<string, any>
  },
): Promise<{ data: DataItemsItem[]; hasMore: boolean; totalCount?: number }> => {
  const { page, pageSize, searchQuery, filters } = options

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Filter by search query
  let filteredItems = [...MOCK_ITEMS]
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query),
    )
  }

  // Filter by category
  if (filters.category) {
    filteredItems = filteredItems.filter((item) => item.category === filters.category)
  }

  // Filter by status
  if (filters.status) {
    filteredItems = filteredItems.filter((item) => item.status === filters.status)
  }

  // Pagination
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  // Map to DataItemsItem with ID
  const data: DataItemsItem[] = paginatedItems.map((item, index) => ({
    ...item,
    id: `dataItems-${page}-${index}`,
  }))

  // For demo, generate more items if we run out
  if (data.length < pageSize && page < 3) {
    for (let i = data.length; i < pageSize; i++) {
      const mockIndex = i % MOCK_ITEMS.length
      data.push({
        ...MOCK_ITEMS[mockIndex],
        id: `dataItems-${page}-${i}`,
        name: `${MOCK_ITEMS[mockIndex].name} (Copy ${i + 1})`,
      })
    }
  }

  return {
    data,
    hasMore: page < 3,
    totalCount: filteredItems.length + 20, // Mock total count
  }
}

// ============================================================================
// Filter Options
// ============================================================================

const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "Development", label: "Development" },
  { value: "Design", label: "Design" },
  { value: "Research", label: "Research" },
  { value: "Infrastructure", label: "Infrastructure" },
]

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
]

// ============================================================================
// Screen Component
// ============================================================================

export const DataItemsScreen = () => {
  const { theme } = useAppTheme()
  const { showBottomSheet, closeBottomSheet } = useBottomSheet()

  // Use the infinite list hook
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    clearFilters,
  } = useInfiniteList<DataItemsItem>({
    fetchData: fetchDataItemsItems,
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
        <DataItemsFilterSheet
          filters={filters}
          setFilters={setFilters}
          onClose={closeBottomSheet}
        />
      ),
    })
  }, [showBottomSheet, filters, setFilters, closeBottomSheet])

  // Render individual item
  const renderItem = useCallback(
    (item: DataItemsItem) => (
      <DataItemsListItem item={item} />
    ),
    [],
  )

  return (
    <DataItemsListView
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      filters={filters}
      setFilters={setFilters}
      clearFilters={clearFilters}
      activeFilterCount={activeFilterCount}
      onOpenFilters={handleOpenFilters}
      renderItem={renderItem}
      fetchOptions={{ fetchData: fetchDataItemsItems, pageSize: 20 }}
      filterOptions={CATEGORY_OPTIONS}
    />
  )
}

// ============================================================================
// Filter Sheet Component
// ============================================================================

interface DataItemsFilterSheetProps {
  filters: Record<string, any>
  setFilters: (filters: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void
  onClose: () => void
}

const DataItemsFilterSheet: React.FC<DataItemsFilterSheetProps> = ({
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
      primaryButtonLabel="Apply"
      onPrimaryPress={onClose}
      secondaryButtonLabel="Reset"
      onSecondaryPress={handleReset}
      onClose={onClose}
    >
      <BottomSheetSection title="Category">
        <FilterChips
          multiple={false}
          options={CATEGORY_OPTIONS}
          selectedValue={filters.category || ""}
          onSelect={(value) =>
            setFilters((prev) => ({
              ...prev,
              category: value || undefined,
            }))
          }
        />
      </BottomSheetSection>

      <BottomSheetSection title="Status">
        <FilterChips
          multiple={false}
          options={STATUS_OPTIONS}
          selectedValue={filters.status || ""}
          onSelect={(value) =>
            setFilters((prev) => ({
              ...prev,
              status: value || undefined,
            }))
          }
        />
      </BottomSheetSection>
    </BottomSheetContent>
  )
}

// ============================================================================
// List Item Component
// ============================================================================

interface DataItemsListItemProps {
  item: DataItemsItem
}

const DataItemsListItem: React.FC<DataItemsListItemProps> = ({ item }) => {
  const { theme } = useAppTheme()

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active": return theme.colors.palette.success500
      case "pending": return theme.colors.palette.warning500
      case "completed": return theme.colors.palette.neutral400
      default: return theme.colors.palette.neutral400
    }
  }

  const getCategoryColor = (category?: string) => {
    const hash = category?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0
    const colors = [
      theme.colors.palette.primary500,
      theme.colors.palette.danger500,
      theme.colors.palette.success500,
      theme.colors.palette.warning500,
      theme.colors.tint,
    ]
    return colors[hash % colors.length]
  }

  return (
    <Pressable
      style={[styles.itemCard, { backgroundColor: theme.colors.palette.neutral100 }]}
      onPress={() => {
        console.log("Pressed:", item.id)
      }}
    >
      <View style={styles.itemIcon}>
        <Avatar
          size="medium"
          text={item.name.charAt(0)}
          backgroundColor={getCategoryColor(item.category) + "20"}
          textColor={getCategoryColor(item.category)}
        />
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text preset="subheading" style={styles.itemName}>
            {item.name}
          </Text>
          {item.status && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "20" }]}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status}
              </Text>
            </View>
          )}
        </View>
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {item.category && (
          <View style={styles.categoryRow}>
            <Icon icon="tag" size={12} color={theme.colors.textDim} />
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        )}
      </View>
      <Icon icon="chevronRight" size={16} color={theme.colors.textDim} />
    </Pressable>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
    marginHorizontal: scale(16),
    marginBottom: scale(8),
    borderRadius: scale(12),
  },
  itemIcon: {
    marginRight: scale(12),
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scale(4),
  },
  itemName: {
    fontSize: scaleFontSize(16),
    fontWeight: "600",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(12),
    marginLeft: scale(8),
  },
  statusText: {
    fontSize: scaleFontSize(11),
    fontWeight: "600",
    textTransform: "uppercase",
  },
  itemDescription: {
    fontSize: scaleFontSize(13),
    marginBottom: scale(4),
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    marginTop: scale(4),
  },
  categoryText: {
    fontSize: scaleFontSize(12),
  },
})
