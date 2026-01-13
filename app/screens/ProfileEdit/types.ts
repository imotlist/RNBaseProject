/**
 * types.ts
 *
 * Type definitions for ProfileEdit screen.
 * Separated to avoid circular imports between Container and View.
 *
 * @module screens/ProfileEdit
 */

import type { UserData } from "@/context/AuthContext"

// ============================================================================
// Types
// ============================================================================

export interface ProfileEditData {
  id: string
  name: string
  email: string
  username?: string
  avatar?: string
  [key: string]: any
}

export interface FormErrors {
  name?: string
  email?: string
  current_password?: string
  new_password?: string
  new_password_confirmation?: string
  general?: string
}

export interface ProfileEditContainerViewProps {
  user: UserData
  isSubmitting: boolean
  errors: FormErrors
  showPassword: boolean
  showNewPassword: boolean
  showConfirmPassword: boolean
  name: string
  email: string
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
  onNameChange: (name: string) => void
  onEmailChange: (email: string) => void
  onCurrentPasswordChange: (password: string) => void
  onNewPasswordChange: (password: string) => void
  onConfirmPasswordChange: (password: string) => void
  onTogglePasswordVisibility: (field: "current" | "new" | "confirm") => void
  onSubmit: () => void
  onCancel: () => void
}
