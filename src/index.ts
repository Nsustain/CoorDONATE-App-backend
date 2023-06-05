import express from 'express';
import config from 'config';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line import/extensions, node/no-missing-import
import AppDataSource from './config/ormconfig';
import authRouter from './routes/auth.routes.ts';
import userRouter from './routes/user.routes.ts';
import handle404 from './routes/404.routes.ts';

require('dotenv').config();

AppDataSource.initialize()
  .then(async () => {
    console.log('database connected');

    // Validate enviroment variables exist

    // start app
    const app = express();

    // eslint-disable-next-line global-require

    // Body parser
    app.use(bodyParser);

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

    // UNHANDLED ROUTE
    app.all('*', handle404);

    // GLOBAL ERROR HANDLER
    // app.use(
    //   (error: AppError, req: Request, res: Response, next: NextFunction) => {
    //     error.status = error.status || 'error';
    //     error.statusCode = error.statusCode || 500;

    //     res.status(error.statusCode).json({
    //       status: error.status,
    //       message: error.message,
    //     });
    //   }
    // );

    const port = parseInt(process.env.PORT || '4000', 10);

    app.listen(port, () => {
      console.log(`Server Running at port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
