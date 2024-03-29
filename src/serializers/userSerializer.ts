import { User } from '../entities/user.entity';
import Serializer from './serializer';

export default class UserSerializer extends Serializer<User, any> {
  serialize(instance: User) {
    return {
      id: instance.id,
      name: instance.name,
      email: instance.email,
      username: instance.username,
      verified: instance.verified,
      role: instance.role,
      profilePic: instance.profile?.profilePic,
    };
  }
  deserialize(data: any): User {
    throw new Error('Method not implemented.');
  }

  deserializePromise(data: any): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
