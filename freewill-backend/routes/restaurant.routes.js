import express from 'express';
import { getRestaurants } from '../controllers/restaurant.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const restaurantRouter = express.Router();

restaurantRouter.get('/', authMiddleware, getRestaurants);

export default restaurantRouter;