import express, { Request, Response, NextFunction } from 'express';
import config from 'config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line import/extensions, node/no-missing-import
import AppDataSource from './config/ormconfig';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import handle404 from './routes/404.routes';
import AppError from './utils/appError';
import validateEnv from './utils/validateEnv';
import postRouter from './routes/post.routes';

require('dotenv').config();

AppDataSource.initialize()
  .then(async () => {
    console.log('database connected');

    validateEnv()
    const app = express();
    // eslint-disable-next-line global-require
    // eslint-disable-next-line global-require

    // Body parser
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Logger

    // Cookie Parser
    app.use(cookieParser());

    // cors
    app.use(
      cors({
        origin: config.get<string>('origin'),
        credentials: true,
      })
    );

    // ROUTES
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
	app.use("/api/post", postRouter);


    // UNHANDLED ROUTE
    app.all('*', handle404);

    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, _req: Request, res: Response, _next: NextFunction) => {
        // eslint-disable-next-line no-param-reassign
        error.status = error.status || 'error';
        // eslint-disable-next-line no-param-reassign
        error.statusCode = error.statusCode || 500;

        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );
    const port = parseInt(process.env.PORT || '4000', 10);

    app.listen(port, () => {
      console.log(`Server Running at port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
