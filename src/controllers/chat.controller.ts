import { NextFunction, Request, Response } from 'express';
import { ChatSerializer } from '../serializers/chatSerializers';
import AppDataSource from '../config/ormconfig';
import { ChatRoom } from '../entities/chat.entity';
import { Repository } from 'typeorm';
import { createChat, findChatByUserId } from '../services/chat.service';
import AppError from '../utils/appError';
import { findUserById } from '../services/user.service';

class ChatController {
  private serializer = new ChatSerializer();
  private repository: Repository<ChatRoom> = AppDataSource.getRepository(ChatRoom);


  public getAllChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Chats are available in res.locals.chats due to the middleware

      const { userId } = req.params;

      // check authority
      if (userId !== res.locals.user.id.toString()){
        throw new AppError(401, "You are not authorized to view this chats.")
      }
  
      // check if user exists
      const user = await findUserById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Fetch chats where the user is a member
      const chats = await findChatByUserId(user.id)

      res.status(200).json(await this.serializer.serializeManyPromise(chats));

    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
      await this.serializer.validate(req, res);
      // Todo: remove message from request body
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