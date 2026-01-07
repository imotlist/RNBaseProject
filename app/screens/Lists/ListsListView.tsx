/**
 * ListsListView.tsx
 *
 * Presentational component for Lists list screen.
 * Demonstrates all ListItem component variations.
 *
 * @module screens/Lists
 */

import React from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { ListItem } from "@/components/ListItem"
import { Icon } from "@/components/Icon"
import { Avatar } from "@/components/ui"
import { Switch } from "@/components/Toggle/Switch"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { TitleBar } from "@/components/ui"
import { useAppTheme } from "@/theme/context"
import { scale } from "@/utils/responsive"

// ============================================================================
// Types
// ============================================================================

export interface ListsItem {
  id: string
  name: string
  description?: string
  [key: string]: any
}

export interface ListsListViewProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: Record<string, any>
  setFilters: (filters: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void
  clearFilters: () => void
  activeFilterCount: number
  onOpenFilters: () => void
  renderItem: (item: ListsItem) => React.ReactElement | null
  fetchOptions: {
    fetchData: (options: any) => Promise<{ data: ListsItem[]; hasMore: boolean; totalCount?: number }>
    pageSize: number
  }
  filterOptions?: Array<{ value: string; label: string }>
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

const ListsListView: React.FC<ListsListViewProps> = () => {
  const { theme } = useAppTheme()

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} style={$outerStyle}>
      <TitleBar title="Lists" showBack={false} />

      <ScrollView style={$flex1} keyboardShouldPersistTaps="handled">
        {/* Basic List Items */}
        <Section title="Basic List Items">
          <ListItem text="Simple list item" bottomSeparator />
          <ListItem text="Another list item" bottomSeparator />
          <ListItem text="Third item" />
        </Section>

        {/* List Items with Icons */}
        <Section title="With Left Icons">
          <ListItem leftIcon="view" text="Home" bottomSeparator />
          <ListItem leftIcon="community" text="Profile" bottomSeparator />
          <ListItem leftIcon="settings" text="Settings" bottomSeparator />
          <ListItem leftIcon="components" text="About" />
        </Section>

        {/* List Items with Right Icons */}
        <Section title="With Right Icons (Chevron)">
          <ListItem text="Go to settings" rightIcon="caretRight" bottomSeparator />
          <ListItem text="View profile" rightIcon="caretRight" bottomSeparator />
          <ListItem text="Open menu" rightIcon="caretRight" />
        </Section>

        {/* List Items with Both Icons */}
        <Section title="With Both Icons">
          <ListItem leftIcon="bell" rightIcon="caretRight" text="Notifications" bottomSeparator />
          <ListItem leftIcon="lock" rightIcon="caretRight" text="Privacy" bottomSeparator />
          <ListItem leftIcon="ladybug" rightIcon="caretRight" text="Help & Support" />
        </Section>

        {/* List Items with Custom Components */}
        <Section title="With Custom Components">
          <ListItem
            LeftComponent={<Icon icon="heart" size={24} color={theme.colors.palette.angry500} />}
            text="Favorites"
            bottomSeparator
          />
          <ListItem
            LeftComponent={
              <Avatar
                size="small"
                source="https://i.pravatar.cc/100?img=1"
              />
            }
            text="John Doe"
            RightComponent={<Icon icon="caretRight" size={20} />}
            bottomSeparator
          />
          <ListItem
            LeftComponent={
              <Avatar
                size="small"
                source="https://i.pravatar.cc/100?img=2"
              />
            }
            text="Jane Smith"
            RightComponent={<Icon icon="caretRight" size={20} />}
          />
        </Section>

        {/* List Items with Toggles */}
        <Section title="With Toggles">
          <View style={styles.listItemWithToggle}>
            <Text style={styles.toggleLabel}>Enable Notifications</Text>
            <Switch value={true} />
          </View>
          <View style={styles.listItemWithToggle}>
            <Text style={styles.toggleLabel}>Dark Mode</Text>
            <Switch value={false} />
          </View>
          <View style={styles.listItemWithToggle}>
            <Text style={styles.toggleLabel}>Remember me</Text>
            <Checkbox value={true} />
          </View>
        </Section>

        {/* List Items with Height Variations */}
        <Section title="Height Variations">
          <ListItem text="Small item (48px)" height={48} bottomSeparator />
          <ListItem text="Medium item (56px)" height={56} bottomSeparator />
          <ListItem text="Large item (64px)" height={64} bottomSeparator />
          <ListItem text="Extra large item (72px)" height={72} />
        </Section>

        {/* List Items as Buttons */}
        <Section title="Pressable Items">
          <ListItem
            leftIcon="check"
            text="Add new item"
            onPress={() => console.log("Add pressed")}
            bottomSeparator
          />
          <ListItem
            leftIcon="components"
            text="Edit item"
            onPress={() => console.log("Edit pressed")}
            bottomSeparator
          />
          <ListItem
            leftIcon="x"
            text="Delete item"
            leftIconColor={theme.colors.palette.angry500}
            onPress={() => console.log("Delete pressed")}
          />
        </Section>

        {/* List Items with Badges */}
        <Section title="With Badges">
          <View style={styles.listItemWithBadge}>
            <Text>Messages</Text>
            <View style={[styles.badge, { backgroundColor: theme.colors.tint }]}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
          <View style={[styles.listItemWithBadge, styles.separator]}>
            <Text>Notifications</Text>
            <View style={[styles.badge, { backgroundColor: theme.colors.palette.angry500 }]}>
              <Text style={styles.badgeText}>9</Text>
            </View>
          </View>
          <View style={styles.listItemWithBadge}>
            <Text>Updates</Text>
            <View style={[styles.badge, { backgroundColor: theme.colors.palette.accent300 }]}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          </View>
        </Section>
      </ScrollView>
    </Screen>
  )
}

export default ListsListView

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
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
    backgroundColor: "#fff",
  },
  listItemWithToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    minHeight: 56,
  },
  toggleLabel: {
    fontSize: 16,
    flex: 1,
  },
  listItemWithBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    minHeight: 56,
  },
  separator: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
})

const $outerStyle = {
  flex: 1,
}

const $flex1 = {
  flex: 1,
  paddingHorizontal: scale(20),
}
