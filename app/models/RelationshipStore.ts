/**
 * Relationship Store
 * Based on MST_STORE_STRUCTURE.md - Manages shared state between partners
 */

import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree"

import { UserModel } from "./UserStore"

/**
 * Proximity threshold in meters for "Love Zone" detection.
 */
const NEARBY_THRESHOLD_METERS = 50

/**
 * Relationship Store - Manages the connection between both partners.
 */
export const RelationshipStoreModel = types
  .model("RelationshipStore", {
    /** First partner */
    partnerA: types.maybe(UserModel),
    /** Second partner */
    partnerB: types.maybe(UserModel),
    /** Calculated distance between partners in meters */
    sharedDistance: types.optional(types.number, 0),
    /** Closeness level - incremented through interactions */
    closenessLevel: types.optional(types.integer, 0),
    /** Couple's unique identifier for data sync */
    coupleId: types.maybe(types.string),
    /** Anniversary date for the relationship */
    anniversaryDate: types.maybe(types.Date),
    /** Whether real-time sync is active */
    isConnected: types.optional(types.boolean, false),
  })
  .views((self) => ({
    /**
     * Returns true if partners are within 50 meters (Love Zone).
     */
    get isNearby() {
      return self.sharedDistance < NEARBY_THRESHOLD_METERS
    },

    /**
     * Returns formatted distance string.
     */
    get distanceText() {
      if (self.sharedDistance < 1000) {
        return `${Math.round(self.sharedDistance)}m`
      }
      return `${(self.sharedDistance / 1000).toFixed(1)}km`
    },

    /**
     * Returns a friendly proximity message.
     */
    get proximityMessage() {
      if (self.sharedDistance < NEARBY_THRESHOLD_METERS) {
        return "You're both in the Love Zone! 💕"
      }
      if (self.sharedDistance < 500) {
        return "You're nearby!"
      }
      return `${(self.sharedDistance / 1000).toFixed(1)} km until a hug`
    },

    /**
     * Returns true if both partners are set up.
     */
    get isRelationshipActive() {
      return self.partnerA !== undefined && self.partnerB !== undefined
    },

    /**
     * Days since anniversary.
     */
    get daysTogether() {
      if (!self.anniversaryDate) return 0
      const now = new Date()
      const diff = now.getTime() - self.anniversaryDate.getTime()
      return Math.floor(diff / (1000 * 60 * 60 * 24))
    },
  }))
  .actions((self) => ({
    /**
     * Set partner A data.
     */
    setPartnerA(partner: typeof UserModel.Type) {
      self.partnerA = partner
    },

    /**
     * Set partner B data.
     */
    setPartnerB(partner: typeof UserModel.Type) {
      self.partnerB = partner
    },

    /**
     * Update the shared distance between partners.
     */
    updateDistance(distanceMeters: number) {
      self.sharedDistance = distanceMeters
    },

    /**
     * Increment closeness through interactions (pokes, nudges, etc).
     */
    incrementCloseness(amount: number = 1) {
      self.closenessLevel += amount
    },

    /**
     * Set the couple's unique ID.
     */
    setCoupleId(id: string) {
      self.coupleId = id
    },

    /**
     * Set anniversary date.
     */
    setAnniversaryDate(date: Date) {
      self.anniversaryDate = date
    },

    /**
     * Set connection status for real-time sync.
     */
    setConnected(connected: boolean) {
      self.isConnected = connected
    },

    /**
     * Calculate distance using Haversine formula.
     * Called when either partner's location updates.
     */
    calculateDistance() {
      if (!self.partnerA?.location || !self.partnerB?.location) {
        return
      }

      const { latitude: lat1, longitude: lon1 } = self.partnerA.location
      const { latitude: lat2, longitude: lon2 } = self.partnerB.location

      // Haversine formula
      const R = 6371000 // Earth's radius in meters
      const dLat = ((lat2 - lat1) * Math.PI) / 180
      const dLon = ((lon2 - lon1) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c

      self.sharedDistance = distance
    },
  }))

export interface RelationshipStoreType
  extends Instance<typeof RelationshipStoreModel> {}
export interface RelationshipStoreSnapshotIn
  extends SnapshotIn<typeof RelationshipStoreModel> {}
export interface RelationshipStoreSnapshotOut
  extends SnapshotOut<typeof RelationshipStoreModel> {}
