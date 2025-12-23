import React, { useEffect } from "react"
import { Pressable, ViewStyle, TextStyle } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from "react-native-reanimated"
import { Text } from "./Text"
import { colors } from "../theme/colors"
import { spacing, pixelSpacing } from "../theme/spacing"

interface MoodCardProps {
  mood: string
  emoji: string
  selected: boolean
  onPress: () => void
  color: string
}

export const MoodCard = ({ mood, emoji, selected, onPress, color }: MoodCardProps) => {
  const scale = useSharedValue(1)
  const animColor = useSharedValue(0)

  useEffect(() => {
    scale.value = withSpring(selected ? 1.1 : 1, { damping: 12, stiffness: 90 })
    animColor.value = withSpring(selected ? 1 : 0)
  }, [selected])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      borderColor: interpolateColor(
        animColor.value,
        [0, 1],
        [colors.border, color] // Transition from dark charcoal to mood color
      ),
    }
  })

  // Static styles
  const CARD_STYLE: ViewStyle = {
    width: 80,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: pixelSpacing.borderWidth,
    borderRadius: 0, // strict pixel look
    marginHorizontal: spacing.sm,
    // Hard Pixel Shadow
    shadowColor: colors.shadow.default,
    shadowOffset: { width: pixelSpacing.shadowOffset, height: pixelSpacing.shadowOffset },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  }

  const TEXT_STYLE: TextStyle = {
    fontFamily: "PressStart2P-Regular",
    fontSize: 10,
    marginTop: spacing.sm,
    color: colors.text,
  }

  const EMOJI_STYLE: TextStyle = {
    fontSize: 32,
  }

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[CARD_STYLE, animatedStyle]}
    >
      <Text style={EMOJI_STYLE} text={emoji} />
      <Text style={TEXT_STYLE} text={mood} />
    </AnimatedPressable>
  )
}
