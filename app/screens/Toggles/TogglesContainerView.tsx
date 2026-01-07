/**
 * TogglesContainerView.tsx
 *
 * Presentational component for Toggles container screen.
 * Demonstrates all Toggle component variations (Switch, Checkbox).
 *
 * @module screens/Toggles
 */

import React, { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Switch } from "@/components/Toggle/Switch"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { TitleBar } from "@/components/ui"
import { useAppTheme } from "@/theme/context"
import { goBack } from "@/navigators/navigationUtilities"
import { useIsFocused, useNavigation } from "@react-navigation/native"

// ============================================================================
// Types
// ============================================================================

export interface TogglesData {
  id: string
  title: string
  value: string | number
  [key: string]: any
}

export interface TogglesContainerViewProps {
  selectedData: TogglesData | null
  onSelectData: (data: TogglesData) => void
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
// Toggle Item Component
// ============================================================================

interface ToggleItemProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  error?: boolean
}

const ToggleItem: React.FC<ToggleItemProps> = ({ label, value, onChange, disabled, error }) => {
  return (
    <View style={styles.toggleItem}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        status={error ? "error" : undefined}
      />
    </View>
  )
}

// ============================================================================
// View Component
// ============================================================================

const TogglesContainerView: React.FC<TogglesContainerViewProps> = () => {
  const { theme } = useAppTheme()

  // Switch states
  const [switch1, setSwitch1] = useState(false)
  const [switch2, setSwitch2] = useState(true)
  const [switch3, setSwitch3] = useState(false)
  const [switch4, setSwitch4] = useState(true)
  const [switchDisabled, setSwitchDisabled] = useState(false)
  const [switchError, setSwitchError] = useState(true)

  // Checkbox states
  const [checkbox1, setCheckbox1] = useState(false)
  const [checkbox2, setCheckbox2] = useState(true)
  const [checkbox3, setCheckbox3] = useState(false)
  const [checkbox4, setCheckbox4] = useState(true)
  const [checkboxDisabled, setCheckboxDisabled] = useState(false)
  const [checkboxError, setCheckboxError] = useState(true)

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
      <TitleBar title="Toggle" showBack={true} onBackPress={goBack} backgroundColor={useColor} />

      <ScrollView style={styles.container}>
        {/* Switch Basic */}
        <Section title="Switch Basic">
          <ToggleItem label="Switch Off" value={switch1} onChange={setSwitch1} />
          <ToggleItem label="Switch On" value={switch2} onChange={setSwitch2} />
        </Section>

        {/* Switch Status */}
        <Section title="Switch Status">
          <ToggleItem label="Disabled" value={switchDisabled} onChange={setSwitchDisabled} disabled />
          <ToggleItem label="Error State" value={switchError} onChange={setSwitchError} error />
        </Section>

        {/* Switch with Label Position */}
        <Section title="Switch with Label Position">
          <View style={styles.toggleItem}>
            <Switch
              label="Left Label"
              labelPosition="left"
              value={switch3}
              onValueChange={setSwitch3}
            />
          </View>
          <View style={styles.toggleItem}>
            <Switch
              label="Right Label"
              labelPosition="right"
              value={switch4}
              onValueChange={setSwitch4}
            />
          </View>
        </Section>

        {/* Switch with Helper */}
        <Section title="Switch with Helper">
          <View style={styles.toggleWithHelper}>
            <Switch
              label="Enable notifications"
              value={true}
              helper="Receive push notifications for updates"
              containerStyle={styles.toggleFullWidth}
            />
          </View>
          <View style={styles.toggleWithHelper}>
            <Switch
              label="Dark mode"
              value={false}
              helper="Use dark theme across the app"
              containerStyle={styles.toggleFullWidth}
            />
          </View>
        </Section>

        {/* Checkbox Basic */}
        <Section title="Checkbox Basic">
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Unchecked</Text>
            <Checkbox value={checkbox1} onValueChange={setCheckbox1} />
          </View>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Checked</Text>
            <Checkbox value={checkbox2} onValueChange={setCheckbox2} />
          </View>
        </Section>

        {/* Checkbox Status */}
        <Section title="Checkbox Status">
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Disabled</Text>
            <Checkbox value={checkboxDisabled} onValueChange={setCheckboxDisabled} disabled />
          </View>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Error State</Text>
            <Checkbox value={checkboxError} onValueChange={setCheckboxError} status="error" />
          </View>
        </Section>

        {/* Checkbox with Label */}
        <Section title="Checkbox with Label">
          <View style={styles.toggleWithHelper}>
            <Checkbox
              label="I agree to the terms and conditions"
              value={checkbox3}
              onValueChange={setCheckbox3}
              containerStyle={styles.toggleFullWidth}
            />
          </View>
          <View style={styles.toggleWithHelper}>
            <Checkbox
              label="Subscribe to newsletter"
              value={checkbox4}
              onValueChange={setCheckbox4}
              helper="Get weekly updates delivered to your inbox"
              containerStyle={styles.toggleFullWidth}
            />
          </View>
        </Section>

        {/* Checkbox with Different Icons */}
        <Section title="Checkbox with Icons">
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Check Icon</Text>
            <Checkbox value={true} icon="check" />
          </View>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Heart Icon</Text>
            <Checkbox value={true} icon="heart" />
          </View>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Settings Icon</Text>
            <Checkbox value={true} icon="settings" />
          </View>
        </Section>
      </ScrollView>
    </Screen>
  )
}

export default TogglesContainerView

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
  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  toggleLabel: {
    fontSize: 16,
  },
  toggleWithHelper: {
    marginBottom: 16,
  },
  toggleFullWidth: {
    width: "100%",
  },
})
