# MST Store Structure: State Modeling for Couples

## 1. Overview
This project uses MobX-State-Tree (MST) for centralized, reactive state management. The store is a tree of models with strictly protected data that can only be modified through actions.

## 2. Core Models

### User & Authentication
- **UserModel**: Represents a single partner.
    - `id`: `types.identifier` (UUID).
    - `name`: `types.string`.
    - `avatar`: `types.maybe(types.string)` (URL to pixel-art avatar).
    - `currentMoodId`: `types.maybe(types.reference(MoodModel))`.
    - `location`: `types.maybe(LocationModel)`.

### Relationship & Connection
- **RelationshipStore**: Manages the shared state between both users.
    - `partnerA`: `UserModel`.
    - `partnerB`: `UserModel`.
    - `sharedDistance`: `types.number` (Calculated distance in meters).
    - `isNearby`: `types.computed` (Returns true if distance < 50m).
    - `closenessLevel`: `types.optional(types.integer, 0)`.

### Moods & Emotional Tracking
- **MoodModel**: Individual mood entry.
    - `id`: `types.identifier`.
    - `timestamp`: `types.Date`.
    - `level`: `types.enumeration(['Happy', 'Sad', 'Anxious', 'Tired', 'Neutral'])`.
    - `note`: `types.maybe(types.string)`.
- **MoodStore**: Collection of historical entries.
    - `entries`: `types.array(MoodModel)`.
    - `lastEntry`: `types.view` (Returns the most recent mood).

### Memories (Albums & Doodles)
- **PhotoModel**: Metadata for shared gallery.
    - `uri`: `types.string`.
    - `caption`: `types.string`.
- **DoodleModel**: JSON path data for Skia drawings.
    - `id`: `types.identifier`.
    - `paths`: `types.frozen()` (Serializable array of coordinate points).
- **GalleryStore**:
    - `photos`: `types.array(PhotoModel)`.
    - `doodles`: `types.array(DoodleModel)`.

## 3. RootStore (The Central Tree)
The `RootStore` composes all domain stores into a single entry point.
- `userStore`: `UserStore`.
- `relationshipStore`: `RelationshipStore`.
- `moodStore`: `MoodStore`.
- `galleryStore`: `GalleryStore`.
- `companionStore`: `CompanionStore`.

## 4. Key MST Actions & Patterns
- **Flows (Async)**: Use `flow` for OpenRouter API calls and Firebase syncing to handle generators/async operations.
- **Snapshots**: Use `onSnapshot` to automatically persist the store to MMKV storage.
- **References**: Use `types.reference` to link the "Active Mood" of a user to the full mood history without duplicating data.

## 5. Technical Implementation (Ignite Pattern)
```typescript
// app/models/RootStore.ts
export const RootStoreModel = types.model("RootStore").props({
  userStore: types.optional(UserStoreModel, {}),
  moodStore: types.optional(MoodStoreModel, { entries: [] }),
  relationshipStore: types.optional(RelationshipStoreModel, {}),
})