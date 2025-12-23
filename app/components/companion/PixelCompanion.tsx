import React, { useEffect } from "react"
import { Image, ImageStyle, Pressable, View, ViewStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  cancelAnimation,
} from "react-native-reanimated"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models/RootStoreContext"
import { useAppTheme } from "@/theme/context"
import { SpeechBubble } from "./SpeechBubble"

const sprites = {
  idle: require("@assets/images/sprites/companion_idle.png"),
  happy: require("@assets/images/sprites/companion_happy.png"),
  sad: require("@assets/images/sprites/companion_sad.png"),
  anxious: require("@assets/images/sprites/companion_anxious.png"),
  excited: require("@assets/images/sprites/companion_excited.png"),
  thinking: require("@assets/images/sprites/companion_thinking.png"),
  companion_idle: require("@assets/images/sprites/companion_idle.png"),
  companion_happy: require("@assets/images/sprites/companion_happy.png"),
  companion_sad: require("@assets/images/sprites/companion_sad.png"),
  companion_anxious: require("@assets/images/sprites/companion_anxious.png"),
  companion_excited: require("@assets/images/sprites/companion_excited.png"),
  companion_thinking: require("@assets/images/sprites/companion_thinking.png"),
}

export const PixelCompanion = observer(function PixelCompanion() {
  const { companionStore } = useStores()
  const { themed } = useAppTheme()
  
  // Animation values
  const scaleY = useSharedValue(1)
  const translateY = useSharedValue(0)
  const translateX = useSharedValue(0)

  // Start idle breathing animation
  useEffect(() => {
    if (companionStore.moodState === "idle") {
      scaleY.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true
      )
    } else {
      cancelAnimation(scaleY)
      scaleY.value = withSpring(1)
    }

    if (companionStore.moodState === "happy" || companionStore.moodState === "excited") {
      translateY.value = withSequence(
        withSpring(-10, { damping: 5 }),
        withSpring(0)
      )
    }

    if (companionStore.moodState === "anxious") {
      translateX.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 50 }),
          withTiming(2, { duration: 50 }),
          withTiming(0, { duration: 50 })
        ),
        -1,
        false
      )
    } else {
      translateX.value = withSpring(0)
    }
  }, [companionStore.moodState])

  const $animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleY: scaleY.value },
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }))

  const handlePress = () => {
    companionStore.poke()
  }

  // Determine which sprite to show
  // The store returns keys like "companion_idle", but we map them to our require() objects
  const spriteSource = sprites[companionStore.spriteForMood as keyof typeof sprites] || sprites.idle

  return (
    <View style={themed($container)}>
      {companionStore.isBubbleVisible && (
        <View style={themed($bubbleContainer)}>
          <SpeechBubble text={companionStore.currentMessage} />
        </View>
      )}
      
      <Pressable onPress={handlePress}>
        <Animated.View style={[$spriteContainer, $animatedStyle]}>
          <Image 
            source={spriteSource} 
            style={$sprite} 
            resizeMode="contain" 
          />
        </Animated.View>
      </Pressable>
    </View>
  )
})

const $container: ViewStyle = {
  alignItems: "center",
  justifyContent: "flex-end",
  height: 150,
}

const $bubbleContainer: ViewStyle = {
  position: "absolute",
  bottom: 80, // Reduced to account for 2.5x parent scale - prevents overflow above screen
  zIndex: 10,
  maxHeight: 150, // Match MAX_BUBBLE_HEIGHT from SpeechBubble
  overflow: "visible", // Prevent any overflow
}

const $spriteContainer: ViewStyle = {
  width: 80,
  height: 80,
  justifyContent: "center",
  alignItems: "center",
}

const $sprite: ImageStyle = {
  width: "100%",
  height: "100%",
}
