import { NextFunction, Request, Response } from 'express';
import { ChatSerializer } from '../serializers/chatSerializers';
import AppDataSource from '../config/ormconfig';
import { ChatRoom } from '../entities/chat.entity';
import { Repository } from 'typeorm';
import { createChat } from '../services/chat.service';

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

  public create = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
      await this.serializer.validate(req, res);
      let chat = await this.serializer.deserializePromise(req.body);

      // check if the chat already exists 
      const existingChat = await this.repository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.members', 'member')
      .where('member.id IN (:...memberIds)', { memberIds: chat.members.map(member => member.id) })
      .getOne();


    if (existingChat) {
      return res.status(200).json(this.serializer.serializePromise(existingChat)); // Return the existing chat
    }

      chat = await createChat(chat);

      return res.status(201).json(this.serializer.serializePromise(chat));
    }
    catch(err) {
      next(err);
    }
  };

}

export const chatController = new ChatController()