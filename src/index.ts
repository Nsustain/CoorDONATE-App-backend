import express, { Request, Response, NextFunction } from 'express';
import config from 'config';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line import/extensions, node/no-missing-import
import AppDataSource from './config/ormconfig';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import handle404 from './routes/404.routes';
import AppError from './utils/appError';
import postRouter from './routes/post.routes';
import chatRouter from './routes/chat.routes';
import messageRouter from './routes/message.route';
import { Server } from 'socket.io';
import { AuthConfig } from './config/authConfig';
import SocketController from './websockets/socketController';
import SocketMiddleware from './websockets/socketMiddleware';
import multarError from './utils/multarError';
import uploadRouter from './routes/upload.routes';
import profileRouter from './routes/profile.routes';
import searchRouter from './routes/search.routes';
import NotificationSocketController from './websockets/notificationSocketController';
import notificationRouter from './routes/notification.routes';

require('dotenv').config();

AppDataSource.initialize()
  .then(async () => {
    console.log('database connected');

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
        origin: AuthConfig.ORIGIN,
        credentials: true,
      })
    );

    // ROUTES
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/post', postRouter);
    app.use('/api/chat', chatRouter);
    app.use('/api/message', messageRouter);
    app.use('/api/upload', uploadRouter);
    app.use('/api/profiles', profileRouter);
    app.use('/api/search', searchRouter);
    app.use('/api/notifications', notificationRouter);

    // UNHANDLED ROUTE
    app.all('*', handle404);

    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, _req: Request, res: Response, _next: NextFunction) => {
        // check if it's multar error
        multarError(error, _req, res);
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

    // create http server
    const ioServer = http.createServer(app);
    // create socket.io server
    const io = new Server(ioServer, {
      cors: {
        origin: AuthConfig.ORIGIN,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      },
    });

    // Attach the middleware to the Socket.IO server
    io.use((socket, next) => {
      new SocketMiddleware(socket, next);
    });

    // Socket Handling
    const socketController = new SocketController(io);

    // Notification socket handler
    const notificationSocketController = new NotificationSocketController(io);

    const port = parseInt(process.env.PORT || '4000', 10);

    ioServer.listen(port, () => {
      console.log(`Server Running at port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
