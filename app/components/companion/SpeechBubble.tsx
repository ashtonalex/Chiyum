import React, { useEffect } from "react"
import { View, ViewStyle, Text as RNText, TextStyle } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated"
import { useAppTheme } from "@/theme/context"
import { colors } from "@/theme/colors"

interface SpeechBubbleProps {
  text: string
}

const BUBBLE_WIDTH = 180
const BUBBLE_HEIGHT = 80
const TAIL_SIZE = 12

export const SpeechBubble = ({ text }: SpeechBubbleProps) => {
  const { theme } = useAppTheme()
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.5)

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 })
    scale.value = withSpring(1, { damping: 12 })
  }, [])

  const $animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View style={[$container, $animatedStyle]}>
      {/* Main Bubble */}
      <View style={$bubble}>
        <View style={$textContainer}>
            <RNText style={[$text, { fontFamily: theme.typography.pixel.normal }]}>
            {text}
            </RNText>
        </View>
      </View>

      {/* Tail - Rotated Square method */}
      <View style={$tailContainer}>
        <View style={$tail} />
        {/* Cover the top border of the tail to merge with bubble */}
        <View style={$tailCover} /> 
      </View>
    </Animated.View>
  )
}

const $container: ViewStyle = {
  width: BUBBLE_WIDTH,
  minHeight: BUBBLE_HEIGHT, 
  alignItems: "center",
  justifyContent: "center",
  marginBottom: TAIL_SIZE, // Make room for tail
}

const $bubble: ViewStyle = {
  backgroundColor: "white",
  borderColor: "#2D2D2D",
  borderWidth: 2,
  borderRadius: 16,
  padding: 10,
  minWidth: BUBBLE_WIDTH,
  minHeight: BUBBLE_HEIGHT,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}

const $textContainer: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

const $text: TextStyle = {
  fontSize: 10,
  color: "#333",
  textAlign: "center",
  lineHeight: 14,
}

const $tailContainer: ViewStyle = {
    position: "absolute",
    bottom: -TAIL_SIZE / 2 - 2, // Adjust needed based on exact geometry
    height: TAIL_SIZE * 2,
    width: TAIL_SIZE * 2,
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 1,
}

const $tail: ViewStyle = {
    width: TAIL_SIZE * 1.5,
    height: TAIL_SIZE * 1.5,
    backgroundColor: "white",
    borderColor: "#2D2D2D",
    borderWidth: 2,
    transform: [{ rotate: "45deg" }],
}

const $tailCover: ViewStyle = {
    position: "absolute",
    top: 0,
    width: TAIL_SIZE * 2,
    height: TAIL_SIZE,
    backgroundColor: "white",
    marginBottom: -2, // Push it down slightly
}
