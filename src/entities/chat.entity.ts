import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import Model from './model.entity';
import { Message } from './message.entity';

@Entity()
export class Chat extends Model {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToMany(()=> User, (user) => user.email)
  members!: User[]

  @OneToMany(() => Message, (message) => message.id)
  messages!: Message[]
} 