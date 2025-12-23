/**
 * RootStore Context
 * React context and hooks for accessing the MST store
 */

import { createContext, useContext } from "react"

import { RootStoreType } from "@/models"

/**
 * React context for the RootStore.
 */
const RootStoreContext = createContext<RootStoreType | undefined>(undefined)

/**
 * Provider component for the RootStore context.
 */
export const RootStoreProvider = RootStoreContext.Provider

/**
 * Hook to access the entire RootStore.
 *
 * @example
 * const rootStore = useStores()
 * console.log(rootStore.userStore.currentUser)
 */
export function useStores(): RootStoreType {
  const store = useContext(RootStoreContext)
  if (store === undefined) {
    throw new Error("useStores must be used within a RootStoreProvider")
  }
  return store
}

/**
 * Hook to access the UserStore.
 *
 * @example
 * const userStore = useUserStore()
 * console.log(userStore.currentUser?.name)
 */
export function useUserStore() {
  const { userStore } = useStores()
  return userStore
}

/**
 * Hook to access the MoodStore.
 *
 * @example
 * const moodStore = useMoodStore()
 * moodStore.addMood("Happy", "Feeling great!")
 */
export function useMoodStore() {
  const { moodStore } = useStores()
  return moodStore
}

/**
 * Hook to access the RelationshipStore.
 *
 * @example
 * const relationshipStore = useRelationshipStore()
 * console.log(relationshipStore.isNearby)
 */
export function useRelationshipStore() {
  const { relationshipStore } = useStores()
  return relationshipStore
}

/**
 * Hook to access the GalleryStore.
 *
 * @example
 * const galleryStore = useGalleryStore()
 * galleryStore.addPhoto(uri, "Summer vacation")
 */
export function useGalleryStore() {
  const { galleryStore } = useStores()
  return galleryStore
}

/**
 * Hook to access the CompanionStore.
 *
 * @example
 * const companionStore = useCompanionStore()
 * companionStore.poke()
 */
export function useCompanionStore() {
  const { companionStore } = useStores()
  return companionStore
}
