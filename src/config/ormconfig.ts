import 'reflect-metadata';
import { DataSource } from 'typeorm';
import UserSession from '../entities/user.session';
import { User } from '../entities/user.entity';
import { Post, PostImage, Comment, Like } from '../entities/post.entity';
import { ChatRoom } from '../entities/chat.entity';
import { Message } from '../entities/message.entity';
import { Profile } from '../entities/profile.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: "surus.db.elephantsql.com",
  port: 5432,
  username: "puwogwoj",
  password: "LJmbehYSUhRbhj_omsYAd0MuAKj8aSKz",
  database: "puwogwoj",
  synchronize: true,
  logging: true,
  entities: [User, UserSession, Post, PostImage, Comment, Like, ChatRoom, Message, Profile],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;