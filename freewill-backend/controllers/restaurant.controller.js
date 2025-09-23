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
          address: restaurant.details,
          region: restaurant.region
        });
      }
      if (restaurant.photo2) {
        photos.push({
          id: `${restaurant._id}_2`,
          url: restaurant.photo2,
          restaurantId: restaurant._id,
          restaurantName: restaurant.restaurant_name,
          address: restaurant.details,
          region: restaurant.region
        });
      }
      if (restaurant.photo3) {
        photos.push({
          id: `${restaurant._id}_3`,
          url: restaurant.photo3,
          restaurantId: restaurant._id,
          restaurantName: restaurant.restaurant_name,
          address: restaurant.details,
          region: restaurant.region
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