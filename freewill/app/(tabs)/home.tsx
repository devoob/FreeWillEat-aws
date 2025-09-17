// app/(tabs)/home.tsx
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native'
import React, { useState, useEffect } from 'react' 
import { useRouter } from 'expo-router'
import { useTheme } from '@/contexts/ThemeContext'
import { MaterialIcons } from '@expo/vector-icons'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import SafeScreenContainer from '@/components/ui/SafeScreenContainer'
import SwipeCard, { Restaurant } from '@/components/ui/SwipeCard'
import { getColors, getComponentStyles, spacing, typography } from '@/styles/globalStyles'
import { useAuth } from '@/contexts/UserContext'


// Sample restaurant data
const sampleRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'The Italian Garden',
    type: 'Italian Cuisine',
    address: '123 Main Street, Downtown',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Sakura Sushi',
    type: 'Japanese Restaurant',
    address: '456 Oak Avenue, Midtown',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Burger Junction',
    type: 'American Fast Food',
    address: '789 Pine Road, Uptown',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.2,
  },
  {
    id: '4',
    name: 'Spice Palace',
    type: 'Indian Cuisine',
    address: '321 Cedar Lane, Eastside',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Le Petit Café',
    type: 'French Bistro',
    address: '654 Maple Street, Westside',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.7,
  },
  {
    id: '6',
    name: 'Dragon Garden',
    type: 'Chinese Cuisine',
    address: '987 Bamboo Avenue, Chinatown',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.4,
  },
  {
    id: '7',
    name: 'Taco Fiesta',
    type: 'Mexican Restaurant',
    address: '555 Salsa Street, South District',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.3,
  },
  {
    id: '8',
    name: 'The Steakhouse',
    type: 'American Steakhouse',
    address: '777 Beef Boulevard, Prime District',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.9,
  },
  {
    id: '9',
    name: 'Mediterranean Delight',
    type: 'Mediterranean Cuisine',
    address: '246 Olive Grove, Harbor View',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.6,
  },
  {
    id: '10',
    name: 'Pizza Corner',
    type: 'Italian Pizzeria',
    address: '888 Cheese Circle, Little Italy',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    rating: 4.5,
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Home = () => {
  const { activeTheme } = useTheme();
  const router = useRouter();
  const themeColors = getColors(activeTheme);
  const componentStyles = getComponentStyles(activeTheme);
  const { logout, user } = useAuth();
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>(sampleRestaurants);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedRestaurants, setLikedRestaurants] = useState<Restaurant[]>([]);
  const [showLikedScreen, setShowLikedScreen] = useState(false);
  const [imagesPrefetched, setImagesPrefetched] = useState(false);

  // Prefetch all restaurant images at startup
  useEffect(() => {
    const prefetchAllImages = async () => {
      console.log('Starting to prefetch all restaurant images...');
      const prefetchPromises = sampleRestaurants.map(restaurant => 
        Image.prefetch(restaurant.image).catch((error) => {
          console.log(`Failed to prefetch image for ${restaurant.name}:`, error);
        })
      );
      
      try {
        await Promise.all(prefetchPromises);
        console.log('All restaurant images prefetched successfully');
        setImagesPrefetched(true);
      } catch (error) {
        console.log('Some images failed to prefetch, but continuing anyway');
        setImagesPrefetched(true);
      }
    };

    prefetchAllImages();
  }, []);

  const handleSwipeLeft = (restaurant: Restaurant) => {
    console.log('Disliked:', restaurant.name);
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeRight = (restaurant: Restaurant) => {
    console.log('Liked:', restaurant.name);
    const newLikedRestaurants = [...likedRestaurants, restaurant];
    setLikedRestaurants(newLikedRestaurants);
    setCurrentIndex(prev => prev + 1);
    
    // Show liked screen after 5 likes
    if (newLikedRestaurants.length === 5) {
      setShowLikedScreen(true);
    }
  };


  const resetCards = () => {
    setCurrentIndex(0);
    setLikedRestaurants([]);
    setShowLikedScreen(false);
  };

  const closeLikedScreen = () => {
    setShowLikedScreen(false);
    // Reset likes after viewing the liked restaurants
    setLikedRestaurants([]);
  };

  // Show loading screen until images are prefetched
  if (!imagesPrefetched) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeScreenContainer style={[{ backgroundColor: themeColors.background }, styles.container]}>
          <View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color={themeColors.secondary} />
            <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>
              Preparing restaurants...
            </Text>
          </View>
        </SafeScreenContainer>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeScreenContainer style={[{ backgroundColor: themeColors.background }, styles.container]}>
        {/* Cards Container */}
        <View style={componentStyles.swipeCardContainer}>
        {currentIndex >= restaurants.length ? (
          <View style={styles.noMoreCards}>
            <MaterialIcons name="restaurant" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.noMoreCardsTitle, { color: themeColors.textPrimary }]}>
              No more restaurants!
            </Text>
            <Text style={[styles.noMoreCardsSubtitle, { color: themeColors.textSecondary }]}>
              You've seen all available restaurants
            </Text>
            <TouchableOpacity 
              style={[styles.resetCardsButton, { backgroundColor: themeColors.secondary }]}
              onPress={resetCards}
            >
              <Text style={styles.resetCardsButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Next card (background) */}
            {currentIndex + 1 < restaurants.length && (
              <SwipeCard
                key={restaurants[currentIndex + 1].id}
                restaurant={restaurants[currentIndex + 1]}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                isTop={false}
              />
            )}
            
            {/* Current card (top) */}
            <SwipeCard
              key={restaurants[currentIndex].id}
              restaurant={restaurants[currentIndex]}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              isTop={true}
            />
          </>
        )}
      </View>


      {/* Floating Like Counter */}
      <View style={styles.floatingControls}>
        <Text style={[styles.likeCounter, { color: themeColors.secondary }]}>
          ❤️ {likedRestaurants.length}
        </Text>
      </View>

      {/* Debug Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={async () => {await logout(); router.replace('/login')}}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Liked Restaurants Modal */}
      <Modal
        visible={showLikedScreen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeScreenContainer style={[{ backgroundColor: themeColors.background }, styles.container]}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>
              Your Liked Restaurants 🎉
            </Text>
            <TouchableOpacity onPress={closeLikedScreen} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Liked Restaurants List */}
          <ScrollView style={styles.likedList} showsVerticalScrollIndicator={false}>
            <Text style={[styles.likedSubtitle, { color: themeColors.textSecondary }]}>
              Great choices! Here are the 5 restaurants you liked:
            </Text>
            
            {likedRestaurants.map((restaurant, index) => (
              <View key={restaurant.id} style={[styles.likedItem, { backgroundColor: themeColors.backgroundWhite }]}>
                <Image source={{ uri: restaurant.image }} style={styles.likedImage} />
                <View style={styles.likedInfo}>
                  <Text style={[styles.likedName, { color: themeColors.textPrimary }]}>
                    {index + 1}. {restaurant.name}
                  </Text>
                  <Text style={[styles.likedType, { color: themeColors.textSecondary }]}>
                    {restaurant.type}
                  </Text>
                  <Text style={[styles.likedAddress, { color: themeColors.textTertiary }]}>
                    {restaurant.address}
                  </Text>
                  <View style={styles.likedRating}>
                    <MaterialIcons name="star" size={16} color={themeColors.secondary} />
                    <Text style={[styles.likedRatingText, { color: themeColors.textSecondary }]}>
                      {restaurant.rating?.toFixed(1)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity 
              style={[styles.continueButton, { backgroundColor: themeColors.secondary }]}
              onPress={closeLikedScreen}
            >
              <Text style={styles.continueButtonText}>Continue Discovering</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeScreenContainer>
      </Modal>

      </SafeScreenContainer>
    </GestureHandlerRootView>  
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingControls: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 1000,
  },
  likeCounter: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  resetButton: {
    padding: spacing.md,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  noMoreCards: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.massive,
    gap: spacing.lg,
  },
  noMoreCardsTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  noMoreCardsSubtitle: {
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  resetCardsButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 25,
  },
  resetCardsButtonText: {
    color: '#ffffff',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
  },
  logoutText: {
    fontSize: typography.fontSize.xs,
    color: '#666',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  closeButton: {
    padding: spacing.sm,
  },
  likedList: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  likedSubtitle: {
    fontSize: typography.fontSize.md,
    marginVertical: spacing.lg,
    textAlign: 'center',
  },
  likedItem: {
    flexDirection: 'row',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  likedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  likedInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  likedName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  likedType: {
    fontSize: typography.fontSize.md,
    marginBottom: spacing.xs,
  },
  likedAddress: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },
  likedRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  likedRatingText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  continueButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  loadingText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
  },
});