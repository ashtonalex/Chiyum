import React, { useState, useEffect } from "react"
import { View, ViewStyle, TouchableOpacity, LayoutChangeEvent } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { Text } from "./Text"
import { colors } from "../theme/colors"
import { spacing, pixelSpacing } from "../theme/spacing"

interface SteppedSliderProps {
  value: number // 1 to 5
  onValueChange: (value: number) => void
  min?: number
  max?: number
}

// "Loading Bar" segments
const TOTAL_SEGMENTS = 5

export const SteppedSlider = ({ value, onValueChange, min = 1, max = 5 }: SteppedSliderProps) => {
  const [width, setWidth] = useState(0)
  const thumbX = useSharedValue(0)

  // Calculate segment width based on total width
  const segmentWidth = width / TOTAL_SEGMENTS

  useEffect(() => {
    if (width > 0) {
      // Calculate position for center of the selected segment
      const targetX = (value - 1) * segmentWidth + segmentWidth / 2 - pixelSpacing.iconSize / 2
      thumbX.value = withSpring(targetX, { damping: 12, stiffness: 90 })
    }
  }, [value, width])

  const handleLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width)
  }

  const handlePress = (index: number) => {
    onValueChange(index + 1)
  }

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }))

  const CONTAINER_STYLE: ViewStyle = {
    height: 40,
    justifyContent: "center",
  }

  const TRACK_STYLE: ViewStyle = {
    flexDirection: "row",
    height: 16,
    width: "100%",
    backgroundColor: colors.backgroundSecondary,
    borderWidth: pixelSpacing.borderWidth,
    borderColor: colors.border,
  }

  const SEGMENT_STYLE: ViewStyle = {
    flex: 1,
    borderRightWidth: pixelSpacing.borderWidth,
    borderRightColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  }

  // Pixel Thumb (Star)
  const THUMB_STYLE: ViewStyle = {
    position: "absolute",
    top: -8, // Center vertically over track (40 height container, 16 track height -> top -8 approx)
    left: 0,
    width: pixelSpacing.iconSize, // 24
    height: pixelSpacing.iconSize,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  }

  const STAR_TEXT: ViewStyle = {
      // Small adjustment to center star visually
      marginTop: -2,
  }

  return (
    <View style={CONTAINER_STYLE}>
      {/* Slider Track with Segments */}
      <View style={TRACK_STYLE} onLayout={handleLayout}>
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              SEGMENT_STYLE,
              {
                backgroundColor: index + 1 <= value ? colors.tint : "transparent",
                borderRightWidth: index === TOTAL_SEGMENTS - 1 ? 0 : pixelSpacing.borderWidth,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => handlePress(index)}
          />
        ))}
      </View>

      {/* Animated Thumb */}
      <Animated.View style={[THUMB_STYLE, thumbAnimatedStyle]}>
        <Text text="★" style={{ fontSize: 20, color: colors.palette.angry500 }} />
      </Animated.View>
    </View>
  )
}
