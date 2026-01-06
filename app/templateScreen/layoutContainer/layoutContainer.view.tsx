/**
 * {{FEATURE_NAME_PASCAL}}ContainerView.tsx
 *
 * Presentational component for {{FEATURE_NAME}} container screen.
 * Contains only UI rendering logic - no business logic.
 *
 * @module screens/{{FEATURE_NAME}}
 */

import React from "react"
import { View, StyleSheet, Pressable, ScrollView, ActivityIndicator, RefreshControl } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { scale, scaleFontSize } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import styles from "./{{FEATURE_NAME_PASCAL}}Container.styles"
import { de } from "date-fns/locale"

// ============================================================================
// Types
// ============================================================================

export interface {{FEATURE_NAME_PASCAL}}Data {
  id: string
  title: string
  value: string | number
  [key: string]: any
}

export interface {{FEATURE_NAME_PASCAL}}ContainerViewProps {
  selectedData: {{FEATURE_NAME_PASCAL}}Data | null
  onSelectData: (data: {{FEATURE_NAME_PASCAL}}Data) => void
  onActionPress: () => void
  onRefresh: () => Promise<void>
  isLoading?: boolean
}

// ============================================================================
// Mock Data (replace with actual data)
// ============================================================================

const MOCK_DATA: {{FEATURE_NAME_PASCAL}}Data[] = [
  { id: "1", title: "Item 1", value: "Value 1" },
  { id: "2", title: "Item 2", value: "Value 2" },
  { id: "3", title: "Item 3", value: "Value 3" },
  { id: "4", title: "Item 4", value: "Value 4" },
  { id: "5", title: "Item 5", value: "Value 5" },
]

// ============================================================================
// View Component
// ============================================================================

const {{FEATURE_NAME_PASCAL}}ContainerView: React.FC<{{FEATURE_NAME_PASCAL}}ContainerViewProps> = ({
  selectedData,
  onSelectData,
  onActionPress,
  onRefresh,
  isLoading = false,
}) => {
  const { theme } = useAppTheme()

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.separator }]}>
        <Text preset="heading" style={styles.title}>
          {{FEATURE_NAME_PASCAL}}
        </Text>
        <Pressable onPress={onActionPress} style={styles.actionButton}>
          <Icon icon="more" size={24} color={theme.colors.tint} />
        </Pressable>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.tint} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={onRefresh}
            />
          }
        >
          {/* Main Content Area */}
          <View style={styles.contentSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textDim }]}>
              Select an item
            </Text>
            {MOCK_DATA.map((item) => (
              <DataItem
                key={item.id}
                item={item}
                selected={selectedData?.id === item.id}
                onPress={() => onSelectData(item)}
              />
            ))}
          </View>

          {/* Selected Item Detail */}
          {selectedData && (
            <View style={[styles.detailSection, { borderTopColor: theme.colors.separator }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textDim }]}>
                Selected Details
              </Text>
              <View style={[styles.detailCard, { backgroundColor: theme.colors.palette.neutral100 }]}>
                <Text preset="subheading" style={styles.detailTitle}>
                  {selectedData.title}
                </Text>
                <Text style={styles.detailValue}>{String(selectedData.value)}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { borderTopColor: theme.colors.separator }]}>
        <Pressable
          style={[styles.bottomButton, { backgroundColor: theme.colors.tint }]}
          onPress={onActionPress}
        >
          <Text style={styles.bottomButtonText}>Show Actions</Text>
        </Pressable>
      </View>
    </Screen>
  )
}

// ============================================================================
// Data Item Component
// ============================================================================

interface DataItemProps {
  item: {{FEATURE_NAME_PASCAL}}Data
  selected: boolean
  onPress: () => void
}

const DataItem: React.FC<DataItemProps> = ({ item, selected, onPress }) => {
  const { theme } = useAppTheme()

  return (
    <Pressable
      style={[
        styles.dataItem,
        { backgroundColor: selected ? theme.colors.palette.neutral200 : theme.colors.palette.neutral100 },
      ]}
      onPress={onPress}
    >
      <Text style={styles.dataItemTitle}>{item.title}</Text>
      <Icon
        icon="check"
        size={20}
        color={selected ? theme.colors.tint : theme.colors.palette.neutral300}
      />
    </Pressable>
  )
}
export default {{FEATURE_NAME_PASCAL}}ContainerView

// ============================================================================
// Styles
// ============================================================================

