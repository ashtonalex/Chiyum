import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { colors } from "@/theme/colors"
import { spacing, pixelSpacing } from "@/theme/spacing"
import { AppStackScreenProps } from "@/navigators/navigationTypes"

interface DashboardScreenProps extends AppStackScreenProps<"Dashboard"> {}

export const DashboardScreen: FC<DashboardScreenProps> = observer(function DashboardScreen({
  navigation,
}) {
  const HEADER_STYLE: ViewStyle = {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: pixelSpacing.borderWidth,
    borderBottomColor: colors.border,
    marginBottom: spacing.lg,
  }

  const CONTENT_CONTAINER_STYLE: ViewStyle = {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  }

  const SPRITE_SECTION_STYLE: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundSecondary,
    borderWidth: pixelSpacing.borderWidth,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    // Pixel Shadow
    shadowColor: colors.shadow.default,
    shadowOffset: { width: pixelSpacing.shadowOffset, height: pixelSpacing.shadowOffset },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0, 
  }

  const ACTIONS_ROW_STYLE: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  }

  const BUTTON_STYLE: ViewStyle = {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: pixelSpacing.borderWidth,
    borderColor: colors.border,
    borderRadius: 0, // Hard edges
    // Retro shadow for buttons
    shadowColor: colors.shadow.teal,
    shadowOffset: { width: pixelSpacing.shadowOffset, height: pixelSpacing.shadowOffset },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={{ flex: 1 }}>
      {/* Header */}
      <View style={HEADER_STYLE}>
        <Text preset="heading" text="Partner Name" style={{ color: colors.text }} />
      </View>

      <View style={CONTENT_CONTAINER_STYLE}>
        {/* Pixel Sprite Placeholder */}
        <View style={SPRITE_SECTION_STYLE}>
          <Text text="[Pixel Sprite Placeholder]" preset="bold" />
        </View>

        {/* Quick Actions */}
        <View style={ACTIONS_ROW_STYLE}>
          <Button
            text="Nudge"
            style={BUTTON_STYLE}
            textStyle={{ color: colors.text, fontFamily: "PressStart2P-Regular", fontSize: 12 }}
            pressedStyle={{ transform: [{ translateY: 2 }, { translateX: 2 }] }}
            onPress={() => console.log("Nudge pressed")}
          />
          <Button
            text="Doodle"
            style={BUTTON_STYLE}
            textStyle={{ color: colors.text, fontFamily: "PressStart2P-Regular", fontSize: 12 }}
            pressedStyle={{ transform: [{ translateY: 2 }, { translateX: 2 }] }}
            onPress={() => navigation.navigate("PhotoAlbum")}
          />
          <Button
            text="Mood"
            style={BUTTON_STYLE}
            textStyle={{ color: colors.text, fontFamily: "PressStart2P-Regular", fontSize: 12 }}
            pressedStyle={{ transform: [{ translateY: 2 }, { translateX: 2 }] }}
            onPress={() => navigation.navigate("MoodTracker")}
          />
        </View>
      </View>
    </Screen>
  )
})
