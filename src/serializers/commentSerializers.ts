import { ValidationChain, body } from 'express-validator';
import { Comment, Post } from '../entities/post.entity';
import Serializer from './serializer';
import { User } from '../entities/user.entity';
import UserSerializer from './userSerializer';
import { findUserById } from '../services/user.service';
import AppError from '../utils/appError';
import SerializerPromise from './serializerPromise';
import { Message } from '../entities/message.entity';
import { getPostById } from '../services/post.service';

export class CommentSerializer extends SerializerPromise<Comment, any> {
  serializePromise(instance: Comment) {
    const userSerializer = new UserSerializer();
    return {
      id: instance.id,
      post: instance.post.id,
      user: userSerializer.serialize(instance.user),
      content: instance.content,
    };
  }

  async deserializePromise(data: any): Promise<Comment> {
    const comment = new Comment();

    const user = await findUserById(data.user);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    comment.user = user;
    const post = await getPostById(data.postId);
    if (!post) {
      throw new AppError(404, "Post doesn't exist");
    }
    comment.post = post;
    if (data.content == '') {
      throw new AppError(404, "content can't be empty");
    }
    comment.content = data.content;
    comment.id = data.id
    return comment;
  }
}
