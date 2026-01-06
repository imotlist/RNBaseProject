/**
 * useFlashMessage.ts
 * Hook for showing flash messages/toasts
 */

import { useCallback } from "react"
import { showMessage as showFlashMessage, hideMessage as hideFlashMessage } from "react-native-flash-message"

export type FlashMessageType = "success" | "error" | "warning" | "info"

export interface FlashMessageOptions {
  /**
   * Message type
   */
  type?: FlashMessageType
  /**
   * Message to display
   */
  message: string
  /**
   * Optional title
   */
  title?: string
  /**
   * Duration in milliseconds
   */
  duration?: number
  /**
   * Whether to auto-hide
   */
  autoHide?: boolean
}

export const useFlashMessage = () => {
  const showMessage = useCallback((options: FlashMessageOptions) => {
    const {
      type = "info",
      message,
      title,
      duration = 3000,
      autoHide = true,
    } = options

    const getMessageType = () => {
      switch (type) {
        case "success":
          return "success"
        case "error":
          return "danger"
        case "warning":
          return "warning"
        default:
          return "info"
      }
    }

    showFlashMessage({
      message: title || type.charAt(0).toUpperCase() + type.slice(1),
      description: message,
      type: getMessageType(),
      duration: autoHide ? duration : 0,
      floating: true,
      icon: type === "success" ? "success" : type === "error" ? "danger" : "info",
    })
  }, [])

  const showSuccess = useCallback((message: string, title?: string) => {
    showMessage({ type: "success", message, title })
  }, [showMessage])

  const showError = useCallback((message: string, title?: string) => {
    showMessage({ type: "error", message, title })
  }, [showMessage])

  const showWarning = useCallback((message: string, title?: string) => {
    showMessage({ type: "warning", message, title })
  }, [showMessage])

  const showInfo = useCallback((message: string, title?: string) => {
    showMessage({ type: "info", message, title })
  }, [showMessage])

  const hideMessage = useCallback(() => {
    hideFlashMessage()
  }, [])

  return {
    showMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideMessage,
  }
}

export default useFlashMessage
