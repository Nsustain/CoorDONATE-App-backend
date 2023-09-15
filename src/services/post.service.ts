import config from 'config';
import { Post, PostImage, Comment, Like } from '../entities/post.entity';
import AppDataSource from '../config/ormconfig';
import { signJwt } from '../utils/jwt';
import { KeyFunction } from '../utils/keyFactory';

const postRepository = AppDataSource.getRepository(Post);
const imageRepository = AppDataSource.getRepository(PostImage);
const commentRepository = AppDataSource.getRepository(Comment);
const likeRepository = AppDataSource.getRepository(Like);
export const getPostById = async (postId: string) => {
  return await postRepository.findOneBy({ id: postId });
};

export const getPostsByUser = async (userId: string) => {
  return await postRepository
  .createQueryBuilder("post")
  .where("post.postedBy = :userId", { userId })
  .leftJoinAndSelect("post.comments", "comments")
  .leftJoinAndSelect("post.likes", "likes")
  .leftJoinAndSelect("post.contentImages", "contentImages")
  .leftJoinAndSelect("post.postedBy", "postedBy")
  .getMany();


  // return await postRepository.find({ where: { postedBy: { id: userId } } });
};

export const deletePost = async (postId: string) => {
  await imageRepository.delete({ post: { id: postId } });
  await commentRepository.delete({ post: { id: postId } });
  await likeRepository.delete({ post: { id: postId } });
  return await postRepository.delete(postId);
};
