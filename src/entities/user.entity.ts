  import { Entity, Column, Index, BeforeInsert, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
  import bcrypt from 'bcryptjs';
  import Model from './model.entity';
  import { Like, Post } from './post.entity';
  import { ChatRoom } from './chat.entity';
  import { Message } from './message.entity';

  export enum RoleEnumType {
    USER = 'user',
    ADMIN = 'admin',
  }

  @Entity('users')
  export class User extends Model {
    @Column()
    name!: string;

    @Index('email_index')
    @Column({ unique: true })
    email!: string;

    @Column({unique: true})
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

    @Column({ nullable: true, default: '' })
    profilePic!: string;

    @OneToMany(() => Post, (post) => post.postedBy)
    posts!: Post[];

    @OneToMany(() => Like, (like) => like.user)
    likedPosts!: Like[];

    // Todo: make it manyTomany
    @OneToMany(() => ChatRoom, (chat) => chat.members)
    chats!: ChatRoom[];

    @OneToMany(() => Message, (message) => message.sender)
    sentMessages!: Message[];

    @BeforeInsert()
    async hashPassword() {
      this.password = await bcrypt.hash(this.password, 12);
    }

    static async comparePasswords(candidatePassword: string, hashedPassword: string) {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    }

    toJSON() {
      return { ...this, password: undefined, verified: undefined };
    }
  }
