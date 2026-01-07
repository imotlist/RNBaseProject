/**
 * AvatarsContainerView.tsx
 *
 * Presentational component for Avatars container screen.
 * Demonstrates all Avatar component variations.
 *
 * @module screens/Avatars
 */

import React, { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Avatar } from "@/components/ui"
import { TitleBar } from "@/components/ui"
import { useAppTheme } from "@/theme/context"
import { goBack } from "@/navigators/navigationUtilities"
import { useIsFocused, useNavigation } from "@react-navigation/native"

// ============================================================================
// Types
// ============================================================================

export interface AvatarsData {
  id: string
  title: string
  value: string | number
  [key: string]: any
}

export interface AvatarsContainerViewProps {
  selectedData: AvatarsData | null
  onSelectData: (data: AvatarsData) => void
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

const AvatarsContainerView: React.FC<AvatarsContainerViewProps> = () => {
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
      <TitleBar title="Avatars" showBack={true} onBackPress={goBack} backgroundColor={useColor}/>

      <ScrollView style={styles.container}>
        {/* Avatar Sizes */}
        <Section title="Sizes (Circle)">
          <View style={styles.row}>
            <View style={styles.avatarWrapper}>
              <Avatar size="small" source="https://i.pravatar.cc/100?img=1" />
              <Text style={styles.label}>Small</Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Avatar size="medium" source="https://i.pravatar.cc/100?img=2" />
              <Text style={styles.label}>Medium</Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Avatar size="large" source="https://i.pravatar.cc/100?img=3" />
              <Text style={styles.label}>Large</Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Avatar size="xlarge" source="https://i.pravatar.cc/100?img=4" />
              <Text style={styles.label}>XLarge</Text>
            </View>
          </View>
        </Section>

        {/* Avatar Shapes */}
        <Section title="Shapes">
          <View style={styles.row}>
            <View style={styles.avatarWrapper}>
              <Avatar size="large" shape="circle" source="https://i.pravatar.cc/100?img=5" />
              <Text style={styles.label}>Circle</Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Avatar size="large" shape="square" source="https://i.pravatar.cc/100?img=6" />
              <Text style={styles.label}>Square</Text>
            </View>
          </View>
        </Section>

        {/* Text Fallback */}
        <Section title="Text Fallback">
          <View style={styles.row}>
            <View style={styles.avatarWrapper}>
              <Avatar size="small" text="John" />
              <Text style={styles.label}>J</Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Avatar size="medium" text="Jane" />
              <Text style={styles.label}>J</Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Avatar size="large" text="Bob" />
              <Text style={styles.label}>B</Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Avatar size="xlarge" text="Alice" />
              <Text style={styles.label}>A</Text>
            </View>
          </View>
        </Section>

        {/* Custom Colors */}
        <Section title="Custom Colors">
          <View style={styles.row}>
            <View style={styles.avatarWrapper}>
              <Avatar size="large" text="A" backgroundColor="#e74c3c" textColor="#fff" />
              <Text style={styles.label}>Red</Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Avatar size="large" text="B" backgroundColor="#3498db" textColor="#fff" />
              <Text style={styles.label}>Blue</Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Avatar size="large" text="C" backgroundColor="#2ecc71" textColor="#fff" />
              <Text style={styles.label}>Green</Text>
            </View>
          </View>
        </Section>

        {/* With Border */}
        <Section title="With Border">
          <View style={styles.row}>
            <View style={styles.avatarWrapper}>
              <Avatar
                size="large"
                source="https://i.pravatar.cc/100?img=7"
                borderColor={theme.colors.tint}
                borderWidth={2}
              />
              <Text style={styles.label}>Border 2px</Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Avatar
                size="large"
                source="https://i.pravatar.cc/100?img=8"
                borderColor={theme.colors.palette.angry500}
                borderWidth={4}
              />
              <Text style={styles.label}>Border 4px</Text>
            </View>
          </View>
        </Section>

        {/* Disabled State */}
        <Section title="Disabled State">
          <View style={styles.row}>
            <View style={styles.avatarWrapper}>
              <Avatar
                size="large"
                source="https://i.pravatar.cc/100?img=9"
                disabled
              />
              <Text style={styles.label}>Image</Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Avatar
                size="large"
                text="D"
                disabled
              />
              <Text style={styles.label}>Text</Text>
            </View>
          </View>
        </Section>

        {/* Avatar Groups */}
        <Section title="Avatar Groups">
          <View style={styles.group}>
            <Avatar size="medium" source="https://i.pravatar.cc/100?img=10" />
            <Avatar size="medium" source="https://i.pravatar.cc/100?img=11" containerStyle={{ marginStart: -8 }} />
            <Avatar size="medium" source="https://i.pravatar.cc/100?img=12" containerStyle={{ marginStart: -8 }} />
            <Avatar size="medium" text="+5" containerStyle={{ marginStart: -8 }} />
          </View>
          <View style={styles.group}>
            <Avatar size="small" source="https://i.pravatar.cc/100?img=13" />
            <Avatar size="small" source="https://i.pravatar.cc/100?img=14" containerStyle={{ marginStart: -6 }} />
            <Avatar size="small" source="https://i.pravatar.cc/100?img=15" containerStyle={{ marginStart: -6 }} />
            <Avatar size="small" text="+3" containerStyle={{ marginStart: -6 }} />
          </View>
        </Section>

        {/* With Names */}
        <Section title="With Names (Common Pattern)">
          <View style={styles.listItem}>
            <Avatar size="medium" source="https://i.pravatar.cc/100?img=20" />
            <View style={styles.listItemContent}>
              <Text style={styles.name}>John Doe</Text>
              <Text style={styles.subtitle}>Software Engineer</Text>
            </View>
          </View>
          <View style={styles.listItem}>
            <Avatar size="medium" text="JS" backgroundColor="#9b59b6" textColor="#fff" />
            <View style={styles.listItemContent}>
              <Text style={styles.name}>Jane Smith</Text>
              <Text style={styles.subtitle}>Product Designer</Text>
            </View>
          </View>
          <View style={styles.listItem}>
            <Avatar size="medium" source="https://i.pravatar.cc/100?img=21" />
            <View style={styles.listItemContent}>
              <Text style={styles.name}>Bob Johnson</Text>
              <Text style={styles.subtitle}>Project Manager</Text>
            </View>
          </View>
        </Section>
      </ScrollView>
    </Screen>
  )
}

export default AvatarsContainerView

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
    gap: 16,
    flexWrap: "wrap",
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  listItemContent: {
    marginStart: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
})
