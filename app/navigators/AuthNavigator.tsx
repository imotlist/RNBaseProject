/**
 * AuthNavigator.tsx
 * Authentication flow navigator
 */

import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAppTheme } from "@/theme/context"
import type { AuthStackParamList } from "./navigationTypes"

// Placeholder screens - will be replaced with actual implementations
import { LoginScreen } from "@/screens/LoginScreen"

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
      initialRouteName="Login"
    >
      {/* Using LoginScreen as placeholder for all auth screens */}
      <Stack.Screen
        name="Intro"
        component={LoginScreen}
        // @ts-ignore - placeholder
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Register"
        component={LoginScreen}
        // @ts-ignore - placeholder
      />
      <Stack.Screen
        name="ForgotPassword"
        component={LoginScreen}
        // @ts-ignore - placeholder
      />
    </Stack.Navigator>
  )
}
