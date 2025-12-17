/**
 * Pixel Art Border System
 * Based on THEME_SPEC.md - Consistent 2px borders with high contrast
 *
 * All UI elements must maintain sharp edges with no blur or anti-aliasing.
 */

import { ViewStyle } from "react-native"

import { colors } from "./colors"

/**
 * Core border configuration.
 * Border width is ALWAYS 2px per spec for pixel-perfect consistency.
 */
export const pixelBorderConfig = {
  /** Standard border width - 2px constant across all components */
  width: 2,
  /** Default corner radius - 0px for strict pixel look */
  radiusPixel: 0,
  /** Optional smooth-pixel hybrid radius */
  radiusSmooth: 12,
} as const

/**
 * Pre-built border styles for common use cases.
 */
export const pixelBorders = {
  /**
   * Default pixel-perfect border - 2px dark charcoal, no radius.
   * Use for containers, buttons, inputs, and cards.
   */
  default: {
    borderWidth: pixelBorderConfig.width,
    borderColor: colors.border,
    borderRadius: pixelBorderConfig.radiusPixel,
  } as ViewStyle,

  /**
   * Smooth-pixel hybrid - 2px border with rounded corners.
   * Use when strict pixel edges feel too harsh.
   */
  smooth: {
    borderWidth: pixelBorderConfig.width,
    borderColor: colors.border,
    borderRadius: pixelBorderConfig.radiusSmooth,
  } as ViewStyle,

  /**
   * Teal accent border - for primary interactive elements.
   */
  teal: {
    borderWidth: pixelBorderConfig.width,
    borderColor: colors.palette.mintyTeal,
    borderRadius: pixelBorderConfig.radiusPixel,
  } as ViewStyle,

  /**
   * Lavender accent border - for secondary elements.
   */
  lavender: {
    borderWidth: pixelBorderConfig.width,
    borderColor: colors.palette.mutedLavender,
    borderRadius: pixelBorderConfig.radiusPixel,
  } as ViewStyle,

  /**
   * Success border - for positive states.
   */
  success: {
    borderWidth: pixelBorderConfig.width,
    borderColor: colors.palette.sageGreen,
    borderRadius: pixelBorderConfig.radiusPixel,
  } as ViewStyle,

  /**
   * Warning border - for alert states.
   */
  warning: {
    borderWidth: pixelBorderConfig.width,
    borderColor: colors.palette.softSalmon,
    borderRadius: pixelBorderConfig.radiusPixel,
  } as ViewStyle,

  /**
   * No border - for removing inherited borders.
   */
  none: {
    borderWidth: 0,
    borderColor: "transparent",
  } as ViewStyle,
} as const

/**
 * Helper to create a custom pixel border with specific color and optional radius.
 */
export function createPixelBorder(
  color: string,
  smooth: boolean = false,
): ViewStyle {
  return {
    borderWidth: pixelBorderConfig.width,
    borderColor: color,
    borderRadius: smooth
      ? pixelBorderConfig.radiusSmooth
      : pixelBorderConfig.radiusPixel,
  }
}

/**
 * Combined pixel card style - border + shadow for common container pattern.
 * Import pixelShadows separately if you need shadow variations.
 */
export const pixelCard: ViewStyle = {
  ...pixelBorders.default,
  backgroundColor: colors.surface,
}
