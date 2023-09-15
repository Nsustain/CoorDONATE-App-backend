import { ValidationChain, body } from 'express-validator';
import { Like, Post } from '../entities/post.entity';
import Serializer from './serializer';
import { User } from '../entities/user.entity';
import UserSerializer from './userSerializer';
import { findUserById } from '../services/user.service';
import AppError from '../utils/appError';
import SerializerPromise from './serializerPromise';
import { Message } from '../entities/message.entity';
import { getPostById } from '../services/post.service';

export class LikeSerializer extends SerializerPromise<Like, any> {
  serializePromise(instance: Like) {
    return {
      id: instance.id,
      user: instance.user.id,
      likedAt: instance.likedAt,
      post: instance.post.id
    };
  }

  async deserializePromise(data: any): Promise<Like> {
    const like = new Like();
    const user = await findUserById(data.user);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const post = await getPostById(data.postId);
    if (!post) {
      throw new AppError(404, "Post doesn't exist");
    }
    const likedAt = new Date();
    like.id = data.id;
    like.user = user;
    (like.post = post),
      (like.liked = data.data || true),
      (like.likedAt = data.likedAt || likedAt);
    return like;
  }
}
