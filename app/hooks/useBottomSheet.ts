/**
 * useBottomSheet.ts
 * Hook for showing bottom sheets
 */

import { useCallback } from "react"
import { useBottomSheetContext } from "@/providers/BottomSheetProvider"
import type { BottomSheetParams } from "@/providers/BottomSheetProvider"

export const useBottomSheet = () => {
  const context = useBottomSheetContext()

  const showBottomSheet = useCallback((params: BottomSheetParams) => {
    context.showBottomSheet(params)
  }, [context])

  const closeBottomSheet = useCallback(() => {
    context.closeBottomSheet()
  }, [context])

  return {
    showBottomSheet,
    closeBottomSheet,
  }
}

export default useBottomSheet
