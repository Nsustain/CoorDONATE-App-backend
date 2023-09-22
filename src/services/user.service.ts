import config from 'config';
import { SignUpType, User } from '../entities/user.entity';
import { CreateUserInput } from '../schemas/user.schema';
import AppDataSource from '../config/ormconfig';
import { signJwt } from '../utils/jwt';
import { KeyFunction } from '../utils/keyFactory';
import { AuthConfig } from '../config/authConfig';

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
  const accessToken = signJwt({ sub: user.id }, KeyFunction.access, {
    expiresIn: `${AuthConfig.ACCESS_TOKEN_EXPIRES_IN}m`,
  });

  const refreshToken = signJwt({ sub: user.id }, KeyFunction.refresh, {
    expiresIn: `${AuthConfig.REFRESH_TOKEN_EXPIRES_IN}m`,
  });

  return { accessToken, refreshToken };
};


export const CreateAuth0User = async (user: User) => {
  // if it already exits
  let existingUser = await userRepository.findOne({
    where: {
      auth0_id: user.auth0_id
    }
  })

  if (existingUser){
    return existingUser;
  }

  // if the email is already used to signup
  existingUser = await findUserByEmail({email: user.email});
  
  if(existingUser){
    throw new Error('email already in use!')
  }

  return await AppDataSource.manager.save(AppDataSource.manager.create(User, user)) as User;
}