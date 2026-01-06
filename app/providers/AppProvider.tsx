/**
 * AppProvider.tsx
 * Central provider setup for the application.
 * Wraps all context providers in a single component.
 */

import React from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { KeyboardProvider } from "react-native-keyboard-controller"
import * as eva from "@eva-design/eva"
// @ts-ignore
import { EvaIconsPack } from "@ui-kitten/eva-icons"

import { ThemeProvider } from "../theme/context"
import { AuthProvider } from "../context/AuthContext"
import { ConnectionProvider } from "../context/ConnectionContext"
import { PermissionProvider } from "../context/PermissionContext"
import FlashMessage from "./FlashMessageProvider"
import { BottomSheetProvider } from "./BottomSheetProvider"
import { PopupMessageProvider } from "./PopupMessageProvider"

export interface AppProviderProps {
  children: React.ReactNode
}

/**
 * Custom theme mapping for UI Kitten
 */
export const customTheme = {
  ...eva.light,
  "color-primary-100": "#F4E0D9",
  "color-primary-200": "#E8C1B4",
  "color-primary-300": "#DDA28E",
  "color-primary-400": "#D28468",
  "color-primary-500": "#C76542",
  "color-primary-600": "#A54F31",
  "color-primary-700": "#8C3F27",
  "color-primary-800": "#732F1D",
  "color-primary-900": "#5A1F13",
  "color-secondary-100": "#DCDDE9",
  "color-secondary-200": "#BCC0D6",
  "color-secondary-300": "#9196B9",
  "color-secondary-400": "#626894",
  "color-secondary-500": "#41476E",
  "color-success-100": "#D4EED4",
  "color-success-500": "#50C750",
  "color-warning-100": "#FFEED4",
  "color-warning-500": "#FFBB50",
  "color-danger-100": "#F2D6CD",
  "color-danger-500": "#C03403",
  "color-basic-100": "#FFFFFF",
  "color-basic-200": "#F4F2F1",
  "color-basic-300": "#D7CEC9",
  "color-basic-400": "#B6ACA6",
  "color-basic-500": "#978F8A",
  "color-basic-600": "#564E4A",
  "color-basic-700": "#3C3836",
  "color-basic-800": "#191015",
  "color-basic-900": "#000000",
  "text-font-family": "spaceGroteskNormal",
  "heading-font-family": "spaceGroteskSemiBold",
}

export const customDarkTheme = {
  ...eva.dark,
  "color-primary-100": "#F4E0D9",
  "color-primary-200": "#E8C1B4",
  "color-primary-300": "#DDA28E",
  "color-primary-400": "#D28468",
  "color-primary-500": "#C76542",
  "color-primary-600": "#A54F31",
  "color-primary-700": "#8C3F27",
  "color-primary-800": "#732F1D",
  "color-primary-900": "#5A1F13",
  "color-secondary-100": "#DCDDE9",
  "color-secondary-200": "#BCC0D6",
  "color-secondary-300": "#9196B9",
  "color-secondary-400": "#626894",
  "color-secondary-500": "#41476E",
  "color-success-100": "#D4EED4",
  "color-success-500": "#50C750",
  "color-warning-100": "#FFEED4",
  "color-warning-500": "#FFBB50",
  "color-danger-100": "#F2D6CD",
  "color-danger-500": "#C03403",
  "text-font-family": "spaceGroteskNormal",
  "heading-font-family": "spaceGroteskSemiBold",
}

/**
 * Root App Provider Component
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <AuthProvider>
            <ConnectionProvider>
              <PermissionProvider>
                <ThemeProvider>
                  <BottomSheetProvider>
                    <PopupMessageProvider>
                      {children}
                      <FlashMessage />
                    </PopupMessageProvider>
                  </BottomSheetProvider>
                </ThemeProvider>
              </PermissionProvider>
            </ConnectionProvider>
          </AuthProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default AppProvider
