import { Entity, Column, Index, BeforeInsert, ManyToOne, OneToMany } from 'typeorm';
import bcrypt from 'bcryptjs';
import Model from './model.entity';
import { Like, Post } from './post.entity';

// eslint-disable-next-line no-shadow
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

  @OneToMany(() => Post, (post) => post.postedBy)
  posts!: Post[]

  @OneToMany(() => Like, (like) => like.user)
  likedPosts!: Like[];

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

  toJSON() {
    return { ...this, password: undefined, verified: undefined };
  }
}
