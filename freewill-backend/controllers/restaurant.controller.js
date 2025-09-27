import Restaurant from '../models/Restaurant.js';

export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    console.log('Found restaurants from DB:', restaurants.length);
    restaurants.forEach((restaurant, index) => {
      console.log(`Restaurant ${index + 1}:`, {
        name: restaurant.restaurant_name,
        lat: restaurant.lat,
        lng: restaurant.lng,
        lat_type: typeof restaurant.lat,
        lng_type: typeof restaurant.lng
      });
    });

    res.status(200).json({
      success: true,
      data: restaurants
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurants'
    });
  }
};

export const getRestaurantPhotos = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    // Extract all photos from restaurants
    const photos = [];
    restaurants.forEach(restaurant => {
      if (restaurant.photo1) {
        photos.push({
          id: `${restaurant._id}_1`,
          url: restaurant.photo1,
          restaurantId: restaurant._id,
          restaurantName: restaurant.restaurant_name,
          address: restaurant.address,
          region: restaurant.region,
          avgPrice: restaurant.avgPrice
        });
      }
      if (restaurant.photo2) {
        photos.push({
          id: `${restaurant._id}_2`,
          url: restaurant.photo2,
          restaurantId: restaurant._id,
          restaurantName: restaurant.restaurant_name,
          address: restaurant.address,
          region: restaurant.region,
          avgPrice: restaurant.avgPrice
        });
      }
      if (restaurant.photo3) {
        photos.push({
          id: `${restaurant._id}_3`,
          url: restaurant.photo3,
          restaurantId: restaurant._id,
          restaurantName: restaurant.restaurant_name,
          address: restaurant.address,
          region: restaurant.region,
          avgPrice: restaurant.avgPrice
        });
      }
    });

    // Shuffle photos randomly
    const shuffledPhotos = photos.sort(() => Math.random() - 0.5);

    res.status(200).json({
      success: true,
      data: shuffledPhotos
    });
  } catch (error) {
    console.error('Error fetching restaurant photos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant photos'
    });
  }
};

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Helper function for Z-score standardization
const standardizeValues = (values) => {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Avoid division by zero
  if (stdDev === 0) return values.map(() => 0);

  return values.map(val => (val - mean) / stdDev);
};

export const getRecommendedRestaurants = async (req, res) => {
  try {
    const { userLat, userLng } = req.query;

    if (!userLat || !userLng) {
      return res.status(400).json({
        success: false,
        message: 'User latitude and longitude are required'
      });
    }

    const userLatitude = parseFloat(userLat);
    const userLongitude = parseFloat(userLng);

    // Get all restaurants from database
    const restaurants = await Restaurant.find();

    if (restaurants.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Calculate raw scores for each restaurant
    const restaurantData = restaurants.map(restaurant => {
      const distance = calculateDistance(
        userLatitude,
        userLongitude,
        restaurant.lat || 0,
        restaurant.lng || 0
      );

      return {
        restaurant,
        netLike: restaurant.netLike || 0,
        likeRatio: restaurant.likeRatio || 0,
        avgPrice: restaurant.avgPrice || 0,
        distance
      };
    });

    // Extract values for standardization
    const netLikes = restaurantData.map(r => r.netLike);
    const likeRatios = restaurantData.map(r => r.likeRatio);
    const avgPrices = restaurantData.map(r => r.avgPrice);
    const distances = restaurantData.map(r => r.distance);

    // Standardize each metric using Z-score
    const standardizedNetLikes = standardizeValues(netLikes);
    const standardizedLikeRatios = standardizeValues(likeRatios);
    const standardizedAvgPrices = standardizeValues(avgPrices);
    const standardizedDistances = standardizeValues(distances);

    // Calculate final scores and sort
    const scoredRestaurants = restaurantData.map((data, index) => {
      const score =
        0.2 * standardizedNetLikes[index] +
        0.1 * standardizedLikeRatios[index] +
        0.3 * (1 - standardizedAvgPrices[index]) + // Higher price = lower score
        0.4 * (1 - standardizedDistances[index]); // Greater distance = lower score

      return {
        ...data.restaurant.toObject(),
        score,
        distance: data.distance
      };
    });

    // Sort by score descending and take top 100
    const topRestaurants = scoredRestaurants
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);

    res.status(200).json({
      success: true,
      data: topRestaurants
    });

  } catch (error) {
    console.error('Error getting recommended restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommended restaurants'
    });
  }
};