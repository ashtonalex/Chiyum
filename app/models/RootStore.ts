/**
 * Root Store
 * Based on MST_STORE_STRUCTURE.md - Central tree composing all domain stores
 */

import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree"

import { CompanionStoreModel } from "./CompanionStore"
import { GalleryStoreModel } from "./GalleryStore"
import { MoodStoreModel } from "./MoodStore"
import { RelationshipStoreModel } from "./RelationshipStore"
import { UserStoreModel } from "./UserStore"

/**
 * RootStore Model
 *
 * The central store tree that composes all domain stores.
 * This is the single entry point for all app state.
 */
export const RootStoreModel = types
  .model("RootStore", {
    /** User authentication and profile */
    userStore: types.optional(UserStoreModel, {}),
    /** Mood tracking entries */
    moodStore: types.optional(MoodStoreModel, { entries: [] }),
    /** Partner relationship state */
    relationshipStore: types.optional(RelationshipStoreModel, {}),
    /** Shared photos and doodles */
    galleryStore: types.optional(GalleryStoreModel, {
      photos: [],
      doodles: [],
    }),
    /** AI companion state */
    companionStore: types.optional(CompanionStoreModel, {}),
  })
  .views((self) => ({
    /**
     * Returns true if the app is fully initialized and ready.
     */
    get isReady() {
      return self.userStore.isLoggedIn
    },
  }))
  .actions((self) => ({
    /**
     * Reset all stores to initial state.
     */
    reset() {
      self.userStore.logout()
      self.moodStore.clearAll()
      self.companionStore.resetToIdle()
    },
  }))

/**
 * The RootStore instance type.
 */
export interface RootStoreType extends Instance<typeof RootStoreModel> {}

/**
 * The RootStore snapshot types for serialization.
 */
export interface RootStoreSnapshotIn
  extends SnapshotIn<typeof RootStoreModel> {}
export interface RootStoreSnapshotOut
  extends SnapshotOut<typeof RootStoreModel> {}
