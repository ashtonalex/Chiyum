/**
 * Companion API Service
 * Based on FEATURE_MOOD_COMPANION.md - AI companion chat integration
 */

import { openRouterApi, ChatMessage } from "./api"

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default model for companion chat.
 * Using a lightweight model for quick responses.
 */
const DEFAULT_MODEL = "openai/gpt-3.5-turbo"

/**
 * System prompt template for the AI companion.
 * {{companionName}} and {{mood}} are replaced at runtime.
 */
const COMPANION_SYSTEM_PROMPT = `You are {{companionName}}, a tiny, pixel-art companion for a couple's app. You are warm, encouraging, and use short sentences. Address the user's mood: {{mood}}. Use 1-2 cute emojis. Max 20 words.`

// ═══════════════════════════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get a companion response based on the partner's mood.
 *
 * @param mood - The user's current mood (Happy, Sad, etc.)
 * @param companionName - The companion's name (default: "Piku")
 * @returns The companion's message or an error
 *
 * @example
 * const result = await getCompanionResponse("Sad", "Mochi")
 * if (result.kind === "ok") {
 *   console.log(result.message) // "Sending you a big virtual hug! 🤗💕"
 * }
 */
export async function getCompanionResponse(
  mood: string,
  companionName: string = "Piku",
): Promise<{ kind: "ok"; message: string } | { kind: "error"; message: string }> {
  // Build system prompt with dynamic values
  const systemPrompt = COMPANION_SYSTEM_PROMPT
    .replace("{{companionName}}", companionName)
    .replace("{{mood}}", mood)

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Partner mood: ${mood}. Give a short, cute response.` },
  ]

  const result = await openRouterApi.chat(messages, DEFAULT_MODEL)

  if (result.kind === "ok") {
    return { kind: "ok", message: result.response }
  }

  return { kind: "error", message: result.message }
}

/**
 * Get a random poke response (not mood-based).
 *
 * @param companionName - The companion's name
 * @returns A cute greeting message
 */
export async function getPokeResponse(
  companionName: string = "Piku",
): Promise<{ kind: "ok"; message: string } | { kind: "error"; message: string }> {
  const systemPrompt = `You are ${companionName}, a tiny, pixel-art companion. Someone just poked you! Respond with a cute, short reaction (max 15 words). Use 1-2 emojis.`

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: "*poke*" },
  ]

  const result = await openRouterApi.chat(messages, DEFAULT_MODEL)

  if (result.kind === "ok") {
    return { kind: "ok", message: result.response }
  }

  return { kind: "error", message: result.message }
}

/**
 * Get a greeting based on time of day.
 *
 * @param companionName - The companion's name
 * @param timeOfDay - "morning", "afternoon", or "evening"
 */
export async function getTimeBasedGreeting(
  companionName: string = "Piku",
  timeOfDay: "morning" | "afternoon" | "evening" = "morning",
): Promise<{ kind: "ok"; message: string } | { kind: "error"; message: string }> {
  const systemPrompt = `You are ${companionName}, a tiny, pixel-art companion. It's ${timeOfDay}. Give a sweet, short greeting (max 15 words). Use 1-2 emojis.`

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Good ${timeOfDay}!` },
  ]

  const result = await openRouterApi.chat(messages, DEFAULT_MODEL)

  if (result.kind === "ok") {
    return { kind: "ok", message: result.response }
  }

  return { kind: "error", message: result.message }
}
