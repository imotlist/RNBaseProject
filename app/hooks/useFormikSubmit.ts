/**
 * useFormikSubmit.ts
 * Hook for handling Formik form submission with API calls
 */

import { useCallback } from "react"
import { FormikHelpers } from "formik"
import { useConnection } from "@/context/ConnectionContext"
import { useFlashMessage } from "./useFlashMessage"

export interface UseFormikSubmitOptions<T, R> {
  /**
   * Submit function that makes the API call
   */
  submitFn: (values: T) => Promise<R>
  /**
   * Success message
   */
  successMessage?: string
  /**
   * Error message prefix
   */
  errorPrefix?: string
  /**
   * Callback on success
   */
  onSuccess?: (result: R, values: T) => void
  /**
   * Callback on error
   */
  onError?: (error: any) => void
  /**
   * Callback on completion (success or error)
   */
  onFinally?: () => void
}

export interface FormikSubmitHandler<T> {
  (values: T, formikHelpers: FormikHelpers<T>): Promise<void>
}

/**
 * Hook for handling Formik form submission with loading states and error handling
 */
export const useFormikSubmit = <T, R>(
  options: UseFormikSubmitOptions<T, R>,
): FormikSubmitHandler<T> => {
  const { submitFn, successMessage, errorPrefix = "Error", onSuccess, onError, onFinally } =
    options
  const { isConnected } = useConnection()
  const { showError, showSuccess } = useFlashMessage()

  const handleSubmit = useCallback(
    async (values: T, helpers: FormikHelpers<T>) => {
      const { setSubmitting, setErrors, resetForm } = helpers

      // Check internet connection
      if (!isConnected) {
        showError("No internet connection. Please check your network and try again.")
        return
      }

      setSubmitting(true)

      try {
        const result = await submitFn(values)

        // Show success message
        if (successMessage) {
          showSuccess(successMessage)
        }

        // Call success callback
        onSuccess?.(result, values)

        // Optionally reset form
        // resetForm?.()
      } catch (error: any) {
        console.error("Form submission error:", error)

        // Handle validation errors
        if (error?.response?.data?.errors) {
          const apiErrors = error.response.data.errors
          const formErrors: Record<string, string> = {}

          // Convert API errors to form errors
          for (const [field, messages] of Object.entries(apiErrors)) {
            formErrors[field] = Array.isArray(messages) ? messages[0] : String(messages)
          }

          setErrors(formErrors as any)
          showError("Please fix the errors and try again.")
        } else if (error?.response?.data?.message) {
          // Show API error message
          showError(`${errorPrefix}: ${error.response.data.message}`)
        } else {
          // Show generic error
          showError(
            error?.message || "An unexpected error occurred. Please try again.",
          )
        }

        // Call error callback
        onError?.(error)
      } finally {
        setSubmitting(false)
        onFinally?.()
      }
    },
    [submitFn, successMessage, errorPrefix, onSuccess, onError, onFinally, isConnected, showError, showSuccess],
  )

  return handleSubmit
}

export default useFormikSubmit
