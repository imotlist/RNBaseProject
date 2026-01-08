/**
 * AuthNavigator.tsx
 * Authentication flow navigator
 */

import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAppTheme } from "@/theme/context"
import type { AuthStackParamList } from "./navigationTypes"

// Auth screens
import { LoginScreen } from "@/screens/LoginScreen"
import AuthContainer from "@/screens/Auth"
import { IntroScreen } from "@/screens/IntroScreen"
import { RegisterContainer } from "@/screens/Register"

const Stack = createNativeStackNavigator<AuthStackParamList>()

export const AuthNavigator = () => {
  const { theme } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: theme.colors.background,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
      initialRouteName="Intro"
    >
      {/* Intro/Onboarding screen - shown on first launch */}
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="Login" component={AuthContainer} />
      <Stack.Screen name="Register" component={RegisterContainer} />
    </Stack.Navigator>
  )
}
