import express from 'express';
import { register, login, logout, getUser, appleLogin, linkAccount, getApiUsage, updateProfile } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/apple', appleLogin);
authRouter.post('/logout', logout);
authRouter.get('/me', authMiddleware, getUser);
authRouter.put('/profile', authMiddleware, updateProfile);

export default authRouter;