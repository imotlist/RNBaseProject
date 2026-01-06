/**
 * Dropdown component
 * A select/dropdown component
 */

import React, { useState } from "react"
import { View, StyleSheet, Pressable, ScrollView, TouchableOpacity } from "react-native"
import { useAppTheme } from "@/theme/context"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { scale, moderateScale, scaleFontSize } from "@/utils/responsive"

type DropdownSize = "small" | "medium" | "large"
type DropdownRounded = "none" | "sm" | "md" | "lg" | "full"

export interface DropdownOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface DropdownProps {
  /**
   * Options to display
   */
  options: DropdownOption[]
  /**
   * Selected value
   */
  value?: string | number
  /**
   * Placeholder text
   */
  placeholder?: string
  /**
   * Label text
   */
  label?: string
  /**
   * Error message
   */
  error?: string
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Callback when option is selected
   */
  onSelect: (value: string | number) => void
  /**
   * Size variation
   */
  size?: DropdownSize
  /**
   * Rounded variation
   */
  rounded?: DropdownRounded
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = "Select an option",
  label,
  error,
  disabled = false,
  onSelect,
  size = "medium",
  rounded,
}) => {
  const { theme } = useAppTheme()
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((opt) => opt.value === value)

  // Get size styles
  const sizeStyles = sizeStylesMap[size]
  const roundedStyle = rounded ? roundedStylesMap[rounded] : {}

  const handleSelect = (option: DropdownOption) => {
    if (!option.disabled) {
      onSelect(option.value)
      setIsOpen(false)
    }
  }

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      )}
      <Pressable
        style={[
          styles.trigger,
          sizeStyles,
          roundedStyle,
          {
            backgroundColor: theme.colors.palette.neutral200,
            borderColor: error ? theme.colors.error : theme.colors.border,
          },
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.triggerText,
            { color: selectedOption ? theme.colors.text : theme.colors.textDim },
          ]}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Icon icon="caretLeft" size={16} color={theme.colors.textDim} />
      </Pressable>
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
      )}
      {isOpen && !disabled && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <ScrollView style={styles.scroll} nestedScrollEnabled>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  {
                    backgroundColor:
                      option.value === value
                        ? theme.colors.palette.neutral300
                        : "transparent",
                  },
                  option.disabled && styles.disabled,
                ]}
                onPress={() => handleSelect(option)}
                disabled={option.disabled}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: option.disabled ? theme.colors.textDim : theme.colors.text },
                  ]}
                >
                  {option.label}
                </Text>
                {option.value === value && <Icon icon="check" size={16} color={theme.colors.tint} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: scale(16),
  },
  label: {
    fontSize: scaleFontSize(14),
    fontWeight: "500",
    marginBottom: scale(8),
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    minHeight: scale(48),
  },
  triggerText: {
    fontSize: scaleFontSize(16),
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    fontSize: scaleFontSize(12),
    marginTop: scale(4),
  },
  dropdown: {
    marginTop: scale(4),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    maxHeight: scale(200),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  scroll: {
    maxHeight: scale(200),
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  optionText: {
    fontSize: scaleFontSize(16),
  },
})

// Size variations
const sizeStylesMap: Record<DropdownSize, ViewStyle> = {
  small: {
    minHeight: scale(36),
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
  },
  medium: {
    minHeight: scale(48),
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
  },
  large: {
    minHeight: scale(56),
    paddingVertical: scale(16),
    paddingHorizontal: scale(20),
  },
}

// Rounded variations
const roundedStylesMap: Record<DropdownRounded, ViewStyle> = {
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
