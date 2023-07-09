import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError.ts';

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = res.locals;

    if (!user) {
      return next(
        new AppError(400, `Session has expired or user doesn't exist`)
      );
    }

    next();
  } catch (err: any) {
    next(err);
  }
};

export default requireUser;
