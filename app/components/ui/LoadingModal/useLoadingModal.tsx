/**
 * useLoadingModal.ts
 *
 * Custom hook for managing loading modal state.
 * Provides simple show/hide functions with optional text configuration.
 *
 * @module components/ui/LoadingModal
 */

import { useCallback, useState } from "react"
import { LoadingModal, LoadingModalProps } from "./LoadingModal"

export interface LoadingModalState extends Omit<LoadingModalProps, 'visible'> {}

export interface UseLoadingModalReturn {
  /** The loading modal component */
  LoadingModalComponent: React.FC
  /** Function to show the loading modal */
  showLoading: (config?: LoadingModalState) => void
  /** Function to hide the loading modal */
  hideLoading: () => void
  /** Whether the modal is currently visible */
  isVisible: boolean
}

/**
 * Hook for managing a loading modal with simple show/hide functions.
 *
 * @example
 * ```tsx
 * const { LoadingModalComponent, showLoading, hideLoading } = useLoadingModal()
 *
 * const fetchData = async () => {
 *   showLoading({ title: "Loading", message: "Please wait..." })
 *   try {
 *     await apiCall()
 *   } finally {
 *     hideLoading()
 *   }
 * }
 *
 * return (
 *   <>
 *     <LoadingModalComponent />
 *     {/ ... other content /}
 *   </>
 * )
 * ```
 */
export function useLoadingModal(): UseLoadingModalReturn {
  const [visible, setVisible] = useState(false)
  const [config, setConfig] = useState<LoadingModalState>({})

  const showLoading = useCallback((newConfig?: LoadingModalState) => {
    if (newConfig) {
      setConfig(newConfig)
    }
    setVisible(true)
  }, [])

  const hideLoading = useCallback(() => {
    setVisible(false)
  }, [])

  const LoadingModalComponent: React.FC = useCallback(() => {
    return (
      <LoadingModal
        visible={visible}
        {...config}
      />
    )
  }, [visible, config])

  return {
    LoadingModalComponent,
    showLoading,
    hideLoading,
    isVisible: visible,
  }
}
