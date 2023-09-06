import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import Model from './model.entity';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity()
export class ChatRoom extends Model {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // @OneToMany(() => User, (user) => user.chats)
  // members!: User[]; // Assuming User entity has a 'chat' property representing the inverse side of the relationship

  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  members!: User[];
  
  @OneToMany(() => Message, (message) => message.content)
  messages!: Message[];
}
