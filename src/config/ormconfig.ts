import 'reflect-metadata';
import { DataSource } from 'typeorm';
import UserSession from '../entities/user.session.ts';
import { User } from '../entities/user.entity.ts';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'coor_dev',
  password: '12345678',
  database: 'coordonate_db',
  synchronize: true,
  logging: true,
  entities: [User, UserSession],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
