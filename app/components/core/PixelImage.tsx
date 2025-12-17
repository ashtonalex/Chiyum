/**
 * PixelImage Component
 * Based on IMAGE_ASSETS_GUIDE.md - Nearest-neighbor sampling for crisp pixel art
 *
 * This component wraps Skia's Image to ensure pixel art stays sharp
 * without any blurring or anti-aliasing.
 */

import React from "react"
import { StyleSheet, View, ViewStyle } from "react-native"
import {
  Canvas,
  Image,
  useImage,
  FilterMode,
  MipmapMode,
  SkImage,
} from "@shopify/react-native-skia"

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PixelImageProps {
  /**
   * Source of the image. Can be:
   * - A require() statement for local assets
   * - A URI string for remote images
   * - A Skia SkImage object
   */
  source: number | string | SkImage

  /**
   * Width to render the image at.
   */
  width: number

  /**
   * Height to render the image at.
   */
  height: number

  /**
   * X position within the canvas (default: 0)
   */
  x?: number

  /**
   * Y position within the canvas (default: 0)
   */
  y?: number

  /**
   * Container style for the canvas wrapper.
   */
  style?: ViewStyle

  /**
   * Whether to show a debug border around the canvas.
   */
  debug?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PixelImage renders pixel art with nearest-neighbor sampling.
 *
 * This ensures that scaled pixel art remains crisp and blocky,
 * rather than becoming blurry from bilinear filtering.
 *
 * @example
 * // Local asset
 * <PixelImage
 *   source={require("@/assets/images/sprites/companion_idle.png")}
 *   width={128}
 *   height={128}
 * />
 *
 * // Remote URI
 * <PixelImage
 *   source="https://example.com/sprite.png"
 *   width={64}
 *   height={64}
 * />
 */
export function PixelImage({
  source,
  width,
  height,
  x = 0,
  y = 0,
  style,
  debug = false,
}: PixelImageProps) {
  // Handle different source types
  const image = useImage(typeof source === "number" || typeof source === "string" ? source : null)

  // If source is already an SkImage, use it directly
  const displayImage = typeof source === "object" && "width" in source ? source : image

  // Show nothing while loading
  if (!displayImage) {
    return (
      <View style={[{ width, height }, style, debug && styles.debugBorder]}>
        {/* Placeholder while loading */}
      </View>
    )
  }

  return (
    <View style={[{ width, height }, style, debug && styles.debugBorder]}>
      <Canvas style={styles.canvas}>
        <Image
          image={displayImage}
          x={x}
          y={y}
          width={width}
          height={height}
          // CRITICAL: Nearest-neighbor sampling for pixel art
          sampling={{
            filter: FilterMode.Nearest,
            mipmap: MipmapMode.None,
          }}
        />
      </Canvas>
    </View>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SPRITE SHEET COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface PixelSpriteProps extends Omit<PixelImageProps, "x" | "y"> {
  /**
   * Frame index in the sprite sheet (0-based).
   */
  frame: number

  /**
   * Number of columns in the sprite sheet.
   */
  columns: number

  /**
   * Width of a single frame in the sprite sheet.
   */
  frameWidth: number

  /**
   * Height of a single frame in the sprite sheet.
   */
  frameHeight: number
}

/**
 * PixelSprite renders a specific frame from a sprite sheet.
 *
 * @example
 * <PixelSprite
 *   source={require("@/assets/images/sprites/companion_sheet.png")}
 *   frame={currentFrame}
 *   columns={4}
 *   frameWidth={32}
 *   frameHeight={32}
 *   width={128}
 *   height={128}
 * />
 */
export function PixelSprite({
  source,
  frame,
  columns,
  frameWidth,
  frameHeight,
  width,
  height,
  style,
  debug,
}: PixelSpriteProps) {
  const image = useImage(typeof source === "number" || typeof source === "string" ? source : null)

  if (!image) {
    return <View style={[{ width, height }, style]} />
  }

  // Calculate source rectangle for the frame
  const col = frame % columns
  const row = Math.floor(frame / columns)
  const srcX = col * frameWidth
  const srcY = row * frameHeight

  // Create a clip to show only the current frame
  // This is a simplified approach - for complex sprites, consider using Skia shaders
  const scaleX = width / frameWidth
  const scaleY = height / frameHeight

  return (
    <View style={[{ width, height, overflow: "hidden" }, style, debug && styles.debugBorder]}>
      <Canvas style={[styles.canvas, { width: width * columns, height: height * Math.ceil(image.height() / frameHeight) }]}>
        <Image
          image={image}
          x={-srcX * scaleX}
          y={-srcY * scaleY}
          width={image.width() * scaleX}
          height={image.height() * scaleY}
          sampling={{
            filter: FilterMode.Nearest,
            mipmap: MipmapMode.None,
          }}
        />
      </Canvas>
    </View>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
  debugBorder: {
    borderWidth: 1,
    borderColor: "red",
  },
})
