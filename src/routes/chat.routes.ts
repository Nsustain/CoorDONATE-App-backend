import express from "express";
import deserializeUser from "../middleware/deserializeUser";
import requireUser from "../middleware/requireUser";
import { chatController } from "../controllers/chat.controller";

const chatRouter = express.Router()

chatRouter.use(deserializeUser, requireUser);

chatRouter.post('/create', chatController.create);
chatRouter.get('/:userId', chatController.getAllChats);
chatRouter.delete('/:roomId', chatController.delete);
chatRouter.get('/details/:roomId', chatController.getChatDetails);


export default chatRouter;