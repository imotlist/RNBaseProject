/**
 * FlashMessageProvider.tsx
 * Flash message component for toast notifications
 */

import React from "react"
import { StyleSheet } from "react-native"
import FlashMessageLib from "react-native-flash-message"

const FlashMessage: React.FC = () => {
  return (
    <FlashMessageLib
      position="top"
      floating
      duration={3000}
      hideStatusBar={false}
      statusBarHeight={0}
      style={styles.flashMessage}
      titleStyle={styles.title}
      textStyle={styles.message}
    />
  )
}

const styles = StyleSheet.create({
  flashMessage: {
    marginTop: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  message: {
    fontSize: 14,
  },
})

export default FlashMessage
