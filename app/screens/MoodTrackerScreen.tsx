import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native"
import { Modal, Portal, Button as PaperButton, TextInput, Text as PaperText } from "react-native-paper"
import { useRoute } from "@react-navigation/native"
import * as Haptics from "expo-haptics"
// import Animated, { useSharedValue, withSequence, withSpring, runOnJS } from "react-native-reanimated"

import { Screen } from "../components/Screen"
import { Text } from "../components/Text"
import { BottomNavBar, NavItem } from "../components/BottomNavBar"
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

const NAV_ITEMS: NavItem[] = [
  { route: "Dashboard", label: "Home", icon: "🏠", color: colors.palette.mintyTeal },
  { route: "MoodTracker", label: "Mood", icon: "💭", color: colors.palette.mutedLavender },
  { route: "PhotoAlbum", label: "Photos", icon: "📷", color: colors.palette.sageGreen },
]

export const MoodTrackerScreen: FC<MoodTrackerScreenProps> = observer(function MoodTrackerScreen({
  navigation,
}) {
  const { companionStore } = useStores()
  const route = useRoute()
  const [chatMessage, setChatMessage] = useState("")
  const [isMoodModalVisible, setMoodModalVisible] = useState(false)
  const [sparkleTrigger, setSparkleTrigger] = useState(0)
  
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

  const handleCompanionPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setSparkleTrigger(prev => prev + 1) // Increment to trigger sparkle animation
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
    marginTop: 220, 
    paddingBottom: 90, // Space for bottom navigation bar
  }

  const COMPANION_CONTAINER: ViewStyle = {
    height: spriteSize,
    width: "100%", // Take full width to center allow helper views
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.xl,
    zIndex: 10,
    overflow: "visible", // Allow speech bubble to overflow this container
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
             <TouchableOpacity onPress={handleCompanionPress} activeOpacity={0.8}>
               <View style={{ transform: [{ scale: 2.5 }] }}> 
                  <PixelCompanion />
               </View>
             </TouchableOpacity>
             {/* Sparkle Effect Overlay - triggers on companion click */}
             <SparkleEffect trigger={sparkleTrigger} />
          </View>

          {/* Controls */}
          <View style={{ width: "100%", paddingBottom: spacing.xxl }}>
            
            {/* Mood Button */}
            <PaperButton 
                mode="contained" 
                onPress={() => setMoodModalVisible(true)}
                style={{ 
                  marginBottom: spacing.lg, 
                  borderRadius: 0,
                  borderWidth: pixelSpacing.borderWidth,
                  borderColor: colors.border,
                  // Hard pixel shadow
                  shadowColor: colors.shadow.lavender,
                  shadowOffset: { width: pixelSpacing.shadowOffset, height: pixelSpacing.shadowOffset },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                  elevation: 0,
                }}
                contentStyle={{ 
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                }}
                labelStyle={{
                  fontFamily: "pressStart2P",
                  fontSize: 12,
                  letterSpacing: 0,
                }}
                icon="emoticon-outline"
                textColor={colors.text}
                buttonColor={colors.palette.mutedLavender}
            >
                How do you feel?
            </PaperButton>

            {/* Chat Input */}
            <View style={INPUT_CONTAINER}>
                <TextInput
                    mode="outlined"
                    placeholder="Say something to Chubbs!"
                    placeholderTextColor={colors.textDim}
                    value={chatMessage}
                    onChangeText={setChatMessage}
                    style={{ 
                      flex: 1, 
                      backgroundColor: colors.surface,
                      fontSize: 16,
                      fontFamily: "pressStart2P",
                      // Hard pixel shadow
                      shadowColor: colors.shadow.default,
                      shadowOffset: { width: pixelSpacing.shadowOffset, height: pixelSpacing.shadowOffset },
                      shadowOpacity: 1,
                      shadowRadius: 0,
                      elevation: 0,
                    }}
                    outlineStyle={{
                      borderWidth: pixelSpacing.borderWidth,
                      borderRadius: 0,
                    }}
                    outlineColor={colors.border}
                    activeOutlineColor={colors.palette.mintyTeal}
                    textColor={colors.text}
                    onSubmitEditing={handleSendMessage}
                />
                <PaperButton 
                    mode="contained" 
                    onPress={handleSendMessage}
                    style={{ 
                      marginLeft: spacing.sm, 
                      borderRadius: 0,
                      borderWidth: pixelSpacing.borderWidth,
                      borderColor: colors.border,
                      // Hard pixel shadow
                      shadowColor: colors.shadow.teal,
                      shadowOffset: { width: pixelSpacing.shadowOffset, height: pixelSpacing.shadowOffset },
                      shadowOpacity: 1,
                      shadowRadius: 0,
                      elevation: 0,
                    }}
                    contentStyle={{ 
                      paddingVertical: spacing.xs,
                      paddingHorizontal: spacing.md,
                    }}
                    labelStyle={{
                      fontFamily: "pressStart2P",
                      fontSize: 12,
                      letterSpacing: 0,
                    }}
                    buttonColor={colors.palette.mintyTeal}
                    textColor={colors.text}
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
          <Text preset="subheading" text="How are you feeling?" style={{ marginBottom: spacing.md, color: colors.text }} />
          <ScrollView style={{ width: "100%", maxHeight: 300 }}>
             {MOODS.map(mood => (
                 <TouchableOpacity key={mood.id} onPress={() => handleMoodSelect(mood.id)} style={MOOD_ITEM}>
                     <Text text={mood.emoji} size="xl" style={{ marginRight: spacing.md }} />
                     <Text 
                       text={mood.id} 
                       preset="bold" 
                       style={{
                         color: companionStore.moodState === mood.sprite ? mood.color : colors.text
                       }}
                     />
                 </TouchableOpacity>
             ))}
          </ScrollView>
          <PaperButton onPress={() => setMoodModalVisible(false)} style={{ marginTop: spacing.md }}>
              Cancel
          </PaperButton>
        </Modal>
      </Portal>

      {/* Bottom Navigation */}
      <BottomNavBar items={NAV_ITEMS} activeRoute={route.name} />

    </Screen>
  )
})
