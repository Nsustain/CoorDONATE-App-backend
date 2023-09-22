import express from 'express';
import deserializeUser from '../middleware/deserializeUser';
import requireUser from '../middleware/requireUser';
import { postController } from '../controllers/post.controller';
import { commentController } from '../controllers/comment.controller';
import { likeController } from '../controllers/like.controller';
import { getUnseenPosts } from '../services/post.service';

const postRouter = express.Router();

postRouter.use(deserializeUser, requireUser);

// Post
postRouter.get('/feed', postController.getFeed);
postRouter.post('/new', postController.create);
postRouter.get('/posts', postController.getPostsByUser);
postRouter.delete('/:postId', postController.deletePost);
postRouter.get('/recommendations', postController.getRecommendations);

// Comment
postRouter.post('/:postId/comment', commentController.commentOnPost);
postRouter.get('/:postId/comments', commentController.getAllCommentsOnPost);
postRouter.put('/comments/:commentId', commentController.updateComment);
postRouter.delete('/comments/:commentId', commentController.deleteComment);

// Like
postRouter.post('/:postId/like', likeController.likeOnPost);
postRouter.get('/:postId/likes', likeController.getAllLikes);
postRouter.delete('/likes/:likeId', likeController.removeLike);
postRouter.get('/unseen/:userId', async (req, res, next) => {
    const {userId} = req.params
    console.log(await getUnseenPosts(userId, 5))
})


export default postRouter;
