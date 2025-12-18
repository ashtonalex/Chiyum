import React, { useEffect } from "react"
import { View, ViewStyle, Text as RNText, TextStyle, Dimensions } from "react-native"
import { Canvas, RoundedRect, Path, Shadow } from "@shopify/react-native-skia"
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated"
import { useAppTheme } from "@/theme/context"

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

  // Create path for the little tail
  const tailPath = `M ${BUBBLE_WIDTH / 2 - TAIL_SIZE} ${BUBBLE_HEIGHT} L ${BUBBLE_WIDTH / 2} ${BUBBLE_HEIGHT + TAIL_SIZE} L ${BUBBLE_WIDTH / 2 + TAIL_SIZE} ${BUBBLE_HEIGHT} Z`

  return (
    <Animated.View style={[$container, $animatedStyle]}>
      <View style={$skiaContainer}>
        <Canvas style={{ flex: 1 }}>
          <RoundedRect
            x={0}
            y={0}
            width={BUBBLE_WIDTH}
            height={BUBBLE_HEIGHT}
            r={16}
            color="white"
          >
            <Shadow dx={0} dy={2} blur={4} color="rgba(0,0,0,0.1)" />
            <Shadow dx={0} dy={0} blur={0} color="#333" inner /> 
            {/* Border simulation via inner shadow or double rect - let's keep it simple with just white rect for now and border via SVG/Path if needed. 
                Actually, spec said "2px dark charcoal border". 
                We can draw a larger black rect behind or use stroke.
            */}
          </RoundedRect>
          
          {/* Border */}
          <Path
            path={`M 16 0 H ${BUBBLE_WIDTH-16} Q ${BUBBLE_WIDTH} 0 ${BUBBLE_WIDTH} 16 V ${BUBBLE_HEIGHT-16} Q ${BUBBLE_WIDTH} ${BUBBLE_HEIGHT} ${BUBBLE_WIDTH-16} ${BUBBLE_HEIGHT} H 16 Q 0 ${BUBBLE_HEIGHT} 0 ${BUBBLE_HEIGHT-16} V 16 Q 0 0 16 0 Z`}
            style="stroke"
            strokeWidth={2}
            color="#2D2D2D"
          />
          
          {/* Tail */}
          <Path path={tailPath} color="white" />
          <Path path={tailPath} style="stroke" strokeWidth={2} color="#2D2D2D" />
          
          {/* Cover the tail stroke connection line with a white patch if needed, but simple overlap is fine for pixel art style */}
        </Canvas>
      </View>
      
      <View style={$textContainer}>
        <RNText style={[$text, { fontFamily: theme.typography.pixel.normal }]}>
          {text}
        </RNText>
      </View>
    </Animated.View>
  )
}

const $container: ViewStyle = {
  width: BUBBLE_WIDTH,
  height: BUBBLE_HEIGHT + TAIL_SIZE,
  alignItems: "center",
  justifyContent: "center",
}

const $skiaContainer: ViewStyle = {
  ...Dimensions.get("window"), // Or absolute fill
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: BUBBLE_WIDTH + 2, // slight padding for border
  height: BUBBLE_HEIGHT + TAIL_SIZE + 2,
}

const $textContainer: ViewStyle = {
  width: BUBBLE_WIDTH - 24,
  height: BUBBLE_HEIGHT,
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: 4, // Center vertically considering tail is outside
}

const $text: TextStyle = {
  fontSize: 10,
  color: "#333",
  textAlign: "center",
  lineHeight: 14,
}
