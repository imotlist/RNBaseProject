/**
 * RegisterContainerView.tsx
 *
 * Presentational component for Register container screen.
 * Contains only UI rendering logic - no business logic.
 * Includes Formik form with username, email, city, password fields.
 *
 * @module screens/Register
 */

import React, { useEffect, useState, useMemo } from "react"
import { View, ScrollView, ActivityIndicator, RefreshControl, Pressable } from "react-native"
import { Formik } from "formik"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { scale } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import styles from "./RegisterContainer.styles"
import { useIsFocused } from "@react-navigation/native"
import { Image } from "expo-image"
import type { RegisterFormValues, RegisterContainerViewProps, CityOption } from "./RegisterContainer"
import { Button } from "@/components/Button"
import { IconPack, Dropdown, DropdownOption } from "@/components/ui"
import { TextField } from "@/components/TextField"
import { navigate } from "@/navigators/navigationUtilities"

// ============================================================================
// City Options (Mock Data - Replace with API call)
// ============================================================================

const CITY_OPTIONS: CityOption[] = [
  { id: "1", name: "Jakarta" },
  { id: "2", name: "Bandung" },
  { id: "3", name: "Surabaya" },
  { id: "4", name: "Medan" },
  { id: "5", name: "Semarang" },
  { id: "6", name: "Makassar" },
  { id: "7", name: "Yogyakarta" },
  { id: "8", name: "Denpasar" },
  { id: "9", name: "Palembang" },
  { id: "10", name: "Balikpapan" },
]

// ============================================================================
// Form Config
// ============================================================================

const INITIAL_VALUES: RegisterFormValues = {
  username: "",
  email: "",
  city_id: "",
  password: "",
  password_confirmation: "",
}

const validate = (values: RegisterFormValues) => {
  const errors: Partial<Record<keyof RegisterFormValues, string>> = {}

  if (!values.username) {
    errors.username = "Username wajib diisi"
  } else if (values.username.length < 3) {
    errors.username = "Username minimal 3 karakter"
  }

  if (!values.email) {
    errors.email = "Email wajib diisi"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Format email tidak valid"
  }

  if (!values.city_id) {
    errors.city_id = "Kota wajib dipilih"
  }

  if (!values.password) {
    errors.password = "Password wajib diisi"
  } else if (values.password.length < 6) {
    errors.password = "Password minimal 6 karakter"
  }

  if (!values.password_confirmation) {
    errors.password_confirmation = "Konfirmasi password wajib diisi"
  } else if (values.password !== values.password_confirmation) {
    errors.password_confirmation = "Konfirmasi password tidak cocok"
  }

  return errors
}

// ============================================================================
// View Component
// ============================================================================

const RegisterContainerView: React.FC<RegisterContainerViewProps> = ({
  isLoading = false,
  onRegister,
  errorMessage,
}) => {
  const { theme } = useAppTheme()
  const { layout } = theme
  const statusBarColor = theme.colors.palette.primary200
  const [useColor, setUseColor] = useState(statusBarColor)
  const isFocused = useIsFocused()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (isFocused) {
      setUseColor(statusBarColor)
    }
  }, [isFocused, statusBarColor])

  const handleRefresh = async () => {
    // Placeholder refresh - not used in register
    console.log("Refresh triggered")
  }

  // Convert city options to dropdown options
  const cityDropdownOptions: DropdownOption[] = useMemo(
    () =>
      CITY_OPTIONS.map((city) => ({
        label: city.name,
        value: city.id,
      })),
    [],
  )

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} statusBarBackgroundColor={useColor} backgroundColor={useColor}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
      >
        <View
          style={[
            styles.containerPadding,
            {
              backgroundColor: "white",
              height: "100%",
              marginTop: scale(40),
              borderTopLeftRadius: scale(30),
              borderTopRightRadius: scale(30),              
            },
          ]}
        >
          {/* Header Section */}
          <View style={[layout.columnCenterPad, { gap: scale(20), alignItems: "center" }]}>
            <Text size="xxl">Register</Text>
            <Text size="md" style={{ textAlign: "center" }}>
              Buat akun baru untuk mulai kelola perawatan tanaman Anda!
            </Text>
          </View>

          {/* Error Message */}
          {errorMessage && (
            <View style={{ backgroundColor: theme.colors.palette.error500, padding: scale(12), borderRadius: scale(8) }}>
              <Text size="sm" style={{ color: "white" }}>{errorMessage}</Text>
            </View>
          )}

          {/* Form Section */}
          <Formik
            initialValues={INITIAL_VALUES}
            validate={validate}
            onSubmit={onRegister}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, setFieldValue }) => (
              <View style={{ gap: scale(16) }}>
                {/* Username Field */}
                <Text weight="normal">Username</Text>
                <TextField
                  placeholder="username"
                  rounded="full"
                  value={values.username}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  status={touched.username && errors.username ? "error" : undefined}
                  helper={touched.username && errors.username ? errors.username : undefined}
                  LeftAccessory={() => (
                    <IconPack name="user" size={scale(20)} color={theme.colors.textDim} />
                  )}
                />

                {/* Email Field */}
                <Text weight="normal">Email</Text>
                <TextField
                  placeholder="email@example.com"
                  rounded="full"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  status={touched.email && errors.email ? "error" : undefined}
                  helper={touched.email && errors.email ? errors.email : undefined}
                  LeftAccessory={() => (
                    <IconPack name="message" size={scale(20)} color={theme.colors.textDim} />
                  )}
                />

                {/* City Dropdown */}
                <Text weight="normal">Kota</Text>
                <Dropdown
                  options={cityDropdownOptions}
                  value={values.city_id}
                  placeholder="Pilih Kota"
                  onSelect={(value) => setFieldValue("city_id", value)}
                  rounded="full"
                  error={touched.city_id ? errors.city_id : undefined}
                />

                {/* Password Field */}
                <Text weight="normal">Password</Text>
                <TextField
                  placeholder="Password"
                  rounded="full"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  secureTextEntry={!showPassword}
                  status={touched.password && errors.password ? "error" : undefined}
                  helper={touched.password && errors.password ? errors.password : undefined}
                  LeftAccessory={() => (
                    <IconPack name="lock" size={scale(20)} color={theme.colors.textDim} />
                  )}
                  RightAccessory={() => (
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <IconPack
                        name={!showPassword ? "eye" : "eye-off"}
                        size={scale(20)}
                        color={theme.colors.textDim}
                      />
                    </Pressable>
                  )}
                />

                {/* Password Confirmation Field */}
                <Text weight="normal">Konfirmasi Password</Text>
                <TextField
                  placeholder="Konfirmasi Password"
                  rounded="full"
                  value={values.password_confirmation}
                  onChangeText={handleChange("password_confirmation")}
                  onBlur={handleBlur("password_confirmation")}
                  secureTextEntry={!showConfirmPassword}
                  status={touched.password_confirmation && errors.password_confirmation ? "error" : undefined}
                  helper={touched.password_confirmation && errors.password_confirmation ? errors.password_confirmation : undefined}
                  LeftAccessory={() => (
                    <IconPack name="lock" size={scale(20)} color={theme.colors.textDim} />
                  )}
                  RightAccessory={() => (
                    <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <IconPack
                        name={!showConfirmPassword ? "eye" : "eye-off"}
                        size={scale(20)}
                        color={theme.colors.textDim}
                      />
                    </Pressable>
                  )}
                />

                {/* Register Button */}
                <Button
                  size="large"
                  rounded="full"
                  onPress={() => handleSubmit()}
                  color="primary"
                  text="Daftar Sekarang"
                  disabled={isLoading}
                />
              </View>
            )}
          </Formik>
          <View style={{ marginVertical: scale(20), marginBottom: scale(40) }}>
            <Text style={{ textAlign: "center" }} size="md">
              Sudah memiliki akun? <Text onPress={()=> navigate('Login')} weight="medium" color="info">Masuk</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  )
}

export default RegisterContainerView
