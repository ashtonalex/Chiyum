import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native"
import { Modal, Portal, Button as PaperButton, TextInput, Text as PaperText } from "react-native-paper"
import * as Haptics from "expo-haptics"
// import Animated, { useSharedValue, withSequence, withSpring, runOnJS } from "react-native-reanimated"

import { Screen } from "../components/Screen"
import { Text } from "../components/Text"
import { PixelCompanion } from "../components/companion/PixelCompanion"
import { SparkleEffect } from "../components/companion/SparkleEffect"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators/navigationTypes"
import { colors } from "../theme/colors"
import { spacing, pixelSpacing } from "../theme/spacing"

interface MoodTrackerScreenProps extends AppStackScreenProps<"MoodTracker"> {}

const MOODS = [
  { id: "Happy", emoji: "😊", color: colors.palette.sageGreen, sprite: "happy" },
  { id: "Excited", emoji: "🤩", color: colors.palette.mintyTeal, sprite: "excited" },
  { id: "Neutral", emoji: "😐", color: colors.palette.neutral400, sprite: "idle" },
  { id: "Sad", emoji: "😢", color: colors.palette.softSalmon, sprite: "sad" },
  { id: "Anxious", emoji: "😰", color: colors.palette.softSalmon, sprite: "anxious" },
//   { id: "Tired", emoji: "😴", color: colors.palette.mutedLavender },
//   { id: "Stressed", emoji: "😫", color: colors.palette.angry500 },
]

export const MoodTrackerScreen: FC<MoodTrackerScreenProps> = observer(function MoodTrackerScreen({
  navigation,
}) {
  const { companionStore } = useStores()
  const [chatMessage, setChatMessage] = useState("")
  const [isMoodModalVisible, setMoodModalVisible] = useState(false)
  
  // Dimensions for responsive sprite sizing
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
  // 30% of screen height/width roughly, keeping aspect ratio? 
  // Let's target 30% of screen height for the companion area
  const spriteSize = screenHeight * 0.3

  useEffect(() => {
    companionStore.hideBubble()
    // Reset to idle or keep current? Let's keep current state
  }, [])

  const handleMoodSelect = (moodId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    companionStore.reactToMood(moodId)
    setMoodModalVisible(false)

    // Optional: Trigger specific response for mood? 
    // The store reactToMood sets the sprite. 
    // Maybe trigger an AI response "Oh you're happy!"?
    companionStore.fetchAIResponse(moodId)
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    Haptics.selectionAsync()
    companionStore.chatWithCompanion(chatMessage)
    setChatMessage("")
  }

  const HEADER_CONTAINER: ViewStyle = {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: pixelSpacing.borderWidth,
    borderBottomColor: colors.border,
    alignItems: "center",
  }

  const CONTENT_CONTAINER: ViewStyle = {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    marginTop: 100,
  }

  const COMPANION_CONTAINER: ViewStyle = {
    height: spriteSize,
    width: "100%", // Take full width to center allow helper views
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.xl,
    zIndex: 10,
  }

  const INPUT_CONTAINER: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: spacing.sm,
  }

  const MODAL_CONTENT: ViewStyle = {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
  }

  const MOOD_ITEM: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: colors.palette.neutral200,
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} style={{ backgroundColor: colors.background }}>
      
      {/* Header */}
      <View style={HEADER_CONTAINER}>
        <Text preset="heading" text="Chubb's Corner" style={{ color: colors.palette.primary500 }} />
      </View>

      <View style={CONTENT_CONTAINER}>
          
          {/* Companion Area */}
          <View style={COMPANION_CONTAINER}>
             {/* We rely on PixelCompanion to render the sprite. 
                 It has internal Fixed sizing styles usually, we might need to override them 
                 or wrap it in a transform for scaling if it doesn't support props. 
                 Let's check PixelCompanion again. It uses fixed sizes. 
                 Since we can't easily pass props without editing it, let's scale the view.
             */}
             <View style={{ transform: [{ scale: 2.5 }] }}> 
                <PixelCompanion />
             </View>
          </View>

          {/* Controls */}
          <View style={{ width: "100%", paddingBottom: spacing.xxl }}>
            
            {/* Mood Button */}
            <PaperButton 
                mode="elevated" 
                onPress={() => setMoodModalVisible(true)}
                style={{ marginBottom: spacing.lg, borderColor: colors.border }}
                contentStyle={{ paddingVertical: spacing.xs }}
                icon="emoticon-outline"
                textColor={colors.palette.primary500}
                buttonColor={colors.palette.neutral100}
            >
                How do you feel?
            </PaperButton>

            {/* Chat Input */}
            <View style={INPUT_CONTAINER}>
                <TextInput
                    mode="outlined"
                    placeholder="Say something to Chubbs!"
                    value={chatMessage}
                    onChangeText={setChatMessage}
                    style={{ flex: 1, backgroundColor: "white", fontSize: 14 }}
                    outlineColor={colors.border}
                    activeOutlineColor={colors.palette.primary500}
                    textColor="black"
                    dense
                    onSubmitEditing={handleSendMessage}
                />
                <PaperButton 
                    mode="contained" 
                    onPress={handleSendMessage}
                    style={{ marginLeft: spacing.sm, borderRadius: 4 }}
                    buttonColor={colors.palette.primary500}
                    compact
                    disabled={companionStore.isThinking}
                >
                    Send
                </PaperButton>
            </View>

          </View>

      </View>

      {/* Mood Selector Modal */}
      <Portal>
        <Modal visible={isMoodModalVisible} onDismiss={() => setMoodModalVisible(false)} contentContainerStyle={MODAL_CONTENT}>
          <Text preset="subheading" text="How are you feeling?" style={{ marginBottom: spacing.md }} />
          <ScrollView style={{ width: "100%", maxHeight: 300 }}>
             {MOODS.map(mood => (
                 <TouchableOpacity key={mood.id} onPress={() => handleMoodSelect(mood.id)} style={MOOD_ITEM}>
                     <Text text={mood.emoji} size="xl" style={{ marginRight: spacing.md }} />
                     <Text text={mood.id} preset="bold" />
                 </TouchableOpacity>
             ))}
          </ScrollView>
          <PaperButton onPress={() => setMoodModalVisible(false)} style={{ marginTop: spacing.md }}>
              Cancel
          </PaperButton>
        </Modal>
      </Portal>

    </Screen>
  )
})
