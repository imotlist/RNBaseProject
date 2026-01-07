/**
 * InputsScreen.styles.ts
 *
 * StyleSheet constants for Inputs container screen.
 * Centralized styling for consistent appearance.
 *
 * @module screens/Inputs
 */

import { StyleSheet } from "react-native"
import { scale, scaleFontSize, moderateScale } from "@/utils/responsive"

export default StyleSheet.create({
    // Header
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: scale(16),
      paddingVertical: scale(12),
      borderBottomWidth: 1,
    },
    title: {
      fontSize: scaleFontSize(24),
      fontWeight: "700",
    },
    actionButton: {
      padding: scale(8),
    },

    // Content
    scrollContent: {
      paddingBottom: scale(100),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    contentSection: {
      padding: scale(16),
    },
    sectionTitle: {
      fontSize: scaleFontSize(13),
      fontWeight: "600",
      marginBottom: scale(12),
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },

    // Data Items
    dataItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: scale(16),
      marginBottom: scale(8),
      borderRadius: moderateScale(12),
    },
    dataItemTitle: {
      fontSize: scaleFontSize(16),
      fontWeight: "500",
    },
    dataItemSelected: {
      backgroundColor: "#F0F0F0",
    },

    // Detail Section
    detailSection: {
      padding: scale(16),
      borderTopWidth: 1,
      marginTop: scale(8),
    },
    detailCard: {
      padding: scale(16),
      borderRadius: scale(12),
    },
    detailTitle: {
      fontSize: scaleFontSize(18),
      fontWeight: "600",
      marginBottom: scale(8),
    },
    detailValue: {
      fontSize: scaleFontSize(14),
    },
    detailMeta: {
      fontSize: scaleFontSize(12),
      marginTop: scale(4),
    },

    // Bottom Bar
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: scale(16),
      borderTopWidth: 1,
    },
    bottomButton: {
      paddingVertical: scale(16),
      borderRadius: scale(12),
      alignItems: "center",
    },
    bottomButtonText: {
      color: "#fff",
      fontSize: scaleFontSize(16),
      fontWeight: "600",
    },

    // Action Sheet
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
    },
    actionLabel: {
      fontSize: scaleFontSize(16),
      fontWeight: "500",
    },
    actionItemDanger: {
      color: "#FF3B30",
    },
    
  })
