import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Model from "./model.entity";
import { User } from "./user.entity";

@Entity()
export class Message extends Model {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @OneToOne(() => User ,(user)=> user.email)
    sender!: User

    @OneToOne(() => User ,(user)=> user.email)
    receiver!: User

    @Column("timestamp")
    sentAt!: Date;

}