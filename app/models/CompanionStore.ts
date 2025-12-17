/**
 * Companion Store
 * Based on FEATURE_MOOD_COMPANION.md - AI pixel-art companion state
 */

import { types, Instance } from "mobx-state-tree"

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
     * Set the companion's message and show bubble.
     */
    setMessage(message: string) {
      self.currentMessage = message
      self.isBubbleVisible = true
    },

    /**
     * Hide the speech bubble.
     */
    hideBubble() {
      self.isBubbleVisible = false
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
  }))

export interface CompanionStoreType
  extends Instance<typeof CompanionStoreModel> {}
