# Infinite List Solution Documentation

A comprehensive, reusable infinite scrolling solution for Ignite React Native applications with support for pagination, pull-to-refresh, search, and filters.

---

## Table of Contents

1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Hook API](#hook-api)
4. [UI Components](#ui-components)
5. [Integration Examples](#integration-examples)
6. [Best Practices](#best-practices)

---

## Overview

This solution provides a complete, type-safe infinite scrolling implementation for React Native applications using FlatList. It separates business logic from UI components, making it reusable across screens.

### Key Features

| Feature | Description |
|---------|-------------|
| **Infinite Pagination** | Load more items as user scrolls to bottom |
| **Pull to Refresh** | Pull down to reload from page 1 |
| **Loading States** | Initial loading, pagination loading, refreshing |
| **Empty State** | Customizable empty list display |
| **Error State** | Error display with retry mechanism |
| **Search Support** | Debounced search query with auto-reload |
| **Filter Support** | Dynamic filters with auto-reset |
| **Responsive Design** | Tablet-friendly with scaling utilities |

---

## Folder Structure

```
app/
├── hooks/
│   ├── index.ts
│   └── useInfiniteList.ts          # Main infinite list hook
│
├── components/
│   ├── list/
│   │   ├── index.ts
│   │   ├── InfiniteList.tsx         # Complete list wrapper component
│   │   ├── ListLoading.tsx          # Loading spinner
│   │   ├── ListEmpty.tsx            # Empty state
│   │   ├── ListError.tsx            # Error state with retry
│   │   ├── ListFooterLoading.tsx    # Footer pagination loader
│   │   └── ListEndIndicator.tsx    # End of list indicator
│   │
│   └── filters/
│       ├── index.ts
│       ├── FilterBar.tsx            # Active filters bar
│       └── FilterChips.tsx          # Single/multi-select chips
│
└── screens/
    └── InfiniteListExampleScreen.tsx  # Example implementation
```

---

## Hook API

### `useInfiniteList<T>(options)`

The main hook that manages all list state and pagination logic.

#### Parameters

```typescript
interface UseInfiniteListOptions<T> {
  // Required
  fetchData: (options: {
    page: number
    pageSize: number
    searchQuery?: string
    filters?: Record<string, any>
  }) => Promise<{
    data: T[]
    hasMore: boolean
    totalCount?: number
  }>

  // Optional
  pageSize?: number              // Default: 20
  initialPage?: number          // Default: 1
  pullToRefresh?: boolean       // Default: true
  onEndReachedThreshold?: number // Default: 0.5
  searchDebounce?: number       // Default: 300ms
  debug?: boolean               // Default: false
}
```

#### Returns

```typescript
interface UseInfiniteListReturn<T> {
  // Data
  data: T[]
  totalCount: number | undefined

  // Loading states
  isLoading: boolean       // Initial load
  isLoadingMore: boolean   // Pagination load
  isRefreshing: boolean    // Pull-to-refresh
  error: Error | null

  // Pagination
  hasMore: boolean
  currentPage: number

  // Search & filters
  searchQuery: string
  filters: Record<string, any>

  // Actions
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  retry: () => Promise<void>
  reset: () => Promise<void>
  setSearchQuery: (query: string) => void
  setFilters: (filters) => void
  clearFilters: () => void

  // FlatList helpers
  refreshControl: React.ReactElement
  listRef: React.RefObject<FlatList<T>>
  scrollToTop: () => void
  onEndReached: () => void
  onEndReachedThreshold: number
}
```

---

## UI Components

### List Components

#### `<ListLoading />`

Displays a loading spinner.

```tsx
<ListLoading type="initial" />  // Centered, full height
<ListLoading type="pagination" />  // At bottom of list
```

#### `<ListEmpty />`

Empty state when no items found.

```tsx
<ListEmpty
  icon="inbox"
  title="No items found"
  message="Try adjusting your search"
  actionLabel="Clear filters"
  onAction={() => clearFilters()}
  isSearchResult={true}
/>
```

#### `<ListError />`

Error state with retry button.

```tsx
<ListError
  icon="warning"
  message="Failed to load items"
  onRetry={() => retry()}
  retryLabel="Try Again"
/>
```

#### `<ListFooterLoading />`

Pagination loading indicator for FlatList footer.

```tsx
<FlatList
  ListFooterComponent={() => <ListFooterLoading isLoadingMore={isLoadingMore} />}
/>
```

#### `<ListEndIndicator />`

Shows when list end is reached.

```tsx
<ListEndIndicator
  text="You've reached the end"
  visible={!hasMore}
  showDivider={true}
/>
```

### Filter Components

#### `<FilterBar />`

Displays active filters as removable chips.

```tsx
<FilterBar
  activeFilters={[
    { key: 'category', label: 'Electronics' },
    { key: 'price', label: 'Under $50' }
  ]}
  onRemoveFilter={(key) => removeFilter(key)}
  onClearAll={() => clearAllFilters()}
/>
```

#### `<FilterChips />`

Single or multi-select filter chips.

```tsx
// Single select
<FilterChips
  options={[
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' }
  ]}
  selectedValue={status}
  onSelect={(value) => setStatus(value)}
/>

// Multi-select
<FilterChips
  multiple
  options={categories}
  selectedValue={selectedCategories}
  onSelect={(value) => toggleCategory(value)}
/>
```

---

## Integration Examples

### Example 1: Basic List

```tsx
import { useInfiniteList } from "@/hooks"
import { InfiniteList } from "@/components/list"

function ProductsScreen() {
  return (
    <InfiniteList
      hookOptions={{
        fetchData: async ({ page, pageSize }) => {
          const response = await api.getProducts(page, pageSize)
          return {
            data: response.items,
            hasMore: response.hasMore
          }
        },
        pageSize: 20,
      }}
      renderItem={(product) => <ProductCard item={product} />}
      keyExtractor={(item) => item.id}
    />
  )
}
```

### Example 2: With Search

```tsx
function ProductsScreen() {
  const { searchQuery, setSearchQuery } = useInfiniteList({
    fetchData: async ({ page, pageSize, searchQuery }) => {
      const response = await api.getProducts(page, pageSize, searchQuery)
      return { data: response.items, hasMore: response.hasMore }
    },
  })

  return (
    <>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search products..."
      />
      <InfiniteList
        hookOptions={{
          fetchData: async ({ page, pageSize, searchQuery }) => {
            const response = await api.getProducts(page, pageSize, searchQuery)
            return { data: response.items, hasMore: response.hasMore }
          },
        }}
        renderItem={(product) => <ProductCard item={product} />}
        keyExtractor={(item) => item.id}
      />
    </>
  )
}
```

### Example 3: With Filters

```tsx
function ProductsScreen() {
  const {
    filters,
    setFilters,
    clearFilters,
  } = useInfiniteList({
    fetchData: async ({ page, pageSize, filters }) => {
      const response = await api.getProducts(page, pageSize, filters)
      return { data: response.items, hasMore: response.hasMore }
    },
  })

  return (
    <>
      {/* Filter Controls */}
      <FilterChips
        options={[
          { value: 'electronics', label: 'Electronics' },
          { value: 'clothing', label: 'Clothing' }
        ]}
        selectedValue={filters.category}
        onSelect={(value) => setFilters({ category: value })}
      />

      {/* Active Filters Bar */}
      {filters.category && (
        <FilterBar
          activeFilters={[{ key: 'category', label: filters.category }]}
          onRemoveFilter={() => setFilters({ category: undefined })}
          onClearAll={clearFilters}
        />
      )}

      <InfiniteList
        hookOptions={{
          fetchData: async ({ page, pageSize, filters }) => {
            const response = await api.getProducts(page, pageSize, filters)
            return { data: response.items, hasMore: response.hasMore }
          },
        }}
        renderItem={(product) => <ProductCard item={product} />}
        keyExtractor={(item) => item.id}
      />
    </>
  )
}
```

### Example 4: Manual FlatList Integration

For full control over the FlatList:

```tsx
import { useInfiniteList } from "@/hooks"
import { ListLoading, ListError, ListEmpty, ListFooterLoading, ListEndIndicator } from "@/components/list"

function ProductsScreen() {
  const {
    data,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    refresh,
    retry,
    listRef,
    onEndReached,
    refreshControl,
  } = useInfiniteList({
    fetchData: async ({ page, pageSize }) => {
      const response = await api.getProducts(page, pageSize)
      return { data: response.items, hasMore: response.hasMore }
    },
  })

  if (error && data.length === 0) {
    return <ListError message={error.message} onRetry={retry} />
  }

  if (isLoading && data.length === 0) {
    return <ListLoading type="initial" />
  }

  return (
    <FlatList
      ref={listRef}
      data={data}
      renderItem={({ item }) => <ProductCard item={item} />}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={ListEmpty}
      ListFooterComponent={() => (
        isLoadingMore ? <ListFooterLoading /> : <ListEndIndicator visible={!hasMore} />
      )}
      refreshControl={refreshControl}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  )
}
```

### Example 5: Using `useInfiniteListComponent`

This hook returns both state and a pre-configured component:

```tsx
import { useInfiniteListComponent } from "@/components/list"

function ProductsScreen() {
  const { listState, InfiniteListComponent } = useInfiniteListComponent({
    fetchData: async ({ page, pageSize, searchQuery, filters }) => {
      const response = await api.getProducts(page, pageSize, searchQuery, filters)
      return { data: response.items, hasMore: response.hasMore }
    },
  })

  return (
    <>
      <SearchBar value={listState.searchQuery} onChange={listState.setSearchQuery} />
      <InfiniteListComponent
        renderItem={(product) => <ProductCard item={product} />}
        keyExtractor={(item) => item.id}
      />
    </>
  )
}
```

---

## Best Practices

### 1. **Memoize Render Items**

```tsx
const ProductCard = memo(({ product }: { product: Product }) => (
  <View>...</View>
))
```

### 2. **Memoize Fetch Function**

```tsx
const fetchData = useCallback(async ({ page, pageSize }) => {
  const response = await api.getProducts(page, pageSize)
  return { data: response.items, hasMore: response.hasMore }
}, [])

useInfiniteList({ fetchData })
```

### 3. **Use Stable Key Extractor**

```tsx
keyExtractor={(item) => item.id}  // Good: stable ID
keyExtractor={(item, index) => index.toString()}  // Bad: changes on reorder
```

### 4. **Handle Search Debouncing**

The hook includes built-in debouncing (default 300ms). Adjust if needed:

```tsx
useInfiniteList({
  searchDebounce: 500,  // Slower for expensive searches
})
```

### 5. **Proper Filter Updates**

When updating filters, use the functional update to avoid stale state:

```tsx
// Good
setFilters((prev) => ({ ...prev, category: newCategory }))

// May cause issues
setFilters({ ...filters, category: newCategory })
```

### 6. **Cleanup on Unmount**

The hook automatically cleans up timeouts and debounced searches.

### 7. **Tablet Considerations**

List items should use responsive scaling:

```tsx
// Use scale() for dimensions
import { scale } from "@/utils/responsive"

const styles = StyleSheet.create({
  itemCard: {
    padding: scale(16),
    marginBottom: scale(12),
    minHeight: scale(60),  // Minimum touch target
  },
})
```

---

## API Integration Pattern

Create an API-specific hook that wraps `useInfiniteList`:

```tsx
// hooks/useProducts.ts
export function useProducts() {
  return useInfiniteList<Product>({
    fetchData: async ({ page, pageSize, searchQuery, filters }) => {
      const params = { page, pageSize, q: searchQuery, ...filters }
      const response = await productsApi.list(params)
      return {
        data: response.data,
        hasMore: response.data.length === pageSize,
        totalCount: response.totalCount,
      }
    },
    pageSize: 25,
    searchDebounce: 300,
  })
}

// Usage in screen
function ProductsScreen() {
  const { data, isLoading, loadMore, setSearchQuery, filters, setFilters } = useProducts()
  // ... render UI
}
```

---

## Type Safety

All components are fully typed. Define your item type:

```tsx
interface User {
  id: string
  name: string
  email: string
}

const { data } = useInfiniteList<User>({ ... })
// data is typed as User[]
```

---

## Troubleshooting

### Issue: Duplicate items on search

**Solution:** The hook resets data when search query changes. Ensure your `fetchData` uses the provided `searchQuery` parameter.

### Issue: "hasMore" not working

**Solution:** Return correct `hasMore` from `fetchData`:
```tsx
hasMore: response.data.length === pageSize
```

### Issue: Filter not applying

**Solution:** Ensure `filters` are passed to your API:
```tsx
fetchData: async ({ page, pageSize, filters }) => {
  return await api.getItems({ page, pageSize, ...filters })
}
```

---

## Summary

This infinite list solution provides:

- ✅ API-agnostic, reusable hook
- ✅ Full TypeScript support
- ✅ Search with debouncing
- ✅ Dynamic filters
- ✅ All loading/error/empty states
- ✅ Responsive UI components
- ✅ Easy integration pattern
