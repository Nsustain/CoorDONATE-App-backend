import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Column,
  ManyToOne,
} from 'typeorm';
import Model from './model.entity';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity()
export class ChatRoom extends Model {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  groupName?: string;

  @Column({ nullable: true })
  description?: string;

  @Column('bool', { default: false })
  isGroup!: boolean;

  @Column({ default: '', nullable: true })
  groupProfile?: string;

  @ManyToOne(() => User, (user) => user.username, { nullable: true })
  groupOwner?: User | null;

  // many to many because the user should join multiple chatrooms
  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  members!: User[];

  @OneToMany(() => Message, (message) => message.receiverRoom)
  messages!: Message[];
}
