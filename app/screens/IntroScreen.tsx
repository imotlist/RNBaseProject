/**
 * IntroScreen.tsx
 *
 * Intro/Onboarding screen shown on first launch before login.
 * Features forest background image with welcome message and CTA button.
 *
 * @module screens/IntroScreen
 */

import React, { useCallback, useEffect, useState, useRef } from "react"
import { View, StyleSheet, ImageBackground, Dimensions, StatusBar, PanResponder, Animated } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { storage } from "@/utils/storage"
import type { AuthStackParamList } from "@/navigators/navigationTypes"
import { IconPack } from "@/components/ui"
import { scale } from "@/utils/responsive"

const { width, height } = Dimensions.get("window")
const INTRO_SHOWN_KEY = "intro_has_been_shown"
const SLIDER_WIDTH = width * 0.8
const THUMB_SIZE = scale(48)

interface IntroScreenProps extends NativeStackScreenProps<AuthStackParamList, "Intro"> {}

export const IntroScreen: React.FC<IntroScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme()
  const [isCompleted, setIsCompleted] = useState(false)
  const translateX = useRef(new Animated.Value(0)).current

  // Check if intro has been shown before
  useEffect(() => {
    const hasSeenIntro = storage.getBoolean(INTRO_SHOWN_KEY) ?? false
    if (hasSeenIntro) {
      // Skip intro and go directly to login
      navigation.replace("Login", {})
    }
  }, [navigation])

  const handleGetStarted = useCallback(() => {
    // Mark intro as shown
    storage.set(INTRO_SHOWN_KEY, true)
    // Navigate to login
    navigation.replace("Login", {})
  }, [navigation])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (isCompleted) return
        const newX = Math.max(0, Math.min(gestureState.dx, SLIDER_WIDTH - THUMB_SIZE))
        translateX.setValue(newX)
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isCompleted) return
        const threshold = SLIDER_WIDTH - THUMB_SIZE - 20
        if (gestureState.dx >= threshold) {
          // Slided far enough - complete the action
          setIsCompleted(true)
          Animated.spring(translateX, {
            toValue: SLIDER_WIDTH - THUMB_SIZE,
            useNativeDriver: true,
          }).start()
          // Trigger action after animation
          setTimeout(handleGetStarted, 300)
        } else {
          // Not far enough - snap back
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
      onPanResponderTerminate: () => {
        if (isCompleted) return
        // Snap back if gesture is interrupted
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start()
      },
    }),
  ).current

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background Image */}
      <ImageBackground
        source={require("@assets/images/IntroImage.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark overlay for better text readability */}
        <View style={styles.overlay} />

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Welcome Text */}
          <Text style={styles.greetingText}>Halo, Selamat Datang Di</Text>
          <Text style={styles.titleText}>Apps Tally Green!</Text>

          {/* Description */}
          <Text style={styles.descriptionText}>
            Kelola tanammu dengan lebih mudah. Pantau kondisi, perawatan, dan progres
            setiap lahan secara dalam satu aplikasi yang simpel dan efisien.
          </Text>
        </View>

        {/* Bottom Button Section */}
        <View style={styles.bottomSection}>
          {/* Slide to Login Button */}
          <View style={styles.sliderTrack}>
            <Animated.Text
              style={[
                styles.sliderText,
                {
                  opacity: translateX.interpolate({
                    inputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
                    outputRange: [1, 0],
                  }),
                },
              ]}
            >
              Geser & Login Sekarang
            </Animated.Text>
            <Animated.View
              style={[
                styles.sliderThumb,
                {
                  transform: [{ translateX }],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <IconPack name="arrow-right" color="white" />
            </Animated.View>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    width: width,
    height: height,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    // marginTop: -60, // Offset to move content up slightly
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowRadius: 4,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 24,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowRadius: 4,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "400",
    color: "#FFFFFF",
    textAlign: "center",
    paddingHorizontal: 20,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowRadius: 4,
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: scale(30),
    paddingTop: 20,
    alignItems: "center",
  },
  sliderTrack: {
    width: SLIDER_WIDTH,
    height: scale(56),
    backgroundColor: "#FFFFFF",
    borderRadius: scale(28),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  sliderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    position: "absolute",
  },
  sliderThumb: {
    position: "absolute",
    left: scale(4),
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#acc32b",
    justifyContent: "center",
    alignItems: "center",
  },
})
