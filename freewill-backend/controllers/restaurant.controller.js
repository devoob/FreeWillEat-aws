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