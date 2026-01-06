/**
 * useInfiniteScroll.tsx
 * Hook for infinite scrolling with pull-to-refresh
 */

import { useCallback, useState, useRef } from "react"
import { FlatList, RefreshControl, FlatListProps } from "react-native"
import { useConnection } from "@/context/ConnectionContext"
import { useFlashMessage } from "./useFlashMessage"

export interface InfiniteScrollOptions<T> {
  /**
   * Function to fetch data
   */
  fetchData: (page: number) => Promise<{ data: T[]; hasMore: boolean }>
  /**
   * Initial page number
   */
  initialPage?: number
  /**
   * Whether to show pull-to-refresh
   */
  pullToRefresh?: boolean
  /**
   * Whether to show connection error
   */
  showConnectionError?: boolean
}

export interface InfiniteScrollResult<T>
  extends Pick<FlatListProps<T>, "onEndReached" | "refreshControl" | "data" | "onRefresh"> {
  /**
   * Current data
   */
  data: T[]
  /**
   * Whether data is loading
   */
  isLoading: boolean
  /**
   * Whether more data is being loaded
   */
  isLoadingMore: boolean
  /**
   * Whether there is more data to load
   */
  hasMore: boolean
  /**
   * Whether refreshing
   */
  isRefreshing: boolean
  /**
   * Refresh function
   */
  refresh: () => Promise<void>
  /**
   * Load more function
   */
  loadMore: () => Promise<void>
  /**
   * FlatList ref
   */
  listRef: React.RefObject<FlatList<T> | null>
  /**
   * Reset and reload data
   */
  reset: () => Promise<void>
}

/**
 * Hook for infinite scrolling with pull-to-refresh
 */
export function useInfiniteScroll<T>(
  options: InfiniteScrollOptions<T>,
): InfiniteScrollResult<T> {
  const {
    fetchData,
    initialPage = 1,
    pullToRefresh = true,
    showConnectionError = true,
  } = options

  const { isConnected } = useConnection()
  const { showError } = useFlashMessage()

  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const listRef = useRef<FlatList<T>>(null)
  const isLoadingRef = useRef(false)

  const loadData = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (isLoadingRef.current) {
        return
      }

      if (!isRefresh && !isConnected && showConnectionError) {
        showError("No internet connection")
        return
      }

      isLoadingRef.current = true

      if (pageNum === initialPage) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      try {
        const result = await fetchData(pageNum)

        if (isRefresh || pageNum === initialPage) {
          setData(result.data)
        } else {
          setData((prev) => [...prev, ...result.data])
        }

        setHasMore(result.hasMore)
        setPage(pageNum + 1)
      } catch (error) {
        console.error("Error loading data:", error)
        showError("Failed to load data. Please try again.")
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
        setIsRefreshing(false)
        isLoadingRef.current = false
      }
    },
    [fetchData, initialPage, isConnected, showConnectionError, showError],
  )

  const loadMore = useCallback(async () => {
    if (!isLoadingMore && !isLoading && hasMore) {
      await loadData(page, false)
    }
  }, [isLoading, isLoadingMore, hasMore, page, loadData])

  const refresh = useCallback(async () => {
    if (!isRefreshing) {
      setIsRefreshing(true)
      setPage(initialPage)
      setHasMore(true)
      await loadData(initialPage, true)
    }
  }, [isRefreshing, initialPage, loadData])

  const reset = useCallback(async () => {
    setData([])
    setPage(initialPage)
    setHasMore(true)
    await loadData(initialPage, true)
  }, [initialPage, loadData])

  const refreshControlElement = pullToRefresh
    ? // @ts-ignore - JSX in TS file is handled by metro
      (
        // @ts-ignore
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
      )
    : undefined

  return {
    data,
    isLoading,
    isLoadingMore,
    hasMore,
    isRefreshing,
    refresh,
    loadMore,
    refreshControl: refreshControlElement as any,
    listRef: listRef as any,
    reset,
    onEndReached: loadMore,
    onRefresh: refresh,
  }
}

export default useInfiniteScroll
