import React from "react"
import { View, Pressable, ViewStyle, TextStyle, Platform } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated"
import * as Haptics from "expo-haptics"
import { useNavigation } from "@react-navigation/native"
import { Text } from "./Text"
import { colors } from "../theme/colors"
import { spacing, pixelSpacing } from "../theme/spacing"
import { fontSizes } from "../theme/typography"

export interface NavItem {
  /** Route name to navigate to */
  route: string
  /** Display label for the nav item */
  label: string
  /** Icon character (emoji or unicode symbol) */
  icon: string
  /** Optional custom color for this nav item */
  color?: string
}

export interface BottomNavBarProps {
  /** Array of navigation items to display */
  items: NavItem[]
  /** Currently active route name */
  activeRoute: string
}

/**
 * Retro-Kawaii Bottom Navigation Bar
 * 
 * A pixel-art styled bottom navigation component with:
 * - Hard-blocked shadows (4px offset)
 * - 2px dark charcoal borders
 * - Pastel color accents
 * - Micro-animations on press
 * - Haptic feedback
 * 
 * @example
 * ```tsx
 * const navItems: NavItem[] = [
 *   { route: "Dashboard", label: "Home", icon: "🏠", color: colors.palette.mintyTeal },
 *   { route: "MoodTracker", label: "Mood", icon: "💭", color: colors.palette.mutedLavender },
 *   { route: "PhotoAlbum", label: "Photos", icon: "📷", color: colors.palette.sageGreen },
 * ]
 * 
 * <BottomNavBar items={navItems} activeRoute={currentRoute} />
 * ```
 */
export const BottomNavBar = ({ items, activeRoute }: BottomNavBarProps) => {
  const navigation = useNavigation()

  const handlePress = (route: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    navigation.navigate(route as never)
  }

  return (
    <View style={$container}>
      <View style={$navBar}>
        {items.map((item, index) => (
          <NavButton
            key={item.route}
            item={item}
            isActive={activeRoute === item.route}
            onPress={() => handlePress(item.route)}
            isFirst={index === 0}
            isLast={index === items.length - 1}
          />
        ))}
      </View>
    </View>
  )
}

interface NavButtonProps {
  item: NavItem
  isActive: boolean
  onPress: () => void
  isFirst: boolean
  isLast: boolean
}

const NavButton = ({ item, isActive, onPress, isFirst, isLast }: NavButtonProps) => {
  const scale = useSharedValue(1)
  const activeProgress = useSharedValue(isActive ? 1 : 0)

  React.useEffect(() => {
    activeProgress.value = withSpring(isActive ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    })
  }, [isActive])

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 200 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 })
  }

  const animatedButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = isActive
      ? item.color || colors.tint
      : colors.surface

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
      // Animate shadow offset for "pressed" effect
      shadowOffset: {
        width: interpolate(scale.value, [0.9, 1], [2, pixelSpacing.shadowOffset]),
        height: interpolate(scale.value, [0.9, 1], [2, pixelSpacing.shadowOffset]),
      },
    }
  })

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(activeProgress.value, [0, 1], [0, -4]),
        },
      ],
    }
  })

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(activeProgress.value, [0, 1], [0.6, 1]),
    }
  })

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        $navButton,
        isFirst && $navButtonFirst,
        isLast && $navButtonLast,
        animatedButtonStyle,
      ]}
    >
      <Animated.View style={animatedIconStyle}>
        <Text style={$icon} text={item.icon} />
      </Animated.View>
      <Animated.View style={animatedLabelStyle}>
        <Text
          style={[$label, isActive && $labelActive]}
          text={item.label}
        />
      </Animated.View>
    </AnimatedPressable>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const $container: ViewStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  paddingBottom: Platform.OS === "ios" ? spacing.lg : spacing.md,
  paddingHorizontal: spacing.md,
  backgroundColor: colors.transparent,
  // Add extra padding for safe area on iOS
  paddingTop: spacing.sm,
}

const $navBar: ViewStyle = {
  flexDirection: "row",
  backgroundColor: colors.surface,
  borderWidth: pixelSpacing.borderWidth,
  borderColor: colors.border,
  borderRadius: 16,
  // Hard pixel shadow
  shadowColor: colors.shadow.default,
  shadowOffset: {
    width: pixelSpacing.shadowOffset,
    height: pixelSpacing.shadowOffset,
  },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 8,
  overflow: "hidden",
}

const $navButton: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.xs,
  borderRightWidth: pixelSpacing.borderWidth,
  borderRightColor: colors.border,
  // Individual button shadow for pressed effect
  shadowColor: colors.shadow.default,
  shadowOffset: {
    width: pixelSpacing.shadowOffset,
    height: pixelSpacing.shadowOffset,
  },
  shadowOpacity: 0.3,
  shadowRadius: 0,
}

const $navButtonFirst: ViewStyle = {
  borderTopLeftRadius: 14,
  borderBottomLeftRadius: 14,
}

const $navButtonLast: ViewStyle = {
  borderRightWidth: 0,
  borderTopRightRadius: 14,
  borderBottomRightRadius: 14,
}

const $icon: TextStyle = {
  fontSize: 24,
  marginBottom: spacing.xxxs,
}

const $label: TextStyle = {
  fontSize: fontSizes.pixel.md,
  fontFamily: "pressStart2P",
  color: colors.text,
  textAlign: "center",
}

const $labelActive: TextStyle = {
  color: colors.text,
  fontWeight: "bold",
}
