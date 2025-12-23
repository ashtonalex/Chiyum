/**
 * User Model & Store
 * Based on MST_STORE_STRUCTURE.md - Represents a single partner/user
 */

import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree"

import { LocationModel } from "./LocationModel"

/**
 * User Model - Represents a single partner in the relationship.
 */
export const UserModel = types.model("User", {
  /** UUID identifier */
  id: types.identifier,
  /** Display name */
  name: types.string,
  /** URL to pixel-art avatar */
  avatar: types.maybe(types.string),
  /** ID of the user's current mood */
  currentMoodId: types.maybe(types.string),
  /** Current geographic location */
  location: types.maybe(LocationModel),
})

/**
 * User Store - Manages the current user's state.
 */
export const UserStoreModel = types
  .model("UserStore", {
    /** The currently authenticated user */
    currentUser: types.maybe(UserModel),
    /** Authentication state */
    isAuthenticated: types.optional(types.boolean, false),
    /** Loading state for auth operations */
    isLoading: types.optional(types.boolean, false),
  })
  .views((self) => ({
    /**
     * Returns true if a user is logged in.
     */
    get isLoggedIn() {
      return self.isAuthenticated && self.currentUser !== undefined
    },

    /**
     * Returns the current user's ID or undefined.
     */
    get userId() {
      return self.currentUser?.id
    },
  }))
  .actions((self) => ({
    /**
     * Set the current user after authentication.
     */
    setCurrentUser(user: typeof UserModel.Type | null) {
      if (user) {
        self.currentUser = user
        self.isAuthenticated = true
      } else {
        self.currentUser = undefined
        self.isAuthenticated = false
      }
    },

    /**
     * Update the user's display name.
     */
    updateName(name: string) {
      if (self.currentUser) {
        self.currentUser.name = name
      }
    },

    /**
     * Update the user's avatar URL.
     */
    updateAvatar(avatarUrl: string) {
      if (self.currentUser) {
        self.currentUser.avatar = avatarUrl
      }
    },

    /**
     * Update the user's location.
     */
    updateLocation(latitude: number, longitude: number) {
      if (self.currentUser) {
        self.currentUser.location = LocationModel.create({
          latitude,
          longitude,
          updatedAt: new Date(),
        })
      }
    },

    /**
     * Set the current mood ID.
     */
    setCurrentMood(moodId: string) {
      if (self.currentUser) {
        self.currentUser.currentMoodId = moodId
      }
    },

    /**
     * Set loading state.
     */
    setLoading(loading: boolean) {
      self.isLoading = loading
    },

    /**
     * Log out the current user.
     */
    logout() {
      self.currentUser = undefined
      self.isAuthenticated = false
    },
  }))

export interface UserType extends Instance<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}

export interface UserStoreType extends Instance<typeof UserStoreModel> {}
