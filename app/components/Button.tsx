import { ComponentType } from "react"
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native"

import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { scale, moderateScale, scaleFontSize } from "@/utils/responsive"

import { Text, TextProps } from "./Text"
import { IconPack, IconSaxName } from "@/components/ui/IconPack"

type Presets = "default" | "filled" | "reversed"
type ButtonSize = "small" | "medium" | "large"
type ButtonColor = "primary" | "secondary" | "success" | "warning" | "danger" | "info"
type ButtonRounded = "none" | "sm" | "md" | "lg" | "full" | "circle"

export interface ButtonAccessoryProps {
  style: StyleProp<any>
  pressableState: PressableStateCallbackType
  disabled?: boolean
}

export interface ButtonProps extends PressableProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps["tx"]
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps["text"]
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps["txOptions"]
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "disabled" state.
   */
  disabledTextStyle?: StyleProp<TextStyle>
  /**
   * One of the different types of button presets.
   */
  preset?: Presets
  /**
   * Size variation of the button.
   */
  size?: ButtonSize
  /**
   * Color variation of the button.
   */
  color?: ButtonColor
  /**
   * Rounded variation of the button.
   */
  rounded?: ButtonRounded
  /**
   * Whether to use outline style.
   */
  outline?: boolean
  /**
   * Icon name for circular button or icon-only button.
   */
  icon?: IconSaxName
  /**
   * Icon size.
   */
  iconSize?: number
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * Children components.
   */
  children?: React.ReactNode
  /**
   * disabled prop, accessed directly for declarative styling reasons.
   * https://reactnative.dev/docs/pressable#disabled
   */
  disabled?: boolean
  /**
   * An optional style override for the disabled state
   */
  disabledStyle?: StyleProp<ViewStyle>
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Button/}
 * @param {ButtonProps} props - The props for the `Button` component.
 * @returns {JSX.Element} The rendered `Button` component.
 * @example
 * <Button
 *   tx="common:ok"
 *   style={styles.button}
 *   textStyle={styles.buttonText}
 *   onPress={handleButtonPress}
 * />
 */
export function Button(props: ButtonProps) {
  const {
    tx,
    text,
    txOptions,
    style: $viewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    disabledTextStyle: $disabledTextStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    disabled,
    disabledStyle: $disabledViewStyleOverride,
    size = "medium",
    color,
    rounded,
    outline,
    icon,
    iconSize = 24,
    ...rest
  } = props

  const { themed, theme } = useAppTheme()

  const preset: Presets = props.preset ?? "default"
  const isCircle = rounded === "circle"
  const hasIcon = !!icon

  // Get size styles
  const $sizeStyle = themed($sizeStyles[size])

  // Get color styles
  const $colorStyle = color ? themed($colorStyles[color]) : null

  // Get rounded styles
  const $roundedStyle = rounded ? themed($roundedStyles[rounded]) : themed($defaultRoundedStyle)

  // Get outline styles
  const $outlineStyle = outline ? themed($outlineViewStyle) : null
  const $outlineTextStyle = outline ? themed($outlineTextStyles[preset]) : null

  // Determine icon color based on preset and outline
  const getIconColor = () => {
    if (outline) {
      return preset === "reversed" ? theme.colors.palette.neutral100 : theme.colors.text
    }
    if (color) {
      return "#FFFFFF"
    }
    return preset === "reversed" ? theme.colors.palette.neutral100 : theme.colors.text
  }

  /**
   * @param {PressableStateCallbackType} root0 - The root object containing the pressed state.
   * @param {boolean} root0.pressed - The pressed state.
   * @returns {StyleProp<ViewStyle>} The view style based on the pressed state.
   */
  function $viewStyle({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> {
    return [
      themed($viewPresets[preset]),
      isCircle ? themed($circleSizeStyles[size]) : $sizeStyle,
      $colorStyle,
      $roundedStyle,
      $outlineStyle,
      $viewStyleOverride,
      !!pressed && themed([$pressedViewPresets[preset], $pressedViewStyleOverride]),
      !!disabled && $disabledViewStyleOverride,
    ]
  }
  /**
   * @param {PressableStateCallbackType} root0 - The root object containing the pressed state.
   * @param {boolean} root0.pressed - The pressed state.
   * @returns {StyleProp<TextStyle>} The text style based on the pressed state.
   */
  function $textStyle({ pressed }: PressableStateCallbackType): StyleProp<TextStyle> {
    return [
      themed($textPresets[preset]),
      $outlineTextStyle,
      $textStyleOverride,
      !!pressed && themed([$pressedTextPresets[preset], $pressedTextStyleOverride]),
      !!disabled && $disabledTextStyleOverride,
    ]
  }

  // If button has icon (circle or icon-only), render icon instead of text
  if (hasIcon) {
    return (
      <Pressable
        style={$viewStyle}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        {...rest}
        disabled={disabled}
      >
        <IconPack
          name={icon}
          size={iconSize}
          color={getIconColor()}
        />
      </Pressable>
    )
  }

  return (
    <Pressable
      style={$viewStyle}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      {...rest}
      disabled={disabled}
    >
      {(state) => (
        <>
          {!!LeftAccessory && (
            <LeftAccessory style={$leftAccessoryStyle} pressableState={state} disabled={disabled} />
          )}

          <Text tx={tx} text={text} txOptions={txOptions} style={$textStyle(state)}>
            {children}
          </Text>

          {!!RightAccessory && (
            <RightAccessory
              style={$rightAccessoryStyle}
              pressableState={state}
              disabled={disabled}
            />
          )}
        </>
      )}
    </Pressable>
  )
}

const $rightAccessoryStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginStart: spacing.xs,
  zIndex: 1,
})
const $leftAccessoryStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginEnd: spacing.xs,
  zIndex: 1,
})

const $viewPresets: Record<Presets, ThemedStyleArray<ViewStyle>> = {
  default: [
    $styles.row,
    ({ colors }) => ({
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.palette.neutral400,
      backgroundColor: colors.palette.neutral100,
    }),
  ],
  filled: [
    $styles.row,
    ({ colors }) => ({
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      backgroundColor: colors.palette.neutral300,
    }),
  ],
  reversed: [
    $styles.row,
    ({ colors }) => ({
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      backgroundColor: colors.palette.neutral800,
    }),
  ],
}

const $textPresets: Record<Presets, ThemedStyleArray<TextStyle>> = {
  default: [
    ({ typography }) => ({
      fontSize: scaleFontSize(16),
      lineHeight: scaleFontSize(20),
      fontFamily: typography.primary.medium,
      textAlign: "center",
      flexShrink: 1,
      flexGrow: 0,
      zIndex: 2,
    }),
  ],
  filled: [
    ({ typography }) => ({
      fontSize: scaleFontSize(16),
      lineHeight: scaleFontSize(20),
      fontFamily: typography.primary.medium,
      textAlign: "center",
      flexShrink: 1,
      flexGrow: 0,
      zIndex: 2,
    }),
  ],
  reversed: [
    ({ typography, colors }) => ({
      fontSize: scaleFontSize(16),
      lineHeight: scaleFontSize(20),
      fontFamily: typography.primary.medium,
      textAlign: "center",
      flexShrink: 1,
      flexGrow: 0,
      zIndex: 2,
      color: colors.palette.neutral100,
    }),
  ],
}

const $pressedViewPresets: Record<Presets, ThemedStyle<ViewStyle>> = {
  default: ({ colors }) => ({ backgroundColor: colors.palette.neutral200 }),
  filled: ({ colors }) => ({ backgroundColor: colors.palette.neutral400 }),
  reversed: ({ colors }) => ({ backgroundColor: colors.palette.neutral700 }),
}

const $pressedTextPresets: Record<Presets, ThemedStyle<TextStyle>> = {
  default: () => ({ opacity: 0.9 }),
  filled: () => ({ opacity: 0.9 }),
  reversed: () => ({ opacity: 0.9 }),
}

// Size variations
const $sizeStyles: Record<ButtonSize, ThemedStyle<ViewStyle>> = {
  small: ({ spacing }) => ({
    minHeight: scale(36),
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  }),
  medium: ({ spacing }) => ({
    minHeight: scale(48),
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  }),
  large: ({ spacing }) => ({
    minHeight: scale(56),
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  }),
}

// Color variations
const $colorStyles: Record<ButtonColor, ThemedStyle<ViewStyle>> = {
  primary: ({ colors }) => ({
    backgroundColor: colors.tint,
    borderColor: colors.tint,
  }),
  secondary: ({ colors }) => ({
    backgroundColor: colors.palette.neutral400,
    borderColor: colors.palette.neutral400,
  }),
  success: ({ colors }) => ({
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  }),
  warning: ({ colors }) => ({
    backgroundColor: "#f59e0b",
    borderColor: "#f59e0b",
  }),
  danger: ({ colors }) => ({
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  }),
  info: ({ colors }) => ({
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  }),
}

// Rounded variations
const $roundedStyles: Record<ButtonRounded, ThemedStyle<ViewStyle>> = {
  none: () => ({ borderRadius: 0 }),
  sm: () => ({ borderRadius: moderateScale(4) }),
  md: () => ({ borderRadius: moderateScale(8) }),
  lg: () => ({ borderRadius: moderateScale(12) }),
  full: () => ({ borderRadius: 9999 }),
  circle: () => ({ borderRadius: 9999 }),
}

// Default border radius for when no rounded prop is specified
const $defaultRoundedStyle: ThemedStyle<ViewStyle> = () => ({ borderRadius: moderateScale(4) })

// Circle button size variations (width = height for perfect circle)
const $circleSizeStyles: Record<ButtonSize, ThemedStyle<ViewStyle>> = {
  small: () => ({
    width: scale(40),
    height: scale(40),
    justifyContent: "center",
    alignItems: "center",
  }),
  medium: () => ({
    width: scale(56),
    height: scale(56),
    justifyContent: "center",
    alignItems: "center",
  }),
  large: () => ({
    width: scale(72),
    height: scale(72),
    justifyContent: "center",
    alignItems: "center",
  }),
}

// Outline style
const $outlineViewStyle: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: "transparent",
  borderWidth: 1,
})

const $outlineTextStyles: Record<Presets, ThemedStyle<TextStyle>> = {
  default: ({ colors }) => ({ color: colors.palette.neutral800 }),
  filled: ({ colors }) => ({ color: colors.palette.neutral800 }),
  reversed: ({ colors }) => ({ color: colors.palette.neutral100 }),
}
