/**
 * BottomSheetSection.tsx
 *
 * A reusable section component for bottom sheet content.
 * Groups related content with optional title and description.
 *
 * @module components/ui/BottomSheetContent
 */

import React, { ReactNode } from "react"
import { View, StyleSheet, ViewStyle } from "react-native"
import { scale, scaleFontSize } from "@/utils/responsive"
import { Text } from "@/components/Text"

// ============================================================================
// Types
// ============================================================================

export interface BottomSheetSectionProps {
  /**
   * Section title
   */
  title?: string
  /**
   * Optional description text below title
   */
  description?: string
  /**
   * Section content
   */
  children: ReactNode
  /**
   * Whether to show bottom divider
   */
  showDivider?: boolean
  /**
   * Optional custom container style
   */
  style?: ViewStyle
  /**
   * Whether to use compact spacing
   */
  compact?: boolean
}

// ============================================================================
// Component
// ============================================================================

/**
 * A section component for organizing bottom sheet content.
 *
 * @example With title
 * ```tsx
 * <BottomSheetSection title="Price Range">
 *   <FilterChips options={priceOptions} selectedValue={value} onSelect={onChange} />
 * </BottomSheetSection>
 * ```
 *
 * @example With description
 * ```tsx
 * <BottomSheetSection
 *   title="Sort Order"
 *   description="Choose ascending or descending order"
 * >
 *   <RadioGroup options={options} selectedValue={value} onChange={onChange} />
 * </BottomSheetSection>
 * ```
 *
 * @example Compact version
 * ```tsx
 * <BottomSheetSection compact>
 *   <Checkbox label="Enable notifications" checked={enabled} onChange={toggle} />
 * </BottomSheetSection>
 * ```
 */
export const BottomSheetSection: React.FC<BottomSheetSectionProps> = ({
  title,
  description,
  children,
  showDivider = false,
  style,
  compact = false,
}) => {
  return (
    <View
      style={[
        styles.section,
        compact && styles.sectionCompact,
        showDivider && styles.sectionWithDivider,
        style,
      ]}
    >
      {(title || description) && (
        <View style={styles.header}>
          {title && (
            <Text preset="subheading" style={styles.title}>
              {title}
            </Text>
          )}
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  section: {
    marginBottom: scale(20),
  },
  sectionCompact: {
    marginBottom: scale(12),
  },
  sectionWithDivider: {
    paddingBottom: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#F4F2F1",
  },
  header: {
    marginBottom: scale(12),
  },
  title: {
    fontSize: scaleFontSize(14),
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: scale(4),
  },
  description: {
    fontSize: scaleFontSize(13),
    opacity: 0.7,
  },
  content: {
    gap: scale(12),
  },
})
