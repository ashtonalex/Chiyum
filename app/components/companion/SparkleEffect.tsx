import React, { useEffect } from "react"
import { View, StyleSheet, Text } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSequence } from "react-native-reanimated"

const Sparkle = ({ delay, x, y, size = 10 }: { delay: number, x: number, y: number, size?: number }) => {
  const scale = useSharedValue(0)
  const opacity = useSharedValue(0)
  const rotation = useSharedValue(0)

  useEffect(() => {
    setTimeout(() => {
        scale.value = withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0, { duration: 400 })
        )
        opacity.value = withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0, { duration: 600 })
        )
        rotation.value = withTiming(180, { duration: 800 })
    }, delay)
  }, [])

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: x,
    top: y,
    opacity: opacity.value,
    transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` } // Correct rotation string interpolation
    ]
  }))

  return (
    <Animated.View style={style}>
       {/* Simple SVG star or just a text star */}
       <Text style={{ fontSize: size }}>✨</Text>
    </Animated.View>
  )
}

const NUM_SPARKLES = 6

interface SparkleEffectProps {
    trigger?: number // Increment this to trigger animation
}

export const SparkleEffect = ({ trigger = 0 }: SparkleEffectProps) => {
    // Generate random sparkles - regenerate on each trigger
    const sparkles = Array.from({ length: NUM_SPARKLES }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 60, // Relative to center
        y: (Math.random() - 0.5) * 60,
        delay: Math.random() * 500,
        size: 15 + Math.random() * 10
    }))

    // Only render sparkles when trigger > 0
    if (trigger === 0) return null

    return (
        <View key={trigger} style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
            {sparkles.map(s => (
                <Sparkle key={s.id} {...s} />
            ))}
        </View>
    )
}
