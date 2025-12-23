# Feature: Digital Nudges (The Shared Pulse)

## 1. Overview
Digital Nudges are low-friction, non-verbal interactions that allow partners to signal they are "thinking of you" without sending a text. One partner sends a nudge, triggering a specific haptic heartbeat and a screen-wide visual effect on the other partner’s device.

## 2. Haptic Implementation (Expo Haptics & Vibration)
- **Library**: `expo-haptics` for standard feedback and the React Native `Vibration` API for custom patterns.
- **Heartbeat Pattern**: 
  - Android: Use `Vibration.vibrate([0, 100, 100, 100])` to create a double-pulse (0ms delay, 100ms vibe, 100ms pause, 100ms vibe).
  - iOS: `Vibration` is fixed at 400ms; for custom patterns, use `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)` triggered twice in sequence.
- **Intensity**: Use `Haptics.ImpactFeedbackStyle.Medium` for light "pokes" and `Heavy` for "heartbeats".

## 3. Communication Logic (Firebase Cloud Messaging)
- **Data-Only Notifications**: Send "silent" payloads to trigger background haptics without showing a system notification tray item.
- **Priority**: Set `priority: 'high'` (Android) and `content-available: true` (iOS) in the FCM payload to wake the app from background/quit states.
- **Background Handler**: 
  - Implement `messaging().setBackgroundMessageHandler` to listen for the `nudge` type and trigger the haptic heartbeat immediately.

## 4. Visual Micro-Interactions (Reanimated)
- **Floating Hearts/Stars**: Use `react-native-reanimated` to spawn absolute-positioned sprites that drift from the bottom to the top of the screen when a nudge is received.
- **Particle System**: Trigger a burst of 10-15 tiny pixel-art stars around the center of the screen using a `useSharedValue` loop.
- **Color Bloom**: Briefly tint the background with the partner's "Mood Color" using a 500ms opacity transition.

## 5. UI Implementation
- **The "Nudge" Button**: A large pixel-art heart icon in the center of the dashboard.
- **Interaction**:
  - **Single Tap**: Sends a "Standard Nudge" (Single haptic pulse).
  - **Long Press**: Sends a "Heartbeat Nudge" (Double pulse haptic).
- **Feedback**: The sender’s button should "bounce" using `withSpring` to confirm the nudge was sent.

## 6. Technical Checklist
- [ ] Install `expo-haptics` and `@react-native-firebase/messaging`.
- [ ] Configure `AndroidManifest.xml` with `VIBRATE` permission.
- [ ] Create `NudgeService.ts` to handle FCM outgoing/incoming payloads.
- [ ] Define the `HEARTBEAT_PATTERN` constant in `theme/timing.ts`.