import express from 'express'
import deserializeUser from '../middleware/deserializeUser'
import requireUser from '../middleware/requireUser'
import { messageController } from '../controllers/message.controller';


const messageRouter = express.Router()

messageRouter.use(deserializeUser, requireUser);

messageRouter.get('/:chatRoomId', messageController.getMessagesByChatRoomId);
messageRouter.post('/send', messageController.sendMessage);
messageRouter.post('/:chatRoomId/search', messageController.searchMessage);
messageRouter.delete('/:messageId', messageController.deleteMessage);
messageRouter.put('/:messageId', messageController.editMessage);

export default messageRouter;