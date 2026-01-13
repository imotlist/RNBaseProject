/**
 * RegisterContainer.tsx
 *
 * Container-based screen template for Register feature.
 * This file contains the screen controller logic with state management
 * and event handlers for container-style screens.
 *
 * @module screens/Register
 */

import { useCallback, useState } from "react"
import { FormikHelpers } from "formik"
import { useAuth } from "@/context/AuthContext"
import RegisterContainerView from "./RegisterContainerView"
import * as authApi from "@/services/api/apisCollection/auth"
import { getFCMToken } from "@/utils/fcm"
import type { UserData } from "@/services/api/apisCollection/auth"

// ============================================================================
// Types
// ============================================================================

export interface CityOption {
  id: string | number
  name: string
}

export interface RegisterFormValues {
  username: string
  email: string
  city_id: string | number
  password: string
  password_confirmation: string
}

export interface RegisterContainerViewProps {
  isLoading: boolean
  onRegister: (values: RegisterFormValues, helpers: FormikHelpers<RegisterFormValues>) => void
  errorMessage?: string | null
}

// ============================================================================
// Screen Component
// ============================================================================

const RegisterContainer = () => {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Handle form submission
  const handleRegister = useCallback(
    async (values: RegisterFormValues, helpers: FormikHelpers<RegisterFormValues>) => {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        // Get FCM token for push notifications
        const fcmToken = await getFCMToken()

        // Call register API
        const response = await authApi.register({
          username: values.username,
          email: values.email,
          city_id: values.city_id,
          password: values.password,
          password_confirmation: values.password_confirmation,
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

        // Successful registration - store user data in context
        await login(userData, response.access_token)
        helpers.resetForm()
      } catch (error) {
        console.error("Register error:", error)
        const message = error instanceof Error ? error.message : "Registration failed. Please try again."
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    },
    [login],
  )

  return (
    <RegisterContainerView
      isLoading={isLoading}
      onRegister={handleRegister}
      errorMessage={errorMessage}
    />
  )
}

export default RegisterContainer
