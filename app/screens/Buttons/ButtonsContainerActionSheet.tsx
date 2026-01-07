/**
 * ButtonsActionSheet.tsx
 *
 * Menu/Action sheet component for Buttons container screen.
 * This component is rendered inside a bottom sheet modal.
 *
 * @module screens/Buttons
 */

import React, { useCallback } from "react"
import { View, StyleSheet, Pressable } from "react-native"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { BottomSheetContent, BottomSheetSection } from "@/components/ui/BottomSheetContent"
import { scale, scaleFontSize } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"

// ============================================================================
// Types
// ============================================================================

export interface ButtonsActionSheetProps {
  selectedData: ButtonsData | null
  onClose: () => void
  onAction: (action: string, data?: ButtonsData) => void
}

export interface ButtonsData {
  id: string
  title: string
  value: string | number
  [key: string]: any
}

// ============================================================================
// Action Definitions
// ============================================================================

interface Action {
  id: string
  label: string
  icon: any
  variant?: "default" | "danger" | "success"
}

const ACTIONS: Action[] = [
  { id: "view", label: "View Details", icon: "eye" },
  { id: "edit", label: "Edit", icon: "edit" },
  { id: "duplicate", label: "Duplicate", icon: "copy" },
  { id: "share", label: "Share", icon: "share" },
  { id: "delete", label: "Delete", icon: "trash", variant: "danger" },
]

// ============================================================================
// Component
// ============================================================================

export const ButtonsActionSheet: React.FC<ButtonsActionSheetProps> = ({
  selectedData,
  onClose,
  onAction,
}) => {
  const { theme } = useAppTheme()

  const handleActionPress = useCallback(
    (action: Action) => {
      onAction(action.id, selectedData || undefined)
    },
    [onAction, selectedData],
  )

  return (
    <BottomSheetContent
      title="Actions"
      primaryButtonLabel="Close"
      onPrimaryPress={onClose}
      onClose={onClose}
    >
      {/* Selected Item Info */}
      {selectedData && (
        <BottomSheetSection showDivider>
          <View style={[styles.selectedInfo, { backgroundColor: theme.colors.palette.neutral100 }]}>
            <Text preset="subheading" style={styles.selectedTitle}>
              {selectedData.title}
            </Text>
            <Text style={styles.selectedValue}>{String(selectedData.value)}</Text>
          </View>
        </BottomSheetSection>
      )}

      {/* Actions List */}
      <BottomSheetSection title="Available Actions">
        {ACTIONS.map((action) => (
          <ActionItem
            key={action.id}
            action={action}
            onPress={() => handleActionPress(action)}
          />
        ))}
      </BottomSheetSection>
    </BottomSheetContent>
  )
}

// ============================================================================
// Action Item Component
// ============================================================================

interface ActionItemProps {
  action: Action
  onPress: () => void
}

const ActionItem: React.FC<ActionItemProps> = ({ action, onPress }) => {
  const { theme } = useAppTheme()
  const isDanger = action.variant === "danger"

  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionItem,
        { borderBottomColor: theme.colors.separator, opacity: pressed ? 0.6 : 1 },
      ]}
      onPress={onPress}
    >
      <Icon
        icon={action.icon}
        size={22}
        color={isDanger ? theme.colors.error : theme.colors.text}
      />
      <Text
        style={[
          styles.actionLabel,
          { color: isDanger ? theme.colors.error : theme.colors.text },
        ]}
      >
        {action.label}
      </Text>
    </Pressable>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  selectedInfo: {
    padding: scale(16),
    borderRadius: scale(12),
  },
  selectedTitle: {
    fontSize: scaleFontSize(16),
    fontWeight: "600",
    marginBottom: scale(4),
  },
  selectedValue: {
    fontSize: scaleFontSize(14),
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(14),
    borderBottomWidth: 1,
    gap: scale(12),
  },
  actionLabel: {
    fontSize: scaleFontSize(16),
    fontWeight: "500",
  },
})
