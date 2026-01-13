/**
 * RiwayatListView.tsx
 *
 * Presentational component for Riwayat (History) list screen.
 * Contains UI for displaying plant monitoring history with search and filters.
 *
 * @module screens/Riwayat
 */

import React, { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { InfiniteList } from "@/components/list"
import { SearchBar } from "@/components/ui/SearchBar/SearchBar"
import { IconPack } from "@/components/ui/IconPack"
import { scale, scaleFontSize } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import { useIsFocused } from "@react-navigation/native"

// ============================================================================
// Types
// ============================================================================

export interface RiwayatListViewProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: Record<string, any>
  setFilters: (filters: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void
  clearFilters: () => void
  activeFilterCount: number
  onOpenFilters: () => void
  renderItem: (item: any) => React.ReactElement
  fetchOptions: {
    fetchData: any
    pageSize: number
  }
}

// ============================================================================
// View Component
// ============================================================================

const RiwayatListView: React.FC<RiwayatListViewProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  clearFilters,
  activeFilterCount,
  onOpenFilters,
  renderItem,
  fetchOptions,
}) => {
  const { theme } = useAppTheme()
  const { colors } = theme
  const statusBarColor = colors.palette.primary700;
  const isFocused = useIsFocused();
  const [useColor, setUseColor] = useState(statusBarColor)
  
  useEffect(() => {
    if (isFocused) {
      setUseColor(statusBarColor)
    }
  }, [isFocused, statusBarColor])

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} statusBarBackgroundColor={useColor} backgroundColor={useColor}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: useColor }]}>
        <Text preset="heading" style={styles.headerTitle}>Riwayat</Text>
        <Text style={styles.headerSubtitle}>Histori monitoring tanaman</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: "#fff" }]}>
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Cari riwayat tanaman..."
          showFilterButton
          rounded="full"
          onFilterPress={onOpenFilters}
          filterCount={activeFilterCount}
          onClear={clearFilters}
        />
      </View>

      {/* List */}
      <InfiniteList
        hookOptions={fetchOptions}
        renderItem={renderItem}
        keyExtractor={(item: any) => String(item.id)}
        flatListProps={{
          contentContainerStyle: styles.listContent,
          showsVerticalScrollIndicator: false,
        }}
        emptyState={{
          icon: "folder" as const,
          title: "Belum Ada Riwayat",
          message: "Riwayat monitoring tanaman Anda akan muncul di sini",
        }}
        errorState={{
          title: "Gagal Memuat",
          message: "Terjadi kesalahan saat memuat riwayat. Silakan coba lagi.",
          actionLabel: "Coba Lagi",
        }}
      />
    </Screen>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  header: {
    padding: scale(16),
  },
  headerTitle: {
    fontSize: scaleFontSize(24),
    fontWeight: "700",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: scaleFontSize(14),
    color: "rgba(255,255,255,0.8)",
  },
   content: {
    backgroundColor: 'white',
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },
  searchContainer: {
    borderTopLeftRadius: scale(20),
    borderTopRightRadius:scale(20),
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  listContent: {
    paddingTop: scale(12),
    paddingBottom: scale(24),
  },
})

export default RiwayatListView
