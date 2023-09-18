import {
  Notification,
  NotificationType,
} from '../entities/notification.entity';
import { MessageSerializer } from './messageSerializers';
import Serializer from './serializer';
import UserSerializer from './userSerializer';

const messageSerializer = new MessageSerializer();
const userSerializer = new UserSerializer();
export class NotificationSerializer extends Serializer<Notification, any> {
  serialize(instance: Notification) {
    const serializedNotification: any = {
      id: instance.id,
      recipient: instance.recipient
        ? userSerializer.serialize(instance.recipient)
        : {},
      isRead: instance.isRead,
      type: instance.type,
      displayText: instance.displayText,
    };

    if (instance.type === NotificationType.Message) {
      serializedNotification.mNotification = instance.mNotification
        ? messageSerializer.serialize(instance.mNotification)
        : {};
    }

    return serializedNotification;
  }

  deserialize(data: any): Notification {
    throw new Error('Method not implemented.');
  }

  async deserializePromise(data: any): Promise<Notification> {
    throw new Error('Method not implemented.');
  }
}

export default NotificationSerializer;
