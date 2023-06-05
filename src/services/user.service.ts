import config from 'config';
import { User } from '../entities/user.entity.ts';
import { CreateUserInput } from '../schemas/user.schema.ts';
import AppDataSource from '../config/ormconfig.ts';
import { signJwt } from '../utils/jwt.ts';

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (input: CreateUserInput) => {
  return (await AppDataSource.manager.save(
    AppDataSource.manager.create(User, input)
  )) as User;
};

export const findUserByEmail = async ({ email }: { email: string }) => {
  return await userRepository.findOneBy({ email });
};

export const findUserById = async (userId: string) => {
  return await userRepository.findOneBy({ id: userId });
};

export const findUser = async (query: Object) => {
  return await userRepository.findOneBy(query);
};

// Sign access and Refresh Tokens

export const signTokens = async (user: User) => {
  // Create Session
  await AppDataSource.getRepository(User).save(user);

  // create access and refresh token
  const accessToken = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
    expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
  });

  const refreshToken = signJwt({ sub: user.id }, 'refreshTokenPrivateKey', {
    expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
  });

  return { accessToken, refreshToken };
};
