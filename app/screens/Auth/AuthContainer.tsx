/**
 * AuthScreen.tsx
 *
 * Container-based screen template for Auth feature.
 * This file contains the screen controller logic with state management
 * and event handlers for container-style screens.
 *
 * @module screens/Auth
 */

import { useCallback, useState } from "react"
import { FormikHelpers } from "formik"
import { useAuth } from "@/context/AuthContext"
import AuthContainerView from "./AuthContainerView"
import { de } from "date-fns/locale"

// ============================================================================
// Types
// ============================================================================

export interface AuthData {
  id: string
  title: string
  value: string | number
  [key: string]: any
}

export interface LoginFormValues {
  username: string
  password: string
}

export interface AuthContainerViewProps {
  isLoading: boolean
  onLogin: (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => void
}

// ============================================================================
// Screen Component
// ============================================================================

const AuthContainer = () => {
  const { setAuthToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Handle form submission
  const handleLogin = useCallback(
    async (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => {
      setIsLoading(true)
      try {
        console.log("Login values:", values)

        // TODO: Implement actual API call
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock successful login - set auth token
        setAuthToken(String(Date.now()))

        // Reset form on success
        helpers.resetForm()
      } catch (error) {
        console.error("Login error:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [setAuthToken],
  )

  return <AuthContainerView isLoading={isLoading} onLogin={handleLogin} />
}

export default AuthContainer
