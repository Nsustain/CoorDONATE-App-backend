import config from 'config';
import { Comment } from '../entities/post.entity.ts';
import AppDataSource from '../config/ormconfig.ts';
import { signJwt } from '../utils/jwt.ts';
import { KeyFunction } from '../utils/keyFactory.ts';

const commentRepository = AppDataSource.getRepository(Comment);
export const commentOnPost = async (comment: Comment) => {
  return await commentRepository.save(commentRepository.create(comment));
};

export const getAllCommentsOnPost = async (postId: any): Promise<Comment[]> => {
  const comments = await commentRepository
    .createQueryBuilder('comment')
    .where('comment.post.id = :postId', { postId })
    .getMany();

  return comments;
};

export const updateComment = async (
  commentId: any,
  content: string
): Promise<Comment> => {
  const comment = await commentRepository.findOneBy({ id: commentId });
  if (!comment) {
    return new Comment();
  }
  comment.content = content;
  await commentRepository.save(comment);
  return comment;
};

export const deleteComment = async (commentId: any): Promise<void> => {
  await commentRepository.delete(commentId);
};
