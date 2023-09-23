import config from 'config';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { CreateUserInput, LoginUserInput } from '../schemas/user.schema';
import {
  createUser,
  findUserByEmail,
  findUserById,
  signTokens,
} from '../services/user.service';
import AppError from '../utils/appError';
import { User } from '../entities/user.entity';
import { signJwt, verifyJwt } from '../utils/jwt';
import AppDataSource from '../config/ormconfig';
import UserSession from '../entities/user.session';
import { KeyFunction } from '../utils/keyFactory';
import UserSerializer from '../serializers/userSerializer';
import { AuthConfig } from '../config/authConfig';

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
};


const userSessionRepository = AppDataSource.getRepository(UserSession);

export const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + AuthConfig.ACCESS_TOKEN_EXPIRES_IN * 60 * 1000
  ),
  maxAge: AuthConfig.ACCESS_TOKEN_EXPIRES_IN * 60 * 1000,
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + AuthConfig.REFRESH_TOKEN_EXPIRES_IN * 60 * 1000
  ),
  maxAge: AuthConfig.REFRESH_TOKEN_EXPIRES_IN * 60 * 1000,
};



// Register new user
export const registerUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, username, password, email } = req.body;

    const user = await createUser({
      name,
      username,
      email: email.toLowerCase(),
      password,

    });


    res.status(201).json({
      status: 'success',
      data: {
          user,
      },
    });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'User with that email already exists',
      });
    }

    next(err);
  }
};

// Login user controller
export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail({ email });

    // Check if user exists and password is valid
    if (!user || !(await User.comparePasswords(password, user.password))) {
      return next(new AppError(400, 'Invalid email or password'));
    }

    const userSerializer = new UserSerializer();
    // Sign Access and Refresh Tokens

    const { accessToken, refreshToken } = await signTokens(user);

    // Add cookies
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    const current_user = userSerializer.serialize(user)

    const session = new UserSession();
    session.userId = user.id;
    session.token = accessToken;
    session.expiresAt = new Date(Date.now());
    session.expiresAt.setMonth(session.expiresAt.getMonth() + 6)

    await userSessionRepository.save(userSessionRepository.create(session));


    // send response
    res.status(200).json({
      status: 'success',
      accessToken,
      refreshToken,
      current_user
    });
  } catch (err: any) {
    next(err);
  }
};

// refresh token controller

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;

    const message = 'Could not refresh access token';

    if (!refreshToken) {
      return next(new AppError(403, message));
    }

    // Validate refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refreshToken,
      KeyFunction.refresh
    );

    if (!decoded) {
      return next(new AppError(403, message));
    }

    // Check if user has a valid session
    // create user session object
    const session = await AppDataSource.getRepository(UserSession).findOne({
      where: { userId: decoded.sub },
    });

    if (!session) {
      return next(new AppError(403, message));
    }

    // Check if user still exists
    const user = await findUserById(session.userId);

    if (!user) {
      return next(new AppError(403, message));
    }

    // Sign new access token
    const accessToken = signJwt({ sub: user.id }, KeyFunction.access, {
      expiresIn: `${AuthConfig.ACCESS_TOKEN_EXPIRES_IN}m`,
    });

    // Set access token cookie
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);

    // Set logged in cookie
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send response
    res.status(200).json({
      status: 'success',
      accessToken,
    });
  } catch (err: any) {
    next(err);
  }
};

// logout

const logout = (res: Response) => {
  res.cookie('accessToken', '', { maxAge: -1 });
  res.cookie('refreshToken', '', { maxAge: -1 });
  res.cookie('logged_in', '', { maxAge: -1 });
};

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = res.locals;
    // remove from session
    // await AppDataSource
    // .getRepository(UserSession)
    // .delete({
    //   userId: user.id,
    // });

    logout(res);

    res.status(200).json({
      status: 'success',
    });
  } catch (err: any) {
    next(err);
  }
};
