import { Like, Post, PostImage, Comment } from '../entities/post.entity.ts';
import AppDataSource from '../config/ormconfig.ts';
import AppError from '../utils/appError.ts';

const postRepository = AppDataSource.getRepository(Post);
const contentImagesRepository = AppDataSource.getRepository(PostImage);
const commentsRepository = AppDataSource.getRepository(Comment);
const likesRepository = AppDataSource.getRepository(Like);


export const createPost = async (input: any) => {
  return (await AppDataSource.manager.save(
    AppDataSource.manager.create(Post, input)
  )) as Post;
};

export const findPostById = async (postId: string) => {
  return await postRepository.findOne({ where: {id: postId}, 
    relations: [
        "contentImages",
        "likes",
        "comments",
        "postedBy"
    ] });
};

export const findPosts = async () => {
  return await postRepository.find();
};

export const updatePost = async (postId: string, updates: Partial<Post>) => {
  await postRepository.update({ id: postId }, updates);
};

export const deletePost = async (postId: string) => {

  const post = await findPostById(postId)

  if (!post) {
    return new AppError(404, "post not found")
  }
      // Delete the related content images
  await contentImagesRepository.remove(post!.contentImages);

  // Delete the related comments
  await commentsRepository.remove(post.comments);

  // Delete the related likes
  await likesRepository.remove(post!.likes);

  // Delete the post
  await postRepository.delete({ id: postId });
};


