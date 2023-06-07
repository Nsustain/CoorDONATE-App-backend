import { NextFunction, Request, Response } from 'express';
import { findUserById } from '../services/user.service.ts';
import AppError from '../utils/appError.ts';
import { verifyJwt } from '../utils/jwt.ts';
import AppDataSource from '../config/ormconfig.ts';
import UserSession from '../entities/user.session.ts';
import { KeyFunction } from '../utils/keyFactory.ts';

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let accessToken;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      const { authorization } = req.headers;
      [, accessToken] = authorization.split(' ');
    } else if (req.cookies.accessToken) {
      accessToken = req.cookies.accessToken;
    }

    if (!accessToken) {
      return next(new AppError(401, 'You are not logged_in'));
    }

    // validate the access token
    const decoded = verifyJwt<{ sub: string }>(
      accessToken,
      KeyFunction.access
    );

    if (!decoded) {
      return next(new AppError(401, `Invalid token or user doesn't exist`));
    }

    // // Check if the user has a valid session
    const session = await AppDataSource.getRepository(UserSession).findOne({
      where: { userId: decoded.sub },
    });

    if (!session) {
      return next(new AppError(401, `Invalid token or session has expired`));
    }

    // Check if the user still exist
    const user = await findUserById(JSON.parse(JSON.stringify(session)).id);

    if (!user) {
      return next(new AppError(401, `Invalid token or session has expired`));
    }
    // Add user to res.locals
    res.locals.user = user;

    next();
  } catch (err: any) {
    next(err);
  }
};

export default deserializeUser;
