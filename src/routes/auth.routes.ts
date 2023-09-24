import express from 'express';
import {
  forgotPasswordHandler,
  loginUserHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerUserHandler,
  resendOTPHandler,
  resetPasswordHandler,
  verifyOTPHandler,
} from '../controllers/auth.controller';

import deserializeUser from '../middleware/deserializeUser';
import requireUser from '../middleware/requireUser';

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

// forgot password
authRouter.post('/forgot-password', forgotPasswordHandler);

// verify otp
authRouter.post('/verify-otp', verifyOTPHandler);

// reset password
authRouter.post('/reset-password', resetPasswordHandler);

// resend OTP
authRouter.post('/resendOTP', resendOTPHandler);

export default authRouter;
