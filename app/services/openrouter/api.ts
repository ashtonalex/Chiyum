/**
 * OpenRouter API Configuration
 * Based on API_ENDPOINTS.md - AI Companion via OpenRouter
 */

import { ApisauceInstance, create, ApiResponse } from "apisauce"

// ═══════════════════════════════════════════════════════════════════════════
// ENVIRONMENT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * OpenRouter API key.
 * Set via environment variable: EXPO_PUBLIC_OPENROUTER_API_KEY
 */
const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || ""

/**
 * App URL for OpenRouter headers.
 */
const APP_URL = process.env.EXPO_PUBLIC_APP_URL || "https://chiyum.app"

/**
 * App name for OpenRouter headers.
 */
const APP_NAME = "Chiyum"

// ═══════════════════════════════════════════════════════════════════════════
// API CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export interface OpenRouterConfig {
  baseURL: string
  timeout: number
}

const DEFAULT_CONFIG: OpenRouterConfig = {
  baseURL: "https://openrouter.ai/api/v1",
  timeout: 30000, // 30s - LLM responses can be slow
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatCompletionRequest {
  model: string
  messages: ChatMessage[]
  max_tokens?: number
  temperature?: number
}

export interface ChatCompletionResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// API CLASS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * OpenRouter API client for AI companion chat.
 */
export class OpenRouterApi {
  apisauce: ApisauceInstance
  config: OpenRouterConfig

  constructor(config: OpenRouterConfig = DEFAULT_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": APP_URL,
        "X-Title": APP_NAME,
      },
    })
  }

  /**
   * Send a chat completion request to OpenRouter.
   */
  async chat(
    messages: ChatMessage[],
    model: string = "openai/gpt-3.5-turbo",
  ): Promise<{ kind: "ok"; response: string } | { kind: "error"; message: string }> {
    const payload: ChatCompletionRequest = {
      model,
      messages,
      max_tokens: 150,
      temperature: 0.7,
    }

    const response: ApiResponse<ChatCompletionResponse> = await this.apisauce.post(
      "/chat/completions",
      payload,
    )

    if (!response.ok || !response.data) {
      console.error("OpenRouter API error:", response.problem, response.data)
      return {
        kind: "error",
        message: response.problem || "Unknown error",
      }
    }

    const content = response.data.choices?.[0]?.message?.content || ""
    return { kind: "ok", response: content }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Singleton OpenRouter API instance.
 */
export const openRouterApi = new OpenRouterApi()

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

if (__DEV__) {
  if (!OPENROUTER_API_KEY) {
    console.warn(
      "⚠️ EXPO_PUBLIC_OPENROUTER_API_KEY is not set. AI companion features will not work.",
    )
  }
}
