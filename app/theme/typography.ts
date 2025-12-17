/**
 * Retro-Kawaii Typography System
 * Based on THEME_SPEC.md - Rounded, bubbly fonts with pixel accent
 *
 * - Headers: Lexend-Bold or Quicksand-Bold (rounded, bubbly feel)
 * - Body: Lexend-Regular
 * - Pixel/Tech: PressStart2P-Regular (AI speech bubbles, meta-data)
 */

import { Platform } from "react-native"

// ═══════════════════════════════════════════════════════════════════════════
// GOOGLE FONTS IMPORTS
// ═══════════════════════════════════════════════════════════════════════════

import {
  Lexend_300Light as lexendLight,
  Lexend_400Regular as lexendRegular,
  Lexend_500Medium as lexendMedium,
  Lexend_600SemiBold as lexendSemiBold,
  Lexend_700Bold as lexendBold,
} from "@expo-google-fonts/lexend"

import {
  Quicksand_400Regular as quicksandRegular,
  Quicksand_500Medium as quicksandMedium,
  Quicksand_600SemiBold as quicksandSemiBold,
  Quicksand_700Bold as quicksandBold,
} from "@expo-google-fonts/quicksand"

import { PressStart2P_400Regular as pressStart2P } from "@expo-google-fonts/press-start-2p"

/**
 * All custom fonts to load at app startup.
 * These are passed to useFonts() in app.tsx
 */
export const customFontsToLoad = {
  // Lexend - Primary body font (rounded, readable)
  lexendLight,
  lexendRegular,
  lexendMedium,
  lexendSemiBold,
  lexendBold,

  // Quicksand - Header font (bubbly feel)
  quicksandRegular,
  quicksandMedium,
  quicksandSemiBold,
  quicksandBold,

  // PressStart2P - Pixel font for AI speech bubbles & tech details
  pressStart2P,
}

/**
 * Font family definitions organized by typeface.
 */
const fonts = {
  /**
   * Lexend - Primary body font.
   * Rounded, highly readable, kawaii-friendly.
   */
  lexend: {
    light: "lexendLight",
    normal: "lexendRegular",
    medium: "lexendMedium",
    semiBold: "lexendSemiBold",
    bold: "lexendBold",
  },

  /**
   * Quicksand - Header/display font.
   * Extra bubbly and rounded for kawaii headings.
   */
  quicksand: {
    normal: "quicksandRegular",
    medium: "quicksandMedium",
    semiBold: "quicksandSemiBold",
    bold: "quicksandBold",
  },

  /**
   * PressStart2P - Pixel/retro font.
   * Use sparingly for AI speech bubbles and tech-style meta-data.
   */
  pixel: {
    normal: "pressStart2P",
  },

  /**
   * Fallback fonts for platform-specific needs.
   */
  helveticaNeue: {
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  sansSerif: {
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    normal: Platform.select({ ios: "Courier", android: "monospace" }),
  },
}

/**
 * Semantic typography assignments.
 */
export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic names.
   */
  fonts,

  /**
   * Primary font for body text - Lexend.
   * Use for paragraphs, labels, and general UI text.
   */
  primary: fonts.lexend,

  /**
   * Header font - Quicksand.
   * Use for screen titles, section headers, and prominent text.
   */
  header: fonts.quicksand,

  /**
   * Pixel font - PressStart2P.
   * Use for AI companion speech bubbles and retro-style accents.
   * ⚠️ Use sparingly - this font is hard to read at small sizes!
   */
  pixel: fonts.pixel,

  /**
   * Secondary font - Platform default for system consistency.
   */
  secondary: Platform.select({
    ios: fonts.helveticaNeue,
    android: fonts.sansSerif,
  }),

  /**
   * Code/monospace font for technical content.
   */
  code: fonts.monospace,
}

/**
 * Pre-defined font sizes following an 8px grid.
 * Optimized for pixel-perfect rendering.
 */
export const fontSizes = {
  /** Extra small - Meta text, timestamps */
  xs: 10,
  /** Small - Captions, helper text */
  sm: 12,
  /** Medium/Default - Body text */
  md: 14,
  /** Large - Emphasized body, sub-headers */
  lg: 16,
  /** Extra large - Section headers */
  xl: 20,
  /** 2X large - Screen titles */
  xxl: 24,
  /** 3X large - Hero text */
  xxxl: 32,

  /**
   * Pixel font sizes - smaller since PressStart2P is visually larger.
   * Use these when applying typography.pixel
   */
  pixel: {
    xs: 6,
    sm: 8,
    md: 10,
    lg: 12,
  },
} as const
