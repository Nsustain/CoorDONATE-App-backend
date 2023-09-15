import 'reflect-metadata';
import { DataSource } from 'typeorm';
import UserSession from '../entities/user.session';
import { User } from '../entities/user.entity';
import { Post, PostImage, Comment, Like } from '../entities/post.entity';
import { ChatRoom } from '../entities/chat.entity';
import { Message } from '../entities/message.entity';
import { Notification } from '../entities/notification.entity';
import { Profile } from '../entities/profile.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'surus.db.elephantsql.com',
  port: 5432,
  username: 'abkqqias',
  password: 'MjV1ZlWGtTPEV2lhFJL7me0cVPvz5YCG',
  database: 'abkqqias',
  synchronize: true,
  logging: true,
  entities: [
    User,
    UserSession,
    Post,
    PostImage,
    Comment,
    Like,
    ChatRoom,
    Message,
    Profile,
  ],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
