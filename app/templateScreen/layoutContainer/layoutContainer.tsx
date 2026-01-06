/**
 * {{FEATURE_NAME_PASCAL}}Screen.tsx
 *
 * Container-based screen template for {{FEATURE_NAME}} feature.
 * This file contains the screen controller logic with state management
 * and event handlers for container-style screens.
 *
 * @module screens/{{FEATURE_NAME}}
 */

import { useCallback, useState } from "react"
import { View, StyleSheet } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useBottomSheet } from "@/hooks/useBottomSheet"
import { scale, scaleFontSize } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import {{FEATURE_NAME_PASCAL}}ContainerView from "./{{FEATURE_NAME_PASCAL}}ContainerView"
// ============================================================================
// Types
// ============================================================================

export interface {{FEATURE_NAME_PASCAL}}Data {
  id: string
  title: string
  value: string | number
  [key: string]: any
}

// ============================================================================
// Screen Component
// ============================================================================

export const {{FEATURE_NAME_PASCAL}}Screen = () => {
  const { theme } = useAppTheme()
  const { showBottomSheet, closeBottomSheet } = useBottomSheet()

  // State management
  const [selectedData, setSelectedData] = useState<{{FEATURE_NAME_PASCAL}}Data | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Handle actions
  const handleActionPress = useCallback(() => {
    showBottomSheet({
      title: "Actions",
      snapPoints: ["40%"],
      renderContent: () => (
        <{{FEATURE_NAME_PASCAL}}ActionSheet
          selectedData={selectedData}
          onClose={closeBottomSheet}
          onAction={handleAction}
        />
      ),
    })
  }, [showBottomSheet, selectedData, closeBottomSheet])

  const handleAction = useCallback((action: string, data?: {{FEATURE_NAME_PASCAL}}Data) => {
    console.log("Action:", action, "Data:", data)
    closeBottomSheet()
    // TODO: Implement action logic
  }, [closeBottomSheet])

  const handleRefresh = useCallback(async () => {
    setIsLoading(true)
    try {
      // TODO: Implement refresh logic
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <{{FEATURE_NAME_PASCAL}}ContainerView
      selectedData={selectedData}
      onSelectData={setSelectedData}
      onActionPress={handleActionPress}
      onRefresh={handleRefresh}
      isLoading={isLoading}
    />
  )
}

// ============================================================================
// Action Sheet Component
// ============================================================================

interface {{FEATURE_NAME_PASCAL}}ActionSheetProps {
  selectedData: {{FEATURE_NAME_PASCAL}}Data | null
  onClose: () => void
  onAction: (action: string, data?: {{FEATURE_NAME_PASCAL}}Data) => void
}

const ACTIONS = [
  { id: "edit", label: "Edit", icon: "edit" },
  { id: "delete", label: "Delete", icon: "trash" },
  { id: "share", label: "Share", icon: "share" },
]

const {{FEATURE_NAME_PASCAL}}ActionSheet: React.FC<{{FEATURE_NAME_PASCAL}}ActionSheetProps> = ({
  selectedData,
  onClose,
  onAction,
}) => {
  const handlePress = useCallback(
    (action: string) => {
      onAction(action, selectedData || undefined)
    },
    [onAction, selectedData],
  )

  return (
    <View style={styles.actionSheet}>
      {selectedData && (
        <Text style={styles.selectedText}>
          Selected: {selectedData.title}
        </Text>
      )}
      {ACTIONS.map((action) => (
        <ActionItem
          key={action.id}
          label={action.label}
          icon={action.icon}
          onPress={() => handlePress(action.id)}
        />
      ))}
    </View>
  )
}

// ============================================================================
// Action Item Component
// ============================================================================

interface ActionItemProps {
  label: string
  icon: string
  onPress: () => void
}

const ActionItem: React.FC<ActionItemProps> = ({ label, icon, onPress }) => {
  const { theme } = useAppTheme()

  return (
    <View style={[styles.actionItem, { borderBottomColor: theme.colors.separator }]}>
      <Text style={styles.actionLabel}>{label}</Text>
    </View>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  actionSheet: {
    padding: scale(16),
  },
  selectedText: {
    fontSize: scaleFontSize(14),
    color: "#666",
    marginBottom: scale(16),
    textAlign: "center",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(16),
    borderBottomWidth: 1,
  },
  actionLabel: {
    fontSize: scaleFontSize(16),
    fontWeight: "500",
  },
})
