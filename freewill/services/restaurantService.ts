import api from './apiClient';
import { Restaurant } from '@/components/ui/SwipeCard';

export interface RestaurantFromDB {
  _id: string;
  details?: string;
  lat?: number;
  lng?: number;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  region?: string;
  restaurant_name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RestaurantPhoto {
  id: string;
  url: string;
  restaurantId: string;
  restaurantName: string;
  address?: string;
  region?: string;
}

export const fetchRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await api.get('/restaurants');
    const restaurants: RestaurantFromDB[] = response.data.data;

    console.log('Raw API response:', JSON.stringify(response.data, null, 2));
    console.log('Number of restaurants:', restaurants.length);

    // Transform DB format to app format
    const transformedRestaurants = restaurants.map(restaurant => {
      console.log('Processing restaurant:', {
        name: restaurant.restaurant_name,
        raw_lat: restaurant.lat,
        raw_lng: restaurant.lng,
        lat_type: typeof restaurant.lat,
        lng_type: typeof restaurant.lng
      });

      return {
        id: restaurant._id,
        name: restaurant.restaurant_name || 'Unknown Restaurant',
        type: restaurant.region || 'Restaurant',
        address: restaurant.details || 'Address not available',
        image: restaurant.photo1 || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        rating: 4.0, // Default rating since we don't have it in DB yet
        lat: restaurant.lat,
        lng: restaurant.lng
      };
    });

    console.log('Transformed restaurants:', transformedRestaurants.map(r => ({
      name: r.name,
      lat: r.lat,
      lng: r.lng
    })));

    return transformedRestaurants;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

export const fetchRestaurantPhotos = async (): Promise<RestaurantPhoto[]> => {
  try {
    const response = await api.get('/restaurants/photos');
    const photos: RestaurantPhoto[] = response.data.data;

    console.log('Fetched photos:', photos.length);
    return photos;
  } catch (error) {
    console.error('Error fetching restaurant photos:', error);
    throw error;
  }
};

export const getAiRestaurantSuggestion = async (message: string): Promise<string> => {
  try {
    const response = await api.post('/restaurants/ai-suggestion', { message });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching AI restaurant suggestion:', error);
    throw error;
  }
};