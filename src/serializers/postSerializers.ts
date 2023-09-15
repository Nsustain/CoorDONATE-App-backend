import { ValidationChain, body } from 'express-validator';
import { Post, PostImage } from '../entities/post.entity';
import Serializer from './serializer';
import { User } from '../entities/user.entity';
import { findUserById } from '../services/user.service';
import UserSerializer from './userSerializer';
import AppError from '../utils/appError';

export class PostImageSerializer extends Serializer<PostImage, any>{
	
	serialize(instance: PostImage): string {
		return instance.url;
	}
	
	deserialize(data: string): PostImage {
		let image = new PostImage();
		image.url = data;
		return image;
	}

	deserializePromise(data: any): Promise<PostImage> {
		throw new Error("Method not implemented.");
	}


}

export class PostSerializer extends Serializer<Post, any> {
  private imageSerializer = new PostImageSerializer();
  private userSerializer = new UserSerializer();

  serialize(instance: Post) {
    return {
      id: instance.id,
      contentText: instance.contentText,
      images: this.imageSerializer.serializeMany(instance.contentImages),
      likes: instance.likes,
      comments: instance.comments,
      postedBy: this.userSerializer.serialize(instance.postedBy),
    };
  }

  deserialize(data: any): Post {
    let post = new Post();
    post.contentText = data['content_text'];
    post.contentImages = this.imageSerializer.deserializeMany(
      data.content_images
    );
    return post;
  }

  async deserializePromise(data: any): Promise<Post> {
    const post = new Post();
    const user = data.postedBy;
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    post.postedBy = user;
    (post.contentImages = data.contentImages),
      (post.contentText = data.contentText),
      (post.comments = data.comments),
      (post.likes = data.likes);
      post.id = data.id;
    return post;
  }

  protected getValidations(): ValidationChain[] {
    return [
      body('tags').notEmpty(),
      body('content_text').notEmpty(),
      body('content_images').notEmpty(),
    ];
  }
}
