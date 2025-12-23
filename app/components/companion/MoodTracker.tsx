import React from "react"
import { View, ViewStyle, ScrollView, Pressable, Image, ImageStyle, TextStyle } from "react-native"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models/RootStoreContext"
import { MoodLevel } from "@/models/MoodStore"

const MOODS = [
  { label: "Happy", emoji: "😊", level: "Happy" },
  { label: "Excited", emoji: "🤩", level: "Excited" },
  { label: "Neutral", emoji: "😐", level: "Neutral" },
  { label: "Sad", emoji: "😢", level: "Sad" },
  { label: "Tired", emoji: "😴", level: "Tired" },
  { label: "Anxious", emoji: "😰", level: "Anxious" },
  { label: "Stressed", emoji: "😫", level: "Stressed" },
]

export const MoodTracker = observer(function MoodTracker() {
  const { themed } = useAppTheme()
  const { moodStore, companionStore } = useStores()

  const handleMoodSelect = (level: string) => {
    moodStore.addMood(level)
    companionStore.reactToMood(level)
    
    // Trigger AI response for the mood
    if (companionStore.fetchAIResponse) {
        companionStore.fetchAIResponse(level)
    }
  }

  return (
    <View style={themed($container)}>
      <Text preset="subheading" text="How are you feeling?" style={themed($title)} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={$scrollContent}>
        {MOODS.map((mood) => (
          <Pressable
            key={mood.label}
            style={({ pressed }) => [
              themed($moodButton),
              pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
              moodStore.lastEntry?.level === mood.level && themed($activeMood),
            ]}
            onPress={() => handleMoodSelect(mood.level)}
          >
            <Text text={mood.emoji} style={$emoji} />
            <Text 
              text={mood.label} 
              size="xs" 
              style={[
                themed($label),
                moodStore.lastEntry?.level === mood.level && { color: "#FF6B6B" }
              ]} 
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
})

const $container: ViewStyle = {
  marginBottom: 24,
}

const $title: TextStyle = {
  marginBottom: 12,
  paddingHorizontal: 24,
}

const $scrollContent: ViewStyle = {
  paddingHorizontal: 16,
}

const $moodButton: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  borderRadius: 12,
  padding: 12,
  marginHorizontal: 8,
  minWidth: 70,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
  borderWidth: 1,
  borderColor: "transparent",
}

const $activeMood: ViewStyle = {
  borderColor: "#FF6B6B", // Use theme color ideally
  backgroundColor: "#FFF0F0",
}

const $emoji: TextStyle = {
  fontSize: 24,
  marginBottom: 4,
}

const $label: TextStyle = {
  opacity: 0.8,
}
