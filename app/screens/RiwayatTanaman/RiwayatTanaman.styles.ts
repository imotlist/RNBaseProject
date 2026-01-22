/**
 * RiwayatTanaman.styles.ts
 *
 * StyleSheet constants for RiwayatTanaman screen.
 * Centralized styling for consistent appearance.
 *
 * @module screens/RiwayatTanaman
 */

import { StyleSheet, Dimensions } from "react-native"
import { scale, scaleFontSize } from "@/utils/responsive"

export default StyleSheet.create({
  // Header styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
    paddingBottom: scale(16),
  },
  backButton: {
    padding: scale(4),
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
  },
  headerTitleText: {
    fontSize: scaleFontSize(18),
    fontWeight: "600",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: scaleFontSize(12),
    color: "rgba(255,255,255,0.8)",
    marginTop: scale(2),
  },
  headerRight: {
    width: scale(32),
  },

  // Plant info card styles
  infoCard: {
    marginTop: scale(20),
    flexDirection: "row",
    marginHorizontal: scale(16),
    marginBottom: scale(12),
    borderRadius: scale(12),
    padding: scale(16),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: Dimensions.get('screen').height * 0.175,
  },
  plantImage: {
    width: scale(100),
    height: '100%',
    borderRadius: scale(5),
  },
  plantInfoContent: {
    flex: 1,
    marginLeft: scale(12),
  },
  plantName: {
    fontSize: scaleFontSize(16),
    fontWeight: "600",
  },
  plantCode: {
    fontSize: scaleFontSize(13),
    color: "#666",
    marginTop: scale(2),
  },
  plantMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: scale(4),
    gap: scale(4),
  },
  plantMetaText: {
    fontSize: scaleFontSize(11),
    color: "#999",
  },
  loadingText: {
    fontSize: scaleFontSize(14),
    color: "#666",
  },
  errorText: {
    fontSize: scaleFontSize(14),
    color: "#EF4444",
  },

  // List styles
  listContent: {
    paddingTop: scale(8),
    paddingBottom: scale(16),
  },

  // List item card styles
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
  itemImage: {
    width: scale(100),
    height: '100%',
  },
  itemContent: {
    flex: 1,
    padding: scale(16),
    gap: scale(10),
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(8),
  },
  itemDate: {
    fontSize: scaleFontSize(12),
    color: "#666",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
  },
  statusDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    marginRight: scale(4),
  },
  statusText: {
    fontSize: scaleFontSize(11),
    fontWeight: "600",
  },

  // AI Analysis styles
  aiSection: {
    marginBottom: scale(8),
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    marginBottom: scale(4),
  },
  aiBadgeText: {
    fontSize: scaleFontSize(10),
    fontWeight: "600",
    marginLeft: scale(4),
  },
  aiDescription: {
    fontSize: scaleFontSize(12),
    color: "#666",
    lineHeight: scale(16),
  },

  // Detail rows styles
  itemDetails: {
    marginBottom: scale(6),
  },
  detailRow: {
    flexDirection: "row",
  },
  detailLabel: {
    fontSize: scaleFontSize(11),
    color: "#666",
    width: scale(50),
  },
  detailValue: {
    fontSize: scaleFontSize(11),
    fontWeight: "500",
    flex: 1,
  },
  userText: {
    fontSize: scaleFontSize(10),
    color: "#999",
  },

  // Layout utility styles
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plantInfo: {
    flex: 1,
    marginLeft: scale(8),
  },
})
