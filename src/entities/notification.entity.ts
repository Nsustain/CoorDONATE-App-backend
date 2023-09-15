import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Model from "./model.entity";
import { User } from "./user.entity";
import { Message } from "./message.entity";
import { Post } from "./post.entity";



@Entity()
export class Notification extends Model{

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, (user) => user.notifications)
    recipient!: User;

    @Column('bool', {default: false})
    isRead!: boolean;

    @ManyToMany(() => Message, (message) => message.notifications)
    mNotifications!: Message[]

    @ManyToMany(() => Post, (post) => post.notifications)
    pNotifications!: Post[]

}