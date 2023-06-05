import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError.ts';

const handle404 = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.url} not found`));
};

export default handle404;
