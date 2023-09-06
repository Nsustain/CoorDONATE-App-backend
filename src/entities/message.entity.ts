import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { User } from './user.entity';
import { ChatRoom } from './chat.entity';

@Entity()
export class Message extends Model {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender!: User;

  @ManyToOne(() => ChatRoom, (chat) => chat.id)
  receiver!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sentAt!: Date;

  @ManyToOne(() => ChatRoom, (chat) => chat.messages)
  chat!: ChatRoom;
}
