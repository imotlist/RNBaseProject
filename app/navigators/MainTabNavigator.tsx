/**
 * MainTabNavigator.tsx
 * Main tab navigation for authenticated users
 */

import React, { useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useAppTheme } from "@/theme/context"
import { Icon } from "@/components/Icon"
import type { MainTabParamList } from "./navigationTypes"
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context"
import { Platform, View } from "react-native"

// Placeholder screens - will be replaced with actual implementations
import { WelcomeScreen } from "@/screens/WelcomeScreen"
import { DemoCommunityScreen } from "@/screens/DemoCommunityScreen"
import { DemoDebugScreen } from "@/screens/DemoDebugScreen"
import { ComponentScreen } from "@/screens/ComponentScreen"
import { setNavigationBar } from "@/services/sytemBars"
import Home from "@/screens/Home"
import { IconPack } from "@/components/ui"
import InfiniteListExampleScreen from "@/screens/InfiniteListExampleScreen"

const Tab = createBottomTabNavigator<MainTabParamList>()

export const MainTabNavigator = () => {
  const { theme } = useAppTheme()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    // Any side effects related to navigation bar can be handled here
    setNavigationBar("#000000", false)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={["bottom"]}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.tint,
          tabBarInactiveTintColor: theme.colors.textDim,
          tabBarStyle: {
            backgroundColor: theme.colors.palette.neutral100,
            borderTopColor: theme.colors.separator,
            borderTopWidth: .5,
            paddingBottom: insets.bottom,
            paddingTop: 8,
            paddingHorizontal: 8,
            height: Platform.OS === "android" ? 30 + insets.bottom : 50 + insets.bottom,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home as any}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => <IconPack name="home" size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="Data"
          component={DemoCommunityScreen as any}
          options={{
            tabBarLabel: "Data",
            tabBarIcon: ({ color }) => <Icon icon="components" size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={DemoDebugScreen as any}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color }) => <Icon icon="ladybug" size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="Components"
          component={ComponentScreen as any}
          options={{
            tabBarLabel: "Components",
            tabBarIcon: ({ color }) => <Icon icon="components" size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="List"
          component={InfiniteListExampleScreen as any}
          options={{
            tabBarLabel: "List",
            tabBarIcon: ({ color }) => <IconPack name="document" size={24} color={color} />,
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  )
}
