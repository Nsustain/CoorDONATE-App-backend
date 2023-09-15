import { Notification } from "../entities/notification.entity";
import Serializer from "./serializer";



export class NotificationSerializer extends Serializer<Notification, any> {

    serialize(instance: Notification) {
        return {
            "id": instance.id,
            "recipient": instance.recipient,
            "isRead": instance.isRead,
            "mNotifications": instance.mNotifications,
            "pNotifications": instance.pNotifications
        }
    }

    deserialize(data: any): Notification {
        throw new Error("Method not implemented.");
    }

    async deserializePromise(data: any): Promise<Notification> {
        throw new Error("Method not implemented.");
    }
}


export default NotificationSerializer;