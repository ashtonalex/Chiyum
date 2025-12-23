/**
 * Supabase Service Barrel Export
 */

export { supabase } from "./client"

// ═══════════════════════════════════════════════════════════════════════════
// DATABASE TABLE NAMES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Supabase table names for type-safe queries.
 */
export const Tables = {
  PROFILES: "profiles",
  MOOD_ENTRIES: "mood_entries",
  DOODLES: "doodles",
  NUDGE_EVENTS: "nudge_events",
} as const

// ═══════════════════════════════════════════════════════════════════════════
// REAL-TIME CHANNEL NAMES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Channel name generators for real-time subscriptions.
 */
export const Channels = {
  /**
   * Relationship channel for mood/nudge updates.
   * @param coupleId - The couple's unique ID
   */
  relationship: (coupleId: string) => `relationship:${coupleId}`,

  /**
   * Doodles broadcast channel for real-time drawing.
   * @param coupleId - The couple's unique ID
   */
  doodles: (coupleId: string) => `doodles:${coupleId}`,
} as const

// ═══════════════════════════════════════════════════════════════════════════
// STORAGE BUCKETS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Supabase storage bucket names.
 */
export const Buckets = {
  /** Album photos */
  ALBUMS: "albums",
  /** User avatars */
  AVATARS: "avatars",
  /** Doodle snapshots */
  DOODLES: "doodles",
} as const
