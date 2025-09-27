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
  ScrollView,
  Animated,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/UserContext';
import { getColors, spacing, typography, borderRadius } from '@/styles/globalStyles';
import { fetchRestaurantPhotos, RestaurantPhoto } from '@/services/restaurantService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = SCREEN_WIDTH / 3; // 3 columns

export default function ExploreScreen() {
  const { activeTheme } = useTheme();
  const { saveRestaurant, unsaveRestaurant, isRestaurantSaved, savedRestaurants } = useAuth();
  const themeColors = getColors(activeTheme);

  // Photos + search
  const [photos, setPhotos] = useState<RestaurantPhoto[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<RestaurantPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal + interactions
  const [selectedPhoto, setSelectedPhoto] = useState<RestaurantPhoto | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});
  const [savedPhotos, setSavedPhotos] = useState<Record<string, boolean>>({});
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [photoComments, setPhotoComments] = useState<Record<string, { id: string; text: string; createdAt: number }[]>>({});
  const [newComment, setNewComment] = useState('');

  // Animation values
  const [likeAnimation] = useState(new Animated.Value(1));
  const [saveAnimation] = useState(new Animated.Value(1));

  // Load photos
  useEffect(() => {
    loadPhotos();
  }, []);

  // Sync savedPhotos with global savedRestaurants
  useEffect(() => {
    const newSavedPhotos: Record<string, boolean> = {};
    savedRestaurants.forEach(restaurant => {
      newSavedPhotos[restaurant.id] = true;
    });
    setSavedPhotos(newSavedPhotos);
  }, [savedRestaurants]);

  const loadPhotos = async () => {
    try {
      const fetched = await fetchRestaurantPhotos();
      // Shuffle photos for refresh variety
      const shuffled = [...fetched].sort(() => Math.random() - 0.5);
      setPhotos(shuffled);
      setFilteredPhotos(shuffled);
    } catch (e) {
      console.error('Error loading photos:', e);
      Alert.alert('Error', 'Failed to load restaurant photos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPhotos();
  };

  // Filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPhotos(photos);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredPhotos(
        photos.filter((p) => p.restaurantName?.toLowerCase().includes(q))
      );
    }
  }, [searchQuery, photos]);

  // Modal handlers
  const openPhotoModal = (photo: RestaurantPhoto) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
    // Initialize local counts/comments once
    setLikesCount((prev) => ({
      ...prev,
      [photo.id]: prev[photo.id] ?? Math.floor(Math.random() * 50),
    }));
    setPhotoComments((prev) => ({ ...prev, [photo.id]: prev[photo.id] ?? [] }));
  };

  const closePhotoModal = () => {
    setModalVisible(false);
    setSelectedPhoto(null);
    setNewComment('');
  };

  // Interactions
  const toggleLike = () => {
    if (!selectedPhoto) return;
    const id = selectedPhoto.id;
    
    // Animate like button with smoother spring bounce
    Animated.sequence([
      Animated.spring(likeAnimation, {
        toValue: 1.4,
        friction: 5,
        tension: 140,
        useNativeDriver: true,
      }),
      Animated.spring(likeAnimation, {
        toValue: 1,
        friction: 7,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();

    setLikedPhotos((prev) => ({ ...prev, [id]: !prev[id] }));
    setLikesCount((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + (likedPhotos[id] ? -1 : 1),
    }));
  };

  const toggleSave = () => {
    if (!selectedPhoto) return;
    const id = selectedPhoto.id;
    const wasSaved = savedPhotos[id];
    
    // Animate save button with spring for smoother feel
    Animated.sequence([
      Animated.spring(saveAnimation, {
        toValue: 1.35,
        friction: 5,
        tension: 150,
        useNativeDriver: true,
      }),
      Animated.spring(saveAnimation, {
        toValue: 1,
        friction: 7,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();

    // Update local state
    setSavedPhotos((prev) => ({ ...prev, [id]: !prev[id] }));

    // Update global saved restaurants
    if (wasSaved) {
      unsaveRestaurant(id);
    } else {
      saveRestaurant({
        id: selectedPhoto.id,
        name: selectedPhoto.restaurantName || 'Unknown Restaurant',
        image: selectedPhoto.url,
        cuisine: selectedPhoto.region,
        rating: 4.2 // Default rating for now
      });
    }
  };

  const addComment = () => {
    if (!selectedPhoto) return;
    const text = newComment.trim();
    if (!text) return;
    const id = selectedPhoto.id;
    const comment = { id: `${Date.now()}`, text, createdAt: Date.now() };
    setPhotoComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] ?? []), comment],
    }));
    setNewComment('');
  };

  // Grid item
  const renderPhotoItem = ({ item }: { item: RestaurantPhoto }) => (
    <TouchableOpacity style={styles.photoContainer} onPress={() => openPhotoModal(item)}>
      <Image source={{ uri: item.url }} style={styles.photo} resizeMode="cover" />
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
    searchIcon: { marginRight: spacing.sm },
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
    photosContainer: { flexGrow: 1 },
    photoContainer: {
      width: PHOTO_SIZE,
      height: PHOTO_SIZE,
      borderWidth: 0.5,
      borderColor: themeColors.textTertiary,
    },
    photo: { width: '100%', height: '100%' },
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
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      overflow: 'hidden',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.textTertiary,
      backgroundColor: themeColors.backgroundWhite,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    modalTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: themeColors.textPrimary,
    },
    closeButton: { padding: spacing.sm },
    imageWrapper: {
      margin: spacing.lg,
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: themeColors.backgroundWhite,
      borderWidth: 1,
      borderColor: themeColors.textTertiary,
      // subtle shadow for postcard feel
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    modalImage: { 
      width: '100%', 
      height: SCREEN_WIDTH * 0.7,
      borderRadius: 20,
    },
    // Actions + details
    actionBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    actionLeft: { flexDirection: 'row', alignItems: 'center' },
    actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: spacing.lg },
    iconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionText: { marginLeft: spacing.xs, fontSize: typography.fontSize.md, color: themeColors.textPrimary },
    modalDetails: { padding: spacing.lg },
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
    addressText: { fontSize: typography.fontSize.md, color: themeColors.textPrimary, marginBottom: spacing.md, lineHeight: 20 },
    priceText: { fontSize: typography.fontSize.md, color: themeColors.textPrimary, marginBottom: spacing.md, lineHeight: 20, fontWeight: typography.fontWeight.medium },
    photoInfo: { fontSize: typography.fontSize.sm, color: themeColors.textSecondary, marginTop: spacing.md, fontStyle: 'italic' },
    // Comments
    commentsContainer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
    commentItem: { marginBottom: spacing.sm },
    commentText: { fontSize: typography.fontSize.md, color: themeColors.textPrimary, lineHeight: 20 },
    commentMeta: { fontSize: typography.fontSize.sm, color: themeColors.textSecondary, marginTop: spacing.xs },
    commentInputRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderTopWidth: 1,
      borderTopColor: themeColors.textTertiary,
      backgroundColor: themeColors.backgroundWhite,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    commentInput: { 
      flex: 1, 
      fontSize: typography.fontSize.md, 
      color: themeColors.textPrimary, 
      marginRight: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: themeColors.background,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: themeColors.borderLight,
      minHeight: 40,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.secondary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={themeColors.textSecondary} style={styles.searchIcon} />
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
          <Text style={styles.emptyTitle}>{searchQuery ? 'No photos found' : 'No photos available'}</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery ? 'Try searching for a different restaurant name' : 'Restaurant photos will appear here when available'}
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={themeColors.textPrimary}
              colors={[themeColors.textPrimary]}
              title="Pull to refresh"
              titleColor={themeColors.textSecondary}
            />
          }
        />
      )}

      {/* Photo Detail Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={closePhotoModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Restaurant Photo</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closePhotoModal}>
                <MaterialIcons name="close" size={24} color={themeColors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedPhoto && (
                <>
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: selectedPhoto.url }} style={styles.modalImage} resizeMode="cover" />
                  </View>

                  {/* Actions */}
                  <View style={styles.actionBar}>
                    <View style={styles.actionLeft}>
                      <TouchableOpacity onPress={toggleLike} style={styles.actionButton} activeOpacity={0.8}>
                        <Animated.View style={[styles.iconCircle, { transform: [{ scale: likeAnimation }] }]}> 
                          <MaterialIcons
                            name={likedPhotos[selectedPhoto.id] ? 'favorite' : 'favorite-border'}
                            size={30}
                            color={likedPhotos[selectedPhoto.id] ? themeColors.secondary : themeColors.textPrimary}
                          />
                        </Animated.View>
                        <Text style={[styles.actionText, { fontWeight: typography.fontWeight.medium }]}>{likesCount[selectedPhoto.id] ?? 0}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={toggleSave} style={styles.actionButton} activeOpacity={0.8}>
                        <Animated.View style={[styles.iconCircle, { transform: [{ scale: saveAnimation }] }]}> 
                          <MaterialIcons
                            name={savedPhotos[selectedPhoto.id] ? 'bookmark' : 'bookmark-border'}
                            size={30}
                            color={savedPhotos[selectedPhoto.id] ? themeColors.secondary : themeColors.textPrimary}
                          />
                        </Animated.View>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.actionButton}>
                      <View style={styles.iconCircle}>
                        <MaterialIcons name="mode-comment" size={30} color={themeColors.textPrimary} />
                      </View>
                      <Text style={[styles.actionText, { fontWeight: typography.fontWeight.medium }]}>{(photoComments[selectedPhoto.id] ?? []).length}</Text>
                    </View>
                  </View>

                  {/* Details */}
                  <View style={styles.modalDetails}>
                    <Text style={styles.restaurantName}>{selectedPhoto.restaurantName || 'Unknown Restaurant'}</Text>
                    {selectedPhoto.region && <Text style={styles.regionText}>{selectedPhoto.region}</Text>}
                    {selectedPhoto.address && <Text style={styles.addressText}>📍 {selectedPhoto.address}</Text>}
                    {selectedPhoto.avgPrice && <Text style={styles.priceText}>💰 Average Price: ${selectedPhoto.avgPrice}</Text>}
                    <Text style={styles.photoInfo}>Restaurant photo from our collection</Text>
                  </View>

                  {/* Comments */}
                  <View style={styles.commentsContainer}>
                    {(photoComments[selectedPhoto.id] ?? []).map((c) => (
                      <View key={c.id} style={styles.commentItem}>
                        <Text style={styles.commentText}>{c.text}</Text>
                        <Text style={styles.commentMeta}>{new Date(c.createdAt).toLocaleString()}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>

            {/* Comment input */}
            {selectedPhoto && (
              <View style={styles.commentInputRow}>
                <View style={[styles.commentInput, { flexDirection: 'row', alignItems: 'flex-start', paddingTop: spacing.sm }]}>
                  <MaterialIcons name="account-circle" size={20} color={themeColors.textSecondary} style={{ marginRight: spacing.xs, marginTop: spacing.xs }} />
                  <TextInput
                    style={{ 
                      flex: 1, 
                      fontSize: typography.fontSize.md, 
                      color: themeColors.textPrimary,
                      textAlignVertical: 'top',
                      paddingTop: spacing.xs,
                    }}
                    placeholder="Add a comment..."
                    placeholderTextColor={themeColors.textSecondary}
                    value={newComment}
                    onChangeText={setNewComment}
                    onSubmitEditing={addComment}
                    returnKeyType="send"
                    multiline
                  />
                </View>
                <TouchableOpacity onPress={addComment} style={{
                  backgroundColor: newComment.trim() ? themeColors.secondary : themeColors.borderLight,
                  borderRadius: 20,
                  padding: spacing.sm,
                  marginLeft: spacing.xs,
                  alignSelf: 'flex-start',
                  marginTop: spacing.xs,
                }}>
                  <MaterialIcons 
                    name="send" 
                    size={20} 
                    color={newComment.trim() ? '#ffffff' : themeColors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}