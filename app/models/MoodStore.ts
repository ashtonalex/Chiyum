/**
 * Mood Model & Store
 * Based on MST_STORE_STRUCTURE.md - Emotional tracking for partners
 */

import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree"

/**
 * Available mood levels for the app.
 */
export const MoodLevel = types.enumeration("MoodLevel", [
  "Happy",
  "Sad",
  "Anxious",
  "Tired",
  "Neutral",
  "Excited",
  "Stressed",
])

/**
 * Individual mood entry model.
 */
export const MoodModel = types.model("Mood", {
  /** Unique identifier */
  id: types.identifier,
  /** When this mood was recorded */
  timestamp: types.Date,
  /** The mood level/type */
  level: MoodLevel,
  /** Optional note about the mood */
  note: types.maybe(types.string),
})

/**
 * Mood Store - Collection of historical mood entries.
 */
export const MoodStoreModel = types
  .model("MoodStore", {
    /** All mood entries */
    entries: types.array(MoodModel),
  })
  .views((self) => ({
    /**
     * Returns the most recent mood entry.
     */
    get lastEntry() {
      if (self.entries.length === 0) return undefined
      return [...self.entries].sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      )[0]
    },

    /**
     * Returns moods for a specific date range.
     */
    getMoodsBetween(startDate: Date, endDate: Date) {
      return self.entries.filter(
        (mood) =>
          mood.timestamp >= startDate && mood.timestamp <= endDate,
      )
    },

    /**
     * Returns the count of each mood type.
     */
    get moodCounts() {
      const counts: Record<string, number> = {}
      self.entries.forEach((mood) => {
        counts[mood.level] = (counts[mood.level] || 0) + 1
      })
      return counts
    },
  }))
  .actions((self) => ({
    /**
     * Add a new mood entry.
     */
    addMood(level: string, note?: string) {
      const mood = {
        id: `mood-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        level: level as typeof MoodLevel.Type,
        note,
      }
      self.entries.push(mood)
      return mood
    },

    /**
     * Remove a mood entry by ID.
     */
    removeMood(id: string) {
      const index = self.entries.findIndex((m) => m.id === id)
      if (index !== -1) {
        self.entries.splice(index, 1)
      }
    },

    /**
     * Clear all mood entries.
     */
    clearAll() {
      self.entries.clear()
    },
  }))

export interface MoodType extends Instance<typeof MoodModel> {}
export interface MoodSnapshotIn extends SnapshotIn<typeof MoodModel> {}
export interface MoodSnapshotOut extends SnapshotOut<typeof MoodModel> {}

export interface MoodStoreType extends Instance<typeof MoodStoreModel> {}
