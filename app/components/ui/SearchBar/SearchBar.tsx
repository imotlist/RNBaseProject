/**
 * SearchBar component
 * A reusable search input component
 */

import React, { useState, useEffect } from "react"
import { View, StyleSheet, Pressable, TextInputProps, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import { TextField } from "@/components/TextField"
import { IconPack } from "@/components/ui/IconPack"
import { scale, moderateScale } from "@/utils/responsive"

type SearchBarSize = "small" | "medium" | "large"
type SearchBarRounded = "none" | "sm" | "md" | "lg" | "full"

export interface SearchBarProps {
  /**
   * Callback when search text changes (debounced)
   */
  onSearch?: (query: string) => void
  /**
   * Debounce delay in milliseconds
   */
  debounceDelay?: number
  /**
   * Placeholder text
   */
  placeholder?: string
  /**
   * Whether to show clear button
   */
  showClear?: boolean
  /**
   * Whether to show filter icon
   */
  showFilter?: boolean
  /**
   * Callback when filter button is pressed
   */
  onFilterPress?: () => void
  /**
   * Value
   */
  value?: string
  /**
   * onChangeText callback
   */
  onChangeText?: (text: string) => void
  /**
   * Size variation
   */
  size?: SearchBarSize
  /**
   * Rounded variation
   */
  rounded?: SearchBarRounded
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  debounceDelay = 300,
  placeholder = "Search...",
  showClear = true,
  showFilter = false,
  onFilterPress,
  value: controlledValue,
  onChangeText,
  size = "medium",
  rounded,
  ...rest
}) => {
  const { theme } = useAppTheme()
  const [value, setValue] = useState(controlledValue ?? "")
  const [debouncedValue, setDebouncedValue] = useState(controlledValue ?? "")

  // Get size and rounded styles
  const containerStyle = [
    styles.container,
    sizeStylesMap[size],
    rounded ? roundedStylesMap[rounded] : styles.roundedDefault,
  ]

  useEffect(() => {
    setValue(controlledValue ?? "")
  }, [controlledValue])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
      onSearch?.(value)
    }, debounceDelay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, debounceDelay, onSearch])

  const handleChangeText = (text: string) => {
    setValue(text)
    onChangeText?.(text)
  }

  const handleClear = () => {
    setValue("")
    onChangeText?.("")
    onSearch?.("")
  }

  const displayValue = controlledValue !== undefined ? controlledValue : value

  return (
    <View
      style={[
        containerStyle,
        {
          backgroundColor: theme.colors.palette.neutral100,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.searchIcon}>
        <IconPack name="search" size={20} color={theme.colors.textDim} />
      </View>
      <TextField
        value={displayValue}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTx={undefined}
        style={styles.input}
        containerStyle={styles.inputContainer}
        inputWrapperStyle={styles.inputWrapper}
        size={size}
        {...rest}
      />
      {showFilter && (
        <Pressable onPress={onFilterPress} style={styles.filterButton}>
          <IconPack name="filter" size={20} color={theme.colors.textDim} />
        </Pressable>
      )}
      {showClear && displayValue && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <IconPack name="close" size={20} color={theme.colors.textDim} />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  roundedDefault: {
    borderRadius: moderateScale(12),
  },
  searchIcon: {
    marginRight: scale(12),
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  inputWrapper: {
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginVertical: 0,
    marginHorizontal: 0,
    minHeight: scale(36),
  },
  input: {
    marginVertical: 0,
    marginHorizontal: 0,
    minHeight: scale(36),
  },
  clearButton: {
    padding: scale(4),
    marginLeft: scale(8),
    justifyContent: "center",
    alignItems: "center",
  },
  filterButton: {
    padding: scale(4),
    marginLeft: scale(8),
    justifyContent: "center",
    alignItems: "center",
  },
})

// Size variations
const sizeStylesMap: Record<SearchBarSize, ViewStyle> = {
  small: {
    paddingVertical: scale(6),
    paddingHorizontal: scale(10),
    minHeight: scale(36),
  },
  medium: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    minHeight: scale(44),
  },
  large: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(16),
    minHeight: scale(52),
  },
}

// Rounded variations
const roundedStylesMap: Record<SearchBarRounded, ViewStyle> = {
  none: {
    borderRadius: 0,
  },
  sm: {
    borderRadius: moderateScale(4),
  },
  md: {
    borderRadius: moderateScale(8),
  },
  lg: {
    borderRadius: moderateScale(12),
  },
  full: {
    borderRadius: 9999,
  },
}
