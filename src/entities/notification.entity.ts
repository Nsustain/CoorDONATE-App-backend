import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Model from './model.entity';
import { User } from './user.entity';
import { Message } from './message.entity';
import { Post } from './post.entity';

export enum NotificationType {
  Message = 'MESSAGE_NOTIFICATION',
  AddToGroup = 'ADD_TO_GROUP_NOTIFICATION',
  Post = 'POST_NOTIFICATION',
  LeaveRoom = 'LEFT-ROOM-NOTIFICATION',
}

@Entity()
export class Notification extends Model {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.notifications)
  recipient!: User;

  @Column('bool', { default: false })
  isRead!: boolean;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type!: NotificationType;

  @ManyToOne(() => Message, (message) => message.notifications, {
    nullable: true,
  })
  mNotification!: Message;

  @ManyToOne(() => Post, (post) => post.notifications, { nullable: true })
  pNotification!: Post;

  @Column()
  displayText!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timeStamp!: Date;
}
