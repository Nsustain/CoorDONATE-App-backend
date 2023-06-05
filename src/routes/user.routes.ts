import express from 'express';
import getMeHandler from '../controllers/user.controller.ts';
import deserializeUser from '../middleware/deserializeUser.ts';
import requireUser from '../middleware/requireUser.ts';

const userRouter = express.Router();

userRouter.use(deserializeUser, requireUser);

// Get currently logged in user
userRouter.get('/me', getMeHandler);

export default userRouter;
