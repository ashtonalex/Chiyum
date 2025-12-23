import { FC, useEffect } from "react"
import { ViewStyle, FlatList, TouchableOpacity, TextStyle, View, ImageStyle, ImageBackground } from "react-native"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { Image } from "expo-image"

import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Card } from "@/components/Card"
import { useStores } from "@/models"
import { colors, spacing } from "@/theme" 

interface PhotoAlbumScreenProps extends AppStackScreenProps<"PhotoAlbum"> {}

export const PhotoAlbumScreen: FC<PhotoAlbumScreenProps> = observer(function PhotoAlbumScreen() {
  const { galleryStore } = useStores()
  const navigation = useNavigation()

  // Initial data for testing if empty
  useEffect(() => {
    if (galleryStore.allAlbums.length === 0) {
       // Optional: Seed some data or just show empty state
       // galleryStore.createAlbum("Summer 2025", "Our trip to the beach was amazing! We ate so much ice cream.")
    }
  }, [])

  const handlePressAlbum = (albumId: string) => {
    navigation.navigate("AlbumDetail", { albumId })
  }

  return (
    <ImageBackground 
      source={require("@assets/images/backgrounds/cozy_cottage.png")}
      style={$root}
      imageStyle={$backgroundImage}
    >
      <Screen 
        preset="fixed" 
        safeAreaEdges={["top", "bottom"]}
        backgroundColor={colors.transparent}
        contentContainerStyle={$screenContent}
      >
        <View style={$headerContainer}>
          <View style={$headerBanner}>
            <Text preset="heading" text="Sticker Book" style={$headerTitle} />
            <Text text="Your shared memories" size="xs" style={$headerSubtitle} />
          </View>
        </View>

        <FlatList
          data={galleryStore.allAlbums}
          keyExtractor={(item) => item.id}
          contentContainerStyle={$listContent}
          renderItem={({ item }) => {
            // Find coverage image (first photo)
            const coverPhoto = item.photoIds.length > 0 ? galleryStore.getPhoto(item.photoIds[0]) : null
            const coverUri = item.coverUri || coverPhoto?.uri

            return (
              <Card
                style={$albumCard}
                onPress={() => handlePressAlbum(item.id)}
                ContentComponent={
                  <View style={$cardContent}>
                    <View style={$coverImageContainer}>
                      {coverUri ? (
                          <Image
                            source={{ uri: coverUri }}
                            style={$coverImage}
                            contentFit="cover"
                            transition={200}
                          />
                      ) : (
                          <View style={$emptyCover}>
                            <Text text="No Photos" size="xxs" />
                          </View>
                      )}
                    </View>
                    <Text text={item.title} style={$albumTitle} />
                    <Text 
                      text={item.story} 
                      numberOfLines={2} 
                      size="xs" 
                      style={$albumSnippet} 
                    />
                    <View style={$metadataRow}>
                      <Text text={`${item.photoIds.length} photos`} size="xxs" style={$metaText} />
                    </View>
                  </View>
                }
              />
            )
          }}
          ListEmptyComponent={
            <View style={$emptyStateContainer}>
              <View style={$emptyStateCard}>
                <Text text="No albums yet!" style={$emptyText} />
                <Text text="Create one to start your collection." size="xs" style={$emptySubtext} />
              </View>
            </View>
          }
        />
      </Screen>
    </ImageBackground>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background, // Fallback
}

const $backgroundImage: ImageStyle = {
  resizeMode: "cover",
  width: "100%",
  height: "100%",
}

const $screenContent: ViewStyle = {
  flex: 1,
}

const $headerContainer: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingTop: spacing.lg,
  paddingBottom: spacing.md,
  alignItems: "center",
}

const $headerBanner: ViewStyle = {
  backgroundColor: colors.palette.cream,
  borderWidth: 2,
  borderColor: colors.border,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.lg,
  borderRadius: 12,
  shadowColor: colors.shadow.default,
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  alignItems: "center",
}

const $headerTitle: TextStyle = {
  fontFamily: "Lexend-Bold",
  color: colors.text,
  textAlign: "center",
}

const $headerSubtitle: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.xxs,
  textAlign: "center",
}

const $listContent: ViewStyle = {
  padding: spacing.md,
  paddingBottom: spacing.xl,
  flexGrow: 1,
}

const $albumCard: ViewStyle = {
  marginBottom: spacing.md,
  backgroundColor: colors.palette.neutral100,
  borderWidth: 2,
  borderColor: colors.border,
  shadowColor: colors.shadow.default,
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  padding: spacing.sm,
}

const $cardContent: ViewStyle = {
  gap: spacing.xs,
}

const $coverImageContainer: ViewStyle = {
  width: "100%",
  aspectRatio: 16 / 9,
  borderWidth: 2,
  borderColor: colors.border,
  marginBottom: spacing.xs,
  overflow: "hidden",
  backgroundColor: colors.palette.neutral200,
  borderRadius: 4,
}

const $coverImage: ImageStyle = {
  flex: 1,
}

const $emptyCover: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.palette.neutral200,
}

const $albumTitle: TextStyle = {
  fontSize: 18,
  color: colors.text,
  fontFamily: "Lexend-Bold",
}

const $albumSnippet: TextStyle = {
  marginBottom: spacing.xxs,
  color: colors.textDim,
}

const $metadataRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "flex-end",
}

const $metaText: TextStyle = {
  color: colors.palette.primary600,
  fontSize: 12,
  fontFamily: "PressStart2P-Regular",
}

const $emptyStateContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  marginTop: spacing.xxl,
}

const $emptyStateCard: ViewStyle = {
  backgroundColor: colors.palette.white,
  padding: spacing.lg,
  borderWidth: 2,
  borderColor: colors.border,
  borderRadius: 12,
  shadowColor: colors.shadow.default,
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  alignItems: "center",
}

const $emptyText: TextStyle = {
  fontFamily: "Lexend-Bold",
  marginBottom: spacing.xs,
  color: colors.text,
  fontSize: 16,
}

const $emptySubtext: TextStyle = {
  color: colors.textDim,
  textAlign: "center",
}
