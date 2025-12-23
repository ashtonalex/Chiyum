import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { View, ViewStyle, ImageBackground, TouchableOpacity, Dimensions, ScrollView } from "react-native"
import { useRoute } from "@react-navigation/native"
import * as Haptics from "expo-haptics"

import { Screen } from "../components/Screen"
import { Text } from "../components/Text"
import { BottomNavBar, NavItem } from "../components/BottomNavBar"
import { PixelCompanion } from "../components/companion/PixelCompanion"
import { SparkleEffect } from "../components/companion/SparkleEffect"
import { colors } from "../theme/colors"
import { spacing, pixelSpacing } from "../theme/spacing"
import { AppStackScreenProps } from "../navigators/navigationTypes"

interface DashboardScreenProps extends AppStackScreenProps<"Dashboard"> {}

const NAV_ITEMS: NavItem[] = [
  { route: "Dashboard", label: "Home", icon: "🏠", color: colors.palette.mintyTeal },
  { route: "MoodTracker", label: "Mood", icon: "💭", color: colors.palette.mutedLavender },
  { route: "PhotoAlbum", label: "Photos", icon: "📷", color: colors.palette.sageGreen },
]

export const DashboardScreen: FC<DashboardScreenProps> = observer(function DashboardScreen({
  navigation,
}) {
  const route = useRoute()
  const [sparkleTrigger, setSparkleTrigger] = React.useState(0)

  // Dimensions for responsive layout
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
  
  // Responsive scale for companion - larger on bigger screens, clamped to reasonable range
  const companionScale = Math.max(1.5, Math.min(3, Math.min(screenWidth, screenHeight) / 300))
  
  // Responsive spacing calculations
  const navBarHeight = screenHeight * 0.1 // Approximate nav bar height (~10%)

  const handleCompanionPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setSparkleTrigger(prev => prev + 1) // Increment to trigger sparkle animation
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
    // flex: 1, // Removed to allow scrolling
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: screenWidth * 0.05, // 5% horizontal padding
    // paddingBottom handled by ScrollView contentContainerStyle
  }

  const COMPANION_CONTAINER: ViewStyle = {
    width: "100%",
    aspectRatio: 1, // Ensure proportional scaling
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    overflow: "visible",
  }

  return (
    <Screen 
      preset="fixed" 
      safeAreaEdges={["top"]} 
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ flex: 1 }}
    >
      <ImageBackground 
        source={require("@assets/images/backgrounds/dashboard_bedroom_bg.png")}
        style={{ flex: 1, flexDirection: "column" }}
        resizeMode="cover"
      >
      
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: navBarHeight + spacing.lg }} // Ensure scrolling and padding
      >
      {/* Header - fixed at top (now scrolls with content) */}
      <View style={HEADER_CONTAINER}>
        <Text preset="heading" text="Partner Name" style={{ fontFamily: "pressStart2P", fontSize: 24, color: colors.text }} />
      </View>
 
      {/* Main content area - fills remaining space */}
      <View style={CONTENT_CONTAINER}>
          
          {/* Companion Area */}
          <View style={COMPANION_CONTAINER}>
             <TouchableOpacity onPress={handleCompanionPress} activeOpacity={0.8}>
               <View style={{ transform: [{ scale: companionScale }] }}>
                  <PixelCompanion />
               </View>
             </TouchableOpacity>
             {/* Sparkle Effect Overlay - triggers on companion click */}
             <SparkleEffect trigger={sparkleTrigger} />
          </View>
 
      </View>
      </ScrollView>
 
      {/* Bottom Navigation */}
      <BottomNavBar items={NAV_ITEMS} activeRoute={route.name} />

      </ImageBackground>
    </Screen>
  )
})
