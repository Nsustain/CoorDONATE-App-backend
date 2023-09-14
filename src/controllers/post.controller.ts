import { NextFunction, Request, Response } from 'express';
import { PostSerializer } from '../serializers/postSerializers';
import AppDataSource from '../config/ormconfig';
import { Post, PostImage } from '../entities/post.entity';
import { Repository } from 'typeorm';
import {
  deletePost,
  getPostById,
  getPostsByUser,
} from '../services/post.service';
import AppError from '../utils/appError';
class PostController {
  private serializer = new PostSerializer();
  private repository: Repository<Post> = AppDataSource.getRepository(Post);
  private imageRepository: Repository<PostImage> =
    AppDataSource.getRepository(PostImage);

  public getFeed = async (req: Request, res: Response, next: NextFunction) => {
    let posts: Post[] = await this.repository.find({
      loadEagerRelations: true,
      relations: ['contentImages', 'likes', 'comments', 'postedBy'],
    });
    res.status(200).json(this.serializer.serializeMany(posts));
  };

  private async createPost(post: Post): Promise<Post> {
    post = await this.repository.save(this.repository.create(post));
    for (let postImage of post.contentImages) {
      postImage.post = post;
      await this.imageRepository.save(postImage);
    }
    return post;
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.serializer.validate(req, res);
      let post = this.serializer.deserialize(req.body);
      post.postedBy = res.locals.user;
      post = await this.createPost(post);
	  console.log(post, "Before saving the post");
      return res.status(201).json(this.serializer.serialize(post));
    } catch (err) {
      next(err);
    }
  };

  public getPostsByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.body;
      const posts = await getPostsByUser(userId);
      let serializedPosts = [];
      console.log(posts);
      for (let post of posts) {
        serializedPosts.push(
          this.serializer.serialize(
            await this.serializer.deserializePromise(post)
          )
        );
      }
      return res.status(200).json(serializedPosts);
    } catch (err) {
      next(err);
    }
  };

  public deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { postId } = req.params;
      await deletePost(postId);
      return res.status(200).json('Post Deleted');
    } catch (err) {
      next(err);
    }
  };
}

export const postController = new PostController();
