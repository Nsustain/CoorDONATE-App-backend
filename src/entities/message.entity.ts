import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ChatRoom } from './chat.entity';
import Model from './model.entity';
import { Notification } from './notification.entity';

@Entity()
export class Message extends Model {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender!: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  receiverRoom!: ChatRoom;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sentAt!: Date;

  @Column()
  content!: string;

  @ManyToMany(() => Notification, (notification) => notification.mNotification)
  notifications!: string;
}
