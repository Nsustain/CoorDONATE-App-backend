import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import Model from './model.entity';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity()
export class ChatRoom extends Model {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Todo: groupname
  // @Column()
  // title!: string; 

  // Todo: field to check group or dm
  // @Column('bool')
  // isGroup!: bool

  // many to many because the user should join multiple chatrooms
  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  members!: User[];
  
  @OneToMany(() => Message, (message) => message.receiverRoom)
  messages!: Message[];
}
