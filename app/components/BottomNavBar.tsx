import React, { useState } from "react"
import { View, Pressable, ViewStyle, TextStyle, Platform, Image, ImageStyle, ImageSourcePropType } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated"
import * as Haptics from "expo-haptics"
import { useNavigation } from "@react-navigation/native"
import { colors } from "../theme/colors"
import { spacing, pixelSpacing } from "../theme/spacing"

export interface NavItem {
  /** Route name to navigate to */
  route: string
  /** Display label for the nav item */
  label: string
  /** Icon image source */
  icon: ImageSourcePropType
  /** Optional custom color for this nav item */
  color?: string
}

export interface BottomNavBarProps {
  /** Array of navigation items to display */
  items: NavItem[]
  /** Currently active route name */
  activeRoute: string
}

// Fixed height for the open state of the navbar content
const NAV_CONTENT_HEIGHT = 80
const TOGGLE_HEIGHT = 20

/**
 * Retro-Kawaii Bottom Navigation Bar
 * 
 * A pixel-art styled bottom navigation component with:
 * - Collapsible design
 * - Rounded edges
 * - Custom pixel art icons
 * - Hard-blocked shadows
 */
export const BottomNavBar = ({ items, activeRoute }: BottomNavBarProps) => {
  const navigation = useNavigation()
  const [isOpen, setIsOpen] = useState(true)
  const openProgress = useSharedValue(1)

  const toggleOpen = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    const newState = !isOpen
    setIsOpen(newState)
    openProgress.value = withSpring(newState ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    })
  }

  const handlePress = (route: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    navigation.navigate(route as never)
  }

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(openProgress.value, [0, 1], [NAV_CONTENT_HEIGHT, 0]),
        },
      ],
    }
  })

  const chevronAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(openProgress.value, [0, 1], [0, 180])}deg`,
        },
      ],
    }
  })

  return (
    <View style={$containerOuter}>
      <Animated.View style={[$animatedContainer, containerAnimatedStyle]}>
        <Pressable onPress={toggleOpen} style={$toggleButton}>
          <Animated.Image
            source={require("../../assets/icons/nav_chevron.png")}
            style={[$chevronIcon, chevronAnimatedStyle]}
            resizeMode="contain"
          />
        </Pressable>
        
        <View style={$navBarContent}>
          <View style={$navItemsContainer}>
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
      </Animated.View>
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

  return (
    <Animated.View style={[$navButtonWrapper]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[$navButtonInner, animatedButtonStyle]}>
          <Animated.Image 
            source={item.icon} 
            style={[$navIcon, animatedIconStyle]} 
            resizeMode="contain" 
          />
        </Animated.View>
        {isActive && (
           <View style={$activeIndicator} />
        )}
      </Pressable>
    </Animated.View>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const $containerOuter: ViewStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  alignItems: 'center',
  paddingBottom: Platform.OS === "ios" ? spacing.lg : spacing.md,
  zIndex: 100,
  width: "100%",
}

const $animatedContainer: ViewStyle = {
  width: "100%",
  alignItems: "center",
}

const $toggleButton: ViewStyle = {
  width: 40,
  height: TOGGLE_HEIGHT,
  backgroundColor: colors.surface,
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  borderWidth: pixelSpacing.borderWidth,
  borderBottomWidth: 0,
  borderColor: colors.border,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  marginBottom: -2, // Overlap slightly to hide border seam
  shadowColor: colors.shadow.default,
  shadowOffset: {
    width: 2,
    height: -2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 0,
}

const $chevronIcon: ImageStyle = {
  width: 12,
  height: 12,
  tintColor: colors.text,
}

const $navBarContent: ViewStyle = {
  backgroundColor: colors.surface,
  borderWidth: pixelSpacing.borderWidth,
  borderColor: colors.border,
  borderRadius: 24, // Rounded edges
  width: "90%", // Span most of the width but not full
  height: NAV_CONTENT_HEIGHT,
  overflow: "hidden",
  // Hard pixel shadow
  shadowColor: colors.shadow.default,
  shadowOffset: {
    width: pixelSpacing.shadowOffset,
    height: pixelSpacing.shadowOffset,
  },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 8,
}

const $navItemsContainer: ViewStyle = {
  flexDirection: "row",
  height: "100%",
  alignItems: 'center',
  justifyContent: 'space-around',
  paddingHorizontal: spacing.sm,
}

const $navButtonWrapper: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
}

const $navButtonInner: ViewStyle = {
  width: 56,
  height: 56,
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 2,
  borderColor: colors.border,
}

const $navIcon: ImageStyle = {
  width: 32,
  height: 32,
}

const $activeIndicator: ViewStyle = {
  position: 'absolute',
  bottom: -4,
  alignSelf: 'center',
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: colors.text,
}
