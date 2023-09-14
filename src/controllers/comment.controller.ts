import { NextFunction, Request, Response } from 'express';
import { CommentSerializer } from '../serializers/commentSerializers';
import AppDataSource from '../config/ormconfig';
import { Comment } from '../entities/post.entity';
import { Repository } from 'typeorm';
import {
  commentOnPost,
  deleteComment,
  getAllCommentsOnPost,
  updateComment,
} from '../services/comment.service';

class CommentController {
  private serializer = new CommentSerializer();
  private repository: Repository<Comment> =
    AppDataSource.getRepository(Comment);

  public commentOnPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { user, content } = req.body;
    const { postId } = req.params;

    const data = {
      content: content,
      postId: postId,
      userId: user,
    };

    try {
      let comment = await this.serializer.deserializePromise(data);
      comment = await commentOnPost(comment);
      return res.status(201).json(this.serializer.serializePromise(comment));
    } catch (err) {
      next(err);
    }
  };

  public getAllCommentsOnPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { postId } = req.params;
      const comments = await getAllCommentsOnPost(postId);

      let serializedcomments = [];

      for (let comment of comments) {
        serializedcomments.push(
          this.serializer.serializePromise(
            await this.serializer.deserializePromise(comment)
          )
        );
      }
      return res.status(200).json(serializedcomments);
    } catch (err) {
      next(err);
    }
  };

  public updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { commentId } = req.params;
      const content = req.body.content;
      const updatedComment = await updateComment(commentId, content);
      return res
        .status(200)
        .json(
          await this.serializer.serializePromise(
            await this.serializer.deserializePromise(updatedComment)
          )
        );
    } catch (err) {
      next(err);
    }
  };

  public deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { commentId } = req.params;
      await deleteComment(commentId);
      return res.status(200).json('comment deleted');
    } catch (err) {
      next(err);
    }
  };
}

export const commentController = new CommentController();
