/**
 * useInfiniteList.ts
 *
 * A comprehensive, API-agnostic hook for infinite scrolling lists with:
 * - Infinite pagination (load more)
 * - Pull to refresh
 * - Initial loading state
 * - Empty list state
 * - Error state
 * - Retry mechanism
 * - Search query support
 * - Filter options support
 *
 * @module hooks/useInfiniteList
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { FlatList, FlatListProps, RefreshControl } from "react-native"

// ============================================================================
// Types
// ============================================================================

/**
 * Configuration for fetching data from an API
 */
export interface InfiniteListFetchOptions<T> {
  /**
   * Current page number (1-based)
   */
  page: number
  /**
   * Number of items per page
   */
  pageSize: number
  /**
   * Optional search query string
   */
  searchQuery?: string
  /**
   * Optional filter parameters object
   */
  filters?: Record<string, any>
}

/**
 * Result from a fetch operation
 */
export interface InfiniteListFetchResult<T> {
  /**
   * Array of items for the current page
   */
  data: T[]
  /**
   * Whether there are more items to load
   */
  hasMore: boolean
  /**
   * Total count (optional, for showing item counts)
   */
  totalCount?: number
}

/**
 * Configuration options for the hook
 */
export interface UseInfiniteListOptions<T> {
  /**
   * Function to fetch data. Should be memoized with useCallback.
   * Receives page, pageSize, searchQuery, and filters.
   */
  fetchData: (options: InfiniteListFetchOptions<T>) => Promise<InfiniteListFetchResult<T>>
  /**
   * Number of items per page (default: 20)
   */
  pageSize?: number
  /**
   * Initial page number (default: 1)
   */
  initialPage?: number
  /**
   * Enable pull-to-refresh (default: true)
   */
  pullToRefresh?: boolean
  /**
   * Threshold for triggering load more (default: 0.5 = 50% from bottom)
   */
  onEndReachedThreshold?: number
  /**
   * Debounce delay for search input in milliseconds (default: 300)
   */
  searchDebounce?: number
  /**
   * Whether to show error messages via flash/toast
   */
  showErrorMessages?: boolean
  /**
   * Custom error message for fetch failures
   */
  errorMessage?: string
  /**
   * Enable logging for debugging (default: false)
   */
  debug?: boolean
}

/**
 * State and controls exposed by the hook
 */
export interface UseInfiniteListReturn<T> extends Pick<FlatListProps<T>, "onEndReached"> {
  // Data
  /**
   * All loaded items
   */
  data: T[]
  /**
   * Total count of items (if provided by API)
   */
  totalCount: number | undefined

  // Loading states
  /**
   * Initial loading state (first page only)
   */
  isLoading: boolean
  /**
   * Loading more items state (pagination)
   */
  isLoadingMore: boolean
  /**
   * Pull-to-refresh state
   */
  isRefreshing: boolean
  /**
   * Error state
   */
  error: Error | null

  // Pagination controls
  /**
   * Whether there are more items to load
   */
  hasMore: boolean
  /**
   * Current page number
   */
  currentPage: number

  // Search & filters
  /**
   * Current search query string
   */
  searchQuery: string
  /**
   * Current filter parameters
   */
  filters: Record<string, any>

  // Actions
  /**
   * Load next page of items
   */
  loadMore: () => Promise<void>
  /**
   * Refresh from the beginning
   */
  refresh: () => Promise<void>
  /**
   * Retry failed request
   */
  retry: () => Promise<void>
  /**
   * Reset and reload with current search/filters
   */
  reset: () => Promise<void>
  /**
   * Update search query and reload
   */
  setSearchQuery: (query: string) => void
  /**
   * Update filters and reload
   */
  setFilters: (filters: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void
  /**
   * Clear all filters and search
   */
  clearFilters: () => void

  // FlatList helpers
  /**
   * RefreshControl element for FlatList
   */
  refreshControl: React.ReactElement | null
  /**
   * Ref for the FlatList
   */
  listRef: React.RefObject<FlatList<T> | null>
  /**
   * Scroll to top of list
   */
  scrollToTop: () => void
  /**
   * Threshold for triggering onEndReached
   */
  onEndReachedThreshold: number
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * A comprehensive hook for infinite scrolling lists with search and filters.
 *
 * @example
 * ```tsx
 * const { data, isLoading, loadMore, refresh, searchQuery, setSearchQuery } = useInfiniteList({
 *   fetchData: async ({ page, pageSize, searchQuery }) => {
 *     const response = await api.getItems({ page, pageSize, q: searchQuery })
 *     return { data: response.items, hasMore: response.hasMore }
 *   },
 *   pageSize: 20,
 * })
 * ```
 */
export function useInfiniteList<T>(
  options: UseInfiniteListOptions<T>,
): UseInfiniteListReturn<T> {
  const {
    fetchData,
    pageSize: pageSizeOption = 20,
    initialPage = 1,
    pullToRefresh = true,
    onEndReachedThreshold = 0.5,
    searchDebounce = 300,
    debug = false,
  } = options

  // Data state
  const [data, setData] = useState<T[]>([])
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Error state
  const [error, setError] = useState<Error | null>(null)

  // Search & filters state
  const [searchQuery, setSearchQueryState] = useState("")
  const [filters, setFiltersState] = useState<Record<string, any>>({})

  // Refs
  const listRef = useRef<FlatList<T>>(null)
  const isLoadingRef = useRef(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Log debug messages if debug mode is enabled
   */
  const log = useCallback(
    (...args: unknown[]) => {
      if (debug) {
        console.log("[useInfiniteList]", ...args)
      }
    },
    [debug],
  )

  /**
   * Core function to load data
   */
  const loadData = useCallback(
    async (page: number, isRefresh = false, isMore = false): Promise<void> => {
      // Prevent duplicate requests
      if (isLoadingRef.current) {
        log("Request already in progress, skipping")
        return
      }

      isLoadingRef.current = true
      setError(null)

      // Set appropriate loading state
      if (isRefresh) {
        setIsRefreshing(true)
        log("Starting refresh")
      } else if (isMore) {
        setIsLoadingMore(true)
        log("Loading more, page:", page)
      } else {
        setIsLoading(true)
        log("Initial load, page:", page)
      }

      try {
        const result = await fetchData({
          page,
          pageSize: pageSizeOption,
          searchQuery,
          filters,
        })

        if (isRefresh || page === initialPage) {
          // Replace all data
          setData(result.data)
          setCurrentPage(page + 1)
        } else {
          // Append data
          setData((prev) => [...prev, ...result.data])
          setCurrentPage(page + 1)
        }

        setHasMore(result.hasMore)
        setTotalCount(result.totalCount)

        log("Loaded", result.data.length, "items, hasMore:", result.hasMore)
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error("Unknown error occurred")
        setError(errorObj)
        log("Error loading data:", errorObj.message)
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
        setIsRefreshing(false)
        isLoadingRef.current = false
      }
    },
    [fetchData, pageSizeOption, initialPage, searchQuery, filters, log],
  )

  /**
   * Load next page
   */
  const loadMore = useCallback(async () => {
    if (!isLoadingRef.current && hasMore && !isLoadingMore) {
      await loadData(currentPage, false, true)
    }
  }, [currentPage, hasMore, isLoadingMore, loadData])

  /**
   * Refresh from beginning
   */
  const refresh = useCallback(async () => {
    if (!isRefreshing) {
      await loadData(initialPage, true, false)
    }
  }, [isRefreshing, initialPage, loadData])

  /**
   * Retry failed request
   */
  const retry = useCallback(async () => {
    setError(null)
    if (data.length === 0) {
      await loadData(initialPage, false, false)
    } else {
      await loadData(currentPage, false, false)
    }
  }, [data.length, currentPage, initialPage, loadData])

  /**
   * Reset and reload with current search/filters
   */
  const reset = useCallback(async () => {
    setData([])
    setHasMore(true)
    setTotalCount(undefined)
    setError(null)
    await loadData(initialPage, false, false)
  }, [initialPage, loadData])

  /**
   * Set search query with debouncing
   */
  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query)

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Debounce the search
    searchTimeoutRef.current = setTimeout(() => {
      setData([])
      setHasMore(true)
      setCurrentPage(initialPage)
      setError(null)
      log("Search query changed:", query)
    }, searchDebounce)
  }, [searchDebounce, initialPage, log])

  /**
   * Update filters and reload
   */
  const setFilters = useCallback((newFilters: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => {
    setFiltersState((prev) => {
      const updated = typeof newFilters === "function" ? newFilters(prev) : newFilters
      // Only reset if filters actually changed
      if (JSON.stringify(updated) !== JSON.stringify(prev)) {
        // Reset data and pagination when filters change
        setTimeout(() => {
          setData([])
          setHasMore(true)
          setCurrentPage(initialPage)
          setError(null)
          log("Filters changed:", updated)
        }, 0)
      }
      return updated
    })
  }, [initialPage, log])

  /**
   * Clear all filters and search
   */
  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setFiltersState({})
  }, [setSearchQuery])

  /**
   * Scroll to top of list
   */
  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true })
  }, [])

  /**
   * Load initial data on mount
   */
  useEffect(() => {
    log("Initial load triggered")
    loadData(initialPage, false, false)
    // Cleanup search timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  /**
   * Reload when search query or filters change (debounced via setTimeout)
   */
  useEffect(() => {
    // Skip initial load
    if (isLoading || isRefreshing) return

    const timeout = setTimeout(() => {
      if (data.length === 0 || currentPage === initialPage) {
        loadData(initialPage, false, false)
      }
    }, searchDebounce + 50)

    return () => clearTimeout(timeout)
  }, [searchQuery, filters])

  /**
   * Create RefreshControl element
   */
  const refreshControl = pullToRefresh
    ? // @ts-ignore - RefreshControl props
      ({
        __typename: "RefreshControl",
        type: "RefreshControl",
        props: {
          refreshing: isRefreshing,
          onRefresh: refresh,
          tintColor: "#000000",
        },
      } as any)
    : null

  return {
    // Data
    data,
    totalCount,

    // Loading states
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,

    // Pagination
    hasMore,
    currentPage,

    // Search & filters
    searchQuery,
    filters,

    // Actions
    loadMore,
    refresh,
    retry,
    reset,
    setSearchQuery,
    setFilters,
    clearFilters,

    // FlatList helpers
    refreshControl,
    listRef,
    scrollToTop,

    // FlatList props
    onEndReached: loadMore,
    onEndReachedThreshold,
  }
}

/**
 * HOC to inject refresh control into FlatList props
 */
export function withRefreshControl<T>(
  refreshControlElement: React.ReactElement | null,
): FlatListProps<T>["refreshControl"] {
  return refreshControlElement as any
}

export default useInfiniteList
