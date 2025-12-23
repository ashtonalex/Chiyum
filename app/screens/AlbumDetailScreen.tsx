import { FC, useMemo } from "react"
import { ViewStyle, FlatList, View, TextStyle, ImageStyle, useWindowDimensions, ImageBackground } from "react-native"
import { observer } from "mobx-react-lite"
import { Image } from "expo-image"

import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Card } from "@/components/Card"
import { useStores } from "@/models"
import { colors, spacing } from "@/theme"

interface AlbumDetailScreenProps extends AppStackScreenProps<"AlbumDetail"> {}


export const AlbumDetailScreen: FC<AlbumDetailScreenProps> = observer(function AlbumDetailScreen({ route, navigation }) {
  const { galleryStore } = useStores()
  const { width } = useWindowDimensions()
  const photoCardWidth = (width - spacing.md * 3) / 2

  const { albumId } = route.params
  const album = galleryStore.getAlbum(albumId)

  const photos = useMemo(() => {
    if (!album) return []
    return album.photoIds.map(id => galleryStore.getPhoto(id)).filter(Boolean)
  }, [album, galleryStore.photos])

  if (!album) {
    return (
        <Screen style={$root} preset="fixed">
            <View style={$emptyState}>
                <Text text="Album not found" />
                <Card 
                    heading="Go Back" 
                    onPress={() => navigation.goBack()}
                    style={{ marginTop: spacing.md }} 
                />
            </View>
        </Screen>
    )
  }

  const renderHeader = () => (
    <View style={$headerContainer}>
        <View style={$headerCard}>
            <Text text={album.title} style={$titleText} />
            <View style={$divider} />
            <Text text={album.story} style={$storyText} />
        </View>
    </View>
  )

  return (
    <Screen style={$root} preset="fixed" safeAreaEdges={["top", "bottom"]}>
      <ImageBackground 
        source={require("@assets/images/backgrounds/cozy_cottage.png")}
        style={{ flex: 1, flexDirection: "column", overflow: "hidden" }}
        imageStyle={{ resizeMode: "cover", top: 0, left: 0 }}
      >
      <View style={$navBar}>
          <Text text="< Back" onPress={() => navigation.goBack()} style={$backButton} />
      </View>
      
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={$columnWrapper}
        contentContainerStyle={$listContent}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
            <View style={[$photoCard, { width: photoCardWidth }]}>
                <View style={$photoFrame}>
                    <Image
                        source={{ uri: item.uri }}
                        style={$photoImage}
                        contentFit="cover"
                        transition={200}
                    />
                </View>
                {/* Polaroid Bottom Note Area */}
                <View style={$photoFooter}>
                    <Text 
                        text={item.note || item.caption || "..."} 
                        style={$noteText} 
                        numberOfLines={2}
                    />
                </View>
            </View>
        )}
        ListEmptyComponent={
            <View style={$emptyPhotos}>
                <Text text="No photos added yet." size="xs" />
            </View>
        }
      />
      </ImageBackground>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $navBar: ViewStyle = {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
}

const $backButton: TextStyle = {
    fontFamily: "Lexend-Bold",
    color: colors.text,
}

const $headerContainer: ViewStyle = {
    paddingBottom: spacing.md,
}

const $headerCard: ViewStyle = {
    backgroundColor: colors.palette.neutral100, // White-ish
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    padding: spacing.md,
    marginBottom: spacing.xs,
}

const $titleText: TextStyle = {
    fontSize: 24,
    fontFamily: "Lexend-Bold",
    color: colors.text,
    marginBottom: spacing.xs,
}

const $divider: ViewStyle = {
    height: 2,
    backgroundColor: colors.palette.mutedLavender, // Muted Lavender
    marginBottom: spacing.xs,
    width: "100%",
}

const $storyText: TextStyle = {
    fontSize: 14,
    color: colors.textDim,
    fontFamily: "Lexend-Regular", // Fallback if regular isn't explicit
    lineHeight: 20,
}

const $listContent: ViewStyle = {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
}

const $columnWrapper: ViewStyle = {
    justifyContent: "space-between",
}

/* Polaroid Card Styling */
const $photoCard: ViewStyle = {
    backgroundColor: colors.palette.white,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 6, // White border around photo
    paddingBottom: spacing.sm, // Extra space at bottom for note
    marginBottom: spacing.md,
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
}

const $photoFrame: ViewStyle = {
    aspectRatio: 1, // Square photos
    width: "100%",
    backgroundColor: colors.palette.neutral200,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.palette.neutral200, // Subtle internal border
    overflow: "hidden",
}

const $photoImage: ImageStyle = {
    flex: 1,
}

const $photoFooter: ViewStyle = {
    minHeight: 20,
    justifyContent: "center",
}

const $noteText: TextStyle = {
    fontFamily: "PressStart2P-Regular",
    fontSize: 10, // Increased for readability
    color: colors.text,
    textAlign: "center",
}

const $emptyState: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
}

const $emptyPhotos: ViewStyle = {
    padding: spacing.xl,
    alignItems: "center",
}
