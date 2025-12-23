/**
 * RootStore Setup & Hydration
 * Based on MST_STORE_STRUCTURE.md - Persistence with MMKV
 */

import { applySnapshot, onSnapshot } from "mobx-state-tree"
import { MMKV } from "react-native-mmkv"

import { RootStoreModel, RootStoreType, RootStoreSnapshotIn } from "../RootStore"

/**
 * MMKV storage instance for store persistence.
 */
const storage = new MMKV({
  id: "chiyum-root-store",
})

/**
 * Storage key for the root store snapshot.
 */
const ROOT_STORE_KEY = "rootStore"

/**
 * Setup the RootStore with hydration and persistence.
 *
 * @returns The initialized RootStore instance
 */
export async function setupRootStore(): Promise<RootStoreType> {
  // Create a new store instance
  const rootStore = RootStoreModel.create({})

  // Try to hydrate from storage
  try {
    const storedData = storage.getString(ROOT_STORE_KEY)
    if (storedData) {
      const snapshot: RootStoreSnapshotIn = JSON.parse(storedData, (key, value) => {
        // Revive Date objects
        if (
          typeof value === "string" &&
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
        ) {
          return new Date(value)
        }
        return value
      })
      applySnapshot(rootStore, snapshot)
      console.log("✅ RootStore hydrated from storage")
    }
  } catch (error) {
    console.warn("⚠️ Failed to hydrate RootStore:", error)
    // Continue with empty store
  }

  // Set up auto-persistence on snapshot changes
  onSnapshot(rootStore, (snapshot) => {
    try {
      storage.set(ROOT_STORE_KEY, JSON.stringify(snapshot))
    } catch (error) {
      console.error("❌ Failed to persist RootStore:", error)
    }
  })

  return rootStore
}

/**
 * Clear all persisted store data.
 * Useful for logout or debugging.
 */
export function clearPersistedStore(): void {
  storage.delete(ROOT_STORE_KEY)
  console.log("🗑️ RootStore persistence cleared")
}

/**
 * Get the raw persisted snapshot for debugging.
 */
export function getPersistedSnapshot(): RootStoreSnapshotIn | null {
  try {
    const storedData = storage.getString(ROOT_STORE_KEY)
    if (storedData) {
      return JSON.parse(storedData)
    }
  } catch (error) {
    console.warn("Failed to read persisted snapshot:", error)
  }
  return null
}
