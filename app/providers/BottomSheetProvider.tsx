/**
 * BottomSheetProvider.tsx
 * Provides bottom sheet functionality to the app
 */

import React, { createContext, useContext, useRef, useState, ReactNode, useCallback } from "react"
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { StyleSheet, View } from "react-native"

export interface BottomSheetParams {
  title?: string
  snapPoints?: string[]
  renderContent: () => ReactNode
  backdropCloses?: boolean
}

interface BottomSheetContextValue {
  showBottomSheet: (params: BottomSheetParams) => void
  closeBottomSheet: () => void
}

const BottomSheetContext = createContext<BottomSheetContextValue | undefined>(undefined)

interface BottomSheetProviderProps {
  children: ReactNode
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({ children }) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [content, setContent] = useState<ReactNode>(null)
  const [snapPoints, setSnapPoints] = useState<string[]>(["50%"])

  const showBottomSheet = useCallback((params: BottomSheetParams) => {
    setContent(params.renderContent())
    if (params.snapPoints) {
      setSnapPoints(params.snapPoints)
    }
    setTimeout(() => {
      bottomSheetRef.current?.expand()
    }, 50)
  }, [])

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close()
  }, [])

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setTimeout(() => {
        setContent(null)
      }, 300)
    }
  }, [])

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  )

  return (
    <BottomSheetContext.Provider value={{ showBottomSheet, closeBottomSheet }}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.indicator}
        enablePanDownToClose={true}
      >
        <BottomSheetView style={styles.contentContainer}>
          {content && <View style={styles.contentInner} key="bottom-sheet-content">{content}</View>}
        </BottomSheetView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  )
}

export const useBottomSheetContext = () => {
  const context = useContext(BottomSheetContext)
  if (!context) {
    throw new Error("useBottomSheetContext must be used within BottomSheetProvider")
  }
  return context
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  indicator: {
    backgroundColor: "#999",
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    height: "100%",
  },
  contentInner: {
    flex: 1,
  },
})
