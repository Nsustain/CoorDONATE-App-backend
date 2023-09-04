import { NextFunction, Request, Response, response } from 'express';
import { ChatSerializer } from '../serializers/chatSerializers';
import AppDataSource from '../config/ormconfig';
import { Chat } from '../entities/chat.entity';
import { Repository, getRepository, SelectQueryBuilder } from 'typeorm';
import { User } from '../entities/user.entity';
import { getChatsByUser } from '../middleware/getChatByUser';

class ChatController {
  private serializer = new ChatSerializer();
  private repository: Repository<Chat> = AppDataSource.getRepository(Chat);

  public getAllChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Chats are available in res.locals.chats due to the middleware
      const chats = res.locals.chats || [];

      res.status(200).json(chats);
    } catch (error) {
      next(error);
    }
  };

  private async createChat(chat: Chat): Promise<Chat> {
    chat = await this.repository.save(this.repository.create(chat));
    return chat;
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.serializer.validate(req, res);
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