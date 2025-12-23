# Feature: Shared Doodle Notes

## 1. Overview
A shared digital canvas allowing partners to send handwritten sketches or notes to each other. The sketches appear as a "sticky note" on the partner's home screen or within the dedicated "Doodles" section of the app.

## 2. Canvas Engine (React Native Skia)
- **Library**: `@shopify/react-native-skia`.
- **Drawing Logic**: 
    - Use `TouchHandler` to capture X/Y coordinates in real-time.
    - Store paths as an array of `SkPath` objects to allow for "Undo" functionality and smooth re-rendering.
- **Stroke Style**: 
    - Use `StrokeCap.Round` and `StrokeJoin.Round` for a soft, marker-like feel.
    - Set `strokeWidth` to `4px` or `6px` to maintain a "chunky" kawaii look.
- **Texture**: Implement a "crayon" or "felt-tip" shader to give the lines a non-digital, organic texture.

## 3. Data Sync & Persistence
- **Storage Strategy**: Do not store doodles as heavy PNGs initially. Store the path data (JSON array of points) in the database (Supabase/Firestore) to allow the partner to watch the drawing "replay" in real-time.
- **Exporting**: Use Skia's `makeImageSnapshot()` to convert the final canvas into a base64 string or URI for display in the Photo Album feature.

## 4. UI/UX Design
- **The "Napkin" Look**: Use the `#FFF9F5` (Cream) background from `THEME_SPEC.md` for the canvas.
- **Washi Tape Overlay**: Decorate the corners of the doodle with pixel-art "tape" sprites from `IMAGE_ASSETS_GUIDE.md`.
- **Color Picker**: A limited palette of 6-8 pastel colors derived from the main theme.
- **Animations**: Use `react-native-reanimated` to "slide" the note onto the screen when a new one is received.

## 5. Technical Implementation Details
- **Component**: `DoodleCanvas.tsx`.
- **State Management**: `DoodleStore.ts` to manage `currentPath`, `allPaths`, and `brushColor`.
- **Optimization**: Use `memo` on the canvas background to prevent re-renders while the user is actively drawing a path.

## 6. Aesthetic Constraints
- **Border**: Every doodle "sticky note" must have a 2px dark charcoal border.
- **Shadow**: 4px hard block shadow to make the note look like it’s hovering over the UI.
- **Clear Button**: A "Trash" icon in pixel art style that triggers a "poof" particle animation.