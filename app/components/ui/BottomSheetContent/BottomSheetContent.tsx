/**
 * BottomSheetContent.tsx
 *
 * A reusable bottom sheet content container component.
 * Provides a consistent layout for bottom sheet content with
 * header, body, and footer sections.
 *
 * @module components/ui/BottomSheetContent
 */

import React, { ReactNode } from "react"
import { View, StyleSheet, Pressable, ViewStyle, ScrollView } from "react-native"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { useAppTheme } from "@/theme/context"
import { scale, scaleFontSize } from "@/utils/responsive"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"

// ============================================================================
// Types
// ============================================================================

export interface BottomSheetContentProps {
  /**
   * Title displayed in the header
   */
  title?: string
  /**
   * Optional subtitle displayed below the title
   */
  subtitle?: string
  /**
   * Content to display in the body
   */
  children: ReactNode
  /**
   * Primary button text
   */
  primaryButtonLabel?: string
  /**
   * Callback when primary button is pressed
   */
  onPrimaryPress?: () => void
  /**
   * Secondary button text (e.g., "Cancel")
   */
  secondaryButtonLabel?: string
  /**
   * Callback when secondary button is pressed
   */
  onSecondaryPress?: () => void
  /**
   * Whether to show close icon in header
   */
  showClose?: boolean
  /**
   * Callback when close is pressed
   */
  onClose?: () => void
  /**
   * Optional custom style for the container
   */
  style?: ViewStyle
  /**
   * Optional custom style for the content area
   */
  contentStyle?: ViewStyle
  /**
   * Whether primary button is disabled
   */
  primaryDisabled?: boolean
  /**
   * Whether to make content scrollable
   */
  scrollable?: boolean
  /**
   * Whether to show scroll indicators
   */
  showsVerticalScrollIndicator?: boolean
}

// ============================================================================
// Component
// ============================================================================

/**
 * A reusable bottom sheet content component with header, body, and footer.
 *
 * @example Basic usage
 * ```tsx
 * <BottomSheetContent
 *   title="Filters"
 *   primaryButtonLabel="Apply"
 *   onPrimaryPress={handleApply}
 *   secondaryButtonLabel="Reset"
 *   onSecondaryPress={handleReset}
 *   onClose={handleClose}
 * >
 *   <FilterChips options={options} selectedValue={value} onSelect={onChange} />
 * </BottomSheetContent>
 * ```
 *
 * @example With subtitle
 * ```tsx
 * <BottomSheetContent
 *   title="Sort By"
 *   subtitle="Choose how items are sorted"
 *   primaryButtonLabel="Done"
 *   onPrimaryPress={handleClose}
 * >
 *   <RadioGroup options={sortOptions} selectedValue={sort} onChange={setSort} />
 * </BottomSheetContent>
 * ```
 */
export const BottomSheetContent: React.FC<BottomSheetContentProps> = ({
  title,
  subtitle,
  children,
  primaryButtonLabel,
  onPrimaryPress,
  secondaryButtonLabel,
  onSecondaryPress,
  showClose = false,
  onClose,
  style,
  contentStyle,
  primaryDisabled = false,
  scrollable = true,
  showsVerticalScrollIndicator = true,
}) => {
  const { theme } = useAppTheme()
  const footerSafeArea = useSafeAreaInsetsStyle(["bottom"], "padding")

  const ContentWrapper = scrollable ? ScrollView : View
  const contentProps = scrollable
    ? {
        showsVerticalScrollIndicator,
        contentContainerStyle: [styles.contentInner, contentStyle],
        bounces: true,
        style: styles.scrollView,
      }
    : { style: [styles.content, contentStyle] }

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      {(title || showClose) && (
        <View style={[styles.header, { borderBottomColor: theme.colors.separator }]}>
          <View style={styles.headerLeft}>
            {title && (
              <Text preset="subheading" style={styles.title}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={[styles.subtitle, { color: theme.colors.textDim }]}>
                {subtitle}
              </Text>
            )}
          </View>
          {(showClose || onClose) && (
            <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
              <Icon icon="x" size={20} color={theme.colors.textDim} />
            </Pressable>
          )}
        </View>
      )}

      {/* Body */}
      <View style={styles.bodyWrapper}>
        <ContentWrapper {...contentProps}>{children}</ContentWrapper>
      </View>

      {/* Footer */}
      {(primaryButtonLabel || secondaryButtonLabel) && (
        <View style={[styles.footer, footerSafeArea , { borderTopColor: theme.colors.separator }]}>
          {secondaryButtonLabel && (
            <Pressable
              onPress={onSecondaryPress}
              style={[styles.footerButton, styles.secondaryButton, { borderColor: theme.colors.separator }]}
            >
              <Text style={[styles.footerButtonText, { color: theme.colors.text }]}>
                {secondaryButtonLabel}
              </Text>
            </Pressable>
          )}
          {primaryButtonLabel && (
            <Pressable
              onPress={onPrimaryPress}
              style={[
                styles.footerButton,
                styles.primaryButton,
                secondaryButtonLabel && styles.primaryButtonWithSecondary,
                { backgroundColor: primaryDisabled ? theme.colors.palette.neutral300 : theme.colors.tint },
              ]}
              disabled={primaryDisabled}
            >
              <Text
                style={[
                  styles.footerButtonText,
                  styles.primaryButtonText,
                  { color: primaryDisabled ? theme.colors.textDim : "#fff" },
                ]}
              >
                {primaryButtonLabel}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#fff",
    paddingBottom: scale(2),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: scaleFontSize(18),
    fontWeight: "600",
  },
  subtitle: {
    fontSize: scaleFontSize(13),
    marginTop: scale(2),
  },
  closeButton: {
    padding: scale(4),
  },
  bodyWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingTop: scale(16),
  },
  contentInner: {
    paddingHorizontal: scale(20),
    paddingTop: scale(16),
    paddingBottom: scale(16),
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: scale(20),
    paddingVertical: scale(16),
    borderTopWidth: 1,
    gap: scale(12),
  },
  footerButton: {
    flex: 1,
    paddingVertical: scale(14),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  primaryButton: {
    flex: 1,
  },
  primaryButtonWithSecondary: {
    flex: 1,
  },
  footerButtonText: {
    fontSize: scaleFontSize(16),
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#fff",
  },
})
