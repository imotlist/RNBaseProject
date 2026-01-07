/**
 * CardsContainerView.tsx
 *
 * Presentational component for Cards container screen.
 * Demonstrates all Card component variations.
 *
 * @module screens/Cards
 */

import React, { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Card } from "@/components/Card"
import { Icon } from "@/components/Icon"
import { Avatar } from "@/components/ui"
import { TitleBar } from "@/components/ui"
import { useAppTheme } from "@/theme/context"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { goBack } from "@/navigators/navigationUtilities"

// ============================================================================
// Types
// ============================================================================

export interface CardsData {
  id: string
  title: string
  value: string | number
  [key: string]: any
}

export interface CardsContainerViewProps {
  selectedData: CardsData | null
  onSelectData: (data: CardsData) => void
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

const CardsContainerView: React.FC<CardsContainerViewProps> = () => {
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
      <TitleBar title="Cards" showBack={true} onBackPress={goBack} backgroundColor={useColor} />

      <ScrollView style={styles.container}>
        {/* Basic Cards */}
        <Section title="Basic Cards">
          <Card
            heading="Simple Heading"
            content="This is a simple card with heading and content."
            style={styles.card}
          />
          <Card
            heading="With Footer"
            content="This card has a footer text below."
            footer="Additional info"
            style={styles.card}
          />
          <Card
            heading="Long Content"
            content="This is an example of a card with longer content that spans multiple lines to demonstrate how the card handles text wrapping."
            style={styles.card}
          />
        </Section>

        {/* Card Presets */}
        <Section title="Card Presets">
          <Card
            preset="default"
            heading="Default"
            content="Default preset with light background"
            style={styles.card}
          />
          <Card
            preset="reversed"
            heading="Reversed"
            content="Reversed preset with dark background"
            style={styles.card}
          />
        </Section>

        {/* Vertical Alignment */}
        <Section title="Vertical Alignment">
          <Card
            heading="Top Alignment"
            content="Content aligned to top"
            verticalAlignment="top"
            style={styles.card}
          />
          <Card
            heading="Center Alignment"
            content="Content aligned to center"
            verticalAlignment="center"
            style={styles.cardMinHeight}
          />
          <Card
            heading="Space Between"
            content="Content spread evenly"
            footer="Footer at bottom"
            verticalAlignment="space-between"
            style={styles.cardMinHeight}
          />
        </Section>

        {/* Pressable Cards */}
        <Section title="Pressable Cards">
          <Card
            heading="Clickable Card"
            content="Tap me to see press effect"
            onPress={() => console.log("Card pressed")}
            style={styles.card}
          />
          <Card
            preset="reversed"
            heading="Another Action"
            content="Cards can be touchable"
            footer="Tap to interact"
            onPress={() => console.log("Reversed card pressed")}
            style={styles.card}
          />
        </Section>

        {/* Cards with Left Component */}
        <Section title="With Left Component">
          <Card
            heading="With Icon"
            content="Card with icon on the left"
            LeftComponent={<Icon icon="check" size={24} color={theme.colors.tint} />}
            style={styles.card}
          />
          <Card
            heading="With Avatar"
            content="Card with avatar on the left"
            footer="John Doe"
            LeftComponent={<Avatar size="small" source="https://i.pravatar.cc/100?img=1" />}
            style={styles.card}
          />
        </Section>

        {/* Cards with Right Component */}
        <Section title="With Right Component">
          <Card
            heading="Notification"
            content="You have a new message"
            RightComponent={<Icon icon="caretRight" size={20} color={theme.colors.textDim} />}
            style={styles.card}
          />
          <Card
            heading="With Badge"
            content="Card with action indicator"
            RightComponent={
              <View style={[styles.badge, { backgroundColor: theme.colors.tint }]}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            }
            style={styles.card}
          />
        </Section>

        {/* Cards with Custom Components */}
        <Section title="Custom Content Component">
          <Card
            heading="Custom Content"
            ContentComponent={
              <View style={styles.customContent}>
                <Text style={styles.customText}>Custom rendered content</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: "70%", backgroundColor: theme.colors.tint }]} />
                </View>
              </View>
            }
            style={styles.card}
          />
        </Section>

        {/* Cards in Row */}
        <Section title="Cards in Row">
          <View style={styles.row}>
            <Card
              heading="Card 1"
              content="First item"
              style={styles.flexCard}
            />
            <Card
              heading="Card 2"
              content="Second item"
              style={styles.flexCard}
            />
          </View>
        </Section>

        {/* Minimal Cards */}
        <Section title="Minimal Cards (Content Only)">
          <Card
            content="Content only card without heading"
            style={styles.card}
          />
          <Card
            content="Another minimal card"
            footer="With footer"
            style={styles.card}
          />
        </Section>
      </ScrollView>
    </Screen>
  )
}

export default CardsContainerView

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
  card: {
    marginBottom: 12,
  },
  cardMinHeight: {
    marginBottom: 12,
    minHeight: 120,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flexCard: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  customContent: {
    width: "100%",
  },
  customText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
})
