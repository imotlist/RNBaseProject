/**
 * usePopupMessage.ts
 * Hook for showing popup/alert dialogs
 */

import { useCallback } from "react"
import {
  showConfirm as showConfirmUtil,
  showAlert as showAlertUtil,
  showInfo as showInfoUtil,
} from "@/providers/PopupMessageProvider"
import { usePopupMessageContext } from "@/providers/PopupMessageProvider"

export const usePopupMessage = () => {
  const context = usePopupMessageContext()

  const showConfirm = useCallback(
    (options: { title: string; message: string; onConfirm: () => void; onCancel?: () => void }) => {
      showConfirmUtil(options, context.showPopup)
    },
    [context],
  )

  const showAlert = useCallback(
    (options: { title: string; message: string; onConfirm?: () => void }) => {
      showAlertUtil(options, context.showPopup)
    },
    [context],
  )

  const showInfo = useCallback(
    (options: { title: string; message: string; onConfirm?: () => void }) => {
      showInfoUtil(options, context.showPopup)
    },
    [context],
  )

  return {
    showConfirm,
    showAlert,
    showInfo,
    showPopup: context.showPopup,
  }
}

export default usePopupMessage
