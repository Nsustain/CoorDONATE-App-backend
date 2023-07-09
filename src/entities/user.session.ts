import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class UserSession {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @Column()
  token!: string;

  @Column()
  expiresAt!: Date;
}
