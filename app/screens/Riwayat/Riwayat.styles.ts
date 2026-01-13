/**
 * Home.styles.ts
 *
 * StyleSheet constants for Home screen.
 * Centralized styling for consistent appearance.
 *
 * @module screens/Home
 */

import { StyleSheet } from "react-native"
import { layoutPresets } from "@/theme/layout"
import { $styles } from "@/theme/styles"
import { scale, scaleFontSize } from "@/utils/responsive"

export default StyleSheet.create({
    // Include layout presets
    ...layoutPresets,
    ...$styles as any,

    itemCard: {
    flexDirection: "row",
    marginHorizontal: scale(16),
    marginBottom: scale(12),
    borderRadius: scale(12),
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusBar: {
    width: scale(8),
  },
  itemContent: {
    flex: 1,
    padding: scale(16),
    gap: scale(10)
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(12),
  },
  itemDate: {
    fontSize: scaleFontSize(13),
    color: "#666",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
  },
  statusDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    marginRight: scale(6),
  },
  statusText: {
    fontSize: scaleFontSize(12),
    fontWeight: "600",
  },
  itemDetails: {
    marginBottom: scale(8),
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: scale(4),
  },
  detailLabel: {
    fontSize: scaleFontSize(13),
    color: "#666",
    width: scale(60),
  },
  detailValue: {
    fontSize: scaleFontSize(13),
    fontWeight: "500",
    flex: 1,
  },
  locationRow: {
    marginTop: scale(4),
  },
  locationText: {
    fontSize: scaleFontSize(11),
    color: "#999",
  },
  notesText: {
    marginTop: scale(8),
    fontSize: scaleFontSize(12),
    color: "#666",
    fontStyle: "italic",
  },
    scrollContent: {
        paddingBottom: 24,
    },
    welcomeSection: {
        padding: 24,
        alignItems: "center",
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    welcomeSubtitle: {
        fontSize: 14,
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 16,
        textTransform: "uppercase",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -6,
    },
    gridItem: {
        width: "50%",
        padding: 6,
        borderRadius: 12,
        marginBottom: 12,
    },
    gridItemTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    gridItemDescription: {
        fontSize: 12,
        lineHeight: 16,
    },
    infoSection: {
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
})

const $outerStyle = {
    flex: 1,
}

const $flex1 = {
    flex: 1,
}
