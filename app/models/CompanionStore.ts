/**
 * Companion Store
 * Based on FEATURE_MOOD_COMPANION.md - AI pixel-art companion state
 */

import { types, Instance, flow } from "mobx-state-tree"
import { getCompanionResponse } from "../services/openrouter/companion-api"

/**
 * Companion mood states that affect sprite animation.
 */
export const CompanionMoodState = types.enumeration("CompanionMoodState", [
  "idle",
  "happy",
  "sad",
  "anxious",
  "thinking",
  "excited",
])

/**
 * Companion Store - Manages the AI pixel companion's state.
 */
export const CompanionStoreModel = types
  .model("CompanionStore", {
    /** Current message displayed in speech bubble */
    currentMessage: types.optional(types.string, ""),
    /** Whether the companion is waiting for AI response */
    isThinking: types.optional(types.boolean, false),
    /** Current mood state affecting sprite */
    moodState: types.optional(CompanionMoodState, "idle"),
    /** Companion's customizable name */
    companionName: types.optional(types.string, "Piku"),
    /** Current sprite texture key */
    currentSprite: types.optional(types.string, "idle"),
    /** Number of interactions (pokes, feeds, etc) */
    interactionCount: types.optional(types.integer, 0),
    /** Whether the speech bubble is visible */
    isBubbleVisible: types.optional(types.boolean, false),
    /** Last interaction timestamp */
    lastInteractionAt: types.maybe(types.Date),
  })
  .volatile((self) => ({
    bubbleTimeout: null as any,
  }))
  .views((self) => ({
    /**
     * Returns true if companion hasn't been interacted with recently.
     */
    get isLonely() {
      if (!self.lastInteractionAt) return true
      const hoursSinceInteraction =
        (Date.now() - self.lastInteractionAt.getTime()) / (1000 * 60 * 60)
      return hoursSinceInteraction > 6
    },

    /**
     * Returns sprite key based on mood.
     */
    get spriteForMood() {
      const spriteMap: Record<string, string> = {
        idle: "companion_idle",
        happy: "companion_happy",
        sad: "companion_sad",
        anxious: "companion_anxious",
        thinking: "companion_thinking",
        excited: "companion_excited",
      }
      return spriteMap[self.moodState] || "companion_idle"
    },
  }))
  // First actions block - base actions
  .actions((self) => ({
    /**
     * Hide the speech bubble.
     */
    hideBubble() {
      self.isBubbleVisible = false
    },
  }))
  .actions((self) => ({
    /**
     * Set the companion's message and show bubble.
     */
    setMessage(message: string) {
      self.currentMessage = message
      self.isBubbleVisible = true
      
      // Clear existing timeout
      if (self.bubbleTimeout) {
        clearTimeout(self.bubbleTimeout)
        self.bubbleTimeout = null
      }

      // Auto-hide after 3 seconds if not thinking
      self.bubbleTimeout = setTimeout(() => {
        if (!self.isThinking) {
            self.hideBubble()
        }
      }, 3000)
    },

    /**
     * Set thinking state (while waiting for AI).
     */
    setThinking(thinking: boolean) {
      self.isThinking = thinking
      if (thinking) {
        self.moodState = "thinking"
      }
    },

    /**
     * Update mood state and sprite.
     */
    setMoodState(mood: typeof CompanionMoodState.Type) {
      self.moodState = mood
      self.currentSprite = mood
    },

    /**
     * Set the companion's name.
     */
    setName(name: string) {
      self.companionName = name
    },

    /**
     * Record an interaction (poke, feed, pet).
     */
    recordInteraction() {
      self.interactionCount += 1
      self.lastInteractionAt = new Date()
    },

    /**
     * React to a partner's mood.
     * Called when MoodStore receives a new entry.
     */
    reactToMood(partnerMood: string) {
      const moodMapping: Record<string, typeof CompanionMoodState.Type> = {
        Happy: "happy",
        Excited: "excited",
        Sad: "sad",
        Tired: "sad",
        Anxious: "anxious",
        Stressed: "anxious",
        Neutral: "idle",
      }
      self.moodState = moodMapping[partnerMood] || "idle"
    },

    /**
     * Reset to idle state.
     */
    resetToIdle() {
      self.moodState = "idle"
      self.isThinking = false
      self.isBubbleVisible = false
    },
  }))
  // Second actions block - actions that depend on base actions
  .actions((self) => ({
    /**
     * Trigger a poke interaction.
     * The companion blinks and shows a greeting.
     */
    poke() {
      self.recordInteraction()
      self.moodState = "happy"

      const greetings = [
        "Hey there! 💕",
        "*blink blink* Hi!",
        "You poked me! ✨",
        "I'm here for you~",
        "Thinking of you! 🌸",
      ]
      const randomGreeting =
        greetings[Math.floor(Math.random() * greetings.length)]
      self.setMessage(randomGreeting)
    },

    /**
     * Fetch AI response based on mood.
     */
    fetchAIResponse: flow(function* fetchAIResponse(mood: string) {
      self.isThinking = true
      self.moodState = "thinking"
      
      try {
        const result = yield getCompanionResponse(mood, self.companionName)
        
        if (result.kind === "ok") {
          self.setMessage(result.message)
        } else {
            console.tron?.error?.("AI Error: " + result.message, [])
            self.setMessage("I'm here for you! ❤️") // Fallback
        }
      } catch (error) {
        console.error("Failed to fetch AI response", error)
        self.setMessage("Sending love! 💕") // Fallback
      } finally {
        self.isThinking = false
        // Restore mood state from input if needed, or let it stay "thinking" until user interaction?
        // Better to set it back to the mood context
        const moodMapping: Record<string, typeof CompanionMoodState.Type> = {
            Happy: "happy",
            Excited: "excited",
            Sad: "sad",
            Tired: "sad",
            Anxious: "anxious",
            Stressed: "anxious",
            Neutral: "idle",
        }
        self.moodState = moodMapping[mood] || "idle"
      }
    }),

    /**
     * Chat with the companion.
     */
    chatWithCompanion: flow(function* chatWithCompanion(message: string) {
        self.isThinking = true
        self.moodState = "thinking"
        
        // Hide previous bubble while thinking? Or keep it? 
        // Let's keep it visible if it exists, or maybe show "..."?
        self.setMessage("...") // Show typing indicator

        try {
            // Needed import
            const { getCompanionChatResponse } = require("../services/openrouter/companion-api")
            const result = yield getCompanionChatResponse(message, self.companionName)

            if (result.kind === "ok") {
                self.setMessage(result.message)
                // Simple sentiment analysis based on keywords to change sprite?
                // For now, let's default to happy/idle unless we detect sad words.
                if (result.message.match(/sorry|sad|hug/i)) {
                    self.moodState = "sad" // Sympathy face
                } else if (result.message.match(/yay|awesome|great/i)) {
                    self.moodState = "excited"
                } else {
                    self.moodState = "happy"
                }

            } else {
                self.setMessage("I didn't quite catch that...")
                self.moodState = "anxious"
            }
        } catch (error) {
            console.error("Chat error", error)
            self.setMessage("My brain fuzzy...")
            self.moodState = "anxious"
        } finally {
            self.isThinking = false
        }
    }),
  }))

export interface CompanionStoreType
  extends Instance<typeof CompanionStoreModel> {}
