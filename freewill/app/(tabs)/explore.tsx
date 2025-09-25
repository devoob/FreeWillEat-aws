import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, spacing, typography } from '@/styles/globalStyles';
import { fetchRestaurantPhotos, fetchRestaurantAdditionalPhotos, RestaurantPhoto } from '@/services/restaurantService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = SCREEN_WIDTH / 3; // Perfect 3 columns, no margins

export default function ExploreScreen() {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  const [photos, setPhotos] = useState<RestaurantPhoto[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<RestaurantPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<RestaurantPhoto | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [loadingAdditionalPhotos, setLoadingAdditionalPhotos] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Load photos on component mount
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const fetchedPhotos = await fetchRestaurantPhotos();
        setPhotos(fetchedPhotos);
        setFilteredPhotos(fetchedPhotos);
      } catch (error) {
        console.error('Error loading photos:', error);
        Alert.alert('Error', 'Failed to load restaurant photos');
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  // Filter photos based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPhotos(photos);
    } else {
      const filtered = photos.filter(photo =>
        photo.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPhotos(filtered);
    }
  }, [searchQuery, photos]);

  const openPhotoModal = async (photo: RestaurantPhoto) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
    setCurrentPhotoIndex(0);
    setAdditionalPhotos([]);

    // Fetch additional photos for this restaurant
    setLoadingAdditionalPhotos(true);
    try {
      const additionalPhotoUrls = await fetchRestaurantAdditionalPhotos(photo.restaurantId);
      setAdditionalPhotos(additionalPhotoUrls);
    } catch (error) {
      console.error('Error loading additional photos:', error);
      // Continue without additional photos
    } finally {
      setLoadingAdditionalPhotos(false);
    }
  };

  const closePhotoModal = () => {
    setModalVisible(false);
    setSelectedPhoto(null);
    setAdditionalPhotos([]);
    setCurrentPhotoIndex(0);
  };

  // Get all photos for the current restaurant (main photo + additional photos)
  const getAllPhotos = () => {
    if (!selectedPhoto) return [];
    return [selectedPhoto.url, ...additionalPhotos];
  };

  const handlePhotoScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentPhotoIndex(index);
  };

  const renderPhotoItem = ({ item }: { item: RestaurantPhoto }) => (
    <TouchableOpacity
      style={styles.photoContainer}
      onPress={() => openPhotoModal(item)}
    >
      <Image
        source={{ uri: item.url }}
        style={styles.photo}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      paddingTop: spacing.massive,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.textTertiary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: themeColors.backgroundWhite,
      borderRadius: 20,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginTop: spacing.sm,
    },
    searchIcon: {
      marginRight: spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: typography.fontSize.md,
      color: themeColors.textPrimary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: typography.fontSize.lg,
      color: themeColors.textSecondary,
      marginTop: spacing.md,
    },
    photosContainer: {
      flexGrow: 1,
    },
    photoContainer: {
      width: PHOTO_SIZE,
      height: PHOTO_SIZE,
      borderWidth: 0.5,
      borderColor: themeColors.textTertiary,
    },
    photo: {
      width: '100%',
      height: '100%',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: themeColors.textPrimary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: typography.fontSize.md,
      color: themeColors.textSecondary,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: SCREEN_WIDTH,
      maxHeight: '90%',
      backgroundColor: themeColors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.textTertiary,
    },
    modalTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: themeColors.textPrimary,
    },
    closeButton: {
      padding: spacing.sm,
    },
    modalImage: {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH,
    },
    modalDetails: {
      padding: spacing.lg,
    },
    restaurantName: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: themeColors.textPrimary,
      marginBottom: spacing.sm,
    },
    regionText: {
      fontSize: typography.fontSize.lg,
      color: themeColors.textSecondary,
      marginBottom: spacing.sm,
      fontWeight: typography.fontWeight.medium,
    },
    addressText: {
      fontSize: typography.fontSize.md,
      color: themeColors.textPrimary,
      marginBottom: spacing.md,
      lineHeight: 20,
    },
    photoInfo: {
      fontSize: typography.fontSize.sm,
      color: themeColors.textSecondary,
      marginTop: spacing.md,
      fontStyle: 'italic',
    },
    galleryContainer: {
      position: 'relative',
    },
    loadingOverlay: {
      position: 'absolute',
      bottom: spacing.lg,
      left: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
    },
    loadingAdditionalText: {
      color: 'white',
      fontSize: typography.fontSize.sm,
      marginLeft: spacing.sm,
    },
    paginationContainer: {
      position: 'absolute',
      bottom: spacing.lg,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    photoCounter: {
      position: 'absolute',
      top: spacing.lg,
      right: spacing.lg,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 16,
    },
    photoCounterText: {
      color: 'white',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.secondary} />
          <Text style={styles.loadingText}>Loading photos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={20}
            color={themeColors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants..."
            placeholderTextColor={themeColors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Photos Grid */}
      {filteredPhotos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="photo-library" size={64} color={themeColors.textSecondary} />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No photos found' : 'No photos available'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery
              ? 'Try searching for a different restaurant name'
              : 'Restaurant photos will appear here when available'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPhotos}
          renderItem={renderPhotoItem}
          numColumns={3}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.photosContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          style={{ flex: 1 }}
        />
      )}

      {/* Photo Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closePhotoModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Restaurant Photo</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closePhotoModal}
              >
                <MaterialIcons name="close" size={24} color={themeColors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Photo Gallery */}
              {selectedPhoto && (
                <>
                  <View style={styles.galleryContainer}>
                    <ScrollView
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      onScroll={handlePhotoScroll}
                      scrollEventThrottle={16}
                    >
                      {getAllPhotos().map((photoUrl, index) => (
                        <Image
                          key={index}
                          source={{ uri: photoUrl }}
                          style={styles.modalImage}
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>

                    {/* Loading indicator for additional photos */}
                    {loadingAdditionalPhotos && (
                      <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="small" color="white" />
                        <Text style={styles.loadingAdditionalText}>
                          Loading more photos...
                        </Text>
                      </View>
                    )}

                    {/* Photo pagination dots */}
                    {getAllPhotos().length > 1 && (
                      <View style={styles.paginationContainer}>
                        {getAllPhotos().map((_, index) => (
                          <View
                            key={index}
                            style={[
                              styles.paginationDot,
                              {
                                backgroundColor: index === currentPhotoIndex
                                  ? 'white'
                                  : 'rgba(255, 255, 255, 0.5)'
                              }
                            ]}
                          />
                        ))}
                      </View>
                    )}

                    {/* Photo counter */}
                    {getAllPhotos().length > 1 && (
                      <View style={styles.photoCounter}>
                        <Text style={styles.photoCounterText}>
                          {currentPhotoIndex + 1} / {getAllPhotos().length}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Restaurant Details */}
                  <View style={styles.modalDetails}>
                    <Text style={styles.restaurantName}>
                      {selectedPhoto.restaurantName || 'Unknown Restaurant'}
                    </Text>

                    {selectedPhoto.region && (
                      <Text style={styles.regionText}>
                        {selectedPhoto.region}
                      </Text>
                    )}

                    {selectedPhoto.address && (
                      <Text style={styles.addressText}>
                        📍 {selectedPhoto.address}
                      </Text>
                    )}

                    <Text style={styles.photoInfo}>
                      {getAllPhotos().length > 1
                        ? `${getAllPhotos().length} photos from this restaurant`
                        : 'Restaurant photo from our collection'}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}