/**
 * Animation Timing & Spring Configurations
 * Based on THEME_SPEC.md - "Jelly-like" kawaii bounce animations
 *
 * Uses React Native Reanimated's withSpring for all transitions.
 */

/**
 * Standard animation durations in milliseconds.
 */
export const timing = {
  /** Quick micro-interactions */
  quick: 150,
  /** Standard transitions */
  medium: 300,
  /** Slower, more dramatic animations */
  slow: 500,
  /** Extra slow for emphasis */
  extraSlow: 800,
} as const

/**
 * Kawaii spring configuration.
 * Provides a "jelly-like" bounce consistent with the retro-kawaii aesthetic.
 *
 * Use with: withSpring(value, kawaiiSpring)
 */
export const kawaiiSpring = {
  /** Lower = more oscillation before settling */
  damping: 12,
  /** Higher = faster snap to target */
  stiffness: 90,
} as const

/**
 * Bouncy spring for playful interactions (pokes, taps).
 * More exaggerated bounce than the default.
 */
export const bouncySpring = {
  damping: 8,
  stiffness: 120,
} as const

/**
 * Gentle spring for subtle movements (floating, breathing).
 * Slower, more relaxed feel.
 */
export const gentleSpring = {
  damping: 20,
  stiffness: 60,
} as const

/**
 * Snappy spring for quick UI responses.
 * Minimal bounce, fast settling.
 */
export const snappySpring = {
  damping: 18,
  stiffness: 150,
} as const

/**
 * Haptic heartbeat pattern for nudges.
 * Format: [delay, vibrate, pause, vibrate]
 * Creates a double-pulse "heartbeat" effect.
 */
export const HEARTBEAT_PATTERN = [0, 100, 100, 100] as const

/**
 * Idle animation configuration for the AI companion.
 * Subtle vertical squish/stretch loop.
 */
export const idleAnimation = {
  /** Duration of one idle cycle */
  duration: 2000,
  /** Scale range for squish effect */
  scaleY: { min: 0.95, max: 1.05 },
  /** Scale range for stretch effect */
  scaleX: { min: 1.02, max: 0.98 },
} as const
