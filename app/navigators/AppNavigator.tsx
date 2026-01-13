/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Config from "@/config"
import { useAuth } from "@/context/AuthContext"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { useAppTheme } from "@/theme/context"

import { AuthNavigator } from "./AuthNavigator"
import { MainTabNavigator } from "./MainTabNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import type { AppStackParamList, NavigationProps } from "./navigationTypes"

// Component showcase screens
import { ButtonsScreen } from "@/screens/Buttons/ButtonsContainer"
import { InputsScreen } from "@/screens/Inputs/InputsContainer"
import { TogglesScreen } from "@/screens/Toggles/TogglesContainer"
import { CardsScreen } from "@/screens/Cards/CardsContainer"
import { ListsScreen } from "@/screens/Lists/ListsList"
import { AvatarsScreen } from "@/screens/Avatars/AvatarsContainer"
import { FiltersScreen } from "@/screens/Filters/FiltersContainer"
import { DataItemsScreen } from "@/screens/DataItems/DataItemsList"
import { ProfileScreen } from "@/screens/Profile/ProfileContainer"
import RiwayatDetailScreen from "@/screens/RiwayatDetail"
import RiwayatTanamanScreen from "@/screens/RiwayatTanaman"
import ProfileEditScreen from "@/screens/ProfileEdit"

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const { isAuthenticated } = useAuth()

  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={isAuthenticated ? "Main" : "Auth"}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="Developer" component={DeveloperPlaceholderScreen} />
          {/* Feature screens */}
          <Stack.Screen
            name="RiwayatDetail"
            component={RiwayatDetailScreen as any}
            options={{
              headerShown: false,
              presentation: "card",
            }}
          />
          <Stack.Screen
            name="RiwayatTanaman"
            component={RiwayatTanamanScreen as any}
            options={{
              headerShown: false,
              presentation: "card",
            }}
          />
          <Stack.Screen
            name="ProfileEdit"
            component={ProfileEditScreen as any}
            options={{
              headerShown: false,
              presentation: "card",
            }}
          />
          {/* Component showcase screens */}
          <Stack.Screen name="ButtonsScreen" component={ButtonsScreen} />
          <Stack.Screen name="InputsScreen" component={InputsScreen} />
          <Stack.Screen name="TogglesScreen" component={TogglesScreen} />
          <Stack.Screen name="CardsScreen" component={CardsScreen} />
          <Stack.Screen name="ListsScreen" component={ListsScreen} />
          <Stack.Screen name="AvatarsScreen" component={AvatarsScreen} />
          <Stack.Screen name="FiltersScreen" component={FiltersScreen} />
          <Stack.Screen name="DataItemsScreen" component={DataItemsScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </>
      )}

      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
}

// Placeholder Developer Screen
const DeveloperPlaceholderScreen = () => {
  return null
}

export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AppStack />
      </ErrorBoundary>
    </NavigationContainer>
  )
}
