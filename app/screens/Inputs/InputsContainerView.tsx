/**
 * InputsContainerView.tsx
 *
 * Presentational component for Inputs container screen.
 * Demonstrates all TextField and Input component variations.
 *
 * @module screens/Inputs
 */

import React, { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { TitleBar } from "@/components/ui"
import { useAppTheme } from "@/theme/context"
import { goBack } from "@/navigators/navigationUtilities"
import { useIsFocused, useNavigation } from "@react-navigation/native"

// ============================================================================
// Types
// ============================================================================

export interface InputsData {
  id: string
  title: string
  value: string | number
  [key: string]: any
}

export interface InputsContainerViewProps {
  selectedData: InputsData | null
  onSelectData: (data: InputsData) => void
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

const InputsContainerView: React.FC<InputsContainerViewProps> = () => {
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
      <TitleBar title="Inputs" showBack={true} onBackPress={goBack} backgroundColor={useColor} />


      <ScrollView style={styles.container}>
        {/* TextField Sizes */}
        <Section title="Sizes">
          <TextField size="small" placeholder="Small input" containerStyle={styles.input} />
          <TextField size="medium" placeholder="Medium input" containerStyle={styles.input} />
          <TextField size="large" placeholder="Large input" containerStyle={styles.input} />
        </Section>

        {/* TextField with Label */}
        <Section title="With Label">
          <TextField label="Username" placeholder="Enter your username" containerStyle={styles.input} />
          <TextField label="Email" placeholder="Enter your email" containerStyle={styles.input} />
          <TextField label="Password" placeholder="Enter your password" secureTextEntry containerStyle={styles.input} />
        </Section>

        {/* TextField with Helper */}
        <Section title="With Helper Text">
          <TextField
            label="Email"
            placeholder="Enter your email"
            helper="We'll never share your email with anyone else."
            containerStyle={styles.input}
          />
          <TextField
            label="Password"
            placeholder="Enter your password"
            helper="Must be at least 8 characters long."
            secureTextEntry
            containerStyle={styles.input}
          />
        </Section>

        {/* TextField Rounded Variants */}
        <Section title="Rounded">
          <TextField rounded="none" placeholder="No radius" containerStyle={styles.input} />
          <TextField rounded="sm" placeholder="Small radius" containerStyle={styles.input} />
          <TextField rounded="md" placeholder="Medium radius" containerStyle={styles.input} />
          <TextField rounded="lg" placeholder="Large radius" containerStyle={styles.input} />
          <TextField rounded="full" placeholder="Full radius" containerStyle={styles.input} />
        </Section>

        {/* TextField Status */}
        <Section title="Status">
          <TextField placeholder="Normal input" containerStyle={styles.input} />
          <TextField
            placeholder="Disabled input"
            editable={false}
            containerStyle={styles.input}
          />
          <TextField
            label="Error state"
            placeholder="Input with error"
            status="error"
            helper="This field has an error"
            containerStyle={styles.input}
          />
        </Section>

        {/* Multiline/Textarea */}
        <Section title="Multiline">
          <TextField
            label="Message"
            placeholder="Enter your message"
            multiline
            numberOfLines={4}
            containerStyle={styles.input}
          />
        </Section>

        {/* With Icons */}
        <Section title="With Left Accessory">
          <TextField
            placeholder="Search..."
            LeftAccessory={() => (
              <Text style={{ color: theme.colors.textDim }}>🔍</Text>
            )}
            containerStyle={styles.input}
          />
          <TextField
            placeholder="Username"
            LeftAccessory={() => (
              <Text style={{ color: theme.colors.textDim }}>👤</Text>
            )}
            containerStyle={styles.input}
          />
          <TextField
            placeholder="Email"
            LeftAccessory={() => (
              <Text style={{ color: theme.colors.textDim }}>📧</Text>
            )}
            containerStyle={styles.input}
          />
        </Section>

        {/* With Right Accessory */}
        <Section title="With Right Accessory">
          <TextField
            placeholder="Amount"
            RightAccessory={() => (
              <Text style={{ color: theme.colors.tint, fontWeight: "600" }}>USD</Text>
            )}
            containerStyle={styles.input}
          />
          <TextField
            placeholder="Website"
            RightAccessory={() => (
              <Text style={{ color: theme.colors.textDim }}>🌐</Text>
            )}
            containerStyle={styles.input}
          />
        </Section>
      </ScrollView>
    </Screen>
  )
}

export default InputsContainerView

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
  input: {
    marginBottom: 12,
  },
})
