import express from "express";
import deserializeUser from "../middleware/deserializeUser";
import requireUser from "../middleware/requireUser";
import { chatController } from "../controllers/chat.controller";
import { getChatsByUser } from '../middleware/getChatByUser';

const chatRouter = express.Router()

chatRouter.use(deserializeUser, requireUser);

chatRouter.post('/create', chatController.create);
chatRouter.get('/get:userId', getChatsByUser, chatController.getAllChats);