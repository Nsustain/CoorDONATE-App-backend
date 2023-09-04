import { NextFunction, Request, Response, response } from 'express';
import { ChatSerializer } from '../serializers/chatSerializers';
import AppDataSource from '../config/ormconfig';
import { ChatRoom } from '../entities/chat.entity';
import { Repository, getRepository, SelectQueryBuilder } from 'typeorm';
import { User } from '../entities/user.entity';
import { getChatsByUser } from '../middleware/getChatByUser';
import { findChatById } from '../services/chat.service';
import { findUserById } from '../services/user.service';

class ChatController {
  private serializer = new ChatSerializer();
  private repository: Repository<ChatRoom> = AppDataSource.getRepository(ChatRoom);

  public getAllChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Chats are available in res.locals.chats due to the middleware
      const chats = res.locals.chats || [];

      res.status(200).json(chats);
    } catch (error) {
      next(error);
    }
  };

  private async createChat(chat: ChatRoom): Promise<ChatRoom> {

    chat = await this.repository.save(this.repository.create(chat));
    console.log("came here 2, ", chat)
    return chat;
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
      await this.serializer.validate(req, res);
      let { members } = req.body;
      const users = [];
      for (let memberId in members) {
        let user = await findUserById(memberId);
        if (user) {
          users.push(user);
        }
      }
      
      members = users;
      const existingChat = await this.repository.findOne({
        where: { members   },
      });

      if (existingChat) {
        return existingChat; // Return the existing chat
      }

      let chat = this.serializer.deserialize(req.body);
      
      chat = await this.createChat(chat);
      return res.status(201).json(this.serializer.serialize(chat));
    }
    catch(err) {
      next(err);
    }
  };

}

export const chatController = new ChatController()