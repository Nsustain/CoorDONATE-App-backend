import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import AppDataSource from '../config/ormconfig';

class NotificationService {
  private notificationRepository: Repository<Notification>;

  constructor() {
    this.notificationRepository = AppDataSource.getRepository(Notification);
  }

  public createNotification = async (notification: Partial<Notification>) => {
    return (await this.notificationRepository.save(
      this.notificationRepository.create(notification)
    )) as Notification;
  };

  public getNotificationsByUserId = async (userId: string) => {
    return await this.notificationRepository.find({
      where: {
        recipient: {
          id: userId,
        },
      },
    });
  };

  public markNotificationAsRead = async (
    userId: string,
    notificationId: string
  ) => {
    try {
      // Retrieve the notification
      const notification = await this.notificationRepository.findOne({
        where: {
          id: notificationId,
        },
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      // Check if the notification belongs to the user
      if (notification.recipient.id !== userId) {
        throw new Error('You are not authorized to perform this action');
      }

      // Mark the notification as read
      notification.isRead = true;

      // Save the updated notification
      return await this.notificationRepository.save(notification);
    } catch (error) {
      throw new Error('Error marking notification as read: ' + error);
    }
  };

  public markAllNotificationsAsRead = async (userId: string) => {
    try {
      let notifications = await this.notificationRepository.find({
        where: {
          recipient: {
            id: userId,
          },
          isRead: false,
        },
      });

      const updatedNotificationsPromises = notifications.map((notification) => {
        notification.isRead = true;
        return this.notificationRepository.update(
          notification.id,
          notification
        );
      });

      // Save the updated notifications
      await Promise.all(updatedNotificationsPromises);
    } catch (err) {
      throw new Error('Error marking all notifications as read: ' + err);
    }
  };
}

export default NotificationService;
