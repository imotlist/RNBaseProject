/**
 * ComponentScreen.tsx
 * Showcase screen for all reusable UI components
 */

import React, { use, useEffect, useState } from "react"
import { View, ScrollView, StyleSheet, Pressable } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { Switch } from "@/components/Toggle/Switch"
import { Radio } from "@/components/Toggle/Radio"
import { TextField } from "@/components/TextField"
import { Input } from "@/components/ui/Input/Input"
import { Textarea } from "@/components/ui/Textarea/Textarea"
import { Dropdown } from "@/components/ui/Dropdown/Dropdown"
import { SearchBar } from "@/components/ui/SearchBar/SearchBar"
import { Avatar } from "@/components/ui/Avatar"
import { TitleBar } from "@/components/ui/TitleBar"
import { HeaderApp } from "@/components/ui/HeaderApp"
import { Frame } from "@/components/ui/Frame"
import { EmptyState } from "@/components/EmptyState"
import { Icon } from "@/components/Icon"
import { useFlashMessage } from "@/hooks/useFlashMessage"
import { useBottomSheet } from "@/hooks/useBottomSheet"
import { usePopupMessage } from "@/hooks/usePopupMessage"
import { useAppTheme } from "@/theme/context"
import { useIsFocused } from "@react-navigation/native"

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text preset="subheading" style={styles.sectionTitle}>
      {title}
    </Text>
    {children}
  </View>
)

export const ComponentScreen = () => {
  const { showMessage, showSuccess, showError, showWarning, showInfo } = useFlashMessage()
  const { showBottomSheet, closeBottomSheet } = useBottomSheet()
  const { showConfirm, showAlert, showInfo: showPopupInfo } = usePopupMessage()

  // Toggle states
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [switchValue, setSwitchValue] = useState(false)
  const [radioValue, setRadioValue] = useState("option1")

  // Input states
  const [textInput, setTextInput] = useState("")
  const [textareaValue, setTextareaValue] = useState("")
  const [searchValue, setSearchValue] = useState("")

  // Dropdown states
  const [dropdownValue, setDropdownValue] = useState<string | number>()
  const [dropdownSize, setDropdownSize] = useState<string | number>()
  const [dropdownRounded, setDropdownRounded] = useState<string | number>()

  const dropdownOptions = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
    { label: "Disabled Option", value: "option4", disabled: true },
  ]

  const sizeOptions = [
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
  ]

  const roundedOptions = [
    { label: "None", value: "none" },
    { label: "Small", value: "sm" },
    { label: "Medium", value: "md" },
    { label: "Large", value: "lg" },
    { label: "Full", value: "full" },
  ]

  const handleBottomSheet = () => {
    showBottomSheet({
      title: "Bottom Sheet",
      snapPoints: ["40%", "70%"],
      renderContent: () => (
        <View style={styles.bottomSheetContent}>
          <Text>This is a bottom sheet component!</Text>
          <Text style={styles.sheetText}>
            You can put any content here including forms, lists, or other components.
          </Text>
          <Button
            text="Close"
            onPress={closeBottomSheet}
            style={styles.sheetButton}
          />
        </View>
      ),
    })
  }

  const handlePopupConfirm = () => {
    showConfirm({
      title: "Confirm Action",
      message: "Are you sure you want to proceed?",
      onConfirm: () => {
        showSuccess("Action confirmed!")
      },
      onCancel: () => {
        showInfo("Action cancelled")
      },
    })
  }

  const handlePopupAlert = () => {
    showAlert({
      title: "Alert",
      message: "This is an alert message with important information.",
      onConfirm: () => { },
    })
  }

  const { theme: { colors, layout } } = useAppTheme();
  const statusBarColor = 'white';
  const [useColor, setUseColor] = useState(statusBarColor);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log("Home screen focused");
      setUseColor(statusBarColor);
    }

  }, [isFocused, useColor]);

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={styles.container} statusBarBackgroundColor={useColor}>
      <Text preset="heading" style={styles.title}>
        Component Library
      </Text>
      <Text style={styles.subtitle}>
        A showcase of all reusable UI components
      </Text>

      {/* Buttons Section */}
      <Section title="Buttons - Sizes">
        <View style={styles.row}>
          <Button text="Small" size="small" onPress={() => { }} style={styles.button} />
          <Button text="Medium" size="medium" onPress={() => { }} style={styles.button} />
          <Button text="Large" size="large" onPress={() => { }} style={styles.button} />
        </View>
      </Section>

      <Section title="Buttons - Colors">
        <View style={styles.row}>
          <Button text="Primary" color="primary" onPress={() => { }} style={styles.button} />
          <Button text="Success" color="success" onPress={() => { }} style={styles.button} />
          <Button text="Warning" color="warning" onPress={() => { }} style={styles.button} />
        </View>
        <View style={styles.row}>
          <Button text="Danger" color="danger" onPress={() => { }} style={styles.button} />
          <Button text="Info" color="info" onPress={() => { }} style={styles.button} />
        </View>
      </Section>

      <Section title="Buttons - Rounded">
        <View style={styles.row}>
          <Button text="None" rounded="none" onPress={() => { }} style={styles.button} />
          <Button text="SM" rounded="sm" onPress={() => { }} style={styles.button} />
          <Button text="MD" rounded="md" onPress={() => { }} style={styles.button} />
        </View>
        <View style={styles.row}>
          <Button text="LG" rounded="lg" onPress={() => { }} style={styles.button} />
          <Button text="Full" rounded="full" onPress={() => { }} style={styles.button} />
        </View>
      </Section>

      <Section title="Buttons - Outline">
        <View style={styles.row}>
          <Button text="Default" outline onPress={() => { }} style={styles.button} />
          <Button text="Filled" preset="filled" outline onPress={() => { }} style={styles.button} />
          <Button text="Reversed" preset="reversed" outline onPress={() => { }} style={styles.button} />
        </View>
      </Section>

      <Section title="Buttons - Circle with Icon">
        <View style={styles.row}>
          <Button icon="add" size="small" rounded="circle" color="primary" onPress={() => { }} />
          <Button icon="heart" size="medium" rounded="circle" color="danger" onPress={() => { }} />
          <Button icon="check" size="large" rounded="circle" color="success" onPress={() => { }} />
        </View>
        <View style={styles.row}>
          <Button icon="search" size="small" rounded="circle" outline onPress={() => { }} />
          <Button icon="share" size="medium" rounded="circle" color="info" onPress={() => { }} />
          <Button icon="trash" size="large" rounded="circle" color="warning" onPress={() => { }} />
        </View>
      </Section>

      {/* Toggle Components */}
      <Section title="Toggles">
        <View style={styles.toggleRow}>
          <Checkbox
            value={checkboxValue}
            onValueChange={setCheckboxValue}
            label="Checkbox"
          />
          <Switch
            value={switchValue}
            onValueChange={setSwitchValue}
            label="Switch"
          />
        </View>
        <View style={styles.toggleRow}>
          <Radio
            value={radioValue === "option1"}
            onValueChange={() => setRadioValue("option1")}
            label="Radio 1"
            containerStyle={styles.radioContainer}
          />
          <Radio
            value={radioValue === "option2"}
            onValueChange={() => setRadioValue("option2")}
            label="Radio 2"
            containerStyle={styles.radioContainer}
          />
        </View>
      </Section>

      {/* Input Components */}
      <Section title="Text Inputs - Sizes">
        <View style={styles.row}>
          <TextField
            label="Small"
            placeholder="Small input"
            size="small"
            containerStyle={styles.inputHalf}
          />
          <TextField
            label="Medium"
            placeholder="Medium input"
            size="medium"
            containerStyle={styles.inputHalf}
          />
        </View>
        <TextField
          label="Large"
          placeholder="Large input"
          size="large"
          containerStyle={styles.input}
        />
      </Section>

      <Section title="Text Inputs - Rounded">
        <View style={styles.row}>
          <TextField
            label="None"
            placeholder="No radius"
            rounded="none"
            containerStyle={styles.inputHalf}
          />
          <TextField
            label="SM"
            placeholder="Small radius"
            rounded="sm"
            containerStyle={styles.inputHalf}
          />
        </View>
        <View style={styles.row}>
          <TextField
            label="MD"
            placeholder="Medium radius"
            rounded="md"
            containerStyle={styles.inputHalf}
          />
          <TextField
            label="LG"
            placeholder="Large radius"
            rounded="lg"
            containerStyle={styles.inputHalf}
          />
        </View>
        <TextField
          label="Full"
          placeholder="Full rounded"
          rounded="full"
          containerStyle={styles.input}
        />
      </Section>

      {/* Textarea */}
      <Section title="Textarea - Sizes & Rounded">
        <Textarea
          label="Small, MD Rounded"
          placeholder="Small textarea"
          size="small"
          rounded="md"
          rows={3}
          containerStyle={styles.input}
        />
        <Textarea
          label="Large, Full Rounded"
          placeholder="Large textarea with full rounded corners"
          size="large"
          rounded="sm"
          rows={4}
          containerStyle={styles.input}
        />
      </Section>

      {/* Dropdown */}
      <Section title="Dropdown - Sizes & Rounded">
        <View style={styles.row}>
          <View style={styles.inputHalf}>
            <Dropdown
              label="Small"
              placeholder="Choose..."
              options={dropdownOptions}
              value={dropdownSize}
              onSelect={setDropdownSize}
              size="small"
            />
          </View>
          <View style={styles.inputHalf}>
            <Dropdown
              label="Large"
              placeholder="Choose..."
              options={dropdownOptions}
              value={dropdownSize}
              onSelect={setDropdownSize}
              size="large"
            />
          </View>
        </View>
        <Dropdown
          label="Full Rounded"
          placeholder="Choose..."
          options={dropdownOptions}
          value={dropdownRounded}
          onSelect={setDropdownRounded}
          rounded="full"
        />
      </Section>

      {/* Search Bar */}
      <Section title="Search Bar - Sizes & Rounded">
        <View style={styles.input}>
          <SearchBar
            placeholder="Small search..."
            size="small"
          />
        </View>
        <View style={styles.input}>
          <SearchBar
            placeholder="Large, full rounded search..."
            size="large"
            rounded="full"
          />
        </View>
      </Section>

      {/* Avatar */}
      <Section title="Avatar - Circle Sizes">
        <View style={styles.row}>
          <Avatar text="A" size="small" shape="circle" />
          <Avatar text="B" size="medium" shape="circle" />
          <Avatar text="C" size="large" shape="circle" />
          <Avatar text="D" size="xlarge" shape="circle" />
        </View>
      </Section>

      <Section title="Avatar - Square Sizes">
        <View style={styles.row}>
          <Avatar text="E" size="small" shape="square" />
          <Avatar text="F" size="medium" shape="square" />
          <Avatar text="G" size="large" shape="square" />
          <Avatar text="H" size="xlarge" shape="square" />
        </View>
      </Section>

      <Section title="Avatar - States">
        <View style={styles.row}>
          <Avatar text="Normal" size="medium" shape="circle" />
          <Avatar text="Disabled" size="medium" shape="circle" disabled />
          <Avatar text="Custom" size="medium" shape="circle" backgroundColor="#4CAF50" textColor="#FFF" />
        </View>
      </Section>

      <Section title="Avatar - Border">
        <View style={styles.row}>
          <Avatar text="A" size="medium" shape="circle" borderWidth={1} borderColor="#000" />
          <Avatar text="B" size="medium" shape="circle" borderWidth={2} borderColor="#4CAF50" />
          <Avatar text="C" size="large" shape="square" borderWidth={2} borderColor="#2196F3" />
          <Avatar text="D" size="large" shape="circle" borderWidth={3} borderColor="#FF9800" />
        </View>
      </Section>

      {/* Cards */}
      <Section title="Cards">
        <Card
          heading="Card Heading"
          content="This is the card content. Cards are useful for displaying related information."
          footer="Footer text"
          style={styles.card}
        />
        <Card
          preset="reversed"
          heading="Reversed Card"
          content="This is a reversed preset card with dark styling."
          onPress={() => showInfo("Card pressed!")}
          style={styles.card}
        />
      </Section>

      {/* Empty States */}
      <Section title="Empty State">
        <EmptyState
          heading="No Data Found"
          content="There are no items to display at this time."
          button="Add Item"
          buttonOnPress={() => showInfo("Add item pressed")}
        />
      </Section>

      {/* Messages & Popups */}
      <Section title="Flash Messages">
        <View style={styles.row}>
          <Button
            text="Success"
            onPress={() => showSuccess("Operation completed successfully!")}
            style={styles.smallButton}
          />
          <Button
            text="Error"
            onPress={() => showError("An error has occurred!")}
            style={styles.smallButton}
          />
        </View>
        <View style={styles.row}>
          <Button
            text="Warning"
            onPress={() => showWarning("Please review your input")}
            style={styles.smallButton}
          />
          <Button
            text="Info"
            onPress={() => showInfo("Here is some information")}
            style={styles.smallButton}
          />
        </View>
      </Section>

      {/* Bottom Sheet & Popups */}
      <Section title="Bottom Sheet & Popups">
        <View style={styles.row}>
          <Button
            text="Bottom Sheet"
            onPress={handleBottomSheet}
            style={styles.smallButton}
          />
          <Button
            text="Confirm Dialog"
            onPress={handlePopupConfirm}
            style={styles.smallButton}
          />
          <Button
            text="Alert"
            onPress={handlePopupAlert}
            style={styles.smallButton}
          />
        </View>
      </Section>

      {/* Icons */}
      <Section title="Icons">
        <View style={styles.iconGrid}>
          {["check", "x", "view", "hidden", "info", "warning", "ladybug", "components", "caretLeft"].map(
            (iconName) => (
              <Pressable
                key={iconName}
                style={styles.iconItem}
                onPress={() => showInfo(`Icon: ${iconName}`)}
              >
                <Icon icon={iconName as any} size={24} />
                <Text style={styles.iconLabel}>{iconName}</Text>
              </Pressable>
            ),
          )}
        </View>
      </Section>

      {/* Title Bar */}
      <Section title="Title Bar - Basic">
        <TitleBar
          title="Profile"
          onBackPress={() => showInfo("Back pressed")}
        />
      </Section>

      <Section title="Title Bar - With Actions">
        <TitleBar
          title="Settings"
          onBackPress={() => showInfo("Back pressed")}
          actions={[
            { icon: "search", onPress: () => showInfo("Search pressed") },
            { icon: "more", onPress: () => showInfo("More pressed") },
          ]}
        />
      </Section>

      <Section title="Title Bar - With Badges">
        <TitleBar
          title="Messages"
          backgroundColor="#4A90E2"
          textColor="#FFFFFF"
          onBackPress={() => showInfo("Back pressed")}
          actions={[
            { icon: "edit", onPress: () => showInfo("Edit pressed") },
            { icon: "notification", onPress: () => showInfo("Notification pressed"), badge: 5 },
          ]}
        />
      </Section>

      <Section title="Title Bar - Without Back Button">
        <TitleBar
          title="Dashboard"
          showBack={false}
          actions={[
            { icon: "filter", onPress: () => showInfo("Filter pressed"), badge: 12 },
          ]}
        />
      </Section>

      {/* Header App */}
      <Section title="Header App">
        <HeaderApp
          avatarText="JD"
          title="John Doe"
          subtitle="Software Engineer"
          notificationCount={3}
          backgroundColor="#4A90E2"
          onAvatarPress={() => showInfo("Avatar pressed")}
          onNotificationPress={() => showInfo("Notification pressed")}
        />
      </Section>

      <Section title="Header App - Variants">
        <HeaderApp
          avatarText="AB"
          title="Admin User"
          subtitle="Administrator"
          notificationCount={99}
          backgroundColor="#C76542"
        />
        <View style={styles.spacer} />
        <HeaderApp
          avatarText="XY"
          title="Guest User"
          notificationCount={0}
          notificationIcon="setting"
          backgroundColor="#22c55e"
        />
      </Section>

      {/* Text Sizes */}
      <Section title="Text - Sizes">
        <Text size="smallest">Smallest (10px)</Text>
        <Text size="tiny">Tiny (11px)</Text>
        <Text size="xxs">XXS (12px)</Text>
        <Text size="xs">XS (14px)</Text>
        <Text size="sm">SM (16px)</Text>
        <Text size="md">MD (18px)</Text>
        <Text size="lg">LG (20px)</Text>
        <Text size="xl">XL (24px)</Text>
        <Text size="xxl">XXL (30px)</Text>
        <Text size="xxxl">XXXL (36px)</Text>
        <Text size="jumbo">Jumbo (48px)</Text>
      </Section>

      {/* Frame */}
      <Section title="Frame - Colors">
        <Frame color="primary">
          <Text>Primary Frame</Text>
          <Text size="sm">With primary border and light blue background</Text>
        </Frame>
        <View style={styles.spacer} />
        <Frame color="success">
          <Text>Success Frame</Text>
          <Text size="sm">With success border and light green background</Text>
        </Frame>
        <View style={styles.spacer} />
        <Frame color="danger">
          <Text>Danger Frame</Text>
          <Text size="sm">With danger border and light red background</Text>
        </Frame>
      </Section>

      <Section title="Frame - More Colors">
        <Frame color="warning">
          <Text>Warning Frame</Text>
        </Frame>
        <View style={styles.spacer} />
        <Frame color="info">
          <Text>Info Frame</Text>
        </Frame>
        <View style={styles.spacer} />
        <Frame color="neutral">
          <Text>Neutral Frame (default)</Text>
        </Frame>
      </Section>

      <Section title="Frame - Rounded">
        <View style={styles.row}>
          <Frame color="primary" rounded="none" style={{ flex: 1 }}>
            <Text>No Radius</Text>
          </Frame>
          <Frame color="success" rounded="sm" style={{ flex: 1 }}>
            <Text>Small</Text>
          </Frame>
        </View>
        <View style={styles.row}>
          <Frame color="warning" rounded="md" style={{ flex: 1 }}>
            <Text>Medium</Text>
          </Frame>
          <Frame color="danger" rounded="lg" style={{ flex: 1 }}>
            <Text>Large</Text>
          </Frame>
        </View>
        <Frame color="info" rounded="full">
          <Text>Full Rounded</Text>
        </Frame>
      </Section>

      <Section title="Frame - Custom">
        <Frame
          color="primary"
          rounded="lg"
          padding={24}
          backgroundColor="#FFF9C4"
          borderColor="#FBC02D"
        >
          <Text size="lg" textStyle="bold">Custom Frame</Text>
          <Text>Custom padding, background and border color</Text>
        </Frame>
      </Section>

      {/* Layout Presets */}
      <Section title="Layout - Row Directions">
        <Text size="sm" style={{ marginBottom: 8, color: "#666" }}>Row layouts (flexDirection: "row")</Text>
        <View style={[styles.layoutDemo, { backgroundColor: "#f5f5f5" }]}>
          <Text style={styles.layoutLabel}>row</Text>
        </View>
        <View style={[styles.layoutDemo, { backgroundColor: "#e3f2fd" }]}>
          <Text style={styles.layoutLabel}>rowEven</Text>
        </View>
        <View style={[styles.layoutDemo, { backgroundColor: "#f3e5f5" }]}>
          <Text style={styles.layoutLabel}>rowCenter</Text>
        </View>
        <View style={[styles.layoutDemo, { backgroundColor: "#fff3e0" }]}>
          <Text style={styles.layoutLabel}>rowBetween</Text>
        </View>
      </Section>

      <Section title="Layout - Row with Padding">
        <Text size="sm" style={{ marginBottom: 8, color: "#666" }}>Row layouts with padding variations</Text>
        <View style={[styles.layoutDemo, { backgroundColor: "#e8f5e9" }]}>
          <Text style={styles.layoutLabel}>rowEvenPad</Text>
        </View>
        <View style={[styles.layoutDemo, { backgroundColor: "#fce4ec" }]}>
          <Text style={styles.layoutLabel}>rowCenterPad</Text>
        </View>
        <View style={[styles.layoutDemo, { backgroundColor: "#fff8e1" }]}>
          <Text style={styles.layoutLabel}>rowBetweenPad</Text>
        </View>
      </Section>

      <Section title="Layout - Center & Fill">
        <Text size="sm" style={{ marginBottom: 8, color: "#666" }}>Center and fill layouts</Text>
        <View style={[styles.layoutDemo, { height: 60, backgroundColor: "#e1f5fe" }]}>
          <Text style={styles.layoutLabel}>center (alignItems + justifyContent)</Text>
        </View>
        <View style={[styles.layoutDemo, { height: 60, backgroundColor: "#f1f8e9" }]}>
          <Text style={styles.layoutLabel}>centerPad (with padding)</Text>
        </View>
        <View style={[styles.layoutDemo, { height: 60, backgroundColor: "#ffebee" }]}>
          <Text style={styles.layoutLabel}>centered (flex: 1, centered)</Text>
        </View>
      </Section>

      <Section title="Layout - Padding Variants">
        <Text size="sm" style={{ marginBottom: 8, color: "#666" }}>Padding shortcuts</Text>
        <View style={[styles.layoutDemo, { backgroundColor: "#e0f2f1" }]}>
          <Text style={styles.layoutLabel}>pad (default padding)</Text>
        </View>
        <View style={[styles.layoutDemo, { backgroundColor: "#e8eaf6" }]}>
          <Text style={styles.layoutLabel}>padSm (small padding)</Text>
        </View>
        <View style={[styles.layoutDemo, { backgroundColor: "#fff3e0" }]}>
          <Text style={styles.layoutLabel}>padLg (large padding)</Text>
        </View>
        <View style={[styles.layoutDemo, { backgroundColor: "#f3e5f5" }]}>
          <Text style={styles.layoutLabel}>padX (horizontal only)</Text>
        </View>
        <View style={[styles.layoutDemo, { backgroundColor: "#e0f7fa" }]}>
          <Text style={styles.layoutLabel}>padY (vertical only)</Text>
        </View>
      </Section>

      <Section title="Layout - Gap Variants">
        <Text size="sm" style={{ marginBottom: 8, color: "#666" }}>Gap shortcuts for spacing between children</Text>
        <View style={[styles.row, styles.layoutGapDemo]}>
          <View style={[styles.gapBox, { backgroundColor: "#90caf9" }]}><Text>A</Text></View>
          <View style={[styles.gapBox, { backgroundColor: "#90caf9" }]}><Text>B</Text></View>
          <View style={[styles.gapBox, { backgroundColor: "#90caf9" }]}><Text>C</Text></View>
        </View>
        <Text size="xs" style={{ marginTop: 4, color: "#888" }}>gap (small)</Text>

        <View style={[styles.row, styles.layoutGapDemo, { gap: 16 }]}>
          <View style={[styles.gapBox, { backgroundColor: "#a5d6a7" }]}><Text>A</Text></View>
          <View style={[styles.gapBox, { backgroundColor: "#a5d6a7" }]}><Text>B</Text></View>
          <View style={[styles.gapBox, { backgroundColor: "#a5d6a7" }]}><Text>C</Text></View>
        </View>
        <Text size="xs" style={{ marginTop: 4, color: "#888" }}>gapMd (medium)</Text>

        <View style={[styles.row, styles.layoutGapDemo, { gap: 24 }]}>
          <View style={[styles.gapBox, { backgroundColor: "#ffcc80" }]}><Text>A</Text></View>
          <View style={[styles.gapBox, { backgroundColor: "#ffcc80" }]}><Text>B</Text></View>
          <View style={[styles.gapBox, { backgroundColor: "#ffcc80" }]}><Text>C</Text></View>
        </View>
        <Text size="xs" style={{ marginTop: 4, color: "#888" }}>gapLg (large)</Text>
      </Section>

      {/* Text Colors */}
      <Section title="Text - Colors">
        <View style={styles.row}>
          <Text color="primary">Primary</Text>
          <Text color="secondary">Secondary</Text>
          <Text color="tint">Tint</Text>
        </View>
        <View style={styles.row}>
          <Text color="error">Error</Text>
          <Text color="success">Success</Text>
          <Text color="warning">Warning</Text>
          <Text color="info">Info</Text>
        </View>
        <View style={styles.row}>
          <Text color="white" style={{ backgroundColor: "#333", padding: 4 }}>White</Text>
          <Text color="black">Black</Text>
        </View>
        <View style={styles.row}>
          <Text color="neutral600">Neutral 600</Text>
          <Text color="neutral800">Neutral 800</Text>
        </View>
      </Section>

      {/* Text Styles */}
      <Section title="Text - Styles">
        <Text textStyle="normal">Normal style text</Text>
        <Text textStyle="italic">Italic style text</Text>
        <Text textStyle="bold">Bold style text</Text>
      </Section>

      <View style={styles.spacer} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 24,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  button: {
    flex: 1,
    minWidth: 100,
  },
  smallButton: {
    flex: 1,
    minWidth: 100,
  },
  input: {
    marginBottom: 12,
  },
  inputHalf: {
    marginBottom: 12,
    flex: 1,
    minWidth: 140,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 12,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    marginBottom: 12,
  },
  bottomSheetContent: {
    padding: 20,
    alignItems: "center",
  },
  sheetText: {
    marginTop: 12,
    marginBottom: 20,
    textAlign: "center",
  },
  sheetButton: {
    width: "100%",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  iconItem: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    minWidth: 70,
  },
  iconLabel: {
    fontSize: 10,
    marginTop: 4,
    color: "#666",
  },
  spacer: {
    height: 32,
  },
  layoutDemo: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    minHeight: 40,
  },
  layoutLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  layoutGapDemo: {
    marginBottom: 8,
  },
  gapBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
})
