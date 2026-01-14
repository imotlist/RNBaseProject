/**
 * ProfileEditScreenView.tsx
 *
 * Presentational component for ProfileEdit screen.
 * Contains the profile edit form UI with account info
 * and password change sections.
 *
 * @module screens/ProfileEdit
 */

import React from "react"
import { View, StyleSheet, Pressable, TextInput, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { IconPack } from "@/components/ui/IconPack/IconPack"
import { TitleBar } from "@/components/ui"
import { scale, scaleFontSize } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import type { ProfileEditScreenViewProps, ProfileEditData } from "./types"
import { goBack } from "@/navigators/navigationUtilities"

// ============================================================================
// View Component
// ============================================================================

const ProfileEditScreenView: React.FC<ProfileEditScreenViewProps> = ({
  user,
  isSubmitting,
  errors,
  showPassword,
  showNewPassword,
  showConfirmPassword,
  name,
  email,
  currentPassword,
  newPassword,
  newPasswordConfirmation,
  onNameChange,
  onEmailChange,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onTogglePasswordVisibility,
  onSubmit,
  onCancel,
}) => {
  const { theme } = useAppTheme()
  const { colors } = theme;

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} statusBarBackgroundColor="white">
      <TitleBar title="Edit Profil" backgroundColor="white" onBackPress={goBack}/>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* General Error */}
        {errors.general && (
          <View style={[styles.errorBox, { backgroundColor: "#FFEBEE" }]}>
            <IconPack name="danger" size={scale(16)} color="#EF4444" />
            <Text style={styles.errorText}>{errors.general}</Text>
          </View>
        )}

        {/* Account Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Akun</Text>

          {/* Name Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={[styles.inputContainer, errors.name && styles.inputError]}>
              <IconPack name="user" size={scale(18)} color={colors.textDim} />
              <TextInput
                style={styles.input}
                onChangeText={onNameChange}
                value={name}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor={colors.textDim}
                autoCapitalize="words"
              />
              {name.trim() && (
                <Pressable onPress={() => onNameChange("")}>
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
                onChangeText={onEmailChange}
                value={email}
                placeholder="Masukkan email"
                placeholderTextColor={colors.textDim}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {email.trim() && (
                <Pressable onPress={() => onEmailChange("")}>
                  <IconPack name="closeCircle" size={scale(16)} color={colors.textDim} />
                </Pressable>
              )}
            </View>
            {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
          </View>
        </View>

        {/* Password Section */}
        <View style={[styles.section, styles.sectionLast]}>
          <Text style={styles.sectionTitle}>Ubah Password</Text>
          <Text style={styles.sectionDescription}>
            Kosongkan jika tidak ingin mengubah password
          </Text>

          {/* Current Password Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password Saat Ini</Text>
            <View style={[styles.inputContainer, errors.current_password && styles.inputError]}>
              <IconPack name="lock" size={scale(18)} color={colors.textDim} />
              <TextInput
                style={styles.input}
                onChangeText={onCurrentPasswordChange}
                value={currentPassword}
                placeholder="Masukkan password saat ini"
                placeholderTextColor={colors.textDim}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => onTogglePasswordVisibility("current")}>
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
                onChangeText={onNewPasswordChange}
                value={newPassword}
                placeholder="Masukkan password baru"
                placeholderTextColor={colors.textDim}
                secureTextEntry={!showNewPassword}
              />
              <Pressable onPress={() => onTogglePasswordVisibility("new")}>
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
                onChangeText={onConfirmPasswordChange}
                value={newPasswordConfirmation}
                placeholder="Konfirmasi password baru"
                placeholderTextColor={colors.textDim}
                secureTextEntry={!showConfirmPassword}
              />
              <Pressable onPress={() => onTogglePasswordVisibility("confirm")}>
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
        </View>

        {/* Bottom padding for buttons */}
        <View style={styles.bottomSpacer} />
        <View style={[styles.bottomBar, { borderTopColor: theme.colors.separator }]}>
          <Pressable
            style={[styles.bottomButton, styles.secondaryButton, { borderColor: theme.colors.separator }]}
            onPress={onCancel}
            disabled={isSubmitting}
          >
            <Text style={[styles.bottomButtonText, { color: theme.colors.text }]}>Batal</Text>
          </Pressable>
          <Pressable
            style={[
              styles.bottomButton,
              styles.primaryButton,
              { backgroundColor: isSubmitting ? theme.colors.palette.neutral300 : theme.colors.tint },
            ]}
            onPress={onSubmit}
            disabled={isSubmitting}
          >
            <Text
              style={[
                styles.bottomButtonText,
                { color: isSubmitting ? theme.colors.textDim : "#fff" },
              ]}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}

    </Screen>
  )
}

export default ProfileEditScreenView

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: scale(100),
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    padding: scale(12),
    borderRadius: scale(8),
    marginHorizontal: scale(16),
    marginTop: scale(16),
    marginBottom: scale(8),
  },
  errorText: {
    fontSize: scaleFontSize(13),
    color: "#EF4444",
    flex: 1,
  },
  section: {
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: "#F4F2F1",
  },
  sectionLast: {
    borderBottomWidth: 0,
    paddingBottom: scale(16),
  },
  sectionTitle: {
    fontSize: scaleFontSize(14),
    fontWeight: "600",
    color: "#333",
    marginBottom: scale(4),
  },
  sectionDescription: {
    fontSize: scaleFontSize(13),
    color: "#999",
    marginBottom: scale(16),
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
  bottomSpacer: {
    height: scale(20),
  },
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    paddingTop: scale(12),
    borderTopWidth: 1,
    gap: scale(12),
    backgroundColor: "#fff",
  },
  bottomButton: {
    flex: 1,
    paddingVertical: scale(14),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  primaryButton: {
    flex: 1,
  },
  bottomButtonText: {
    fontSize: scaleFontSize(16),
    fontWeight: "600",
  },
})
