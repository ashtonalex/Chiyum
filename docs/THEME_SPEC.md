# Theme Specification: Retro-Kawaii Pixel Aesthetic

## 1. Core Visual Principles
- **Pixel-Perfect Rendering**: All UI elements must maintain sharp edges. No blur or anti-aliasing on borders or icons.
- **High Contrast Outlines**: Use 2px solid borders for all containers, buttons, and input fields.
- **Blocky Shadows**: Use hard shadows (0px blur) with a 4px horizontal and 4px vertical offset to mimic 2D sticker depth.
- **Muted Pastel Palette**: Avoid vibrant neons. Use desaturated, "milky" versions of primary colors.

## 2. Color Palette (Hex Codes)

### Base & Backgrounds
- **Primary Background**: `#FFF9F5` (Off-white Cream)
- **Secondary Background**: `#FFEBEE` (Dusty Rose Blush)
- **Card/Container Surface**: `#FFFFFF` (Pure White)

### Accents & UI States
- **Primary Accent**: `#B2DFDB` (Minty Teal)
- **Secondary Accent**: `#E1BEE7` (Muted Lavender)
- **Success/Growth**: `#C8E6C9` (Sage Green)
- **Alert/Warning**: `#FFCDD2` (Soft Salmon)

### Borders & Shadows
- **Main Border/Text**: `#3C3C3C` (Dark Charcoal - not pure black)
- **Pink Shadow**: `#E59A9A` (For Rose elements)
- **Green Shadow**: `#81C784` (For Sage elements)

## 3. Typography
- **Header Font**: `Lexend-Bold` or `Quicksand-Bold` (Rounded, bubbly feel)
- **Body Font**: `Lexend-Regular`
- **Pixel/Detail Font**: `PressStart2P-Regular` (For AI speech bubbles and small tech-style meta-data)

## 4. UI Component Constants
- **Border Width**: `2px` (Constant across all components)
- **Corner Radius**: `0px` for a strict pixel look, or `12px` for a "smooth-pixel" hybrid. (Project Default: `0px` with stepped-pixel corners).
- **Shadow Offset**: `x: 4, y: 4`
- **Shadow Opacity**: `1.0` (Hard shadow)

## 5. Animation Profiles (React Native Reanimated)
- **Transition Style**: `withSpring`
- **Spring Config**: `{ damping: 12, stiffness: 90 }` (Provides a "jelly-like" bounce consistent with the kawaii aesthetic)