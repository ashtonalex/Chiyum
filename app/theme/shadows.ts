/**
 * Pixel Art Shadow System
 * Based on THEME_SPEC.md - Hard-blocked shadows with 4px offset, 0 blur
 *
 * These shadows mimic the "2D sticker depth" look common in kawaii pixel art.
 */

import { ViewStyle } from "react-native"

import { colors } from "./colors"

/**
 * Core pixel shadow configuration.
 * All shadows use 0 blur radius for crisp, blocky edges.
 */
export const pixelShadowConfig = {
  /** Horizontal offset in pixels */
  offsetX: 4,
  /** Vertical offset in pixels */
  offsetY: 4,
  /** Shadow blur radius - always 0 for hard edges */
  radius: 0,
  /** Shadow opacity - always 1.0 for solid shadows */
  opacity: 1.0,
} as const

/**
 * Pre-built shadow styles for common use cases.
 * Apply these directly to View components.
 */
export const pixelShadows = {
  /**
   * Default shadow using dark charcoal.
   * Use for most containers, cards, and buttons.
   */
  default: {
    shadowColor: colors.palette.darkCharcoal,
    shadowOffset: {
      width: pixelShadowConfig.offsetX,
      height: pixelShadowConfig.offsetY,
    },
    shadowOpacity: pixelShadowConfig.opacity,
    shadowRadius: pixelShadowConfig.radius,
    elevation: 4, // Android fallback
  } as ViewStyle,

  /**
   * Pink shadow for rose/salmon themed elements.
   */
  pink: {
    shadowColor: colors.palette.pinkShadow,
    shadowOffset: {
      width: pixelShadowConfig.offsetX,
      height: pixelShadowConfig.offsetY,
    },
    shadowOpacity: pixelShadowConfig.opacity,
    shadowRadius: pixelShadowConfig.radius,
    elevation: 4,
  } as ViewStyle,

  /**
   * Green shadow for sage/success themed elements.
   */
  green: {
    shadowColor: colors.palette.greenShadow,
    shadowOffset: {
      width: pixelShadowConfig.offsetX,
      height: pixelShadowConfig.offsetY,
    },
    shadowOpacity: pixelShadowConfig.opacity,
    shadowRadius: pixelShadowConfig.radius,
    elevation: 4,
  } as ViewStyle,

  /**
   * Teal shadow for minty/primary accent elements.
   */
  teal: {
    shadowColor: colors.palette.tealShadow,
    shadowOffset: {
      width: pixelShadowConfig.offsetX,
      height: pixelShadowConfig.offsetY,
    },
    shadowOpacity: pixelShadowConfig.opacity,
    shadowRadius: pixelShadowConfig.radius,
    elevation: 4,
  } as ViewStyle,

  /**
   * Lavender shadow for secondary accent elements.
   */
  lavender: {
    shadowColor: colors.palette.lavenderShadow,
    shadowOffset: {
      width: pixelShadowConfig.offsetX,
      height: pixelShadowConfig.offsetY,
    },
    shadowOpacity: pixelShadowConfig.opacity,
    shadowRadius: pixelShadowConfig.radius,
    elevation: 4,
  } as ViewStyle,

  /**
   * No shadow - for removing inherited shadows.
   */
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,
} as const

/**
 * Helper to create a custom pixel shadow with a specific color.
 */
export function createPixelShadow(color: string): ViewStyle {
  return {
    shadowColor: color,
    shadowOffset: {
      width: pixelShadowConfig.offsetX,
      height: pixelShadowConfig.offsetY,
    },
    shadowOpacity: pixelShadowConfig.opacity,
    shadowRadius: pixelShadowConfig.radius,
    elevation: 4,
  }
}
