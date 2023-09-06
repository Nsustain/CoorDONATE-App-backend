import express from 'express'
import deserializeUser from '../middleware/deserializeUser'
import requireUser from '../middleware/requireUser'
import { messageController } from '../controllers/message.controller';


const messageRouter = express.Router()

messageRouter.use(deserializeUser, requireUser);

messageRouter.get('/:chatRoomId', messageController.getMessagesByChatRoomId);
messageRouter.post('/send', messageController.sendMessage)

export default messageRouter;