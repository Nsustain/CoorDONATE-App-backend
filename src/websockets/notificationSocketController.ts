import { Server, Socket } from 'socket.io';
import NotificationService from '../services/notification.service';
import NotificationSerializer from '../serializers/notificationSerializers';
import { Message } from '../entities/message.entity';
import {
  Notification,
  NotificationType,
} from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { ChatRoom } from '../entities/chat.entity';

class NotificationSocketController {
  protected socket!: Socket;
  private notificationService = new NotificationService();
  private notificationSerializer = new NotificationSerializer();
  private userId!: string;
  private socketIdUserIdMap: Map<string, string> = new Map();

  constructor(io: Server) {
    io.on('connection', (socket: Socket) => {
      this.socket = socket;
      this.initialize();
      this.mapEvents();
    });
  }

  private mapEvents() {
    this.socket.on('get-notifications', this.getAllNotifications.bind(this));
  }

  // Send all notifications
  private async initialize() {
    this.userId = this.socket.data.user.id;
    // map userId to socketId
    this.socketIdUserIdMap.set(this.userId, this.socket.id);

    this.getAllNotifications();
  }

  private async getAllNotifications() {
    try {
      // get notifications for user;
      const page = 1;
      const limit = await this.notificationService.countAllNotifications(
        this.userId
      );
      const notifications =
        await this.notificationService.getNotificationsByUserId(
          this.userId,
          page,
          limit
        );
      const serializedNotifications =
        this.notificationSerializer.serializeMany(notifications);

      this.socket.emit('receive-notifications', {
        notifications: serializedNotifications,
      });
    } catch (err) {
      this.socket.emit('notification-error', err);
    }
  }

  public async notify(
    object: Message | User,
    chatRoom: ChatRoom,
    type: NotificationType
  ) {
    const members = chatRoom.members;

    // send notifications for all members in the chatroom based on type
    for (const member of members) {
      const notification: Notification = new Notification();
      notification.recipient = member;

      if (type === NotificationType.Message && object instanceof Message) {
        const message = object;
        notification.mNotification = message;
        notification.type = NotificationType.Message;
        notification.displayText = message.content;
      } else if (
        type === NotificationType.AddToGroup &&
        object instanceof User
      ) {
        const user = object;
        notification.displayText = `${user.name} added to chat!`;
        notification.type = NotificationType.AddToGroup;
      } else if (
        type === NotificationType.LeaveRoom &&
        object instanceof User
      ) {
        const user = object;
        notification.displayText = `${user.name} left the chat!`;
        notification.type = NotificationType.LeaveRoom;
      }

      // save to db
      const savedNotification =
        await this.notificationService.createNotification(notification);

      // Emit 'new-notification' event for each user
      const socketId = this.socketIdUserIdMap.get(member.id);
      if (socketId !== undefined) {
        this.socket.to(socketId).emit('new-notification', {
          notification:
            this.notificationSerializer.serialize(savedNotification),
        });
      }
    }
  }
}

export default NotificationSocketController;
