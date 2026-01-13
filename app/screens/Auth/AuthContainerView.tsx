/**
 * AuthContainerView.tsx
 *
 * Presentational component for Auth container screen.
 * Contains only UI rendering logic - no business logic.
 * Includes Formik form with email and password fields.
 *
 * @module screens/Auth
 */

import React, { useEffect, useState } from "react"
import { View, ScrollView, ActivityIndicator, RefreshControl, Pressable } from "react-native"
import { Formik } from "formik"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { scale } from "@/utils/responsive"
import { useAppTheme } from "@/theme/context"
import styles from "./AuthContainer.styles"
import { useIsFocused } from "@react-navigation/native"
import { Image } from "expo-image"
import type { LoginFormValues, AuthContainerViewProps } from "./AuthContainer"
import { Button } from "@/components/Button"
import { Input, IconPack } from "@/components/ui"
import { TextField } from "@/components/TextField"
import { Size } from "iconsax-react-native"
import { goBack, navigate } from "@/navigators/navigationUtilities"

// ============================================================================
// Form Config
// ============================================================================

const INITIAL_VALUES: LoginFormValues = {
  email: "test@tallygreen.com",
  password: "password",
}

const validate = (values: LoginFormValues) => {
  const errors: Partial<Record<keyof LoginFormValues, string>> = {}

  if (!values.email) {
    errors.email = "Email wajib diisi"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Format email tidak valid"
  }

  if (!values.password) {
    errors.password = "Password wajib diisi"
  } else if (values.password.length < 6) {
    errors.password = "Password minimal 6 karakter"
  }

  return errors
}

// ============================================================================
// View Component
// ============================================================================

const AuthContainerView: React.FC<AuthContainerViewProps> = ({
  isLoading = false,
  onLogin,
  errorMessage,
}) => {
  const { theme } = useAppTheme()
  const { layout } = theme
  const statusBarColor = theme.colors.palette.primary200
  const [useColor, setUseColor] = useState(statusBarColor)
  const isFocused = useIsFocused()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isFocused) {
      setUseColor(statusBarColor)
    }
  }, [isFocused, statusBarColor])

  const handleRefresh = async () => {
    // Placeholder refresh - not used in login
    console.log("Refresh triggered")
  }

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
            <Text size="xxl">Login Disini</Text>
            <Text size="md" style={{ textAlign: "center" }}>
              Ketik email dan password untuk masuk dan mulai kelola perawatan tanaman Anda!
            </Text>
            <Image
              source={require("@assets/images/LoginIcon.png")}
              style={{ width: scale(250), height: scale(250), resizeMode: "contain" }}
            />
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
            onSubmit={onLogin}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
              <View style={{ gap: scale(16) }}>
                {/* Email Field */}
                <Text weight="normal">Email</Text>
                <TextField
                  placeholder="email@example.com"
                  rounded="full"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  status={touched.email && errors.email ? "error" : undefined}
                  helper={touched.email && errors.email ? errors.email : undefined}
                  LeftAccessory={() => (
                    <IconPack name="message" size={scale(20)} color={theme.colors.textDim} />
                  )}
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
                      <IconPack name={!showPassword ? "eye" : "eye-off"} size={scale(20)} color={theme.colors.textDim} />
                    </Pressable>
                  )}
                />

                {/* Login Button */}
                <Button
                  size="large"
                  rounded="full"
                  onPress={() => handleSubmit()}
                  color="primary"
                  text="Login Sekarang"
                  disabled={isLoading}
                />
              </View>

            )}
          </Formik>
          <View style={{ marginVertical: scale(20) }}>
            <Text style={{ textAlign: "center" }} size="md">Belum memiliki akun? <Text onPress={()=> navigate('Register')} weight="medium" color="info">Daftar</Text></Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  )
}

export default AuthContainerView
