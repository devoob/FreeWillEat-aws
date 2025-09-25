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

    // Extract only one photo per restaurant (prefer photo1, fallback to photo2, then photo3)
    const photos = [];
    restaurants.forEach(restaurant => {
      let photoUrl = null;
      let photoId = null;

      if (restaurant.photo1) {
        photoUrl = restaurant.photo1;
        photoId = `${restaurant._id}_1`;
      } else if (restaurant.photo2) {
        photoUrl = restaurant.photo2;
        photoId = `${restaurant._id}_2`;
      } else if (restaurant.photo3) {
        photoUrl = restaurant.photo3;
        photoId = `${restaurant._id}_3`;
      }

      if (photoUrl) {
        photos.push({
          id: photoId,
          url: photoUrl,
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

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the restaurant ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid restaurant ID format'
      });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    console.log('Found restaurant by ID:', {
      id: restaurant._id,
      name: restaurant.restaurant_name,
      photos: {
        photo1: !!restaurant.photo1,
        photo2: !!restaurant.photo2,
        photo3: !!restaurant.photo3,
        photo4: !!restaurant.photo4,
        photo5: !!restaurant.photo5,
      },
      likes: restaurant.like,
      dislikes: restaurant.dislike
    });

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error fetching restaurant by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant'
    });
  }
};