# Feature: Distance Bubbles (Heartbeat Proximity)

## 1. Overview
A visual representation of the physical distance between partners. Two floating profile bubbles move closer or further apart on a dedicated screen, eventually merging into a single heart-shaped bubble when the partners are in the same "Love Zone" (proximity < 50 meters).

## 2. Real-Time Location Tracking
- **Library**: `expo-location`.
- **Permissions**: 
    - Foreground: `requestForegroundPermissionsAsync`.
    - Background: `requestBackgroundPermissionsAsync` (required for continuous updates).
- **Background Task**: Register a task with `TaskManager` to update the partner's location even when the app is closed.
- **Accuracy**: Set to `LocationAccuracy.Balanced` to conserve battery.

## 3. Distance Calculation & Privacy
- **Formula**: Haversine Formula (to calculate distance in meters from Lat/Long).
- **Privacy Mode**: Store only the *distance* value in the database if the user enables "Fuzzy Location," rather than exact coordinates.
- **Thresholds**: 
    - Same Place: < 50m.
    - Nearby: 50m - 500m.
    - Far: > 500m.

## 4. Visuals & Micro-Interactions (Reanimated)
- **Floating Effect**: Use `useSharedValue` and `withRepeat` with a sine wave transition to make bubbles "float" vertically.
- **Proximity Scaling**: As distance decreases, increase the `scale` of both bubbles slightly.
- **The "Merge" Animation**: When distance < 50m:
    1. Animate both bubbles to the screen center using `withSpring`.
    2. Trigger an opacity cross-fade to a single heart-shaped pixel-art sprite.
    3. Trigger a "Heartbeat" haptic pattern using `expo-haptics`.

## 5. UI Implementation Details
- **Bubble Style**: 
    - 2px dark charcoal border.
    - Circular clipping for profile photos (stair-stepped pixel edges).
    - Hard drop-shadow (offset 4px).
- **Text Overlay**: "10.5 km until a hug" or "You're both in the Love Zone!" using `PressStart2P-Regular` font.

## 6. Technical Checklist
- [ ] Configure `app.json` for Android `ACCESS_BACKGROUND_LOCATION`.
- [ ] Implement `LocationService.ts` for background tracking and distance math.
- [ ] Create `RelationshipStore` to hold the `sharedDistance` state.
- [ ] Build the `DistanceCanvas` component using `Animated.View` for the floating bubbles.