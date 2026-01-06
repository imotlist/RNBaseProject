import { ReactNode, forwardRef, ForwardedRef } from "react"
// eslint-disable-next-line no-restricted-imports
import { StyleProp, Text as RNText, TextProps as RNTextProps, TextStyle } from "react-native"
import { TOptions } from "i18next"

import { isRTL, TxKeyPath } from "@/i18n"
import { translate } from "@/i18n/translate"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { useAppTheme } from "@/theme/context"
import { typography } from "@/theme/typography"
import { scaleFontSize } from "@/utils/responsive"

type Sizes = keyof typeof $sizeStyles
type Weights = keyof typeof typography.primary
type Presets = "default" | "bold" | "heading" | "subheading" | "formLabel" | "formHelper"
type Colors = keyof typeof $colorStyles
type TextStyles = "normal" | "italic" | "bold"

export interface TextProps extends RNTextProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TOptions
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>
  /**
   * One of the different types of text presets.
   */
  preset?: Presets
  /**
   * Text weight modifier.
   */
  weight?: Weights
  /**
   * Text size modifier.
   */
  size?: Sizes
  /**
   * Text color variant.
   */
  color?: Colors
  /**
   * Text style variant (normal, italic, bold).
   */
  textStyle?: TextStyles
  /**
   * Children components.
   */
  children?: ReactNode
}

/**
 * For your text displaying needs.
 * This component is a HOC over the built-in React Native one.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Text/}
 * @param {TextProps} props - The props for the `Text` component.
 * @returns {JSX.Element} The rendered `Text` component.
 */
export const Text = forwardRef(function Text(props: TextProps, ref: ForwardedRef<RNText>) {
  const {
    weight,
    size,
    color,
    textStyle,
    tx,
    txOptions,
    text,
    children,
    style: $styleOverride,
    ...rest
  } = props
  const { themed, theme } = useAppTheme()

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const preset: Presets = props.preset ?? "default"
  const $styles: StyleProp<TextStyle> = [
    $rtlStyle,
    themed($presets[preset]),
    weight && $fontWeightStyles[weight],
    size && $sizeStyles[size],
    color && $colorStyles[color](theme),
    textStyle && $textStyleStyles[textStyle],
    $styleOverride,
  ]

  return (
    <RNText {...rest} style={$styles} ref={ref}>
      {content}
    </RNText>
  )
})

// Size variants from smallest to jumbo
const $sizeStyles = {
  smallest: { fontSize: scaleFontSize(10), lineHeight: scaleFontSize(14) } satisfies TextStyle,
  tiny: { fontSize: scaleFontSize(11), lineHeight: scaleFontSize(16) } satisfies TextStyle,
  xxs: { fontSize: scaleFontSize(12), lineHeight: scaleFontSize(18) } satisfies TextStyle,
  xs: { fontSize: scaleFontSize(14), lineHeight: scaleFontSize(21) } satisfies TextStyle,
  sm: { fontSize: scaleFontSize(16), lineHeight: scaleFontSize(24) } satisfies TextStyle,
  md: { fontSize: scaleFontSize(18), lineHeight: scaleFontSize(26) } satisfies TextStyle,
  lg: { fontSize: scaleFontSize(20), lineHeight: scaleFontSize(32) } satisfies TextStyle,
  xl: { fontSize: scaleFontSize(24), lineHeight: scaleFontSize(34) } satisfies TextStyle,
  xxl: { fontSize: scaleFontSize(30), lineHeight: scaleFontSize(40) } satisfies TextStyle,
  xxxl: { fontSize: scaleFontSize(36), lineHeight: scaleFontSize(44) } satisfies TextStyle,
  jumbo: { fontSize: scaleFontSize(48), lineHeight: scaleFontSize(56) } satisfies TextStyle,
}

// Text style variants
const $textStyleStyles: Record<TextStyles, TextStyle> = {
  normal: { fontStyle: "normal" as const, fontWeight: "400" as const },
  italic: { fontStyle: "italic" as const },
  bold: { fontWeight: "700" as const },
}

const $fontWeightStyles = Object.entries(typography.primary).reduce((acc, [weight, fontFamily]) => {
  return { ...acc, [weight]: { fontFamily } }
}, {}) as Record<Weights, TextStyle>

// Color variants
const $colorStyles = {
  primary: (theme: any) => ({ color: theme.colors.text }),
  secondary: (theme: any) => ({ color: theme.colors.textDim }),
  tint: (theme: any) => ({ color: theme.colors.tint }),
  error: (theme: any) => ({ color: theme.colors.error }),
  success: (theme: any) => ({ color: "#4CAF50" }),
  warning: (theme: any) => ({ color: "#FF9800" }),
  info: (theme: any) => ({ color: "#2196F3" }),
  white: () => ({ color: "#FFFFFF" }),
  black: () => ({ color: "#000000" }),
  bold: () => ({ fontWeight: "700" as const }),
  neutral100: () => ({ color: "#FFFFFF" }),
  neutral200: () => ({ color: "#F4F2F1" }),
  neutral300: () => ({ color: "#D7CEC9" }),
  neutral400: () => ({ color: "#B6ACA6" }),
  neutral500: () => ({ color: "#978F8A" }),
  neutral600: () => ({ color: "#564E4A" }),
  neutral700: () => ({ color: "#3C3836" }),
  neutral800: () => ({ color: "#191015" }),
  neutral900: () => ({ color: "#000000" }),
}

const $baseStyle: ThemedStyle<TextStyle> = (theme) => ({
  ...$sizeStyles.sm,
  ...$fontWeightStyles.normal,
  color: theme.colors.text,
})

const $presets: Record<Presets, ThemedStyleArray<TextStyle>> = {
  default: [$baseStyle],
  bold: [$baseStyle, { ...$colorStyles.bold }],
  heading: [
    $baseStyle,
    {
      ...$sizeStyles.xxxl,
      ...$colorStyles.bold,
    },
  ],
  subheading: [$baseStyle, { ...$sizeStyles.lg, ...$fontWeightStyles.medium }],
  formLabel: [$baseStyle, { ...$fontWeightStyles.medium }],
  formHelper: [$baseStyle, { ...$sizeStyles.sm, ...$fontWeightStyles.normal }],
}
const $rtlStyle: TextStyle = isRTL ? { writingDirection: "rtl" } : {}
