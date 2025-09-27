// backend/models/Restaurant.js
import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  details: {
    type: String,
    required: false,
  },
  lat: {
    type: Number,
    required: false,
  },
  lng: {
    type: Number,
    required: false,
  },
  photo1: {
    type: String,
    required: false,
  },
  photo2: {
    type: String,
    required: false,
  },
  photo3: {
    type: String,
    required: false,
  },
  photo4: {
    type: String,
    required: false,
  },
  photo5: {
    type: String,
    required: false,
  },
  region: {
    type: String,
    required: false,
  },
  restaurant_name: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  netLike: {
    type: Number,
    default: 0,
  },
  likeRatio: {
    type: Number,
    required: false,
  },
  avgPrice: {
    type: Number,
    required: false,
  }
}, { timestamps: true });

export default mongoose.model('Restaurant', RestaurantSchema);