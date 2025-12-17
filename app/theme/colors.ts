/**
 * Retro-Kawaii Pastel Pixel Color Palette
 * Based on THEME_SPEC.md - Muted, "milky" pastels with high-contrast charcoal borders
 *
 * Includes backward-compatibility aliases for the original Ignite palette colors
 * to avoid breaking existing demo screens and components.
 */

const palette = {
  // ═══════════════════════════════════════════════════════════════════════════
  // BASE & BACKGROUNDS (Retro-Kawaii)
  // ═══════════════════════════════════════════════════════════════════════════
  /** Primary Background - Off-white Cream */
  cream: "#FFF9F5",
  /** Secondary Background - Dusty Rose Blush */
  dustyRose: "#FFEBEE",
  /** Card/Container Surface - Pure White */
  white: "#FFFFFF",

  // ═══════════════════════════════════════════════════════════════════════════
  // ACCENTS & UI STATES (Retro-Kawaii)
  // ═══════════════════════════════════════════════════════════════════════════
  /** Primary Accent - Minty Teal */
  mintyTeal: "#B2DFDB",
  /** Secondary Accent - Muted Lavender */
  mutedLavender: "#E1BEE7",
  /** Success/Growth - Sage Green */
  sageGreen: "#C8E6C9",
  /** Alert/Warning - Soft Salmon */
  softSalmon: "#FFCDD2",

  // ═══════════════════════════════════════════════════════════════════════════
  // BORDERS & SHADOWS (Pixel Art Style)
  // ═══════════════════════════════════════════════════════════════════════════
  /** Main Border/Text - Dark Charcoal (not pure black for softer look) */
  darkCharcoal: "#3C3C3C",
  /** Shadow for Rose/Pink elements */
  pinkShadow: "#E59A9A",
  /** Shadow for Sage/Green elements */
  greenShadow: "#81C784",
  /** Shadow for Teal elements */
  tealShadow: "#80CBC4",
  /** Shadow for Lavender elements */
  lavenderShadow: "#CE93D8",

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY
  // ═══════════════════════════════════════════════════════════════════════════
  transparent: "rgba(0, 0, 0, 0)",
  overlay20: "rgba(60, 60, 60, 0.2)",
  overlay50: "rgba(60, 60, 60, 0.5)",

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKWARD COMPATIBILITY - Original Ignite Neutral Palette
  // These map to the new Retro-Kawaii palette for smooth migration
  // ═══════════════════════════════════════════════════════════════════════════
  neutral100: "#FFFFFF",
  neutral200: "#FFF9F5", // Maps to cream
  neutral300: "#FFEBEE", // Maps to dustyRose
  neutral400: "#E0E0E0",
  neutral500: "#9E9E9E",
  neutral600: "#757575",
  neutral700: "#616161",
  neutral800: "#3C3C3C", // Maps to darkCharcoal
  neutral900: "#212121",

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKWARD COMPATIBILITY - Original Ignite Primary Palette
  // ═══════════════════════════════════════════════════════════════════════════
  primary100: "#B2DFDB", // Maps to mintyTeal
  primary200: "#80CBC4",
  primary300: "#4DB6AC",
  primary400: "#26A69A",
  primary500: "#009688",
  primary600: "#00897B",

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKWARD COMPATIBILITY - Original Ignite Secondary Palette
  // ═══════════════════════════════════════════════════════════════════════════
  secondary100: "#E1BEE7", // Maps to mutedLavender
  secondary200: "#CE93D8",
  secondary300: "#BA68C8",
  secondary400: "#AB47BC",
  secondary500: "#9C27B0",

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKWARD COMPATIBILITY - Original Ignite Accent Palette
  // ═══════════════════════════════════════════════════════════════════════════
  accent100: "#C8E6C9", // Maps to sageGreen
  accent200: "#A5D6A7",
  accent300: "#81C784",
  accent400: "#66BB6A",
  accent500: "#4CAF50",

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKWARD COMPATIBILITY - Original Ignite Error Palette
  // ═══════════════════════════════════════════════════════════════════════════
  angry100: "#FFCDD2", // Maps to softSalmon
  angry500: "#D32F2F",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the semantic names.
   * This is only included for rare, one-off cases.
   */
  palette,

  /**
   * A helper for making something see-thru.
   */
  transparent: palette.transparent,

  /**
   * The default text color - Dark Charcoal for pixel-perfect readability.
   */
  text: palette.darkCharcoal,

  /**
   * Secondary/dimmed text information.
   */
  textDim: "#6B6B6B",

  /**
   * The default screen background - Cream for warm kawaii feel.
   */
  background: palette.cream,

  /**
   * Secondary background for alternating sections.
   */
  backgroundSecondary: palette.dustyRose,

  /**
   * Card/container surface color.
   */
  surface: palette.white,

  /**
   * The default border color - Always 2px Dark Charcoal per spec.
   */
  border: palette.darkCharcoal,

  /**
   * The main tinting/accent color - Minty Teal.
   */
  tint: palette.mintyTeal,

  /**
   * Secondary accent - Muted Lavender.
   */
  tintSecondary: palette.mutedLavender,

  /**
   * The inactive tinting color.
   */
  tintInactive: "#D7D7D7",

  /**
   * Success states - Sage Green.
   */
  success: palette.sageGreen,

  /**
   * Warning/alert states - Soft Salmon.
   */
  warning: palette.softSalmon,

  /**
   * A subtle color used for separators/lines.
   */
  separator: palette.dustyRose,

  /**
   * Error messages - Slightly muted red for kawaii aesthetic.
   */
  error: palette.angry500,

  /**
   * Error background.
   */
  errorBackground: palette.softSalmon,

  // ═══════════════════════════════════════════════════════════════════════════
  // SHADOW COLORS (for hard-blocked pixel shadows)
  // ═══════════════════════════════════════════════════════════════════════════
  shadow: {
    default: palette.darkCharcoal,
    pink: palette.pinkShadow,
    green: palette.greenShadow,
    teal: palette.tealShadow,
    lavender: palette.lavenderShadow,
  },
} as const
