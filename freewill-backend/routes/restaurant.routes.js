import express from 'express';
import { getRestaurants, getRestaurantById, getRestaurantPhotos } from '../controllers/restaurant.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const restaurantRouter = express.Router();

restaurantRouter.get('/', authMiddleware, getRestaurants);
restaurantRouter.get('/photos', authMiddleware, getRestaurantPhotos);
restaurantRouter.get('/:id', authMiddleware, getRestaurantById);

export default restaurantRouter;