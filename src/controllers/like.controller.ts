import { NextFunction, Request, Response } from 'express';
import { LikeSerializer } from '../serializers/likeSerializers';
import AppDataSource from '../config/ormconfig';
import { Like } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { checkExistingLike, getAllLikes, likeOnAPost, removeLike } from '../services/like.service';
import { findUserById } from '../services/user.service';
import { getPostById } from '../services/post.service';

class LikeController {
  private serializer = new LikeSerializer();
  private repository: Repository<Like> = AppDataSource.getRepository(Like);

  public likeOnPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { postId } = req.params;
    const { user } = req.body;
    const data = {
      postId: postId,
      user: user,
    };

  const userFound = await findUserById(user);
  const post = await getPostById(postId);

  if (!userFound || !post) {
  return res.status(404).json({ error: "User or post not found", message: "User or post with the provided ID does not exist." });
}

const existingLike = await checkExistingLike(userFound.id, post.id)

if (existingLike) {
  // User has already liked the post, return an error response
  return res.status(400).json({ error: "Already liked", message: "You have already liked this post." });
}
    try {
      let like = await this.serializer.deserializePromise(data);
      like = await likeOnAPost(like);
      return res.status(201).json(this.serializer.serializePromise(like));
    } catch (err) {
      next(err);
    }
  };

  public getAllLikes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { postId } = req.params;
      const likes = await getAllLikes(postId);
      let serializedlikes = [];

      for (let like of likes) {
        serializedlikes.push(
          this.serializer.serializePromise(
            await this.serializer.deserializePromise(like)
          )
        );
      }

      return res.status(200).json(serializedlikes);
    } catch (err) {
      next(err);
    }
  };

  public removeLike = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { likeId } = req.params;
      const response = await removeLike(likeId);
      return res.status(200).json(`Like Removed`);
    } catch (err) {
      next(err);
    }
  };
}

export const likeController = new LikeController();
