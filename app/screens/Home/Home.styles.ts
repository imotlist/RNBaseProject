/**
 * Home.styles.ts
 *
 * StyleSheet constants for Home screen.
 * Centralized styling for consistent appearance.
 *
 * @module screens/Home
 */

import { StyleSheet, Dimensions } from "react-native"
import { layoutPresets } from "@/theme/layout"
import { $styles } from "@/theme/styles"

export default StyleSheet.create({
    // Include layout presets
    ...layoutPresets,
    ...$styles as any,
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
    tabContent: {
        minHeight: 300,
    },
    topScroll: {
        maxHeight: 300,
    },
    topScrollContent: {
        paddingBottom: 10,
    },
    tabContentContainer: {
        height: Dimensions.get('screen').height * 0.45,
    },
})

const $outerStyle = {
    flex: 1,
}

const $flex1 = {
    flex: 1,
}
