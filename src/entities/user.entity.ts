  import { Entity, Column, Index, BeforeInsert, ManyToOne, OneToMany, ManyToMany, OneToOne, JoinColumn } from 'typeorm';
  import bcrypt from 'bcryptjs';
  import Model from './model.entity.ts';
  import { Like, Post } from './post.entity.ts';
  import { ChatRoom } from './chat.entity.ts';
  import { Message } from './message.entity.ts';

  export enum RoleEnumType {
    USER = 'user',
    ADMIN = 'admin',
  }

  export enum UserTypeEnum {
    LOCAL_NGO = 'Local NGO',
    INTERNATIONAL_NGO = 'International NGO',
    LOCAL_COMMUNITIES = 'Local communities',
    DIASPORA = 'Diaspora' 
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

    @OneToOne(() => Profile, { cascade: true, eager: true })
    @JoinColumn()
    profile!: Profile | null;

    @OneToMany(() => Post, (post) => post.postedBy)
    posts!: Post[];

    @OneToMany(() => Like, (like) => like.user)
    likedPosts!: Like[];

    @ManyToMany(() => ChatRoom, (chat) => chat.members)
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



@Entity('profiles')
export class Profile extends Model {
  @Column()
  name!: string;

  @Column({ nullable: true, default: '' })
  profilePic!: string;

  @Column({ nullable: true })
  shortBio!: string;

  @Column({ nullable: true })
  ngoDescription!: string;

  @Column({ nullable: true })
  numberOfParticipants!: number;

  @Column({ nullable: true, type: 'enum', enum: UserTypeEnum })
  organizationType!: UserTypeEnum;

  @Column({ nullable: true })
  previousWork!: string;

  @Column({ nullable: true })
  goals!: string;

  @Column({ nullable: true })
  targetAudience!: string;

  @Column({ nullable: true })
  location!: string;

  @OneToOne(() => User, (user) => user.profile)
  user!: User;
}