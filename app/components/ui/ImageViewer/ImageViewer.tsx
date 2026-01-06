/**
 * ImageViewer component
 * An image viewer component with zoom and fullscreen support
 */

import React, { useState } from "react"
import {
  View,
  StyleSheet,
  Pressable,
} from "react-native"
import { Image } from "expo-image"
import { useAppTheme } from "@/theme/context"
import { Icon } from "@/components/Icon"
import { scale, moderateScale } from "@/utils/responsive"

export interface ImageViewerProps {
  /**
   * Image source URI or require
   */
  source: string | { uri: string }
  /**
   * Initial width
   */
  width?: number
  /**
   * Initial height
   */
  height?: number
  /**
   * Border radius
   */
  borderRadius?: number
  /**
   * Style override
   */
  style?: any
  /**
   * Whether to allow fullscreen
   */
  allowFullscreen?: boolean
  /**
   * Resize mode
   */
  resizeMode?: "contain" | "cover" | "stretch" | "center"
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  source,
  width = scale(200),
  height = scale(200),
  borderRadius = moderateScale(8),
  style,
  allowFullscreen = true,
  resizeMode = "cover",
}) => {
  const { theme } = useAppTheme()
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleImagePress = () => {
    if (allowFullscreen) {
      setIsFullscreen(!isFullscreen)
    }
  }

  const imageStyle = {
    width,
    height,
    borderRadius,
    ...(style ?? {}),
  }

  return (
    <>
      <Pressable onPress={handleImagePress} disabled={!allowFullscreen}>
        <Image
          source={typeof source === "string" ? { uri: source } : source}
          style={imageStyle}
          contentFit={resizeMode === "contain" ? "contain" : resizeMode === "cover" ? "cover" : "fill"}
        />
      </Pressable>

      {isFullscreen && (
        <FullscreenViewer
          source={source}
          onClose={() => setIsFullscreen(false)}
          resizeMode={resizeMode}
        />
      )}
    </>
  )
}

interface FullscreenViewerProps {
  source: string | { uri: string }
  onClose: () => void
  resizeMode?: "contain" | "cover" | "stretch" | "center"
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ source, onClose, resizeMode = "contain" }) => {
  const { theme } = useAppTheme()
  const [scaleValue, setScaleValue] = useState(1)

  return (
    <View style={[styles.fullscreenContainer, { backgroundColor: theme.colors.palette.neutral900 }]}>
      <Pressable style={styles.closeButton} onPress={onClose}>
        <Icon icon="x" size={28} color="#FFFFFF" />
      </Pressable>
      <Pressable
        style={styles.imageContainer}
        onPress={() => {
          setScaleValue(scaleValue === 1 ? 2 : 1)
        }}
      >
        <Image
          source={typeof source === "string" ? { uri: source } : source}
          style={[styles.fullscreenImage, { transform: [{ scale: scaleValue }] }]}
          contentFit={resizeMode === "contain" ? "contain" : resizeMode === "cover" ? "cover" : "fill"}
        />
      </Pressable>
      <View style={styles.zoomHint}>
        <Icon icon="view" size={20} color="#FFFFFF" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  fullscreenContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: scale(50),
    right: scale(20),
    zIndex: 10000,
    padding: scale(8),
    borderRadius: moderateScale(20),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  zoomHint: {
    position: "absolute",
    bottom: scale(50),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: moderateScale(20),
  },
})
