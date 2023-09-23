import express from 'express';
import getMeHandler from '../controllers/user.controller';
import deserializeUser from '../middleware/deserializeUser';
import requireUser from '../middleware/requireUser';
import { getUnseenPosts } from '../services/post.service';

const userRouter = express.Router();

userRouter.use(deserializeUser, requireUser);

// Get currently logged in user
userRouter.get('/me', getMeHandler);
userRouter.get('/:userId', async (req, res, next) => {
    const {userId} = req.params
    console.log(await getUnseenPosts(userId, 5))
})

export default userRouter;
