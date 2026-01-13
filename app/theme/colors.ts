const palette = {
  // Neutral shades (renamed from grey for clarity)
  neutral50: "#F9FAFB",
  neutral100: "#F3F4F6",
  neutral200: "#E5E7EB",
  neutral300: "#D1D5DB",
  neutral400: "#9CA3AF",
  neutral500: "#6B7280",
  neutral600: "#4B5563",
  neutral700: "#374151",
  neutral800: "#1F2937",
  neutral900: "#111827",

  // Primary green color palette
  primary50: "#f7f9ea",
  primary100: "#ebf1cc",
  primary200: "#dbe5a4",
  primary300: "#cbd979",
  primary400: "#bbce51",
  primary500: "#acc32b", // Main primary
  primary600: "#92a625",
  primary700: "#7a8a1f",
  primary800: "#626f19",
  primary900: "#4d5813",

  // Outline color palette
  outline50: "#F9FAFB",
  outline100: "#F3F4F6",
  outline200: "#E5E7EB",
  outline300: "#D1D5DB",
  outline400: "#9CA3AF",
  outline500: "#6B7280",
  outline600: "#4B5563",
  outline700: "#374151",
  outline800: "#1F2937",
  outline900: "#111827",

  // Error color palette
  error50: "#FEF2F2",
  error100: "#FEE2E2",
  error200: "#FECACA",
  error300: "#FCA5A5",
  error400: "#F87171",
  error500: "#EF4444", // Main error
  error600: "#DC2626",
  error700: "#B91C1C",
  error800: "#991B1B",
  error900: "#7F1D1D",

  // Error color palette
  danger50: "#FEF2F2",
  danger100: "#FEE2E2",
  danger200: "#FECACA",
  danger300: "#FCA5A5",
  danger400: "#F87171",
  danger500: "#EF4444", // Main error
  danger600: "#DC2626",
  danger700: "#B91C1C",
  danger800: "#991B1B",
  danger900: "#7F1D1D",

  // Success color palette
  success50: "#F0FDF4",
  success100: "#DCFCE7",
  success200: "#BBF7D0",
  success300: "#86EFAC",
  success400: "#4ADE80",
  success500: "#22C55E", // Main success
  success600: "#16A34A",
  success700: "#15803D",
  success800: "#166534",
  success900: "#14532D",

  // Warning color palette
  warning50: "#FFF7ED",
  warning100: "#FFEDD5",
  warning200: "#FED7AA",
  warning300: "#FDBA74",
  warning400: "#FB923C",
  warning500: "#F97316", // Main warning
  warning600: "#EA580C",
  warning700: "#C2410C",
  warning800: "#9A3412",
  warning900: "#7C2D12",

  // Purple color palette
  purple50: "#FAF5FF",
  purple100: "#F3E8FF",
  purple200: "#E9D5FF",
  purple300: "#D8B4FE",
  purple400: "#C084FC",
  purple500: "#A855F7", // Main purple
  purple600: "#9333EA",
  purple700: "#7E22CE",
  purple800: "#6B21A8",
  purple900: "#581C87",

  // Malibu (blue) color palette
  malibu50: "#EFF6FF",
  malibu100: "#DBEAFE",
  malibu200: "#BFDBFE",
  malibu300: "#93C5FD",
  malibu400: "#60A5FA",
  malibu500: "#3B82F6", // Main malibu/blue
  malibu600: "#2563EB",
  malibu700: "#1D4ED8",
  malibu800: "#1E40AF",
  malibu900: "#1E3A8A",

  // Teal color palette
  teal50: "#F0FDFA",
  teal100: "#CCFBF1",
  teal200: "#99F6E4",
  teal300: "#5EEAD4",
  teal400: "#2DD4BF",
  teal500: "#14B8A6", // Main teal
  teal600: "#0D9488",
  teal700: "#0F766E",
  teal800: "#115E59",
  teal900: "#134E4A",

  // Yellow color palette
  yellow50: "#FEFCE8",
  yellow100: "#FEF9C3",
  yellow200: "#FEF08A",
  yellow300: "#FDE047",
  yellow400: "#FACC15",
  yellow500: "#EAB308", // Main yellow
  yellow600: "#CA8A04",
  yellow700: "#A16207",
  yellow800: "#854D0E",
  yellow900: "#713F12",

  // Dark blue color palette
  darkBlue50: "#EFF6FF",
  darkBlue100: "#DBEAFE",
  darkBlue200: "#BFDBFE",
  darkBlue300: "#93C5FD",
  darkBlue400: "#60A5FA",
  darkBlue500: "#3B82F6", // Main dark blue
  darkBlue600: "#2563EB",
  darkBlue700: "#1D4ED8",
  darkBlue800: "#1E40AF",
  darkBlue900: "#1E3A8A",

  // Overlay colors
  overlay20: "rgba(17, 24, 39, 0.2)",
  overlay50: "rgba(17, 24, 39, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral500,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral50,
  /**
   * The default border color.
   */
  border: palette.neutral200,
  /**
   * The main tinting color.
   */
  tint: palette.primary700,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral200,
  /**
   * Error messages.
   */
  error: palette.error500,
  /**
   * Error Background.
   */
  errorBackground: palette.error50,
  /**
   * Success color.
   */
  success: palette.success500,
  /**
   * Warning color.
   */
  warning: palette.warning500,
} as const
