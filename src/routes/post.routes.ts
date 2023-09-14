import express from 'express';
import deserializeUser from '../middleware/deserializeUser';
import requireUser from '../middleware/requireUser';
import { postController } from '../controllers/post.controller';
import { commentController } from '../controllers/comment.controller';
import { likeController } from '../controllers/like.controller';

const postRouter = express.Router();

postRouter.use(deserializeUser, requireUser);

// Post
postRouter.get('/feed', postController.getFeed);
postRouter.post('/new', postController.create);
postRouter.get('/posts', postController.getPostsByUser);
postRouter.delete('/:postId', postController.deletePost);

// Comment
postRouter.post('/comment', commentController.commentOnPost);
postRouter.get('/:postId/comments', commentController.getAllCommentsOnPost);
postRouter.put('/comments/:commentId', commentController.updateComment);
postRouter.delete('/comments/:commentId', commentController.deleteComment);

// Like
postRouter.post('/like', likeController.likeOnPost);
postRouter.get('/:postId/likes', likeController.getAllLikes);
postRouter.delete('/likes/:likeId', likeController.removeLike);

export default postRouter;
