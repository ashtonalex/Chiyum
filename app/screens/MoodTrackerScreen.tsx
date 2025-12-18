import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, ScrollView, Alert } from "react-native"
import * as Haptics from "expo-haptics"
// import Animated, { useSharedValue, withSequence, withSpring, runOnJS } from "react-native-reanimated"

import { Button } from "../components/Button"
import { Screen } from "../components/Screen"
import { Text } from "../components/Text"
import { MoodCard } from "../components/MoodCard"
import { SteppedSlider } from "../components/SteppedSlider"
import { PixelCompanion } from "../components/companion/PixelCompanion"
import { SparkleEffect } from "../components/companion/SparkleEffect"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators/navigationTypes"
import { colors } from "../theme/colors"
import { spacing, pixelSpacing } from "../theme/spacing"

interface MoodTrackerScreenProps extends AppStackScreenProps<"MoodTracker"> {}

const MOODS = [
  { id: "Happy", emoji: "😊", color: colors.palette.sageGreen },
  { id: "Excited", emoji: "🤩", color: colors.palette.mintyTeal },
  { id: "Neutral", emoji: "😐", color: colors.palette.neutral400 },
  { id: "Sad", emoji: "😢", color: colors.palette.softSalmon },
  { id: "Tired", emoji: "😴", color: colors.palette.mutedLavender },
  { id: "Anxious", emoji: "😰", color: colors.palette.softSalmon },
  { id: "Stressed", emoji: "😫", color: colors.palette.angry500 },
]

export const MoodTrackerScreen: FC<MoodTrackerScreenProps> = observer(function MoodTrackerScreen({
  navigation,
}) {
  const { companionStore } = useStores()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(3)
  const [showSparkles, setShowSparkles] = useState(false)

  // Reset companion bubble on mount
  useEffect(() => {
    companionStore.hideBubble()
  }, [])

  const handleMoodSelect = (moodId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setSelectedMood(moodId)
    // Update companion mood instantly for visual feedback
    companionStore.reactToMood(moodId)
  }

  const handleSave = async () => {
    if (!selectedMood) {
      Alert.alert("Wait!", "Please select a mood first.")
      return
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setShowSparkles(true)
    
    // Trigger AI response
    await companionStore.fetchAIResponse(selectedMood)

    setTimeout(() => {
        Alert.alert("Mood Saved", "Your partner will see how you feel!", [
            { text: "OK", onPress: () => navigation.goBack() }
        ])
    }, 1000) // Delay alert to let sparkles show
  }

  const HEADER_CONTAINER: ViewStyle = {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: pixelSpacing.borderWidth,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }

  const SECTION_TITLE: ViewStyle = {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  }

  const SCROLL_CONTAINER: ViewStyle = {
    paddingHorizontal: spacing.md, 
    paddingBottom: spacing.sm,
  }

  const COMPANION_CONTAINER: ViewStyle = {
    position: "absolute",
    top: spacing.md,
    right: spacing.lg,
    zIndex: 10,
    alignItems: "flex-end", // Align bubble to right
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top", "bottom"]} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      
      {/* Header with Washi Tape Look */}
      <View style={HEADER_CONTAINER}>
        <View>
            <Text preset="heading" text="Mood Tracker" />
            <Text text="How are you feeling?" size="xs" style={{ fontFamily: "PressStart2P-Regular", marginTop: spacing.xs }} />
        </View>
        {/* Companion Placeholder Area (Visual Logic handled by Absolute View below) */}
        <View style={{ width: 64, height: 64 }} /> 
      </View>

      {/* Floating Companion */}
      <View style={COMPANION_CONTAINER}>
          <PixelCompanion />
      </View>

      <Text text="Select Mood" preset="bold" style={SECTION_TITLE} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={SCROLL_CONTAINER}>
        {MOODS.map((m) => (
          <MoodCard
            key={m.id}
            mood={m.id}
            emoji={m.emoji}
            color={m.color}
            selected={selectedMood === m.id}
            onPress={() => handleMoodSelect(m.id)}
          />
        ))}
      </ScrollView>

      <Text text="Intensity" preset="bold" style={SECTION_TITLE} />
      <View style={{ paddingHorizontal: spacing.lg }}>
        <SteppedSlider value={intensity} onValueChange={setIntensity} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing.xs }}>
             <Text text="Low" size="xxs" style={{ fontFamily: "PressStart2P-Regular" }} />
             <Text text="High" size="xxs" style={{ fontFamily: "PressStart2P-Regular" }} />
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xxl }}>
        <Button
            text="Save Mood"
            preset="reversed"
            onPress={handleSave}
            style={{ 
                borderWidth: pixelSpacing.borderWidth, 
                borderColor: colors.border,
                borderRadius: 0,
                shadowColor: colors.shadow.default,
                shadowOffset: { width: pixelSpacing.shadowOffset, height: pixelSpacing.shadowOffset },
                shadowOpacity: 1,
                shadowRadius: 0,
                elevation: 0,
            }}
            textStyle={{ fontFamily: "PressStart2P-Regular", fontSize: 12 }}
        />
      </View>

      {showSparkles && <SparkleEffect />}
    </Screen>
  )
})
