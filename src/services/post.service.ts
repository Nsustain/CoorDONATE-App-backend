import config from 'config';
import { Post, PostImage, Comment, Like } from '../entities/post.entity';
import AppDataSource from '../config/ormconfig';
import { signJwt } from '../utils/jwt';
import { KeyFunction } from '../utils/keyFactory';
import { User } from '../entities/user.entity';

const postRepository = AppDataSource.getRepository(Post);
const imageRepository = AppDataSource.getRepository(PostImage);
const commentRepository = AppDataSource.getRepository(Comment);
const likeRepository = AppDataSource.getRepository(Like);
const userRepository = AppDataSource.getRepository(User);

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

export const getUnseenPosts = async (userId: string, amount: number) => {
  // Find the user by userId
  try {
    const user = await userRepository.findOne(
      { where: {id: userId}, 
      relations: ['seenPosts'] 
    });
  
    if (!user) {
      throw new Error('User not found');
    }
    
    const seenPostIds = user.seenPosts.map((post) => post.id)
    
    let unseenPosts: Post[];
    if (seenPostIds.length !== 0){
      unseenPosts = await postRepository
      .createQueryBuilder('post')
      .where('post.id NOT IN (:...seenPostIds)', { seenPostIds })
      .take(amount)
      .getMany();
    }else{
      unseenPosts = await postRepository
      .createQueryBuilder('post')
      .take(amount)
      .getMany()
    }
  
    return unseenPosts;
  } catch(err){
      throw new Error(`Cant get unseen posts ${err}`);
  }

}
