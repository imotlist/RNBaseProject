/**
 * FiltersContainerView.tsx
 *
 * Presentational component for Filters container screen.
 * Demonstrates all Filter component variations.
 *
 * @module screens/Filters
 */

import React, { useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { FilterChips } from "@/components/filters"
import { FilterBar } from "@/components/filters"
import { TitleBar } from "@/components/ui"
import { useAppTheme } from "@/theme/context"

// ============================================================================
// Types
// ============================================================================

export interface FiltersData {
  id: string
  title: string
  value: string | number
  [key: string]: any
}

export interface FiltersContainerViewProps {
  selectedData: FiltersData | null
  onSelectData: (data: FiltersData) => void
  onActionPress: () => void
  onRefresh: () => Promise<void>
  isLoading?: boolean
}

// ============================================================================
// Section Component
// ============================================================================

interface SectionProps {
  title: string
  children: React.ReactNode
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  const { theme } = useAppTheme()
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textDim }]}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  )
}

// ============================================================================
// View Component
// ============================================================================

const FiltersContainerView: React.FC<FiltersContainerViewProps> = () => {
  const { theme } = useAppTheme()

  // Single select state
  const [singleSelect, setSingleSelect] = useState("all")

  // Multi select states
  const [multiSelect1, setMultiSelect1] = useState<string[]>([])
  const [multiSelect2, setMultiSelect2] = useState<string[]>(["option1"])

  // Active filters state
  const [activeFilters, setActiveFilters] = useState([
    { key: "category", label: "Electronics" },
    { key: "price", label: "Under $50" },
  ])

  // Filter options
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
  ]

  const categoryOptions = [
    { value: "electronics", label: "Electronics", count: 24 },
    { value: "clothing", label: "Clothing", count: 18 },
    { value: "home", label: "Home", count: 12 },
    { value: "sports", label: "Sports", count: 8 },
    { value: "books", label: "Books", count: 15 },
  ]

  const sizeOptions = [
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
  ]

  const toggleMultiSelect = (value: string, current: string[], setter: (val: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value))
    } else {
      setter([...current, value])
    }
  }

  const handleRemoveFilter = (key: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.key !== key))
  }

  const handleClearAllFilters = () => {
    setActiveFilters([])
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]}>
      <TitleBar title="Filters" showBack={false} />

      <ScrollView style={styles.container}>
        {/* Single Select Filter Chips */}
        <Section title="Single Select Filter Chips">
          <FilterChips
            options={statusOptions}
            selectedValue={singleSelect}
            onSelect={setSingleSelect}
          />
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>Selected: {singleSelect}</Text>
          </View>
        </Section>

        {/* Multi Select Filter Chips */}
        <Section title="Multi Select Filter Chips">
          <FilterChips
            multiple
            options={sizeOptions}
            selectedValue={multiSelect1}
            onSelect={(value) => toggleMultiSelect(value, multiSelect1, setMultiSelect1)}
          />
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              Selected: {multiSelect1.length > 0 ? multiSelect1.join(", ") : "None"}
            </Text>
          </View>
        </Section>

        {/* Filter Chips with Counts */}
        <Section title="Filter Chips with Counts">
          <FilterChips
            options={categoryOptions}
            selectedValue={multiSelect2}
            onSelect={(value) => toggleMultiSelect(value, multiSelect2, setMultiSelect2)}
            multiple
          />
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              Selected: {multiSelect2.length > 0 ? multiSelect2.join(", ") : "None"}
            </Text>
          </View>
        </Section>

        {/* Active Filters Bar */}
        <Section title="Active Filters Bar">
          <Text style={styles.description}>
            Shows active filters with remove buttons and clear all option.
          </Text>
          <FilterBar
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              Active filters: {activeFilters.length}
            </Text>
          </View>
        </Section>

        {/* Usage Example */}
        <Section title="Usage Example">
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Category Filter</Text>
            <FilterChips
              options={[
                { value: "all", label: "All Products" },
                { value: "new", label: "New Arrivals", count: 5 },
                { value: "sale", label: "On Sale", count: 12 },
              ]}
              selectedValue="all"
              onSelect={(value) => console.log("Selected:", value)}
            />
          </View>

          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Price Range</Text>
            <FilterChips
              options={[
                { value: "0-25", label: "Under $25" },
                { value: "25-50", label: "$25 - $50" },
                { value: "50-100", label: "$50 - $100" },
                { value: "100+", label: "$100+" },
              ]}
              selectedValue="0-25"
              onSelect={(value) => console.log("Selected:", value)}
            />
          </View>

          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Rating Filter (Multi)</Text>
            <FilterChips
              multiple
              options={[
                { value: "5", label: "5 Stars" },
                { value: "4", label: "4 Stars" },
                { value: "3", label: "3 Stars" },
              ]}
              selectedValue={[]}
              onSelect={(value) => console.log("Toggled:", value)}
            />
          </View>
        </Section>

        {/* Filter States */}
        <Section title="Different Filter States">
          <View style={styles.stateRow}>
            <View style={styles.stateChip}>
              <Text style={styles.stateLabel}>Default</Text>
            </View>
            <View style={[styles.stateChip, { backgroundColor: theme.colors.tint }]}>
              <Text style={[styles.stateLabel, { color: theme.colors.palette.neutral100 }]}>
                Selected
              </Text>
            </View>
            <View style={[styles.stateChip, { backgroundColor: theme.colors.palette.neutral300 }]}>
              <Text style={styles.stateLabel}>Disabled</Text>
            </View>
          </View>
        </Section>
      </ScrollView>
    </Screen>
  )
}

export default FiltersContainerView

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    marginHorizontal: 16,
    textTransform: "uppercase",
  },
  sectionContent: {
    paddingHorizontal: 16,
  },
  selectionInfo: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  selectionText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  description: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  exampleContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  exampleTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.6,
  },
  stateRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
  },
  stateChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  stateLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
})
