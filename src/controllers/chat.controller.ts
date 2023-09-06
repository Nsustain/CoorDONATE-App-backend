import { NextFunction, Request, Response } from 'express';
import { ChatSerializer } from '../serializers/chatSerializers';
import AppDataSource from '../config/ormconfig';
import { ChatRoom } from '../entities/chat.entity';
import { Repository } from 'typeorm';
import { createChat, deleteChat, findChatById, findChatByUserId } from '../services/chat.service';
import AppError from '../utils/appError';
import { findUserById } from '../services/user.service';

class ChatController {
  private serializer = new ChatSerializer();
  private repository: Repository<ChatRoom> = AppDataSource.getRepository(ChatRoom);


  public getAllChats = async (req: Request, res: Response, next: NextFunction) => {
    try {

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

      res.status(200).json(await this.serializer.serializeMany(chats));

    } catch (error) {
      next(error);
    }
  };

  public getChatDetails = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const {roomId} = req.params;

      // check if room exists
      const chat: ChatRoom | null = await findChatById(roomId)

      if (!chat){
        return next(new AppError(404, 'Chat room not found.'))
      }

      // check if current user is a member
      const currUserId = res.locals.user.id;
      const isMember = chat.members.some(member => member.id === currUserId);
      
      if (!isMember) {
        return next(new AppError(403, "User is not a member of the ChatRoom"));
    }

    console.log(chat)
    return res.status(200).json(this.serializer.serialize(chat));

    }catch(error) {
      next(error);
    }
  }

  public create = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
      await this.serializer.validate(req, res);
      // Todo: remove message from request body
      let chat = await this.serializer.deserializePromise(req.body);

      // check if the chat already exists 
      const existingChat = await this.repository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.members', 'member')
      .where('member.id IN (:...memberIds)', { memberIds: chat.members.map(member => member.id) })
      .andWhere('chat.isGroup = :isGroup', { isGroup: chat.isGroup })
      .getOne();


    if (existingChat) {
      // Return the existing chat
      return res.status(200).json(this.serializer.serialize(existingChat)); 
    }

      if (chat.isGroup){
        chat.groupOwner = res.locals.user
      }

      chat = await createChat(chat);

      return res.status(201).json(this.serializer.serialize(chat));
    }
    catch(err) {
      next(err);
    }
  };


  public delete = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const {roomId} = req.params;

      // check if room exists
      const chat: ChatRoom | null = await findChatById(roomId)

      if (!chat){
        return next(new AppError(404, 'Chat room not found.'))
      }
      
      // check if user can delete the chat
      const currUserId = res.locals.user.id;
      const isMember = chat.members.some(member => member.id === currUserId);
           
      // if private chat then user can delete by being a member
      if (!isMember) {
          return next(new AppError(403, "User is not a member of the ChatRoom"));
      }

      // Todo: if group user needs to be an admin


      await deleteChat(roomId);
      return res.status(200).json({ message: 'Chat deleted successfully.' })

    }catch(err) {

      next(err)
    }
  }

}




export const chatController = new ChatController()