/**
 * Register.tsx
 *
 * Container-based screen for Register feature.
 * This file contains the screen controller logic with state management
 * and event handlers.
 *
 * @module screens/Register
 */

import { useCallback, useState, useEffect } from "react"
import { FormikHelpers } from "formik"
import { useAuth } from "@/context/AuthContext"
import RegisterScreenView from "./RegisterScreenView"
import * as authApi from "@/services/api/apisCollection/auth"
import * as citiesApi from "@/services/api/apisCollection/cities"
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
  name: string
  email: string
  city_id: string | number
  password: string
  password_confirmation: string
}

export interface RegisterScreenViewProps {
  isLoading: boolean
  onRegister: (values: RegisterFormValues, helpers: FormikHelpers<RegisterFormValues>) => void
  errorMessage?: string | null
  cityOptions: CityOption[]
  isLoadingCities: boolean
}

// ============================================================================
// Screen Component
// ============================================================================

const Register = () => {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [cityOptions, setCityOptions] = useState<CityOption[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      setIsLoadingCities(true)
      try {
        const options = await citiesApi.getCitiesOptions(1, 100)
        setCityOptions(options)
      } catch (error) {
        console.error("Error fetching cities:", error)
        // Set default empty options on error
        setCityOptions([])
      } finally {
        setIsLoadingCities(false)
      }
    }

    fetchCities()
  }, [])

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
          name: values.name,
          email: values.email,
          city_id: values.city_id,
          password: values.password,
          password_confirmation: values.password_confirmation,
          fcm_token: fcmToken || undefined,
        })

        // Convert API user data to match context UserData
        // const userData: UserData = {
        //   id: response.user.id,
        //   name: response.user.name,
        //   username: response.user.username || response.user.name,
        //   email: response.user.email,
        //   role: response.user.role,
        //   city_id: response.user.city_id,
        //   avatar: response.user.avatar,
        // }

        // // Successful registration - store user data in context
        // await login(userData, response.access_token)
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

  const viewProps: RegisterScreenViewProps = {
    isLoading,
    onRegister: handleRegister,
    errorMessage,
    cityOptions,
    isLoadingCities,
  }

  return <RegisterScreenView {...viewProps} />
}

export default Register
