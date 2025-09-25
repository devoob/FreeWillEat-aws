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
  Alert,
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
import { useTheme } from '@/contexts/ThemeContext'
import { MaterialIcons } from '@expo/vector-icons'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import SafeScreenContainer from '@/components/ui/SafeScreenContainer'
import SwipeCard, { Restaurant } from '@/components/ui/SwipeCard'
import { getColors, getComponentStyles, spacing, typography } from '@/styles/globalStyles'
import { useAuth } from '@/contexts/UserContext'
import { fetchRestaurants } from '@/services/restaurantService'
import * as Location from 'expo-location'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withRepeat, 
  withTiming 
} from 'react-native-reanimated'


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

// Distance calculation function
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  // Convert to numbers in case they're strings
  const userLat = Number(lat1);
  const userLon = Number(lon1);
  const restLat = Number(lat2);
  const restLon = Number(lon2);

  console.log('Calculating distance between:', { userLat, userLon, restLat, restLon });

  const R = 6371; // Earth's radius in kilometers
  const dLat = (restLat - userLat) * Math.PI / 180;
  const dLon = (restLon - userLon) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(userLat * Math.PI / 180) * Math.cos(restLat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  console.log('Calculated distance:', distance);
  return distance;
};

const Home = () => {
  const { activeTheme } = useTheme();
  const router = useRouter();
  const themeColors = getColors(activeTheme);
  const componentStyles = getComponentStyles(activeTheme);
  const { logout, user } = useAuth();

  // Animation values
  const likeButtonScale = useSharedValue(1);
  const pulseAnimation = useSharedValue(1);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedRestaurants, setLikedRestaurants] = useState<Restaurant[]>([]);
  const [showLikedScreen, setShowLikedScreen] = useState(false);
  const [imagesPrefetched, setImagesPrefetched] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [distancesCalculated, setDistancesCalculated] = useState(false);

  // Start pulse animation on mount
  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withTiming(1.05, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  // Animation styles
  const likeButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeButtonScale.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setLocationPermission(true);
          try {
            const location = await Location.getCurrentPositionAsync({});
            setUserLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });
          } catch (locError) {
            console.log('Error getting location:', locError);
            // Fallback to Hong Kong location if GPS fails
            setUserLocation({
              latitude: 22.3193,
              longitude: 114.1694
            });
          }
        } else {
          Alert.alert(
            'Location Permission',
            'Location permission is required to show distance to restaurants.',
            [{ text: 'OK' }]
          );
        }

        // Fetch restaurants from database
        const fetchedRestaurants = await fetchRestaurants();

        // Set restaurants first, distances will be calculated in the useEffect
        setRestaurants(fetchedRestaurants);

        // Prefetch first 10 images immediately, then continue with the rest
        console.log('Starting to prefetch restaurant images...');
        const firstBatch = fetchedRestaurants.slice(0, 10);
        const remainingBatch = fetchedRestaurants.slice(10);

        // Prefetch first 10 images
        const firstBatchPromises = firstBatch.map(restaurant =>
          Image.prefetch(restaurant.image).catch((error) => {
            console.log(`Failed to prefetch image for ${restaurant.name}:`, error);
          })
        );

        await Promise.all(firstBatchPromises);
        console.log('First 10 images prefetched successfully');
        setImagesPrefetched(true);

        // Continue prefetching remaining images in background
        if (remainingBatch.length > 0) {
          console.log(`Continuing to prefetch ${remainingBatch.length} more images in background...`);
          const remainingPromises = remainingBatch.map(restaurant =>
            Image.prefetch(restaurant.image).catch((error) => {
              console.log(`Failed to prefetch image for ${restaurant.name}:`, error);
            })
          );

          Promise.all(remainingPromises).then(() => {
            console.log('All remaining images prefetched successfully');
          }).catch(() => {
            console.log('Some remaining images failed to prefetch, but continuing anyway');
          });
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        Alert.alert('Error', 'Failed to load restaurants. Please try again.');
        // Fallback to sample data
        setRestaurants(sampleRestaurants);
        setImagesPrefetched(true);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Calculate distances when both location and restaurants are available
  useEffect(() => {
    if (userLocation && restaurants.length > 0 && !distancesCalculated) {
      console.log('Calculating distances for restaurants');
      console.log('User location:', userLocation);
      console.log('Restaurants count:', restaurants.length);

      const restaurantsWithDistance = restaurants.map(restaurant => {
        if (restaurant.lat && restaurant.lng) {
          console.log(`Restaurant ${restaurant.name}:`, { lat: restaurant.lat, lng: restaurant.lng });
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            restaurant.lat,
            restaurant.lng
          );
          console.log(`Distance to ${restaurant.name}:`, distance);
          return { ...restaurant, distance: Math.round(distance * 10) / 10 };
        } else {
          console.log(`Restaurant ${restaurant.name} has no coordinates`);
          return restaurant;
        }
      });

      setRestaurants(restaurantsWithDistance);
      setDistancesCalculated(true);
    }
  }, [userLocation, restaurants.length, distancesCalculated]);

  const handleSwipeLeft = (restaurant: Restaurant) => {
    console.log('Disliked:', restaurant.name);
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeRight = (restaurant: Restaurant) => {
    console.log('Liked:', restaurant.name);
    const newLikedRestaurants = [...likedRestaurants, restaurant];
    setLikedRestaurants(newLikedRestaurants);
    setCurrentIndex(prev => prev + 1);
    
    // Animate like button with Apple-style feedback
    likeButtonScale.value = withSpring(0.95, { 
      damping: 15, 
      stiffness: 300 
    }, () => {
      likeButtonScale.value = withSpring(1, { 
        damping: 15, 
        stiffness: 300 
      });
    });
    
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

  // Show loading screen until everything is ready
  if (loading || !imagesPrefetched) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeScreenContainer style={[{ backgroundColor: themeColors.background }, styles.container]}>
          <View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color={themeColors.secondary} />
            <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>
              {loading ? 'Loading restaurants...' : 'Preparing restaurants...'}
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


      {/* Modern Like Button */}
      <View style={styles.floatingControls}>
        {/* Pulse background for visual appeal */}
        <Animated.View 
          style={[
            styles.pulseBackground, 
            { backgroundColor: `${themeColors.secondary}20` },
            pulseAnimatedStyle
          ]} 
        />
        <Animated.View style={likeButtonAnimatedStyle}>
          <TouchableOpacity 
            style={[
              styles.modernLikeButton, 
              { backgroundColor: themeColors.secondary },
              activeTheme === 'dark' && styles.darkModeButton
            ]}
            onPress={() => setShowLikedScreen(true)}
            activeOpacity={0.7}
          >
            <View style={styles.likeButtonContent}>
              <MaterialIcons name="favorite" size={18} color="#ffffff" />
              <Text style={styles.likeButtonText}>{likedRestaurants.length}</Text>
            </View>
            {likedRestaurants.length > 0 && (
              <View style={[styles.likeButtonBadge, { backgroundColor: '#ff4757' }]}>
                <Text style={styles.badgeText}>!</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
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
    left: spacing.xl,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseBackground: {
    position: 'absolute',
    width: 94,
    height: 54,
    borderRadius: 27,
    opacity: 0.15,
  },
  modernLikeButton: {
    position: 'relative',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minWidth: 80,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  darkModeButton: {
    borderColor: 'rgba(255,255,255,0.1)',
    shadowOpacity: 0.4,
  },
  likeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  likeButtonText: {
    color: '#ffffff',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.5,
  },
  likeButtonBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
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