/**
 * LoadingModal.tsx
 *
 * Reusable loading modal component with overlay.
 * Displays a centered loading popup with optional title, text, and subtext.
 *
 * @module components/ui/LoadingModal
 */

import React from "react"
import { View, Modal, ActivityIndicator, StyleSheet } from "react-native"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { scale, scaleFontSize } from "@/utils/responsive"

// ============================================================================
// Types
// ============================================================================

export interface LoadingModalProps {
  /** Whether the modal is visible */
  visible: boolean
  /** Optional title text */
  title?: string
  /** Optional message/description text */
  message?: string
  /** Optional subtext (smaller text below message) */
  subtext?: string
  /** Size of the activity indicator */
  size?: "small" | "large"
  /** Custom color for the spinner (defaults to primary color) */
  color?: string
  /** Background color of the modal overlay */
  overlayColor?: string
  /** Background color of the content box */
  backgroundColor?: string
}

// ============================================================================
// Component
// ============================================================================

export const LoadingModal: React.FC<LoadingModalProps> = ({
  visible,
  title,
  message,
  subtext,
  size = "large",
  color,
  overlayColor = "rgba(0, 0, 0, 0.5)",
  backgroundColor = "#fff",
}) => {
  const { theme } = useAppTheme()
  const { colors } = theme

  const spinnerColor = color || colors.palette.primary600

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <View style={[styles.contentContainer, { backgroundColor }]}>
          {/* Activity Indicator */}
          <ActivityIndicator
            size={size}
            color={spinnerColor}
            style={styles.spinner}
          />

          {/* Title */}
          {title && (
            <Text style={styles.title}>{title}</Text>
          )}

          {/* Message */}
          {message && (
            <Text style={styles.message}>{message}</Text>
          )}

          {/* Subtext */}
          {subtext && (
            <Text style={styles.subtext}>{subtext}</Text>
          )}
        </View>
      </View>
    </Modal>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    minWidth: scale(200),
    maxWidth: scale(280),
    padding: scale(24),
    borderRadius: scale(16),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  spinner: {
    marginBottom: scale(16),
  },
  title: {
    fontSize: scaleFontSize(16),
    fontWeight: "600",
    textAlign: "center",
    marginBottom: scale(8),
  },
  message: {
    fontSize: scaleFontSize(14),
    textAlign: "center",
    marginBottom: scale(4),
  },
  subtext: {
    fontSize: scaleFontSize(12),
    textAlign: "center",
    opacity: 0.7,
  },
})
