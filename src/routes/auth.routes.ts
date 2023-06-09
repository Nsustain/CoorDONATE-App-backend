import express from 'express';
import {
  loginUserHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerUserHandler,
} from '../controllers/auth.controller.ts';

import deserializeUser from '../middleware/deserializeUser.ts';
import requireUser from '../middleware/requireUser.ts';
import validate from '../middleware/validate.ts';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema.ts';

const authRouter = express.Router();

// Register user
// use create user schema middleware
// authRouter.post('/register', validate(createUserSchema), registerUserHandler);
authRouter.post('/register', registerUserHandler);

// Login user
// authRouter.post('/login', validate(loginUserSchema), loginUserHandler);
authRouter.post('/login', loginUserHandler);

// Logout user
authRouter.get('/logout', deserializeUser, requireUser, logoutHandler);

// Refresh access token
authRouter.get('/refresh', refreshAccessTokenHandler);

export default authRouter;
