import { NextFunction, Request, Response } from 'express';
import { LikeSerializer } from '../serializers/likeSerializers';
import AppDataSource from '../config/ormconfig';
import { Like } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { getAllLikes, likeOnAPost, removeLike } from '../services/like.service';

class LikeController {
  private serializer = new LikeSerializer();
  private repository: Repository<Like> = AppDataSource.getRepository(Like);

  public likeOnPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { postId } = req.params;
    try {
      let like = await this.serializer.deserializePromise(req.body);
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
