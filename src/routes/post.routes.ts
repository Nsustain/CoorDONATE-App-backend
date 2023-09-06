import express from 'express';
import deserializeUser from '../middleware/deserializeUser';
import requireUser from '../middleware/requireUser';
import { postController } from '../controllers/post.controller';
import { commentController } from '../controllers/comment.controller';

const postRouter = express.Router();

postRouter.use(deserializeUser, requireUser);

postRouter.get('/feed', postController.getFeed);
postRouter.post('/new', postController.create);
postRouter.post('/comment', commentController.commentOnPost);
postRouter.get('/:postId/comments', commentController.getAllCommentsOnPost);
postRouter.put('/comments/:commentId', commentController.updateComment);
postRouter.delete('/comments/:commentId', commentController.deleteComment);

export default postRouter;
