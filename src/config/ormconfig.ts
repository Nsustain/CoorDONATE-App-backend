import 'reflect-metadata';
import { DataSource } from 'typeorm';
import UserSession from '../entities/user.session';
import { User } from '../entities/user.entity';
import { Post, PostImage, Comment, Like } from '../entities/post.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'coordev',
  password: '12345678',
  database: 'coordonate',
  synchronize: true,
  logging: true,
  entities: [User, UserSession, Post, PostImage, Comment, Like],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
