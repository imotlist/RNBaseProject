/**
 * Auth.tsx
 *
 * Container-based screen for Auth feature.
 * This file contains the screen controller logic with state management
 * and event handlers.
 *
 * @module screens/Auth
 */

import { useCallback, useState } from "react"
import { FormikHelpers } from "formik"
import { useAuth } from "@/context/AuthContext"
import AuthScreenView from "./AuthScreenView"
import * as authApi from "@/services/api/apisCollection/auth"
import { getFCMToken } from "@/utils/fcm"
import type { UserData } from "@/services/api/apisCollection/auth"

// ============================================================================
// Types
// ============================================================================

export interface LoginFormValues {
  email: string
  password: string
}

export interface AuthScreenViewProps {
  isLoading: boolean
  onLogin: (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => void
  errorMessage?: string | null
}

// ============================================================================
// Screen Component
// ============================================================================

const Auth = () => {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Handle form submission
  const handleLogin = useCallback(
    async (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        // Get FCM token for push notifications
        const fcmToken = await getFCMToken()

        // Call login API
        const response = await authApi.login({
          email: values.email,
          password: values.password,
          fcm_token: fcmToken || undefined,
        })

        // Convert API user data to match context UserData
        const userData: UserData = {
          id: response.user.id,
          name: response.user.name,
          username: response.user.username || response.user.name,
          email: response.user.email,
          role: response.user.role,
          city_id: response.user.city_id,
          avatar: response.user.avatar,
        }

        // Successful login - store user data in context
        await login(userData, response.access_token)
        helpers.resetForm()
      } catch (error) {
        console.error("Login error:", error)
        const message = error instanceof Error ? error.message : "Login failed. Please try again."
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    },
    [login],
  )

  const viewProps: AuthScreenViewProps = {
    isLoading,
    onLogin: handleLogin,
    errorMessage,
  }

  return <AuthScreenView {...viewProps} />
}

export default Auth
