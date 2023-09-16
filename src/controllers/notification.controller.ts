import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import { NotificationSerializer } from '../serializers/notificationSerializers';
import NotificationService from '../services/notification.service';

const notificationService = new NotificationService();
const notificationSerializer = new NotificationSerializer();

class NotificationController {
  // private notificationService = new NotificationService();
  // private notificationSerializer = new NotificationSerializer();

  public async getAllNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = res.locals.user.id;

    try {
      // get notifications for user;
      const notifications = await notificationService.getNotificationsByUserId(
        userId
      );

      const serializedNotifications =
        notificationSerializer.serializeMany(notifications);

      res.status(200).json({
        notifications: serializedNotifications,
      });
    } catch (err) {
      next(err);
    }
  }

  public async readNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = res.locals.user.id;
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        return next(new AppError(404, 'Notification not found!'));
      }

      await notificationService.markNotificationAsRead(userId, notificationId);

      res.status(200).json({
        message: `notification with id: ${notificationId} read`,
      });
    } catch (err) {
      next(err);
    }
  }

  public async readAllNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = res.locals.user.id;

    try {
      await notificationService.markAllNotificationsAsRead(userId);
      res.status(200).json({
        message: 'all notifications read!',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const notificationController = new NotificationController();
