/**
 * DataItemsScreen.styles.ts
 *
 * StyleSheet constants for DataItems screen.
 * Centralized styling for consistent appearance.
 *
 * @module screens/DataItems
 */

import { StyleSheet } from "react-native"
import { scale, scaleFontSize, moderateScale } from "@/utils/responsive"

export default StyleSheet.create({
    // Header
    header: {
      paddingHorizontal: scale(16),
      paddingVertical: scale(12),
      borderBottomWidth: 1,
    },
    title: {
      fontSize: scaleFontSize(24),
      fontWeight: "700",
    },

    // Search
    searchContainer: {
      paddingHorizontal: scale(16),
      paddingTop: scale(12),
      paddingBottom: scale(8),
    },

    // Filter Chips
    chipsContainer: {
      paddingHorizontal: scale(16),
      paddingVertical: scale(8),
    },

    // Active Filters
    activeFiltersContainer: {
      paddingHorizontal: scale(16),
      paddingVertical: scale(8),
    },
    activeFiltersRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    activeFiltersText: {
      fontSize: scaleFontSize(13),
      color: "#666",
    },
    clearButton: {
      paddingVertical: scale(4),
      paddingHorizontal: scale(8),
    },
    clearButtonText: {
      fontSize: scaleFontSize(14),
      fontWeight: "600",
    },

    // List
    listContent: {
      paddingVertical: scale(8),
    },

    // List Item
    itemCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: scale(16),
      marginHorizontal: scale(16),
      marginBottom: scale(8),
      borderRadius: moderateScale(12),
    },
    itemContent: {
      flex: 1,
    },
    itemName: {
      fontSize: scaleFontSize(16),
      fontWeight: "600",
      marginBottom: scale(4),
    },
    itemDescription: {
      fontSize: scaleFontSize(13),
    },
    itemMeta: {
      fontSize: scaleFontSize(12),
      color: "#666",
    },

    // Empty State
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: scale(40),
    },
    emptyText: {
      fontSize: scaleFontSize(16),
      color: "#666",
      marginTop: scale(16),
    },

    // Loading
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    // Filter Sheet
    filterSection: {
      marginBottom: scale(20),
    },
    filterSectionTitle: {
      fontSize: scaleFontSize(14),
      fontWeight: "600",
      marginBottom: scale(12),
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    filterSummary: {
      padding: scale(14),
      borderRadius: scale(10),
      backgroundColor: "#F4F2F1",
    },
    filterSummaryText: {
      fontSize: scaleFontSize(14),
      fontWeight: "500",
    },
  })
