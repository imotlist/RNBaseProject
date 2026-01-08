import { ViewStyle } from "react-native"

import { spacing } from "./spacing"
import { scale } from "@/utils/responsive"

/* Use this file to define styles that are used in multiple places in your app. */
export const $styles = {
  row: { flexDirection: "row" } as ViewStyle,
  flex1: { flex: 1 } as ViewStyle,
  flexWrap: { flexWrap: "wrap" } as ViewStyle,

  container: {
    paddingBottom: spacing.sm,
    width: "100%",
  } as ViewStyle,

  containerPadding: {
    paddingVertical: spacing.lg,
    width: "100%",
    paddingHorizontal: spacing.lg,
  } as ViewStyle,

  toggleInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  } as ViewStyle,

  cirleSm : {
    borderRadius : scale(40),
    width : scale(40),
    height: scale(40),
    justifyContent :'center',
    alignItems : "center"
  },

  contentContainer : {
    // gap: scale(20)
  },

  sectionContainer:{
    paddingHorizontal : scale(20),
    paddingVertical : scale(14),
    gap: scale(20)
  }
}
