/**
 * PopupMessageProvider.tsx
 * Provides popup/alert dialog functionality
 */

import React, { createContext, useContext, useRef, ReactNode } from "react"
import { Modal, View, StyleSheet, Pressable, Text } from "react-native"

export interface PopupMessageParams {
  title?: string
  message: string
  buttons?: PopupButton[]
  type?: "info" | "success" | "warning" | "error"
}

export interface PopupButton {
  text: string
  onPress?: () => void
  style?: "default" | "cancel" | "destructive"
}

interface PopupMessageContextValue {
  showPopup: (params: PopupMessageParams) => void
}

const PopupMessageContext = createContext<PopupMessageContextValue | undefined>(undefined)

interface PopupMessageProviderProps {
  children: ReactNode
}

export const PopupMessageProvider: React.FC<PopupMessageProviderProps> = ({ children }) => {
  const [visible, setVisible] = React.useState(false)
  const paramsRef = useRef<PopupMessageParams>({
    message: "",
    buttons: [{ text: "OK" }],
  })

  const showPopup = (params: PopupMessageParams) => {
    paramsRef.current = {
      ...params,
      buttons: params.buttons || [{ text: "OK" }],
    }
    setVisible(true)
  }

  const hidePopup = () => {
    setVisible(false)
  }

  const handleButtonPress = (button: PopupButton) => {
    hidePopup()
    button.onPress?.()
  }

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "success":
        return "#50C750"
      case "warning":
        return "#FFBB50"
      case "error":
        return "#C03403"
      default:
        return "#41476E"
    }
  }

  const params = paramsRef.current

  return (
    <PopupMessageContext.Provider value={{ showPopup }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={hidePopup}
      >
        <Pressable style={styles.overlay} onPress={hidePopup}>
          <Pressable style={styles.container}>
            {params.title && (
              <Text style={[styles.title, { color: getTypeColor(params.type) }]}>
                {params.title}
              </Text>
            )}
            <Text style={styles.message}>{params.message}</Text>
            <View style={styles.buttonContainer}>
              {params.buttons?.map((button, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.button,
                    button.style === "destructive" && styles.buttonDestructive,
                  ]}
                  onPress={() => handleButtonPress(button)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      button.style === "destructive" && styles.buttonTextDestructive,
                    ]}
                  >
                    {button.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </PopupMessageContext.Provider>
  )
}

export const usePopupMessage = () => {
  const context = useContext(PopupMessageContext)
  if (!context) {
    throw new Error("usePopupMessage must be used within PopupMessageProvider")
  }
  return context
}

export const usePopupMessageContext = () => {
  const context = useContext(PopupMessageContext)
  if (!context) {
    throw new Error("usePopupMessageContext must be used within PopupMessageProvider")
  }
  return context
}

// Utility functions for common popup patterns
export const showConfirm = (
  options: { title: string; message: string; onConfirm: () => void; onCancel?: () => void },
  showPopup: (params: PopupMessageParams) => void,
) => {
  showPopup({
    title: options.title,
    message: options.message,
    type: "info",
    buttons: [
      { text: "Cancel", style: "cancel", onPress: options.onCancel },
      { text: "Confirm", onPress: options.onConfirm },
    ],
  })
}

export const showAlert = (
  options: { title: string; message: string; onConfirm?: () => void },
  showPopup: (params: PopupMessageParams) => void,
) => {
  showPopup({
    title: options.title,
    message: options.message,
    type: "warning",
    buttons: [{ text: "OK", onPress: options.onConfirm }],
  })
}

export const showInfo = (
  options: { title: string; message: string; onConfirm?: () => void },
  showPopup: (params: PopupMessageParams) => void,
) => {
  showPopup({
    title: options.title,
    message: options.message,
    type: "info",
    buttons: [{ text: "OK", onPress: options.onConfirm }],
  })
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    minWidth: 280,
    maxWidth: 320,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#3C3836",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F4F2F1",
    minWidth: 70,
    alignItems: "center",
  },
  buttonDestructive: {
    backgroundColor: "#F2D6CD",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3C3836",
  },
  buttonTextDestructive: {
    color: "#C03403",
  },
})
