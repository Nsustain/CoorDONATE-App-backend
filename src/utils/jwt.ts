import jwt, { SignOptions } from 'jsonwebtoken';
import UtilsProvider from '../di/utilProviders';
import KeyFactory, { KeyFunction, KeyName } from './keyFactory';



// Sign Access or Refresh Token
export const signJwt = (
  payload: Object,
  fun: KeyFunction,
  options: SignOptions
) => {

  return jwt.sign(payload, UtilsProvider.provideKeyFactory().getKey(fun, KeyName.private), {
    ...(options && options),
    algorithm: 'RS256',
  });
};

// Verify Access or Refresh Token

export const verifyJwt = <T>(
  token: string,
  fun: KeyFunction
): T | null => {
  try {
    const publicKey = UtilsProvider.provideKeyFactory().getKey(fun, KeyName.public)
    const decoded = jwt.verify(token, publicKey) as T;

    return decoded;
  } catch (error) {
    return null;
  }
};
