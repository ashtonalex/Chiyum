# Image Assets & Sprite Guide: Pixel Art Optimization

## 1. Directory Structure
- `assets/images/sprites/`: Multi-frame PNG sheets for the AI companion (Idle, Happy, Sad, Thinking).
- `assets/images/icons/`: Pixel-art UI icons (Heart, Photo-Album, Calendar, Map-Pin).
- `assets/images/backgrounds/`: Low-resolution textured patterns (Dithering patterns, Washi-tape textures).

## 2. Technical Requirements for Sharpness
To prevent "blurry" pixel art in React Native/Expo:
- **Resizing Mode**: Always use `resizeMode="repeat"` or `resizeMode="center"` for small assets.
- **Skia Sampling**: When using `@shopify/react-native-skia`, set `sampling` to `FilterMode.Nearest`.
- **Image Smoothing**: In the Root UI or specific Image components, apply the following style prop:
  - `fragment shader` (if custom) or `pixelated` scaling (Web/Android target): `imageRendering: "pixelated"`.

## 3. Sprite Sheet Specifications
- **Grid Size**: Use a 32x32 or 64x64 base grid per frame.
- **Format**: 32-bit PNG with transparency (No background).
- **Export Settings**: Export at 1x scale. Scaling up should be handled by the UI engine to ensure pixels align with the physical screen grid.

## 4. Animation Frame Logic
- **Idle Loop**: 4 frames (Slight vertical squish/stretch).
- **Interaction Reaction**: 3 frames (Jump or blink).
- **Mood Shift**: Single frame texture swap with a `withTiming` opacity cross-fade.

## 5. Handling "Cute" Decorations
- **Washi Tape**: Assets should be long, horizontal strips with alpha-transparent "torn" edges.
- **Sparkles**: 3x3 pixel white "plus" signs used as absolute-positioned overlays on highlighted items.

## 6. Implementation Snippet (Skia)
```typescript
import { Image, FilterMode } from "@shopify/react-native-skia";

// Ensuring nearest-neighbor interpolation for pixel art
<Image 
  image={pixelAsset} 
  sampling={{ filter: FilterMode.Nearest }} 
  x={0} 
  y={0} 
  width={128} 
  height={128} 
/>