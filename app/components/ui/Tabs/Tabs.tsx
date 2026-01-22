/**
 * Tabs.tsx
 *
 * A simple tab component for switching between views.
 *
 * @module components/ui/Tabs
 */

import React, { useState } from "react"
import { View, Pressable, StyleSheet } from "react-native"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { scale } from "@/utils/responsive"

// ============================================================================
// Types
// ============================================================================

export interface TabOption {
  key: string
  label: string
}

export interface TabsProps {
  options: TabOption[]
  selectedKey: string
  onSelect: (key: string) => void
}

// ============================================================================
// Component
// ============================================================================

export const Tabs: React.FC<TabsProps> = ({ options, selectedKey, onSelect }) => {
  const { theme } = useAppTheme()
  const { colors } = theme

  return (
    <View style={[styles.container, { backgroundColor: colors.palette.neutral100 }]}>
      {options.map((option) => {
        const isSelected = option.key === selectedKey

        return (
          <Pressable
            key={option.key}
            style={({ pressed }) => [
              styles.tab,
              isSelected && [
                styles.tabActive,
                { backgroundColor: colors.palette.primary700 },
              ],
              pressed && styles.tabPressed,
            ]}
            onPress={() => onSelect(option.key)}
          >
            <Text
              size="sm"
              weight={isSelected ? "600" : "400"}
              style={{ color: isSelected ? "white" : colors.textDim }}
            >
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: scale(8),
    padding: scale(4),
    marginHorizontal: scale(20),
    marginTop: scale(10),
    marginBottom: scale(10),
  },
  tab: {
    flex: 1,
    paddingVertical: scale(10),
    paddingHorizontal: scale(16),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(6),
  },
  tabActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabPressed: {
    opacity: 0.8,
  },
})
