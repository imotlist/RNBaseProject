/**
 * ProfileEditSheet.tsx
 *
 * Bottom sheet component for editing user profile.
 * Allows users to update their name, email, and password.
 *
 * @module screens/Profile
 */

import React, { useState, useCallback } from "react"
import { View, StyleSheet, Pressable, Alert, TextInput } from "react-native"
import { Text } from "@/components/Text"
import { IconPack } from "@/components/ui/IconPack/IconPack"
import { BottomSheetContent, BottomSheetSection } from "@/components/ui/BottomSheetContent"
import { useAppTheme } from "@/theme/context"
import { scale, scaleFontSize } from "@/utils/responsive"
import * as authApi from "@/services/api/apisCollection/auth"
import type { UserData } from "@/context/AuthContext"

// ============================================================================
// Types
// ============================================================================

export interface ProfileEditSheetProps {
  user: UserData
  onSuccess: (updatedUser: UserData) => void
  onClose: () => void
}

interface FormErrors {
  name?: string
  email?: string
  current_password?: string
  new_password?: string
  new_password_confirmation?: string
  general?: string
}

// ============================================================================
// Component
// ============================================================================

export const ProfileEditSheet: React.FC<ProfileEditSheetProps> = ({ user, onSuccess, onClose }) => {
  const { theme } = useAppTheme()
  const { colors } = theme

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
      onSuccess(updatedUser)
      Alert.alert("Berhasil", "Profil berhasil diperbarui", [
        { text: "OK", onPress: onClose },
      ])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memperbarui profil"
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }, [name, email, currentPassword, newPassword, newPasswordConfirmation, validateForm, onSuccess, onClose])

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    if (field === "current") setShowPassword(!showPassword)
    if (field === "new") setShowNewPassword(!showNewPassword)
    if (field === "confirm") setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <BottomSheetContent
      title="Edit Profil"
      showClose={true}
      onClose={onClose}
      primaryButtonLabel={isSubmitting ? "Menyimpan..." : "Simpan"}
      onPrimaryPress={handleSubmit}
      primaryDisabled={isSubmitting}
      secondaryButtonLabel="Batal"
      onSecondaryPress={onClose}
    >
      {/* General Error */}
      {errors.general && (
        <View style={[styles.errorBox, { backgroundColor: "#FFEBEE" }]}>
          <IconPack name="danger" size={scale(16)} color="#EF4444" />
          <Text style={styles.errorText}>{errors.general}</Text>
        </View>
      )}

      {/* Account Info Section */}
      <BottomSheetSection title="Informasi Akun">
        {/* Name Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <View style={[styles.inputContainer, errors.name && styles.inputError]}>
            <IconPack name="user" size={scale(18)} color={colors.textDim} />
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor={colors.textDim}
            />
            {name.trim() && (
              <Pressable onPress={() => setName("")}>
                <IconPack name="closeCircle" size={scale(16)} color={colors.textDim} />
              </Pressable>
            )}
          </View>
          {errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}
        </View>

        {/* Email Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={[styles.inputContainer, errors.email && styles.inputError]}>
            <IconPack name="sms" size={scale(18)} color={colors.textDim} />
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Masukkan email"
              placeholderTextColor={colors.textDim}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {email.trim() && (
              <Pressable onPress={() => setEmail("")}>
                <IconPack name="closeCircle" size={scale(16)} color={colors.textDim} />
              </Pressable>
            )}
          </View>
          {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
        </View>
      </BottomSheetSection>

      {/* Password Section */}
      <BottomSheetSection
        title="Ubah Password"
        description="Kosongkan jika tidak ingin mengubah password"
      >
        {/* Current Password Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password Saat Ini</Text>
          <View style={[styles.inputContainer, errors.current_password && styles.inputError]}>
            <IconPack name="lock" size={scale(18)} color={colors.textDim} />
            <TextInput
              style={styles.input}
              onChangeText={setCurrentPassword}
              value={currentPassword}
              placeholder="Masukkan password saat ini"
              placeholderTextColor={colors.textDim}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => togglePasswordVisibility("current")}>
              <IconPack
                name={showPassword ? "eye" : "eyeSlash"}
                size={scale(18)}
                color={colors.textDim}
              />
            </Pressable>
          </View>
          {errors.current_password && <Text style={styles.fieldError}>{errors.current_password}</Text>}
        </View>

        {/* New Password Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password Baru</Text>
          <View style={[styles.inputContainer, errors.new_password && styles.inputError]}>
            <IconPack name="lock" size={scale(18)} color={colors.textDim} />
            <TextInput
              style={styles.input}
              onChangeText={setNewPassword}
              value={newPassword}
              placeholder="Masukkan password baru"
              placeholderTextColor={colors.textDim}
              secureTextEntry={!showNewPassword}
            />
            <Pressable onPress={() => togglePasswordVisibility("new")}>
              <IconPack
                name={showNewPassword ? "eye" : "eyeSlash"}
                size={scale(18)}
                color={colors.textDim}
              />
            </Pressable>
          </View>
          {errors.new_password && <Text style={styles.fieldError}>{errors.new_password}</Text>}
        </View>

        {/* Confirm Password Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Konfirmasi Password Baru</Text>
          <View style={[styles.inputContainer, errors.new_password_confirmation && styles.inputError]}>
            <IconPack name="lock" size={scale(18)} color={colors.textDim} />
            <TextInput
              style={styles.input}
              onChangeText={setNewPasswordConfirmation}
              value={newPasswordConfirmation}
              placeholder="Konfirmasi password baru"
              placeholderTextColor={colors.textDim}
              secureTextEntry={!showConfirmPassword}
            />
            <Pressable onPress={() => togglePasswordVisibility("confirm")}>
              <IconPack
                name={showConfirmPassword ? "eye" : "eyeSlash"}
                size={scale(18)}
                color={colors.textDim}
              />
            </Pressable>
          </View>
          {errors.new_password_confirmation && (
            <Text style={styles.fieldError}>{errors.new_password_confirmation}</Text>
          )}
        </View>
      </BottomSheetSection>
    </BottomSheetContent>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    padding: scale(12),
    borderRadius: scale(8),
    marginBottom: scale(16),
  },
  errorText: {
    fontSize: scaleFontSize(13),
    color: "#EF4444",
    flex: 1,
  },
  fieldGroup: {
    marginBottom: scale(16),
  },
  label: {
    fontSize: scaleFontSize(14),
    fontWeight: "500",
    color: "#333",
    marginBottom: scale(8),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: scale(10),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    gap: scale(10),
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  input: {
    flex: 1,
    fontSize: scaleFontSize(14),
    color: "#333",
  },
  fieldError: {
    fontSize: scaleFontSize(12),
    color: "#EF4444",
    marginTop: scale(4),
  },
})

export default ProfileEditSheet
