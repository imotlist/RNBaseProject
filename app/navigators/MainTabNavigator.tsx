/**
 * MainTabNavigator.tsx
 * Main tab navigation for authenticated users
 */

import React, { useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useAppTheme } from "@/theme/context"
import type { MainTabParamList } from "./navigationTypes"
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context"
import { Platform, View } from "react-native"

// Component showcase screens
import Home from "@/screens/Home"
import PenanamanScreen from "@/screens/Penanaman"
import RiwayatScreen from "@/screens/Riwayat"
import { ButtonsScreen } from "@/screens/Buttons/ButtonsContainer"
import { InputsScreen } from "@/screens/Inputs/InputsContainer"
import { TogglesScreen } from "@/screens/Toggles/TogglesContainer"
import { CardsScreen } from "@/screens/Cards/CardsContainer"
import { ListsScreen } from "@/screens/Lists/ListsList"
import { AvatarsScreen } from "@/screens/Avatars/AvatarsContainer"
import { FiltersScreen } from "@/screens/Filters/FiltersContainer"
import { DataItemsScreen } from "@/screens/DataItems/DataItemsList"
import { ProfileScreen } from "@/screens/Profile/ProfileContainer"
import { setNavigationBar } from "@/services/sytemBars"
import { IconPack } from "@/components/ui"
import InfiniteListExampleScreen from "@/screens/InfiniteListExampleScreen"
import { scale } from "@/utils/responsive"

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
            backgroundColor: 'white',
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
            tabBarIcon: ({ color, focused }) => <IconPack name="home" size={scale(26)} color={color} variant={focused ? "Bold" : "Linear"} />,
          }}
        />
        <Tab.Screen
          name="Penanaman"
          component={PenanamanScreen as any}
          options={{
            tabBarLabel: "Penanaman",
            tabBarIcon: ({ color, focused }) => <IconPack name="scan" size={scale(26)} color={color} variant={focused ? "Bold" : "Linear"} />,
          }}
        />
        <Tab.Screen
          name="Riwayat"
          component={RiwayatScreen as any}
          options={{
            tabBarLabel: "Riwayat",
            tabBarIcon: ({ color, focused }) => <IconPack name="list" size={scale(26)} color={color} variant={focused ? "Bold" : "Linear"} />,
          }}
        />
        {/* <Tab.Screen
          name="Data"
          component={DataItemsScreen as any}
          options={{
            tabBarLabel: "Data",
            tabBarIcon: ({ color, focused }) => <IconPack name="document" size={scale(26)} color={color} variant={focused ? "Bold" : "Linear"} />,
          }}
        />
        <Tab.Screen
          name="List"
          component={ListsScreen as any}
          options={{
            tabBarLabel: "List",
            tabBarIcon: ({ color, focused }) => <IconPack name="list" size={scale(26)} color={color} variant={focused ? "Bold" : "Linear"} />,
          }}
        /> */}
        <Tab.Screen
          name="Profile"
          component={ProfileScreen as any}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, focused }) => <IconPack name="user" size={scale(26)} color={color} variant={focused ? "Bold" : "Linear"} />,
          }}
        />

      </Tab.Navigator>
    </SafeAreaView>
  )
}
