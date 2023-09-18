import express from 'express';
import deserializeUser from '../middleware/deserializeUser';
import requireUser from '../middleware/requireUser';
import { notificationController } from '../controllers/notification.controller';

const notificationRouter = express.Router();

notificationRouter.use(deserializeUser, requireUser);

notificationRouter.get('/', notificationController.getAllNotifications);
notificationRouter.put('/readAll', notificationController.readAllNotifications);
notificationRouter.put(
  '/read/:notificationId',
  notificationController.readNotification
);

export default notificationRouter;
