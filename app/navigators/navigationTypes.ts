import { ComponentProps } from "react"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import {
  CompositeScreenProps,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

// Auth Navigator types
export type AuthStackParamList = {
  Intro: undefined
  Login: { message?: string }
  Register: undefined
  ForgotPassword: undefined
}

// Tab Navigator types
export type MainTabParamList = {
  Home: undefined
  Data: { tab?: string }
  Profile: undefined
  Components: undefined
  List: undefined
}

// Demo Tab Navigator types (kept for legacy screens)
export type DemoTabParamList = {
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoDebug: undefined
  DemoPodcastList: undefined
}

// App Stack Navigator types
export type AppStackParamList = {
  // Auth flows
  Auth: NavigatorScreenParams<AuthStackParamList>
  // Main app with tabs
  Main: NavigatorScreenParams<MainTabParamList>
  // Standalone screens
  Developer: undefined
  // Component showcase screens
  ButtonsScreen: undefined
  InputsScreen: undefined
  TogglesScreen: undefined
  CardsScreen: undefined
  ListsScreen: undefined
  AvatarsScreen: undefined
  FiltersScreen: undefined
  DataItemsScreen: undefined
  ProfileScreen: undefined
  // Demo screens (kept for reference)
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoDebug: undefined
  DemoPodcastList: undefined
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer<AppStackParamList>>> {}
