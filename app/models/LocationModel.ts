/**
 * Location Model
 * Stores geographic coordinates for distance calculation between partners.
 */

import { types } from "mobx-state-tree"

export const LocationModel = types.model("Location", {
  /** Latitude coordinate */
  latitude: types.number,
  /** Longitude coordinate */
  longitude: types.number,
  /** Timestamp of last location update */
  updatedAt: types.optional(types.Date, () => new Date()),
})

export type LocationType = typeof LocationModel.Type
