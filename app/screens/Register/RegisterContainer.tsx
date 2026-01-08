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
}

// ============================================================================
// Screen Component
// ============================================================================

const RegisterContainer = () => {
  const { setAuthToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Handle form submission
  const handleRegister = useCallback(
    async (values: RegisterFormValues, helpers: FormikHelpers<RegisterFormValues>) => {
      setIsLoading(true)
      try {
        console.log("Register values:", values)

        // TODO: Implement actual API call
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock successful registration - set auth token
        setAuthToken(String(Date.now()))

        // Reset form on success
        helpers.resetForm()
      } catch (error) {
        console.error("Register error:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [setAuthToken],
  )

  return <RegisterContainerView isLoading={isLoading} onRegister={handleRegister} />
}

export default RegisterContainer
