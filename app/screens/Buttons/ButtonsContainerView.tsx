/**
 * ButtonsContainerView.tsx
 *
 * Presentational component for Buttons container screen.
 * Demonstrates all Button component variations.
 *
 * @module screens/Buttons
 */

import React, { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { TitleBar } from "@/components/ui"
import { useAppTheme } from "@/theme/context"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { goBack } from "@/navigators/navigationUtilities"

// ============================================================================
// Types
// ============================================================================

export interface ButtonsData {
  id: string
  title: string
  value: string | number
  [key: string]: any
}

export interface ButtonsContainerViewProps {
  selectedData: ButtonsData | null
  onSelectData: (data: ButtonsData) => void
  onActionPress: () => void
  onRefresh: () => Promise<void>
  isLoading?: boolean
}

// ============================================================================
// Section Component
// ============================================================================

interface SectionProps {
  title: string
  children: React.ReactNode
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  const { theme } = useAppTheme()
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textDim }]}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  )
}

// ============================================================================
// View Component
// ============================================================================

const ButtonsContainerView: React.FC<ButtonsContainerViewProps> = () => {
  const { theme } = useAppTheme()
  const navigation = useNavigation()
  const statusBarColor = 'white'
  const [useColor, setUseColor] = useState(statusBarColor)
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      setUseColor(statusBarColor)
    }
  }, [isFocused, statusBarColor])
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]}>
      <TitleBar title="Buttons" showBack={true} onBackPress={goBack} backgroundColor={useColor}/>

      <ScrollView style={styles.container}>
        {/* Button Sizes */}
        <Section title="Sizes">
          <View style={styles.row}>
            <Button text="Small" size="small" style={styles.buttonFlex} />
            <Button text="Medium" size="medium" style={styles.buttonFlex} />
            <Button text="Large" size="large" style={styles.buttonFlex} />
          </View>
        </Section>

        {/* Button Presets */}
        <Section title="Presets">
          <View style={styles.row}>
            <Button text="Default" preset="default" style={styles.buttonFlex} />
            <Button text="Filled" preset="filled" style={styles.buttonFlex} />
            <Button text="Reversed" preset="reversed" style={styles.buttonFlex} />
          </View>
        </Section>

        {/* Button Colors */}
        <Section title="Colors">
          <View style={styles.row}>
            <Button text="Primary" color="primary" style={styles.buttonFlex} />
            <Button text="Success" color="success" style={styles.buttonFlex} />
          </View>
          <View style={styles.row}>
            <Button text="Warning" color="warning" style={styles.buttonFlex} />
            <Button text="Danger" color="danger" style={styles.buttonFlex} />
          </View>
          <View style={styles.row}>
            <Button text="Info" color="info" style={styles.buttonFlex} />
          </View>
        </Section>

        {/* Outline Variants */}
        <Section title="Outline">
          <View style={styles.row}>
            <Button text="Default" outline style={styles.buttonFlex} />
            <Button text="Filled" preset="filled" outline style={styles.buttonFlex} />
            <Button text="Reversed" preset="reversed" outline style={styles.buttonFlex} />
          </View>
          <View style={styles.row}>
            <Button text="Primary" color="primary" outline style={styles.buttonFlex} />
            <Button text="Success" color="success" outline style={styles.buttonFlex} />
            <Button text="Danger" color="danger" outline style={styles.buttonFlex} />
          </View>
        </Section>

        {/* Rounded Variants */}
        <Section title="Rounded">
          <View style={styles.row}>
            <Button text="None" rounded="none" style={styles.buttonFlex} />
            <Button text="SM" rounded="sm" style={styles.buttonFlex} />
            <Button text="MD" rounded="md" style={styles.buttonFlex} />
          </View>
          <View style={styles.row}>
            <Button text="LG" rounded="lg" style={styles.buttonFlex} />
            <Button text="Full" rounded="full" style={styles.buttonFlex} />
          </View>
        </Section>

        {/* Icon Buttons */}
        <Section title="With Icons">
          <View style={styles.row}>
            <Button
              text="Check"
              icon="check"
              size="small"
              rounded="full"
              color="primary"
              style={styles.buttonFlex}
            />
            <Button
              text="Heart"
              icon="heart"
              size="medium"
              rounded="circle"
              color="danger"
            />
            <Button
              text="Trash"
              icon="trash"
              size="small"
              rounded="full"
              color="warning"
              style={styles.buttonFlex}
            />
          </View>
        </Section>

        {/* Circle Icon Buttons */}
        <Section title="Circle Icons">
          <View style={[styles.row, styles.centerRow]}>
            <Button icon="add" size="small" rounded="circle" color="primary" />
            <Button icon="heart" size="medium" rounded="circle" color="danger" />
            <Button icon="check" size="large" rounded="circle" color="success" />
          </View>
        </Section>
      </ScrollView>
    </Screen>
  )
}

export default ButtonsContainerView

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    marginHorizontal: 16,
    textTransform: "uppercase",
  },
  sectionContent: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  centerRow: {
    justifyContent: "center",
  },
  buttonFlex: {
    flex: 1,
  },
})
