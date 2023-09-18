import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  OneToMany,
  ManyToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import Model from './model.entity';
import { Like, Post } from './post.entity';
import { ChatRoom } from './chat.entity';
import { Message } from './message.entity';
import { Notification } from './notification.entity';
import { Profile } from './profile.entity';

export enum RoleEnumType {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserTypeEnum {
  LOCAL_NGO = 'Local NGO',
  INTERNATIONAL_NGO = 'International NGO',
  LOCAL_COMMUNITIES = 'Local communities',
  DIASPORA = 'Diaspora',
}

@Entity('users')
export class User extends Model {
  @Column()
  name!: string;

  @Index('email_index')
  @Column({ unique: true })
  email!: string;

  @Column({ unique: true, nullable: true })
  username!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: RoleEnumType,
    default: RoleEnumType.USER,
  })
  role!: RoleEnumType.USER;

  @Column({ default: false })
  verified!: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  profile!: Profile | null;

  @OneToMany(() => Post, (post) => post.postedBy)
  posts!: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likedPosts!: Like[];

  @ManyToMany(() => ChatRoom, (chat) => chat.members)
  chats!: ChatRoom[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages!: Message[];

  @OneToMany(() => Notification, (notification) => notification.recipient)
  notifications!: Notification[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  toJSON(): object {
    return { ...this, password: undefined, verified: undefined };
  }
}
