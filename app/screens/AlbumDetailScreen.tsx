import { FC, useMemo, useState } from "react"
import { ViewStyle, FlatList, View, TextStyle, ImageStyle, useWindowDimensions, ImageBackground, TouchableOpacity, Alert } from "react-native"
import { observer } from "mobx-react-lite"
import { Image } from "expo-image"
import * as ImagePicker from "expo-image-picker"
import { Modal, Portal, TextInput } from "react-native-paper"

import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Card } from "@/components/Card"
import { useStores } from "@/models"
import { colors, spacing } from "@/theme"
import { Button } from "@/components/Button"

interface AlbumDetailScreenProps extends AppStackScreenProps<"AlbumDetail"> {}

export const AlbumDetailScreen: FC<AlbumDetailScreenProps> = observer(function AlbumDetailScreen({ route, navigation }) {
  const { galleryStore } = useStores()
  const { width } = useWindowDimensions()
  const photoCardWidth = (width - spacing.md * 3) / 2

  const { albumId } = route.params
  const album = galleryStore.getAlbum(albumId)

  // State for Modal
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedNote, setEditedNote] = useState("")

  const photos = useMemo(() => {
    if (!album) return []
    return album.photoIds.map(id => galleryStore.getPhoto(id)).filter(Boolean)
  }, [album, galleryStore.photos])

  const handleAddPhoto = async () => {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (!result.canceled && result.assets[0]) {
            const uri = result.assets[0].uri
            const newPhoto = galleryStore.addPhoto(uri, "", "user", "New Memory")
            if (album) {
                galleryStore.addPhotoToAlbum(album.id, newPhoto.id)
            }
        }
    } catch (e) {
        Alert.alert("Error picking image", "Could not select the image.")
        console.error("ImagePicker Error:", e)
    }
  }

  const handlePressPhoto = (photo: any) => {
    setSelectedPhoto(photo)
    setEditedNote(photo.note || photo.caption || "")
    setIsEditing(false)
  }

  const handleCloseModal = () => {
    setSelectedPhoto(null)
    setIsEditing(false)
  }

  const handleSaveNote = () => {
    if (selectedPhoto) {
        galleryStore.updatePhotoDetails(selectedPhoto.id, selectedPhoto.caption, editedNote)
        setIsEditing(false)
        // Update local selected object reference if needed or rely on observer re-render (since store updates)
        // For immediate feedback in modal we might want to update local state too if not purely reactive
        // But since we pass selectedPhoto.id to store, next render will have updated note.
    }
  }

  if (!album) {
    return (
        <ImageBackground 
            source={require("@assets/images/backgrounds/cozy_cottage.png")}
            style={$root}
            imageStyle={$backgroundImage}
        >
            <Screen style={$root} preset="fixed" backgroundColor={colors.transparent}>
                <View style={$emptyState}>
                    <Text text="Album not found" style={$emptyText} />
                    <TouchableOpacity onPress={() => navigation.goBack()} style={$backButtonStyle}>
                         <Text text="Go Back" style={$backButtonText} />
                    </TouchableOpacity>
                </View>
            </Screen>
        </ImageBackground>
    )
  }

  const renderHeader = () => (
    <View style={$headerContainer}>
        <View style={$headerCard}>
            <Text text={album.title} style={$titleText} />
            {!!album.story && (
                <>
                    <View style={$divider} />
                    <Text text={album.story} style={$storyText} />
                </>
            )}
            
            <Button 
                text="Add Photo" 
                preset="filled" 
                onPress={handleAddPhoto} 
                style={$addPhotoButton}
                textStyle={$addPhotoButtonText}
            />
        </View>
    </View>
  )

  return (
    <ImageBackground 
        source={require("@assets/images/backgrounds/cozy_cottage.png")}
        style={$root}
        imageStyle={$backgroundImage}
    >
        <Screen 
            style={$screen} 
            preset="fixed" 
            safeAreaEdges={["top", "bottom"]}
            backgroundColor={colors.transparent}
        >
            <View style={$navBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={$backButtonContainer}>
                    <Text text="< Back" style={$backButtonText} />
                </TouchableOpacity>
            </View>
            
            <FlatList
                data={photos}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={$columnWrapper}
                contentContainerStyle={$listContent}
                ListHeaderComponent={renderHeader}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => handlePressPhoto(item)}
                        style={[$photoCard, { width: photoCardWidth }]}
                    >
                        <View style={$photoFrame}>
                            <Image
                                source={{ uri: item.uri }}
                                style={$photoImage}
                                contentFit="cover"
                                transition={200}
                            />
                        </View>
                        <View style={$photoFooter}>
                            <Text 
                                text={item.note || item.caption || "..."} 
                                style={$noteText} 
                                numberOfLines={2}
                            />
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={$emptyPhotos}>
                        <Text text="No photos added yet." size="xs" style={$emptyPhotoText} />
                    </View>
                }
            />

            <Portal>
                <Modal
                    visible={!!selectedPhoto}
                    onDismiss={handleCloseModal}
                    contentContainerStyle={$modalContainer}
                >
                    {selectedPhoto && (
                        <View style={$modalContent}>
                            <Image
                                source={{ uri: selectedPhoto.uri }}
                                style={$fullImage}
                                contentFit="contain"
                            />
                            
                            <View style={$modalFooter}>
                                {isEditing ? (
                                    <View style={$editContainer}>
                                        <TextInput
                                            mode="outlined"
                                            value={editedNote}
                                            onChangeText={setEditedNote}
                                            placeholder="Write a note..."
                                            style={$noteInput}
                                            activeOutlineColor={colors.palette.primeBlue}
                                        />
                                        <View style={$editButtons}>
                                            <Button 
                                                text="Cancel" 
                                                preset="default" 
                                                onPress={() => setIsEditing(false)} 
                                                style={{ flex: 1, marginRight: spacing.xs }}
                                            />
                                            <Button 
                                                text="Save" 
                                                preset="filled" 
                                                onPress={handleSaveNote} 
                                                style={{ flex: 1, marginLeft: spacing.xs }}
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    <>
                                        <Text 
                                            text={selectedPhoto.note || selectedPhoto.caption || "No description"} 
                                            style={$modalNoteText} 
                                        />
                                        <Button 
                                            text="Edit Note" 
                                            preset="filled" 
                                            onPress={() => setIsEditing(true)}
                                            style={$editButton}
                                            textStyle={{ color: colors.text }}
                                        />
                                    </>
                                )}
                                
                                <TouchableOpacity onPress={handleCloseModal} style={$closeButton}>
                                    <Text text="Close" style={$closeButtonText} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Modal>
            </Portal>
        </Screen>
    </ImageBackground>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $backgroundImage: ImageStyle = {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
}

const $screen: ViewStyle = {
    flex: 1,
}

const $navBar: ViewStyle = {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
}

const $backButtonContainer: ViewStyle = {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.palette.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignSelf: "flex-start",
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
}

const $backButtonStyle: ViewStyle = {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.palette.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    marginTop: spacing.md,
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
}

const $backButtonText: TextStyle = {
    fontFamily: "Lexend-Bold",
    color: colors.text,
    fontSize: 14,
}

const $headerContainer: ViewStyle = {
    paddingBottom: spacing.md,
}

const $headerCard: ViewStyle = {
    backgroundColor: colors.palette.neutral100,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: 12,
    alignItems: "center",
}

const $titleText: TextStyle = {
    fontSize: 24,
    fontFamily: "Lexend-Bold",
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: "center",
}

const $divider: ViewStyle = {
    height: 2,
    backgroundColor: colors.palette.mutedLavender,
    marginBottom: spacing.xs,
    width: "100%",
}

const $storyText: TextStyle = {
    fontSize: 14,
    color: colors.textDim,
    fontFamily: "Lexend-Regular",
    lineHeight: 20,
    textAlign: "center",
}

const $addPhotoButton: ViewStyle = {
    marginTop: spacing.md,
    backgroundColor: colors.palette.sageGreen,
    borderWidth: 2,
    borderColor: colors.border,
    minWidth: 160,
}

const $addPhotoButtonText: TextStyle = {
    fontFamily: "PressStart2P-Regular",
    fontSize: 12, 
    color: colors.text
}

const $listContent: ViewStyle = {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
}

const $columnWrapper: ViewStyle = {
    justifyContent: "space-between",
}

/* Polaroid Card Styling */
const $photoCard: ViewStyle = {
    backgroundColor: colors.palette.white,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 6,
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
}

const $photoFrame: ViewStyle = {
    aspectRatio: 1,
    width: "100%",
    backgroundColor: colors.palette.neutral200,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.palette.neutral200,
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
    fontSize: 10,
    color: colors.text,
    textAlign: "center",
}

const $emptyState: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
}

const $emptyText: TextStyle = {
    fontFamily: "Lexend-Bold",
    fontSize: 18,
    color: colors.text,
}

const $emptyPhotos: ViewStyle = {
    padding: spacing.xl,
    alignItems: "center",
    marginTop: spacing.xl,
    backgroundColor: colors.palette.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    gap: spacing.md,
}

const $emptyPhotoText: TextStyle = {
    color: colors.textDim,
    fontFamily: "Lexend-Regular",
}

/* Modal Styling */
const $modalContainer: ViewStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Dimmed background
    flex: 1,
    justifyContent: "center",
    padding: spacing.md,
}

const $modalContent: ViewStyle = {
    backgroundColor: colors.palette.white,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: "center",
    maxHeight: "90%",
}

const $fullImage: ImageStyle = {
    width: "100%",
    aspectRatio: 1, // Or adjust based on image dimensions
    backgroundColor: colors.palette.neutral200,
    borderRadius: 8,
    marginBottom: spacing.md,
}

const $modalFooter: ViewStyle = {
    width: "100%",
    alignItems: "center",
}

const $modalNoteText: TextStyle = {
    fontFamily: "Lexend-Medium",
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 24,
}

const $editButton: ViewStyle = {
    backgroundColor: colors.palette.mutedLavender,
    borderWidth: 2,
    marginBottom: spacing.sm,
    minWidth: 140,
    borderColor: colors.border,
}

const $editContainer: ViewStyle = {
    width: "100%",
    gap: spacing.sm,
    marginBottom: spacing.sm,
}

const $noteInput: TextStyle = {
    backgroundColor: colors.palette.white,
    fontSize: 14,
    fontFamily: "Lexend-Regular",
}

const $editButtons: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
}

const $closeButton: ViewStyle = {
    marginTop: spacing.sm,
    padding: spacing.xs,
}

const $closeButtonText: TextStyle = {
    color: colors.text,
    fontFamily: "Lexend-Bold",
    textDecorationLine: "none",
    fontSize: 14,
}
