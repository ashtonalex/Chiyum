import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, ScrollView, Image, ImageBackground, TouchableOpacity, Dimensions } from "react-native"
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
import { typography } from "../theme/typography"

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
  
  // Dimensions for responsive layout
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
  
  // Responsive scale for companion - larger on bigger screens, clamped to reasonable range
  const companionScale = Math.max(1.5, Math.min(3, Math.min(screenWidth, screenHeight) / 300))
  
  // Responsive spacing calculations
  const navBarHeight = screenHeight * 0.1 // Approximate nav bar height (~10%)
  const modalMaxHeight = screenHeight * 0.4 // 40% of screen for modal content
  const modalPadding = Math.max(16, screenWidth * 0.05) // 5% of screen width, min 16
  const modalMargin = Math.max(16, screenWidth * 0.05) // 5% of screen width, min 16

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
    width: "100%",
    zIndex: 100,
  }

  const CONTENT_CONTAINER: ViewStyle = {
    alignItems: "center",
    justifyContent: "flex-end", // Align content to bottom if space permits
    paddingHorizontal: screenWidth * 0.05,
    width: "100%",
    maxWidth: 600, // Limit width on large screens
    alignSelf: "center", // Center the container itself
  }

  const COMPANION_CONTAINER: ViewStyle = {
    width: "100%",
    minHeight: 200, // Ensure minimum height for companion area
    aspectRatio: 1, // Maintain aspect ratio for scaling
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: spacing.md, // Increased margin
    zIndex: 10,
    overflow: "visible",
  }

  const INPUT_CONTAINER: ViewStyle = {
    flexDirection: "row",
    alignItems: "center", // Changed from stretch to center
    width: "100%",
    marginTop: spacing.sm,
    height: 50,
  }

  const MODAL_CONTENT: ViewStyle = {
    backgroundColor: "white",
    padding: modalPadding,
    margin: modalMargin,
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
    <Screen 
      preset="fixed" 
      safeAreaEdges={["top"]} 
      style={{ backgroundColor: colors.background, width: "100%", height: "100%" }}
      contentContainerStyle={{ flex: 1, width: "100%", height: "100%" }}
    >
      <ImageBackground 
        source={require("@assets/images/backgrounds/cozy_cottage.png")}
        style={{ flex: 1, flexDirection: "column", overflow: "hidden", width: "100%", height: "100%" }}
        imageStyle={{ resizeMode: "cover", top: 0, left: 0, width: "100%", height: "100%" }}
      >
      
      {/* Header - fixed at top */}
      <View style={HEADER_CONTAINER}>
        <Text preset="heading" text="Chubb's Corner" style={{ fontFamily: typography.pixel.normal, fontSize: 20, color: colors.text }} />
      </View>

      <ScrollView 
        style={{ flex: 1, width: "100%" }} 
        contentContainerStyle={{ 
          flexGrow: 1, 
          paddingBottom: navBarHeight + spacing.lg,
          alignItems: "center", // Enforce centering of children
        }}
      >
      {/* Spacer to push content to bottom */}
      <View style={{ flex: 1 }} />
 
      {/* Main content area - fills remaining space */}
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
               <View style={{ transform: [{ scale: companionScale }] }}>
                  <PixelCompanion />
               </View>
             </TouchableOpacity>
             {/* Sparkle Effect Overlay - triggers on companion click */}
             <SparkleEffect trigger={sparkleTrigger} />
          </View>
 
          {/* Controls - pinned to bottom of content area */}
          <View style={{ width: "100%", flexShrink: 0 }}>
            
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
                  paddingHorizontal: spacing.md,
                }}
                labelStyle={{
                  fontFamily: typography.pixel.normal,
                  fontSize: 10,
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
                      fontFamily: typography.pixel.normal,
                      // Hard pixel shadow
                      shadowColor: colors.shadow.default,
                      shadowOffset: { width: pixelSpacing.shadowOffset, height: pixelSpacing.shadowOffset },
                      shadowOpacity: 1,
                      shadowRadius: 0,
                      elevation: 0,
                      height: 50,
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
                      height: 50,
                      justifyContent: "center",
                    }}
                    contentStyle={{ 
                      height: "100%",
                      paddingVertical: 0, // Remove vertical padding to let flex center it
                      paddingHorizontal: spacing.md, 
                    }}
                    labelStyle={{
                      fontFamily: typography.pixel.normal,
                      fontSize: 12,
                      letterSpacing: 0,
                      // textAlignVertical: "center" // Android only usually
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
      </ScrollView>

      {/* Mood Selector Modal */}
      <Portal>
        <Modal visible={isMoodModalVisible} onDismiss={() => setMoodModalVisible(false)} contentContainerStyle={MODAL_CONTENT}>
          <Text preset="subheading" text="How are you feeling?" style={{ marginBottom: spacing.md, color: colors.text }} />
          <ScrollView style={{ width: "100%", maxHeight: modalMaxHeight }}>
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

      </ImageBackground>
    </Screen>
  )
})
