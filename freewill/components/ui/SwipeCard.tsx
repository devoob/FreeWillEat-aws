import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, spacing, typography, borderRadius, shadows } from '@/styles/globalStyles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export interface Restaurant {
  id: string;
  name: string;
  type: string;
  address: string;
  image: string;
  rating?: number;
  lat?: number;
  lng?: number;
  distance?: number;
}

interface SwipeCardProps {
  restaurant: Restaurant;
  onSwipeLeft: (restaurant: Restaurant) => void;
  onSwipeRight: (restaurant: Restaurant) => void;
  isTop?: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  restaurant,
  onSwipeLeft,
  onSwipeRight,
  isTop = false,
}) => {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(isTop ? 1 : 0.95);
  const opacity = useSharedValue(1);

  // Reset values when card changes
  useEffect(() => {
    setImageLoaded(false); // Reset image loaded state
    setImageError(false);
    translateX.value = 0;
    rotate.value = 0;
    scale.value = withSpring(isTop ? 1 : 0.95);
    opacity.value = 1;

    const checkImageLoad = () => {
      Image.prefetch(restaurant.image)
        .then(() => {
          setImageLoaded(true);
          setImageError(false);
        })
        .catch((error) => {
          console.log(`Image failed to load for ${restaurant.name}:`, error);
          setImageLoaded(true); // Still show the card even if image fails
          setImageError(true);
        });
    };

    checkImageLoad();
  }, [restaurant.id, isTop, restaurant.image]);

  const handleSwipeComplete = (direction: number) => {
    if (direction > 0) {
      onSwipeRight(restaurant);
    } else {
      onSwipeLeft(restaurant);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / 10; // Rotation based on horizontal movement
    })
    .onEnd((event) => {
      const shouldSwipe = Math.abs(event.translationX) > SWIPE_THRESHOLD || Math.abs(event.velocityX) > 500;
      
      if (shouldSwipe) {
        const direction = event.translationX > 0 ? 1 : -1;
        
        translateX.value = withTiming(direction * SCREEN_WIDTH * 1.5, { duration: 300 });
        rotate.value = withTiming(direction * 30, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(handleSwipeComplete)(direction);
        });
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  const likeIndicatorStyle = useAnimatedStyle(() => {
    const opacity = translateX.value > 0 ? Math.min(translateX.value / SWIPE_THRESHOLD, 1) : 0;
    return { opacity };
  });

  const nopeIndicatorStyle = useAnimatedStyle(() => {
    const opacity = translateX.value < 0 ? Math.min(-translateX.value / SWIPE_THRESHOLD, 1) : 0;
    return { opacity };
  });

  // Show loading state until image is loaded
  if (!imageLoaded) {
    return (
      <Reanimated.View style={[styles.card, animatedStyle]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.secondary} />
          <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>
            Loading {restaurant.name}...
          </Text>
        </View>
      </Reanimated.View>
    );
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Reanimated.View style={[styles.card, animatedStyle]}>
        {imageError ? (
          <View style={[styles.cardImage, styles.errorContainer]}>
            <MaterialIcons name="image-not-supported" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.errorText, { color: themeColors.textSecondary }]}>
              Image not available
            </Text>
            <View style={styles.gradient}>
              <View style={styles.cardContent}>
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.restaurantType}>{restaurant.type}</Text>
                  <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
                  <View style={styles.metaContainer}>
                    {restaurant.rating && (
                      <View style={styles.ratingContainer}>
                        <MaterialIcons name="star" size={16} color={themeColors.secondary} />
                        <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
                      </View>
                    )}
                    <View style={styles.distanceContainer}>
                      <MaterialIcons name="place" size={16} color="#e5e7eb" />
                      <Text style={styles.distanceText}>
                        {restaurant.distance ? `${restaurant.distance} km away` : 'Distance: N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <ImageBackground
            source={{ uri: restaurant.image }}
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
            resizeMode="cover"
            onLoad={() => console.log(`ImageBackground loaded for ${restaurant.name}`)}
            onError={(error) => console.log(`ImageBackground error for ${restaurant.name}:`, error)}
          >
            <View style={styles.gradient}>
              <View style={styles.cardContent}>
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.restaurantType}>{restaurant.type}</Text>
                  <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
                  <View style={styles.metaContainer}>
                    {restaurant.rating && (
                      <View style={styles.ratingContainer}>
                        <MaterialIcons name="star" size={16} color={themeColors.secondary} />
                        <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
                      </View>
                    )}
                    <View style={styles.distanceContainer}>
                      <MaterialIcons name="place" size={16} color="#e5e7eb" />
                      <Text style={styles.distanceText}>
                        {restaurant.distance ? `${restaurant.distance} km away` : 'Distance: N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        )}
        
        {/* Like/Nope Indicators overlay */}
        <Reanimated.View style={[styles.indicator, styles.likeIndicator, likeIndicatorStyle]}>
          <MaterialIcons name="favorite" size={40} color="#4ade80" />
          <Text style={[styles.indicatorText, { color: '#4ade80' }]}>LIKE</Text>
        </Reanimated.View>

        <Reanimated.View style={[styles.indicator, styles.nopeIndicator, nopeIndicatorStyle]}>
          <MaterialIcons name="close" size={40} color="#ef4444" />
          <Text style={[styles.indicatorText, { color: '#ef4444' }]}>NOPE</Text>
        </Reanimated.View>
      </Reanimated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT * 0.7,
    borderRadius: 20,
    ...shadows.large,
  },
  cardImage: {
    flex: 1,
    borderRadius: 20,
  },
  cardImageStyle: {
    borderRadius: 20,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cardContent: {
    padding: spacing.xl,
  },
  restaurantInfo: {
    gap: spacing.sm,
  },
  restaurantName: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: '#ffffff',
  },
  restaurantType: {
    fontSize: typography.fontSize.lg,
    color: '#e5e7eb',
    fontWeight: typography.fontWeight.medium,
  },
  restaurantAddress: {
    fontSize: typography.fontSize.md,
    color: '#d1d5db',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    fontSize: typography.fontSize.md,
    color: '#ffffff',
    fontWeight: typography.fontWeight.semibold,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  distanceText: {
    fontSize: typography.fontSize.sm,
    color: '#e5e7eb',
    fontWeight: typography.fontWeight.medium,
  },
  indicator: {
    position: 'absolute',
    top: 100,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    alignItems: 'center',
    gap: spacing.sm,
  },
  likeIndicator: {
    right: 20,
    borderColor: '#4ade80',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  nopeIndicator: {
    left: 20,
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  indicatorText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    gap: spacing.sm,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});

export default SwipeCard;