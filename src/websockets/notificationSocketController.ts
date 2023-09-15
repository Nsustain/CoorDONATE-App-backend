import { Server, Socket } from "socket.io";
import NotificationService from "../services/notification.service";
import NotificationSerializer from "../serializers/notificationSerializers";


class NotificationSocketController {
    protected socket!: Socket;
    private notificationService = new NotificationService();
    private notificationSerializer = new NotificationSerializer();
    private userId!: string;

    constructor(io: Server) {
        io.on('connection', (socket: Socket) => {
            this.socket = socket;
            this.initialize();
            this.mapEvents();
        })
    }

    private mapEvents() {
        this.socket.on('get-notifications', this.getAllNotifications.bind(this));
        this.socket.on('read-notification', this.readNotification.bind(this));
        this.socket.on('read-all-notiifcations', this.readAllNotifications.bind(this));
    }

    // Send all notifications
    private async initialize(){
        this.userId = this.socket.data.user.id;
        this.getAllNotifications();
    }

    private async getAllNotifications() {

        try{
            // get notifications for user;
            const notifications = await this.notificationService.getNotificationsByUserId(this.userId);
            const serializedNotifications = this.notificationSerializer.serializeMany(notifications);
            
            this.socket.emit('receive-notifications', {
                notifications: serializedNotifications
            })
    
        }catch(err) {
            this.socket.emit('notification-error', err)
        }

    }

    private async readNotification(data: any) {

        try {
            const {id: notificationId} = data;

            await this.notificationService.markNotificationAsRead(this.userId, notificationId);
    
            this.socket.emit('notification-read', {
                notificationId
              });

        }catch(err){
            this.socket.emit('notification-error', {
                message: `Error marking notification as read ${err}`
              });
        }
    }

    private async readAllNotifications() {

        try{
            
            await this.notificationService.markAllNotificationsAsRead(this.userId);
            this.socket.emit('all-notifications-read');

        }catch(err) {
            this.socket.emit('notification-error', {
                message: `Error marking all notifications as read, ${err}` 
              });
        }
    }

    public async notify() {

    }

}


export default NotificationSocketController;