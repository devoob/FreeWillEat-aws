import express from 'express';
import { getRestaurants, getRestaurantPhotos } from '../controllers/restaurant.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const restaurantRouter = express.Router();

restaurantRouter.get('/', authMiddleware, getRestaurants);
restaurantRouter.get('/photos', authMiddleware, getRestaurantPhotos);

export default restaurantRouter;