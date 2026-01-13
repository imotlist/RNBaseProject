/**
 * ProfileEditContainer.tsx
 *
 * Container component for ProfileEdit screen.
 * Handles profile editing logic with state management,
 * form validation, and API integration.
 *
 * @module screens/ProfileEdit
 */

import React, { useState, useCallback } from "react"
import { Alert } from "react-native"
import { useNavigation, RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AppStackParamList } from "@/navigators/navigationTypes"
import { useAuth } from "@/context/AuthContext"
import * as authApi from "@/services/api/apisCollection/auth"
import ProfileEditContainerView from "./ProfileEditContainerView"
import type { FormErrors } from "./types"

// Re-export types for use in other files
export type { ProfileEditContainerViewProps, ProfileEditData, FormErrors } from "./types"

type ProfileEditScreenRouteProp = RouteProp<AppStackParamList, "ProfileEdit">
type ProfileEditScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, "ProfileEdit">

interface ProfileEditScreenProps {
  route: ProfileEditScreenRouteProp
  navigation: ProfileEditScreenNavigationProp
}

// ============================================================================
// Screen Component
// ============================================================================

export const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({ route }) => {
  const navigation = useNavigation<ProfileEditScreenNavigationProp>()
  const { user: authUser, login } = useAuth()

  // Get user data from route params or auth context
  const user = route.params?.user || authUser

  if (!user) {
    Alert.alert("Error", "User data not found")
    navigation.goBack()
    return null
  }

  // Form state
  const [name, setName] = useState(user.name || "")
  const [email, setEmail] = useState(user.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("")

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({})

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Nama harus diisi"
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email harus diisi"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email tidak valid"
    }

    // Password validation (only if changing password)
    if (newPassword || currentPassword) {
      if (!currentPassword) {
        newErrors.current_password = "Password saat ini harus diisi"
      }
      if (!newPassword) {
        newErrors.new_password = "Password baru harus diisi"
      } else if (newPassword.length < 6) {
        newErrors.new_password = "Password baru minimal 6 karakter"
      }
      if (newPassword !== newPasswordConfirmation) {
        newErrors.new_password_confirmation = "Konfirmasi password tidak cocok"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [name, email, currentPassword, newPassword, newPasswordConfirmation])

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const payload: authApi.UpdateProfileRequest = {
        name: name.trim(),
        email: email.trim(),
      }

      // Only include password fields if user wants to change password
      if (newPassword) {
        payload.current_password = currentPassword
        payload.new_password = newPassword
        payload.new_password_confirmation = newPasswordConfirmation
      }

      const updatedUser = await authApi.updateProfile(payload)

      // Update auth context
      await login(updatedUser)

      Alert.alert("Berhasil", "Profil berhasil diperbarui", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memperbarui profil"
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }, [name, email, currentPassword, newPassword, newPasswordConfirmation, validateForm, login, navigation])

  const togglePasswordVisibility = useCallback((field: "current" | "new" | "confirm") => {
    if (field === "current") setShowPassword((prev) => !prev)
    if (field === "new") setShowNewPassword((prev) => !prev)
    if (field === "confirm") setShowConfirmPassword((prev) => !prev)
  }, [])

  const handleCancel = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return (
    <ProfileEditContainerView
      user={user}
      isSubmitting={isSubmitting}
      errors={errors}
      showPassword={showPassword}
      showNewPassword={showNewPassword}
      showConfirmPassword={showConfirmPassword}
      name={name}
      email={email}
      currentPassword={currentPassword}
      newPassword={newPassword}
      newPasswordConfirmation={newPasswordConfirmation}
      onNameChange={setName}
      onEmailChange={setEmail}
      onCurrentPasswordChange={setCurrentPassword}
      onNewPasswordChange={setNewPassword}
      onConfirmPasswordChange={setNewPasswordConfirmation}
      onTogglePasswordVisibility={togglePasswordVisibility}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

export default ProfileEditScreen
