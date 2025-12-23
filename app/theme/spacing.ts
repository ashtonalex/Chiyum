/**
 * Pixel-Perfect Spacing System
 * Based on THEME_SPEC.md - Aligned to 4px grid for crisp pixel rendering
 *
 * Use these spacings for margins, paddings, and whitespace throughout the app.
 */

export const spacing = {
  /** 2px - Micro spacing, icon padding */
  xxxs: 2,
  /** 4px - Tight spacing, inline elements */
  xxs: 4,
  /** 8px - Small spacing, compact layouts */
  xs: 8,
  /** 12px - Default small margin */
  sm: 12,
  /** 16px - Default spacing, standard padding */
  md: 16,
  /** 20px - Medium-large gap */
  lg: 20,
  /** 24px - Section spacing */
  xl: 24,
  /** 32px - Large section gaps */
  xxl: 32,
  /** 48px - Extra large spacing */
  xxxl: 48,
  /** 64px - Maximum spacing, screen-level padding */
  huge: 64,
} as const

/**
 * Pixel art specific spacing constants.
 */
export const pixelSpacing = {
  /** Standard border width per THEME_SPEC - always 2px */
  borderWidth: 2,
  /** Shadow offset per THEME_SPEC - always 4px */
  shadowOffset: 4,
  /** Minimum touch target for accessibility */
  touchTarget: 44,
  /** Sprite grid base size */
  spriteGrid: 32,
  /** Icon standard size */
  iconSize: 24,
  /** Avatar/profile bubble size */
  avatarSize: 48,
  /** Large avatar for profiles */
  avatarLarge: 64,
} as const
