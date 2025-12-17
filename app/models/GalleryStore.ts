/**
 * Gallery Store (Photos & Doodles)
 * Based on MST_STORE_STRUCTURE.md - Shared memories between partners
 */

import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree"

/**
 * Photo Model - Metadata for shared gallery images.
 */
export const PhotoModel = types.model("Photo", {
  /** Unique identifier */
  id: types.identifier,
  /** URI to the image file */
  uri: types.string,
  /** Caption text */
  caption: types.optional(types.string, ""),
  /** When the photo was added */
  createdAt: types.optional(types.Date, () => new Date()),
  /** ID of user who added the photo */
  addedBy: types.maybe(types.string),
})

/**
 * Doodle Model - JSON path data for Skia drawings.
 */
export const DoodleModel = types.model("Doodle", {
  /** Unique identifier */
  id: types.identifier,
  /** Serializable array of coordinate points */
  paths: types.frozen<Array<{ x: number; y: number }[]>>(),
  /** Brush colors used in the doodle */
  colors: types.optional(types.array(types.string), []),
  /** When the doodle was created */
  createdAt: types.optional(types.Date, () => new Date()),
  /** ID of user who created the doodle */
  createdBy: types.maybe(types.string),
  /** Optional exported image URI */
  snapshotUri: types.maybe(types.string),
})

/**
 * Gallery Store - Manages photos and doodles.
 */
export const GalleryStoreModel = types
  .model("GalleryStore", {
    /** All shared photos */
    photos: types.array(PhotoModel),
    /** All shared doodles */
    doodles: types.array(DoodleModel),
    /** Currently selected photo for viewing */
    selectedPhotoId: types.maybe(types.string),
  })
  .views((self) => ({
    /**
     * Returns photos sorted by creation date (newest first).
     */
    get sortedPhotos() {
      return [...self.photos].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )
    },

    /**
     * Returns doodles sorted by creation date (newest first).
     */
    get sortedDoodles() {
      return [...self.doodles].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )
    },

    /**
     * Total memory count.
     */
    get totalMemories() {
      return self.photos.length + self.doodles.length
    },

    /**
     * Get a photo by ID.
     */
    getPhoto(id: string) {
      return self.photos.find((p) => p.id === id)
    },

    /**
     * Get a doodle by ID.
     */
    getDoodle(id: string) {
      return self.doodles.find((d) => d.id === id)
    },
  }))
  .actions((self) => ({
    /**
     * Add a new photo to the gallery.
     */
    addPhoto(uri: string, caption?: string, addedBy?: string) {
      const photo = {
        id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        uri,
        caption: caption || "",
        createdAt: new Date(),
        addedBy,
      }
      self.photos.push(photo)
      return photo
    },

    /**
     * Add a new doodle to the gallery.
     */
    addDoodle(
      paths: Array<{ x: number; y: number }[]>,
      colors: string[],
      createdBy?: string,
    ) {
      const doodle = {
        id: `doodle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        paths,
        colors,
        createdAt: new Date(),
        createdBy,
        snapshotUri: undefined,
      }
      self.doodles.push(doodle)
      return doodle
    },

    /**
     * Set the snapshot URI for a doodle (exported image).
     */
    setDoodleSnapshot(id: string, uri: string) {
      const doodle = self.doodles.find((d) => d.id === id)
      if (doodle) {
        doodle.snapshotUri = uri
      }
    },

    /**
     * Remove a photo by ID.
     */
    removePhoto(id: string) {
      const index = self.photos.findIndex((p) => p.id === id)
      if (index !== -1) {
        self.photos.splice(index, 1)
      }
    },

    /**
     * Remove a doodle by ID.
     */
    removeDoodle(id: string) {
      const index = self.doodles.findIndex((d) => d.id === id)
      if (index !== -1) {
        self.doodles.splice(index, 1)
      }
    },

    /**
     * Select a photo for viewing.
     */
    selectPhoto(id: string | undefined) {
      self.selectedPhotoId = id
    },

    /**
     * Update a photo's caption.
     */
    updateCaption(id: string, caption: string) {
      const photo = self.photos.find((p) => p.id === id)
      if (photo) {
        photo.caption = caption
      }
    },
  }))

export interface PhotoType extends Instance<typeof PhotoModel> {}
export interface PhotoSnapshotIn extends SnapshotIn<typeof PhotoModel> {}
export interface PhotoSnapshotOut extends SnapshotOut<typeof PhotoModel> {}

export interface DoodleType extends Instance<typeof DoodleModel> {}
export interface DoodleSnapshotIn extends SnapshotIn<typeof DoodleModel> {}
export interface DoodleSnapshotOut extends SnapshotOut<typeof DoodleModel> {}

export interface GalleryStoreType extends Instance<typeof GalleryStoreModel> {}
