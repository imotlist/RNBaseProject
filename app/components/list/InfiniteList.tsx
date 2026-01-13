/**
 * InfiniteList.tsx
 *
 * A complete, ready-to-use infinite list component that combines
 * the useInfiniteList hook with all UI states.
 *
 * @module components/list/InfiniteList
 */

import React, { memo } from "react"
import {
  View,
  FlatList,
  FlatListProps,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { useAppTheme } from "@/theme/context"
import { scale } from "@/utils/responsive"

import {
  ListLoading,
  ListEmpty,
  ListError,
  ListFooterLoading,
  ListEndIndicator,
} from "./index"
import { useInfiniteList, UseInfiniteListOptions, UseInfiniteListReturn } from "@/hooks/useInfiniteList"

// ============================================================================
// Types
// ============================================================================

export interface InfiniteListProps<T> {
  /**
   * Configuration for the infinite list hook
   */
  hookOptions: UseInfiniteListOptions<T>
  /**
   * Render function for each item
   */
  renderItem: (item: T, index: number) => React.ReactElement | null
  /**
   * Unique key extractor for items
   */
  keyExtractor?: (item: T, index: number) => string
  /**
   * Custom empty state component
   */
  EmptyComponent?: React.FC
  /**
   * Custom error component
   */
  ErrorComponent?: React.FC<{ error: Error; onRetry: () => void }>
  /**
   * Custom loading component
   */
  LoadingComponent?: React.FC
  /**
   * Custom footer loading component
   */
  FooterLoadingComponent?: React.FC
  /**
   * Custom end indicator component
   */
  EndIndicatorComponent?: React.FC
  /**
   * Text to display when list is empty
   */
  emptyText?: string
  /**
   * Text to display for retry button
   */
  retryText?: string
  /**
   * Whether to show list end indicator
   */
  showEndIndicator?: boolean
  /**
   * List content container style (wraps FlatList)
   */
  contentContainerStyle?: FlatListProps<T>["contentContainerStyle"]
  /**
   * Additional FlatList props
   */
  flatListProps?: Partial<Omit<FlatListProps<T>, "data" | "renderItem" | "keyExtractor" | "ListEmptyComponent" | "ListFooterComponent" | "refreshControl" | "onEndReached" | "onEndReachedThreshold">>
}

// ============================================================================
// Components
// ============================================================================

/**
 * A complete, ready-to-use infinite list component.
 *
 * This component wraps FlatList with infinite scrolling, pull-to-refresh,
 * loading states, empty states, error states, and search/filter support.
 *
 * @example Basic usage
 * ```tsx
 * <InfiniteList
 *   hookOptions={{
 *     fetchData: async ({ page, pageSize }) => {
 *       const response = await api.getItems(page, pageSize)
 *       return { data: response.items, hasMore: response.hasMore }
 *     },
 *   }}
 *   renderItem={(item) => <ItemCard item={item} />}
 *   keyExtractor={(item) => item.id}
 * />
 * ```
 *
 * @example With search and filters
 * ```tsx
 * const { searchQuery, setSearchQuery, filters, setFilters } = useInfiniteList({
 *   fetchData,
 * })
 *
 * return (
 *   <>
 *     <SearchBar value={searchQuery} onChange={setSearchQuery} />
 *     <FilterChips options={filterOptions} onSelect={setFilters} />
 *     <InfiniteList
 *       hookOptions={hookOptions}
 *       renderItem={(item) => <ItemCard item={item} />}
 *     />
 *   </>
 * )
 * ```
 */
function InfiniteListInner<T>({
  hookOptions,
  renderItem,
  keyExtractor,
  EmptyComponent,
  ErrorComponent,
  LoadingComponent,
  FooterLoadingComponent,
  EndIndicatorComponent,
  emptyText,
  retryText,
  showEndIndicator = true,
  contentContainerStyle,
  flatListProps,
}: InfiniteListProps<T>) {
  const { theme } = useAppTheme()

  // Use the infinite list hook
  const listState = useInfiniteList<T>(hookOptions)

  const {
    data,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    hasMore,
    refresh,
    retry,
    listRef,
    onEndReached,
    searchQuery,
  } = listState

  // Default empty state
  const DefaultEmptyComponent = () => (
    <ListEmpty
      title={emptyText || "No items found"}
      message={searchQuery?.length ? "Try adjusting your search" : undefined}
    />
  )

  // Default error state
  const DefaultErrorComponent = () => <ListError message={error?.message} onRetry={retry} retryLabel={retryText} />

  // Default loading state
  const DefaultLoadingComponent = () => <ListLoading type="initial" />

  // Default footer loading
  const DefaultFooterLoadingComponent = () => (
    <ListFooterLoading visible={isLoadingMore} />
  )

  // Default end indicator
  const DefaultEndIndicatorComponent = () => <ListEndIndicator visible={!hasMore && !isLoading && data.length > 0} />

  // Determine which components to use
  const RenderEmpty = EmptyComponent || DefaultEmptyComponent
  const RenderError = ErrorComponent || DefaultErrorComponent
  const RenderLoading = LoadingComponent || DefaultLoadingComponent
  const RenderFooterLoading = FooterLoadingComponent || DefaultFooterLoadingComponent
  const RenderEndIndicator = EndIndicatorComponent || DefaultEndIndicatorComponent

  // Show error state if there's an error and no data
  if (error && data.length === 0 && !isLoading) {
    return <RenderError error={error} onRetry={retry} />
  }

  // Show loading state on initial load
  if (isLoading && data.length === 0) {
    return <RenderLoading />
  }

  // Determine footer component
  const ListFooterComponent = () => {
    if (isLoadingMore) {
      return <RenderFooterLoading />
    }
    if (!hasMore && showEndIndicator) {
      return <RenderEndIndicator />
    }
    return null
  }

  return (
    <FlatList
      ref={listRef}
      data={data}
      style={{backgroundColor:'white'}}
      keyExtractor={keyExtractor || ((item, index) => `${index}-${JSON.stringify(item)}`)}
      renderItem={({ item, index }) => renderItem(item, index)}
      ListEmptyComponent={data.length === 0 && !isLoading ? RenderEmpty : undefined}
      ListFooterComponent={ListFooterComponent}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          tintColor={theme.colors.tint}
          colors={[theme.colors.tint]}
        />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={hookOptions.onEndReachedThreshold || 0.5}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      {...flatListProps}
    />
  )
}

// Export memoized version for performance
export const InfiniteList = memo(InfiniteListInner) as <T>(
  props: InfiniteListProps<T>,
) => React.ReactElement | null

// ============================================================================
// Helper Hooks
// ============================================================================

/**
 * A hook that returns both the list state and a pre-configured InfiniteList component.
 * Useful for when you need to access list state for search/filter controls.
 *
 * @example
 * ```tsx
 * function MyScreen() {
 *   const { listState, InfiniteListComponent } = useInfiniteListComponent({
 *     fetchData: async ({ page, pageSize, searchQuery, filters }) => {
 *       const response = await api.getItems(page, pageSize, searchQuery, filters)
 *       return { data: response.items, hasMore: response.hasMore }
 *     },
 *   })
 *
 *   return (
 *     <>
 *       <SearchBar value={listState.searchQuery} onChange={listState.setSearchQuery} />
 *       <InfiniteListComponent
 *         renderItem={(item) => <ItemCard item={item} />}
 *         keyExtractor={(item) => item.id}
 *       />
 *     </>
 *   )
 * }
 * ```
 */
export function useInfiniteListComponent<T>(hookOptions: UseInfiniteListOptions<T>) {
  const listState = useInfiniteList<T>(hookOptions)

  const InfiniteListComponent = memo((props: Omit<InfiniteListProps<T>, "hookOptions">) => (
    <InfiniteList {...props} hookOptions={hookOptions} />
  ))

  InfiniteListComponent.displayName = "InfiniteListComponent"

  return {
    listState,
    InfiniteListComponent,
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
})
