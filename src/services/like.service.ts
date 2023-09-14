import { Like } from '../entities/post.entity.ts';
import AppDataSource from '../config/ormconfig.ts';
import { DeleteResult } from 'typeorm';

const likeRepository = AppDataSource.getRepository(Like);

export const likeOnAPost = async (like: Like) => {
  return await likeRepository.save(likeRepository.create(like));
};

export const getAllLikes = async (postId: any): Promise<Like[]> => {
  const likes = await likeRepository
    .createQueryBuilder('like')
    .where('like.post.id = :postId', { postId })
    .getMany();

  return likes;
};

export const removeLike = async (likeId: string): Promise<DeleteResult> => {
  return await likeRepository.delete(likeId);
};