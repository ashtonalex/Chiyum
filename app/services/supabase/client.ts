/**
 * Supabase Client Configuration
 * Based on API_ENDPOINTS.md - Backend for Auth, DB, Real-time, Storage
 */

import { createClient } from "@supabase/supabase-js"

import Config from "@/config"

// ═══════════════════════════════════════════════════════════════════════════
// ENVIRONMENT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Supabase project URL.
 * Set via environment variable: EXPO_PUBLIC_SUPABASE_URL
 */
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || ""

/**
 * Supabase anonymous key (public).
 * Set via environment variable: EXPO_PUBLIC_SUPABASE_ANON_KEY
 */
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""

// ═══════════════════════════════════════════════════════════════════════════
// CLIENT INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Supabase client instance.
 *
 * @example
 * import { supabase } from "@/services/supabase"
 *
 * // Auth
 * await supabase.auth.signInWithOAuth({ provider: "google" })
 *
 * // Database
 * const { data } = await supabase.from("profiles").select("*")
 *
 * // Real-time
 * supabase.channel("relationship:123").subscribe()
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Use in-memory storage for React Native
    // TODO: Replace with SecureStore for production
    storage: undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

if (__DEV__) {
  if (!SUPABASE_URL) {
    console.warn(
      "⚠️ EXPO_PUBLIC_SUPABASE_URL is not set. Supabase features will not work.",
    )
  }
  if (!SUPABASE_ANON_KEY) {
    console.warn(
      "⚠️ EXPO_PUBLIC_SUPABASE_ANON_KEY is not set. Supabase features will not work.",
    )
  }
}
